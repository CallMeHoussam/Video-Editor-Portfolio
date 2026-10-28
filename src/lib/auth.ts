import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_PIN = process.env.CMS_ADMIN_PIN || 'evoless2027';
const AUTH_SECRET = process.env.CMS_AUTH_SECRET || 'evoless-dev-salt-2027';

export const SESSION_COOKIE_NAME = 'evoless_cms_session';

/**
 * Computes the HMAC-SHA256 session token using the server-side secret and admin PIN.
 */
export function getExpectedSessionToken(): string {
  return crypto.createHmac('sha256', AUTH_SECRET).update(ADMIN_PIN).digest('hex');
}

/**
 * Validates a session token using timing-safe comparison to prevent timing attacks.
 */
export function verifyAdminSessionToken(token?: string | null): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }
  const expected = getExpectedSessionToken();
  const tokenBuf = Buffer.from(token);
  const expectedBuf = Buffer.from(expected);

  if (tokenBuf.length !== expectedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(tokenBuf, expectedBuf);
}

/**
 * Verifies admin authentication on a NextRequest (for API Route handlers).
 */
export function verifyAdminRequest(req: NextRequest): boolean {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  return verifyAdminSessionToken(cookie?.value);
}

/**
 * Verifies admin authentication on the server inside Server Components.
 */
export async function checkIsAdminServerSide(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);
    return verifyAdminSessionToken(cookie?.value);
  } catch {
    return false;
  }
}
