import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioData, savePortfolioData } from '@/lib/cms-store';
import { SiteSettings } from '@/types/portfolio';
import { verifyAdminRequest } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function PUT(req: NextRequest) {
  try {
    if (!verifyAdminRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin authentication required.' },
        { status: 401 }
      );
    }

    const settingsUpdate: Partial<SiteSettings> = await req.json();
    const data = getPortfolioData();

    data.settings = {
      ...data.settings,
      ...settingsUpdate
    };

    savePortfolioData(data);
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, settings: data.settings });
  } catch (err) {
    console.error('Error updating settings:', err);
    return NextResponse.json({ success: false, message: 'Failed to update settings' }, { status: 500 });
  }
}
