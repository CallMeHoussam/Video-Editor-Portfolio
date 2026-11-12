import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioDataAsync, savePortfolioDataAsync } from '@/lib/cms-store';
import { SiteSettings } from '@/types/portfolio';
import { verifyAdminRequest } from '@/lib/auth';
import { parseVideoUrl, normalizeVideoProvider } from '@/lib/video-utils';
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
    const data = await getPortfolioDataAsync();

    if (settingsUpdate.showreel?.videoUrl) {
      const envLib = process.env.BUNNY_STREAM_LIBRARY_ID?.trim() || undefined;
      const parsed = parseVideoUrl(
        settingsUpdate.showreel.videoUrl,
        settingsUpdate.showreel.bunnyLibraryId || envLib
      );
      if (parsed.valid) {
        settingsUpdate.showreel.provider = normalizeVideoProvider(parsed.provider);
        settingsUpdate.showreel.videoUrl = parsed.directUrl || parsed.embedUrl || settingsUpdate.showreel.videoUrl;
        if (parsed.provider === 'bunny') {
          settingsUpdate.showreel.bunnyLibraryId =
            parsed.libraryId || settingsUpdate.showreel.bunnyLibraryId || envLib;
          settingsUpdate.showreel.bunnyVideoId =
            parsed.bunnyVideoId || settingsUpdate.showreel.bunnyVideoId;
        }
      }
    }

    data.settings = {
      ...data.settings,
      ...settingsUpdate
    };

    await savePortfolioDataAsync(data);
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, settings: data.settings });
  } catch (err) {
    console.error('Error updating settings:', err);
    return NextResponse.json({ success: false, message: 'Failed to update settings' }, { status: 500 });
  }
}
