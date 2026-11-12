import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyAdminRequest } from '@/lib/auth';

const BUNNY_STATUS_LABELS: Record<number, string> = {
  0: 'Created',
  1: 'Uploaded',
  2: 'Processing',
  3: 'Transcoding',
  4: 'Ready',
  5: 'Error',
  6: 'Upload Failed',
};

function getBunnyServerConfig() {
  const apiKey = process.env.BUNNY_STREAM_API_KEY?.trim() || '';
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID?.trim() || '';
  const cdnHostname = process.env.BUNNY_STREAM_CDN_HOSTNAME?.trim() || '';
  const tokenSigningConfigured = Boolean(process.env.BUNNY_STREAM_TOKEN_KEY?.trim());
  return { apiKey, libraryId, cdnHostname, tokenSigningConfigured };
}

/**
 * GET /api/video/bunny/upload
 * Admin-only:
 *  - ?checkConfig=true -> checks whether Bunny upload credentials exist on server (never exposes secrets)
 *  - ?videoId=...      -> checks encoding status & metadata before saving/publishing
 */
export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized. Admin authentication required.' },
      { status: 401 }
    );
  }

  const { apiKey, libraryId, cdnHostname, tokenSigningConfigured } = getBunnyServerConfig();
  const { searchParams } = new URL(req.url);

  if (searchParams.get('checkConfig') === 'true') {
    return NextResponse.json({
      success: true,
      uploadConfigured: Boolean(apiKey && libraryId),
      tokenSigningConfigured,
      libraryIdConfigured: Boolean(libraryId),
      libraryId: libraryId || null,
      cdnHostnameConfigured: Boolean(cdnHostname),
    });
  }

  const videoId = searchParams.get('videoId')?.trim();
  const targetLibraryId = searchParams.get('libraryId')?.trim() || libraryId;

  if (!apiKey || !targetLibraryId) {
    return NextResponse.json(
      {
        success: false,
        code: 'BUNNY_NOT_CONFIGURED',
        message:
          'Bunny Stream upload credentials (BUNNY_STREAM_API_KEY and BUNNY_STREAM_LIBRARY_ID) are not configured on the server.',
      },
      { status: 503 }
    );
  }

  if (!videoId) {
    return NextResponse.json(
      { success: false, message: 'videoId query parameter is required.' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://video.bunnycdn.com/library/${encodeURIComponent(targetLibraryId)}/videos/${encodeURIComponent(videoId)}`,
      {
        method: 'GET',
        headers: {
          AccessKey: apiKey,
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return NextResponse.json(
        {
          success: false,
          code: 'BUNNY_VERIFY_FAILED',
          message: `Failed to verify Bunny video (${res.status}). ${errText.slice(0, 120)}`,
        },
        { status: res.status === 404 ? 404 : 502 }
      );
    }

    const video = await res.json();
    const width = Number(video.width || 0);
    const height = Number(video.height || 0);
    const aspectRatio = width > 0 && height > 0 && height > width ? '9:16' : '16:9';
    const thumbFile = typeof video.thumbnailFileName === 'string' && video.thumbnailFileName
      ? video.thumbnailFileName
      : 'thumbnail.jpg';

    const status = Number(video.status ?? 0);
    const thumbnailUrl = cdnHostname
      ? `https://${cdnHostname}/${videoId}/${thumbFile}`
      : '';

    return NextResponse.json({
      success: true,
      videoId,
      libraryId: targetLibraryId,
      title: video.title || '',
      status,
      statusLabel: BUNNY_STATUS_LABELS[status] || 'Processing',
      encodeProgress: Number(video.encodeProgress ?? 0),
      ready: status === 4,
      failed: status === 5 || status === 6,
      width,
      height,
      duration: Number(video.length ?? 0),
      aspectRatio,
      thumbnailUrl,
      embedReference: `https://iframe.mediadelivery.net/embed/${targetLibraryId}/${videoId}`,
    });
  } catch (err) {
    console.error('[Bunny Verify] Error querying Bunny video status:', err);
    return NextResponse.json(
      { success: false, message: 'Network error while verifying Bunny Stream video.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/video/bunny/upload
 * Admin-only:
 * Creates a Bunny Stream video entry server-side and returns a short-lived TUS upload
 * SHA-256 signature so the browser uploads bytes directly to Bunny Stream without
 * ever receiving BUNNY_STREAM_API_KEY.
 */
export async function POST(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized. Admin authentication required.' },
      { status: 401 }
    );
  }

  const { apiKey, libraryId, cdnHostname } = getBunnyServerConfig();

  if (!apiKey || !libraryId) {
    return NextResponse.json(
      {
        success: false,
        code: 'BUNNY_NOT_CONFIGURED',
        message:
          'Direct Bunny upload requires BUNNY_STREAM_LIBRARY_ID and BUNNY_STREAM_API_KEY in server environment variables.',
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const rawTitle = typeof body.title === 'string' ? body.title.trim() : '';
    const title = rawTitle || `Evoless Cut ${new Date().toISOString().slice(0, 16)}`;
    const collectionId = typeof body.collectionId === 'string' ? body.collectionId.trim() : undefined;

    const createPayload: Record<string, string> = { title };
    if (collectionId) {
      createPayload.collectionId = collectionId;
    }

    const createRes = await fetch(
      `https://video.bunnycdn.com/library/${encodeURIComponent(libraryId)}/videos`,
      {
        method: 'POST',
        headers: {
          AccessKey: apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(createPayload),
      }
    );

    if (!createRes.ok) {
      const errText = await createRes.text().catch(() => '');
      return NextResponse.json(
        {
          success: false,
          code: 'BUNNY_CREATE_FAILED',
          message: `Bunny Stream rejected video creation (${createRes.status}). ${errText.slice(0, 140)}`,
        },
        { status: 502 }
      );
    }

    const created = await createRes.json();
    const videoId = String(created.guid || '');

    if (!videoId) {
      return NextResponse.json(
        { success: false, message: 'Bunny Stream did not return a valid video GUID.' },
        { status: 502 }
      );
    }

    // Short-lived direct upload signature (30 minutes)
    const expirationTime = Math.floor(Date.now() / 1000) + 1800;
    const signature = crypto
      .createHash('sha256')
      .update(`${libraryId}${apiKey}${expirationTime}${videoId}`)
      .digest('hex');

    return NextResponse.json({
      success: true,
      videoId,
      libraryId,
      expirationTime,
      signature,
      tusEndpoint: 'https://video.bunnycdn.com/tusupload',
      embedReference: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`,
      thumbnailUrl: cdnHostname ? `https://${cdnHostname}/${videoId}/thumbnail.jpg` : '',
    });
  } catch (err) {
    console.error('[Bunny Upload Init] Error creating video entry:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to initialize Bunny Stream upload session.' },
      { status: 500 }
    );
  }
}

