import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
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
 * GET /api/video/r2/stream?key=videos/...
 * Streams object with HTTP 206 Partial Content range requests support, OR redirects to signed URL.
 * Also supports ?urlOnly=true for returning a temporary signed direct GET URL.
 */
export async function GET(req: NextRequest) {
  if (!isOriginAllowed(req)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const r2 = getR2Client();
  if (!r2) {
    return new NextResponse('Cloudflare R2 storage is not configured.', { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key')?.trim();
  const urlOnly = searchParams.get('urlOnly') === 'true';

  if (!key) {
    return new NextResponse('Missing object key.', { status: 400 });
  }

  // Security: prevent directory traversal
  if (key.includes('..') || key.startsWith('/')) {
    return new NextResponse('Invalid key.', { status: 400 });
  }

  try {
    // If client requested a direct temporary signed URL (e.g. for HTML5 video element directly)
    if (urlOnly) {
      // 1 hour signed GET URL for uninterrupted video playback
      const getCmd = new GetObjectCommand({
        Bucket: r2.config.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(r2.client, getCmd, { expiresIn: 3600 });
      return NextResponse.json({
        success: true,
        playbackUrl: signedUrl,
        expiresInSeconds: 3600,
      });
    }

    // Direct streaming with Range request support through Next.js route:
    const rangeHeader = req.headers.get('range');

    const headRes = await r2.client.send(
      new HeadObjectCommand({
        Bucket: r2.config.bucketName,
        Key: key,
      })
    );

    const contentLength = headRes.ContentLength || 0;
    const contentType = headRes.ContentType || (key.endsWith('.svg') ? 'image/svg+xml' : key.endsWith('.jpg') || key.endsWith('.jpeg') ? 'image/jpeg' : 'video/mp4');

    if (!rangeHeader) {
      const getRes = await r2.client.send(
        new GetObjectCommand({
          Bucket: r2.config.bucketName,
          Key: key,
        })
      );

      const stream = (getRes.Body?.transformToWebStream?.() || getRes.Body) as unknown as BodyInit;

      return new NextResponse(stream, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': String(contentLength),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Parse Range header (e.g. bytes=0-1048575 or bytes=1048576-)
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : contentLength - 1;

    if (start >= contentLength || end >= contentLength || start > end) {
      return new NextResponse('Requested range not satisfiable', {
        status: 416,
        headers: {
          'Content-Range': `bytes */${contentLength}`,
        },
      });
    }

    const chunkLength = end - start + 1;

    const rangeGetRes = await r2.client.send(
      new GetObjectCommand({
        Bucket: r2.config.bucketName,
        Key: key,
        Range: `bytes=${start}-${end}`,
      })
    );

    const rangeStream = (rangeGetRes.Body?.transformToWebStream?.() || rangeGetRes.Body) as unknown as BodyInit;

    return new NextResponse(rangeStream, {
      status: 206,
      headers: {
        'Content-Type': contentType,
        'Content-Range': `bytes ${start}-${end}/${contentLength}`,
        'Content-Length': String(chunkLength),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err: unknown) {
    const errorObj = err as { name?: string; $metadata?: { httpStatusCode?: number } };
    if (errorObj?.name === 'NoSuchKey' || errorObj?.$metadata?.httpStatusCode === 404) {
      return new NextResponse('Video not found.', { status: 404 });
    }
    console.error('[R2 Stream Error]:', err);
    return new NextResponse('Playback failed.', { status: 500 });
  }
}

