import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2Client } from '@/lib/r2-client';

function isOriginAllowed(req: NextRequest): boolean {
  const secFetchSite = req.headers.get('sec-fetch-site');
  if (secFetchSite === 'cross-site') {
    return false;
  }

  const origin = req.headers.get('origin') || req.headers.get('referer');
  if (!origin) return true;

  try {
    const originHost = new URL(origin).hostname.toLowerCase();
    if (originHost === 'localhost' || originHost === '127.0.0.1' || originHost === '[::1]' || originHost.endsWith('.local')) {
      return true;
    }
    if (originHost.endsWith('.vercel.app')) {
      return true;
    }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl) {
      const siteHost = new URL(siteUrl).hostname.toLowerCase();
      if (originHost === siteHost || originHost === `www.${siteHost}`) return true;
    }
  } catch {
    return false;
  }

  return true;
}

/**
 * POST /api/video/r2/token
 * Generates an expiring signed GET URL for an R2 key or reference URL.
 * Expiration defaults to 3600 seconds (1 hour) to ensure uninterrupted viewing of long videos,
 * and the player automatically refreshes signed URLs seamlessly.
 */
export async function POST(req: NextRequest) {
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ success: false, message: 'Forbidden origin.' }, { status: 403 });
  }

  const r2 = getR2Client();
  if (!r2) {
    return NextResponse.json(
      {
        success: false,
        code: 'R2_NOT_CONFIGURED',
        message: 'Cloudflare R2 is not configured on the server.',
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    let key = typeof body.key === 'string' ? body.key.trim() : '';
    const url = typeof body.url === 'string' ? body.url.trim() : '';
    const expiresIn = Math.min(Math.max(Number(body.expiresIn || 3600), 300), 14400); // 5 min to 4 hours

    if (!key && url) {
      if (url.startsWith('r2://')) {
        key = url.replace(/^r2:\/\//, '').replace(/^\/+/, '');
      } else if (url.includes('/api/video/r2/stream')) {
        try {
          const parsed = new URL(url, 'http://localhost');
          key = parsed.searchParams.get('key') || '';
        } catch {
          // ignore
        }
      }
    }

    if (!key) {
      return NextResponse.json({ success: false, message: 'R2 object key or url is required.' }, { status: 400 });
    }

    // Generate signed GET URL with Range support enabled
    const getCmd = new GetObjectCommand({
      Bucket: r2.config.bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(r2.client, getCmd, { expiresIn });
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    return NextResponse.json({
      success: true,
      playbackUrl: signedUrl,
      streamRouteUrl: `/api/video/r2/stream?key=${encodeURIComponent(key)}`,
      expiresInSeconds: expiresIn,
      expiresAt,
      key,
    });
  } catch (err) {
    console.error('[R2 Token Error]:', err);
    return NextResponse.json({ success: false, message: 'Failed to generate signed playback token.' }, { status: 500 });
  }
}

