import { NextRequest, NextResponse } from 'next/server';
import { getExpectedSessionToken, verifyAdminSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

const ADMIN_PIN = process.env.CMS_ADMIN_PIN || 'evoless2027';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { pin } = body;

    if (!pin || typeof pin !== 'string' || pin.trim() !== ADMIN_PIN.trim()) {
      return NextResponse.json({ success: false, message: 'Invalid admin PIN' }, { status: 401 });
    }

    const token = getExpectedSessionToken();
    const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });
    
    const isHttps = req.nextUrl.protocol === 'https:' || req.headers.get('x-forwarded-proto') === 'https';

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (err) {
    console.error('[CMS Auth Error]:', err);
    return NextResponse.json({ success: false, message: 'Authentication error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  const isValid = verifyAdminSessionToken(cookie?.value);

  if (isValid) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/'
  });
  return response;
}
