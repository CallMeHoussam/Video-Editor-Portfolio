import { NextRequest, NextResponse } from 'next/server';
import { parseVideoUrl } from '@/lib/video-utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
      return NextResponse.json({ success: false, message: 'URL is required' }, { status: 400 });
    }

    const parsed = parseVideoUrl(videoUrl);

    if (!parsed.valid) {
      return NextResponse.json({
        success: false,
        message: parsed.error || 'Invalid video link'
      }, { status: 400 });
    }

    // 1. YouTube: directly return YouTube thumbnail
    if (parsed.provider === 'youtube' && parsed.thumbnailUrl) {
      return NextResponse.json({
        success: true,
        provider: 'youtube',
        thumbnailUrl: parsed.thumbnailUrl,
        message: 'Official YouTube thumbnail generated'
      });
    }

    // 2. Vimeo: fetch oEmbed data
    if (parsed.provider === 'vimeo' && parsed.videoId) {
      try {
        const oembedRes = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${parsed.videoId}`, {
          headers: { 'User-Agent': 'EvolessPortfolio/1.0' },
          next: { revalidate: 86400 }
        });

        if (oembedRes.ok) {
          const oembedData = await oembedRes.json();
          if (oembedData.thumbnail_url) {
            return NextResponse.json({
              success: true,
              provider: 'vimeo',
              thumbnailUrl: oembedData.thumbnail_url,
              message: 'Vimeo oEmbed thumbnail fetched successfully'
            });
          }
        }
      } catch (err) {
        console.warn('Vimeo oEmbed fetch failed:', err);
      }
    }

    // 3. Google Drive: attempt public thumbnail retrieval
    if (parsed.provider === 'googledrive' && parsed.videoId) {
      try {
        const driveThumbUrl = `https://drive.google.com/thumbnail?id=${parsed.videoId}&sz=w1280`;
        const testRes = await fetch(driveThumbUrl, {
          method: 'HEAD',
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (testRes.ok && testRes.headers.get('content-type')?.startsWith('image/')) {
          return NextResponse.json({
            success: true,
            provider: 'googledrive',
            thumbnailUrl: driveThumbUrl,
            message: 'Google Drive video thumbnail retrieved successfully'
          });
        }
      } catch (err) {
        console.warn('Google Drive thumbnail verification failed:', err);
      }

      return NextResponse.json({
        success: true,
        provider: 'googledrive',
        thumbnailUrl: null,
        fallbackAvailable: true,
        message: 'Google Drive file is private or does not permit public thumbnail access. Please set permissions to "Anyone with the link can view", or use a custom thumbnail.'
      });
    }

    // 4. Direct / Others fallback
    return NextResponse.json({
      success: true,
      provider: parsed.provider,
      thumbnailUrl: null,
      fallbackAvailable: true,
      message: 'Direct video sources use an automatic visual fallback card with title and play icon.'
    });
  } catch (err) {
    console.error('Error fetching video thumbnail:', err);
    return NextResponse.json({ success: false, message: 'Error retrieving thumbnail' }, { status: 500 });
  }
}
