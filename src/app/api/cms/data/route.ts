import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioData, savePortfolioData } from '@/lib/cms-store';
import { verifyAdminRequest } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const data = getPortfolioData();
  return NextResponse.json(data);
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

    const success = savePortfolioData(body);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success, message: 'Portfolio data updated successfully' });
  } catch (err) {
    console.error('Error saving portfolio data:', err);
    return NextResponse.json({ success: false, message: 'Failed to update data' }, { status: 500 });
  }
}
