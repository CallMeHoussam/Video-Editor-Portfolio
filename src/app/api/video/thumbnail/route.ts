import { NextRequest, NextResponse } from 'next/server';
import { parseVideoUrl } from '@/lib/video-utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
      return NextResponse.json({ success: false, message: 'URL is required' }, { status: 400 });
    }

    const fallbackLib = process.env.BUNNY_STREAM_LIBRARY_ID?.trim();
    const parsed = parseVideoUrl(videoUrl, fallbackLib);

    if (!parsed.valid) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error || 'Invalid video link',
        },
        { status: 400 }
      );
    }

    // 1. Bunny Stream: resolve via API if configured, or CDN hostname
    if (parsed.provider === 'bunny' && parsed.videoId) {
      const apiKey = process.env.BUNNY_STREAM_API_KEY?.trim();
      const cdnHost = process.env.BUNNY_STREAM_CDN_HOSTNAME?.trim();
      const libId = parsed.libraryId || fallbackLib;

      if (apiKey && libId) {
        try {
          const res = await fetch(
            `https://video.bunnycdn.com/library/${encodeURIComponent(libId)}/videos/${encodeURIComponent(parsed.videoId)}`,
            {
              headers: { AccessKey: apiKey, Accept: 'application/json' },
              cache: 'no-store',
            }
          );
          if (res.ok) {
            const video = await res.json();
            const thumbFile = video.thumbnailFileName || 'thumbnail.jpg';
            if (cdnHost) {
              return NextResponse.json({
                success: true,
                provider: 'bunny',
                thumbnailUrl: `https://${cdnHost}/${parsed.videoId}/${thumbFile}`,
                message: 'Bunny Stream video thumbnail retrieved.',
              });
            }
          }
        } catch (err) {
          console.warn('[Bunny Thumbnail] API metadata lookup failed:', err);
        }
      }

      if (parsed.thumbnailUrl) {
        return NextResponse.json({
          success: true,
          provider: 'bunny',
          thumbnailUrl: parsed.thumbnailUrl,
          message: 'Bunny Stream CDN thumbnail resolved.',
        });
      }

      if (cdnHost) {
        return NextResponse.json({
          success: true,
          provider: 'bunny',
          thumbnailUrl: `https://${cdnHost}/${parsed.videoId}/thumbnail.jpg`,
          message: 'Bunny Stream thumbnail resolved from CDN hostname.',
        });
      }

      return NextResponse.json({
        success: true,
        provider: 'bunny',
        thumbnailUrl: null,
        fallbackAvailable: true,
        message:
          'Bunny Stream video verified. Upload a custom thumbnail or configure BUNNY_STREAM_CDN_HOSTNAME for automatic Bunny thumbnails.',
      });
    }

    // 2. YouTube: directly return YouTube thumbnail
    if (parsed.provider === 'youtube' && parsed.thumbnailUrl) {
      return NextResponse.json({
        success: true,
        provider: 'youtube',
        thumbnailUrl: parsed.thumbnailUrl,
        message: 'Official YouTube thumbnail generated',
      });
    }

    // 3. Vimeo: fetch oEmbed data
    if (parsed.provider === 'vimeo' && parsed.videoId) {
      try {
        const oembedRes = await fetch(
          `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${parsed.videoId}`,
          {
            headers: { 'User-Agent': 'EvolessPortfolio/1.0' },
            next: { revalidate: 86400 },
          }
        );

        if (oembedRes.ok) {
          const oembedData = await oembedRes.json();
          if (oembedData.thumbnail_url) {
            return NextResponse.json({
              success: true,
              provider: 'vimeo',
              thumbnailUrl: oembedData.thumbnail_url,
              message: 'Vimeo oEmbed thumbnail fetched successfully',
            });
          }
        }
      } catch (err) {
        console.warn('Vimeo oEmbed fetch failed:', err);
      }
    }

    // 4. Google Drive: attempt public thumbnail retrieval
    if (parsed.provider === 'googledrive' && parsed.videoId) {
      try {
        const driveThumbUrl = `https://drive.google.com/thumbnail?id=${parsed.videoId}&sz=w1280`;
        const testRes = await fetch(driveThumbUrl, {
          method: 'HEAD',
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });

        if (testRes.ok && testRes.headers.get('content-type')?.startsWith('image/')) {
          return NextResponse.json({
            success: true,
            provider: 'googledrive',
            thumbnailUrl: driveThumbUrl,
            message: 'Google Drive video thumbnail retrieved successfully',
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
        message:
          'Google Drive file does not allow public thumbnail fetch. Upload a custom image or migrate to Bunny Stream.',
      });
    }

    // 5. Direct / Others fallback
    return NextResponse.json({
      success: true,
      provider: parsed.provider,
      thumbnailUrl: null,
      fallbackAvailable: true,
      message: 'Upload a custom thumbnail or paste an image URL.',
    });
  } catch (err) {
    console.error('Error fetching video thumbnail:', err);
    return NextResponse.json({ success: false, message: 'Error retrieving thumbnail' }, { status: 500 });
  }
}
