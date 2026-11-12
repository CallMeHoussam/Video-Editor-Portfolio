import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { parseBunnyReference } from '@/lib/video-utils';

const MIN_EXPIRATION_SECONDS = 60;
const MAX_EXPIRATION_SECONDS = 7200;
const DEFAULT_EXPIRATION_SECONDS = 1800;

function extractHostname(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return value.replace(/^https?:\/\//i, '').split('/')[0].split(':')[0].toLowerCase() || null;
  }
}

function isOriginAllowed(req: NextRequest): { allowed: boolean; reason?: string } {
  const secFetchSite = req.headers.get('sec-fetch-site');
  if (secFetchSite === 'cross-site') {
    return { allowed: false, reason: 'Cross-site token requests are blocked.' };
  }

  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const requestHost = (req.headers.get('host') || '').split(':')[0].toLowerCase();

  const sourceHost = extractHostname(origin) || extractHostname(referer);
  if (!sourceHost) {
    // Allow direct same-server or non-browser local calls only when request host itself is valid
    return { allowed: true };
  }

  if (requestHost && sourceHost === requestHost) {
    return { allowed: true };
  }

  // Always allow local development hosts
  if (
    sourceHost === 'localhost' ||
    sourceHost === '127.0.0.1' ||
    sourceHost === '[::1]' ||
    sourceHost.endsWith('.local')
  ) {
    return { allowed: true };
  }

  // Allow Vercel deployment preview domains
  if (sourceHost.endsWith('.vercel.app')) {
    return { allowed: true };
  }

  // Build explicit allowlist from environment variables
  const configuredHosts = new Set<string>();
  const siteUrlHost = extractHostname(process.env.NEXT_PUBLIC_SITE_URL || null);
  if (siteUrlHost) configuredHosts.add(siteUrlHost);

  const vercelHost = extractHostname(process.env.VERCEL_URL || null);
  if (vercelHost) configuredHosts.add(vercelHost);

  const extraOrigins = (process.env.ALLOWED_VIDEO_ORIGINS || '')
    .split(',')
    .map((entry) => extractHostname(entry.trim()))
    .filter((entry): entry is string => Boolean(entry));

  extraOrigins.forEach((h) => configuredHosts.add(h));

  if (configuredHosts.has(sourceHost)) {
    return { allowed: true };
  }

  // Support wildcard subdomains listed as .example.com in ALLOWED_VIDEO_ORIGINS
  for (const allowed of configuredHosts) {
    if (allowed.startsWith('*.') && sourceHost.endsWith(allowed.slice(1))) {
      return { allowed: true };
    }
    if (sourceHost === `www.${allowed}` || `www.${sourceHost}` === allowed) {
      return { allowed: true };
    }
  }

  return {
    allowed: false,
    reason: `Domain "${sourceHost}" is not in ALLOWED_VIDEO_ORIGINS.`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const originCheck = isOriginAllowed(req);
    if (!originCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: 'ORIGIN_NOT_ALLOWED',
          message: originCheck.reason || 'Unauthorized playback origin.',
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawVideoId = typeof body.videoId === 'string' ? body.videoId.trim() : '';
    const rawLibraryId = typeof body.libraryId === 'string' ? body.libraryId.trim() : '';
    const rawUrl = typeof body.url === 'string' ? body.url.trim() : '';
    const autoplay = Boolean(body.autoplay);
    const requestedSeconds = Number(body.expirationSeconds ?? DEFAULT_EXPIRATION_SECONDS);

    const parsedFromUrl = rawUrl
      ? parseBunnyReference(rawUrl, rawLibraryId || process.env.BUNNY_STREAM_LIBRARY_ID)
      : { isBunny: false as const };

    const parsedFromId =
      rawVideoId && !parsedFromUrl.videoId
        ? parseBunnyReference(rawVideoId, rawLibraryId || process.env.BUNNY_STREAM_LIBRARY_ID)
        : { isBunny: false as const };

    const resolvedVideoId =
      parsedFromUrl.videoId || parsedFromId.videoId || rawVideoId;
    const resolvedLibraryId =
      rawLibraryId ||
      parsedFromUrl.libraryId ||
      parsedFromId.libraryId ||
      process.env.BUNNY_STREAM_LIBRARY_ID ||
      '';

    if (!resolvedVideoId) {
      return NextResponse.json(
        {
          success: false,
          code: 'MISSING_VIDEO_ID',
          message: 'A valid Bunny Stream video ID is required.',
        },
        { status: 400 }
      );
    }

    if (!resolvedLibraryId) {
      return NextResponse.json(
        {
          success: false,
          code: 'MISSING_LIBRARY_ID',
          message:
            'Bunny Stream Library ID is missing. Configure BUNNY_STREAM_LIBRARY_ID or include the full embed URL.',
        },
        { status: 400 }
      );
    }

    const safeTtl = Number.isFinite(requestedSeconds)
      ? Math.min(Math.max(Math.round(requestedSeconds), MIN_EXPIRATION_SECONDS), MAX_EXPIRATION_SECONDS)
      : DEFAULT_EXPIRATION_SECONDS;

    const cdnHost = parsedFromUrl.cdnHost || process.env.BUNNY_STREAM_CDN_HOSTNAME?.trim() || '';
    const thumbnailUrl = cdnHost
      ? `https://${cdnHost}/${resolvedVideoId}/thumbnail.jpg`
      : null;

    const tokenKey = process.env.BUNNY_STREAM_TOKEN_KEY?.trim();

    if (tokenKey) {
      const expires = Math.floor(Date.now() / 1000) + safeTtl;
      const hashableBase = `${tokenKey}${resolvedVideoId}${expires}`;
      const token = crypto.createHash('sha256').update(hashableBase).digest('hex');

      const params = new URLSearchParams({
        token,
        expires: String(expires),
        autoplay: autoplay ? 'true' : 'false',
        preload: 'true',
        responsive: 'true',
      });

      const embedUrl = `https://iframe.mediadelivery.net/embed/${resolvedLibraryId}/${resolvedVideoId}?${params.toString()}`;

      return NextResponse.json({
        success: true,
        protected: true,
        expires,
        expiresAt: new Date(expires * 1000).toISOString(),
        libraryId: resolvedLibraryId,
        videoId: resolvedVideoId,
        embedUrl,
        thumbnailUrl,
        message: 'Signed Bunny Stream playback URL generated.',
      });
    }

    // Never allow silent unsigned fallback in strict production mode unless explicitly opted in
    const allowUnsignedFallback =
      process.env.NODE_ENV !== 'production' || process.env.ALLOW_UNSIGNED_BUNNY_FALLBACK === 'true';

    if (!allowUnsignedFallback) {
      return NextResponse.json(
        {
          success: false,
          protected: false,
          code: 'SIGNING_NOT_CONFIGURED',
          message:
            'Playback token signing is not configured on the server (BUNNY_STREAM_TOKEN_KEY missing).',
        },
        { status: 503 }
      );
    }

    const fallbackParams = new URLSearchParams({
      autoplay: autoplay ? 'true' : 'false',
      preload: 'true',
      responsive: 'true',
    });

    const publicEmbedUrl = `https://iframe.mediadelivery.net/embed/${resolvedLibraryId}/${resolvedVideoId}?${fallbackParams.toString()}`;

    return NextResponse.json({
      success: true,
      protected: false,
      code: 'SIGNING_NOT_CONFIGURED',
      expires: null,
      libraryId: resolvedLibraryId,
      videoId: resolvedVideoId,
      embedUrl: publicEmbedUrl,
      thumbnailUrl,
      message:
        'Development mode without BUNNY_STREAM_TOKEN_KEY: serving unsigned embed URL. Add BUNNY_STREAM_TOKEN_KEY before production.',
    });
  } catch (err) {
    console.error('[Bunny Token] Error generating video token:', err);
    return NextResponse.json(
      {
        success: false,
        code: 'TOKEN_GENERATION_FAILED',
        message: 'Failed to prepare video playback session.',
      },
      { status: 500 }
    );
  }
}
