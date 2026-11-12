import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioDataAsync, savePortfolioDataAsync } from '@/lib/cms-store';
import { getDbConfigStatus } from '@/lib/persistent-db';
import { verifyAdminRequest } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const data = await getPortfolioDataAsync();
  const dbStatus = getDbConfigStatus();
  return NextResponse.json({
    ...data,
    _persistence: {
      provider: dbStatus.provider,
      isPersistent: dbStatus.isConfigured,
      message: dbStatus.isConfigured
        ? `Connected to persistent ${dbStatus.provider === 'neon' ? 'Neon Postgres' : 'Supabase'} database`
        : 'Running on local file storage (changes are ephemeral on Vercel unless POSTGRES_URL or SUPABASE_URL is set)',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    if (!verifyAdminRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin authentication required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (!body || !body.settings || !Array.isArray(body.projects)) {
      return NextResponse.json({ success: false, message: 'Invalid portfolio data payload' }, { status: 400 });
    }

    const success = await savePortfolioDataAsync(body);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success, message: 'Portfolio data updated successfully' });
  } catch (err) {
    console.error('Error saving portfolio data:', err);
    return NextResponse.json({ success: false, message: 'Failed to update data' }, { status: 500 });
  }
}
