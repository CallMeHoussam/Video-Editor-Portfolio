export type VideoSourceType = 'r2' | 'youtube' | 'vimeo' | 'googledrive' | 'direct' | 'bunny' | 'github' | 'unsupported';

export interface ParsedBunnyReference {
  isBunny: boolean;
  libraryId?: string;
  videoId?: string;
  cdnHost?: string;
  embedUrl?: string;
}

export interface ParsedVideoInfo {
  valid: boolean;
  provider: VideoSourceType;
  originalUrl: string;
  embedUrl?: string;
  directUrl?: string;
  videoId?: string;
  libraryId?: string;
  bunnyVideoId?: string;
  r2Key?: string;
  thumbnailUrl?: string;
  notice?: string;
  warning?: string;
  error?: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Extracts Bunny Stream libraryId and videoId from embed URLs, play URLs, CDN URLs, or bunny: references.
 */
export function parseBunnyReference(rawInput: string, fallbackLibraryId?: string): ParsedBunnyReference {
  const input = (rawInput || '').trim();
  if (!input) return { isBunny: false };

  // Pattern 1: https://iframe.mediadelivery.net/(embed|play)/{libraryId}/{videoId}
  // Also matches https://video.bunnycdn.com/play/{libraryId}/{videoId}
  const embedOrPlayMatch = input.match(
    /(?:iframe\.mediadelivery\.net\/(?:embed|play)|video\.bunnycdn\.com\/play)\/([0-9]+)\/([a-zA-Z0-9-]+)/i
  );
  if (embedOrPlayMatch) {
    const libraryId = embedOrPlayMatch[1];
    const videoId = embedOrPlayMatch[2];
    return {
      isBunny: true,
      libraryId,
      videoId,
      embedUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`,
    };
  }

  // Pattern 2: Embed URL without explicit libraryId: https://iframe.mediadelivery.net/embed/{videoId}
  const embedNoLibMatch = input.match(
    /iframe\.mediadelivery\.net\/(?:embed|play)\/([0-9a-f-]{20,})/i
  );
  if (embedNoLibMatch) {
    const videoId = embedNoLibMatch[1];
    const libraryId = fallbackLibraryId || undefined;
    return {
      isBunny: true,
      libraryId,
      videoId,
      embedUrl: libraryId
        ? `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`
        : `https://iframe.mediadelivery.net/embed/${videoId}`,
    };
  }

  // Pattern 3: Bunny CDN HLS / MP4 / thumbnail URL: https://{pullzone}.b-cdn.net/{videoId}/...
  const cdnMatch = input.match(
    /^https?:\/\/([a-zA-Z0-9.-]+\.b-cdn\.net)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\/|$|\?)/i
  );
  if (cdnMatch) {
    const cdnHost = cdnMatch[1];
    const videoId = cdnMatch[2];
    const libraryId = fallbackLibraryId || undefined;
    return {
      isBunny: true,
      libraryId,
      videoId,
      cdnHost,
      embedUrl: libraryId
        ? `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`
        : undefined,
    };
  }

  // Pattern 4: Bunny dashboard URL: https://dash.bunny.net/stream/{libraryId}/library/videos?videoId={videoId}
  const dashMatch = input.match(/dash\.bunny\.net\/stream\/([0-9]+).*?[?&]videoId=([a-zA-Z0-9-]+)/i);
  if (dashMatch) {
    const libraryId = dashMatch[1];
    const videoId = dashMatch[2];
    return {
      isBunny: true,
      libraryId,
      videoId,
      embedUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`,
    };
  }

  // Pattern 5: Custom shorthand bunny://{libraryId}/{videoId} or bunny:{libraryId}:{videoId}
  const schemeMatch = input.match(/^bunny:(?:\/\/)?([0-9]+)[:/]([a-zA-Z0-9-]+)$/i);
  if (schemeMatch) {
    const libraryId = schemeMatch[1];
    const videoId = schemeMatch[2];
    return {
      isBunny: true,
      libraryId,
      videoId,
      embedUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`,
    };
  }

  // Pattern 6: Direct Bunny video GUID
  if (UUID_REGEX.test(input)) {
    const libraryId = fallbackLibraryId || undefined;
    return {
      isBunny: true,
      libraryId,
      videoId: input,
      embedUrl: libraryId
        ? `https://iframe.mediadelivery.net/embed/${libraryId}/${input}`
        : undefined,
    };
  }

  return { isBunny: false };
}

/**
 * Parses and validates any video URL or Bunny reference.
 */
export function parseVideoUrl(rawUrl: string, fallbackBunnyLibraryId?: string): ParsedVideoInfo {
  const url = (rawUrl || '').trim();

  if (!url) {
    return {
      valid: false,
      provider: 'unsupported',
      originalUrl: '',
      error: 'Please enter a video URL, Cloudflare R2 reference, or video file.',
    };
  }

  // 0. Cloudflare R2 reference: r2://key, /api/video/r2/stream?key=..., or public R2 domain URL
  if (url.startsWith('r2://')) {
    const r2Key = url.replace(/^r2:\/\//, '').replace(/^\/+/, '');
    return {
      valid: Boolean(r2Key),
      provider: 'r2',
      originalUrl: url,
      r2Key,
      directUrl: url,
      notice: 'Cloudflare R2 private storage video reference detected. Playback uses temporary signed URLs.',
    };
  }

  if (url.includes('/api/video/r2/stream') || url.includes('/api/video/r2/token')) {
    let key = '';
    try {
      const parsed = new URL(url, 'http://localhost');
      key = parsed.searchParams.get('key') || '';
    } catch {
      key = '';
    }
    return {
      valid: true,
      provider: 'r2',
      originalUrl: url,
      r2Key: key || undefined,
      directUrl: url,
      notice: 'Cloudflare R2 stream link detected. Playback uses private temporary signed URLs.',
    };
  }

  // 1. Bunny Stream (check before direct file checks because CDN URLs may end in .mp4/.m3u8)
  const bunnyRef = parseBunnyReference(url, fallbackBunnyLibraryId);
  if (bunnyRef.isBunny && bunnyRef.videoId) {
    return {
      valid: true,
      provider: 'bunny',
      originalUrl: url,
      libraryId: bunnyRef.libraryId,
      videoId: bunnyRef.videoId,
      bunnyVideoId: bunnyRef.videoId,
      embedUrl: bunnyRef.embedUrl || url,
      thumbnailUrl: bunnyRef.cdnHost
        ? `https://${bunnyRef.cdnHost}/${bunnyRef.videoId}/thumbnail.jpg`
        : undefined,
      notice: bunnyRef.libraryId
        ? `Bunny Stream verified (Library ${bunnyRef.libraryId}). Protected signed playback supported.`
        : 'Bunny Stream video ID detected. Ensure BUNNY_STREAM_LIBRARY_ID is configured or paste the full embed URL.',
    };
  }

  // 2. YouTube (supports public, unlisted, shorts, and embed URLs)
  const youtubeMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    return {
      valid: true,
      provider: 'youtube',
      originalUrl: url,
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      notice: 'YouTube embed verified (compatible with Public and Unlisted videos) with privacy-enhanced mode.',
    };
  }

  // 2b. GitHub Hosted / Raw Video
  // Matches: https://github.com/owner/repo/blob/branch/path/video.mp4 or https://raw.githubusercontent.com/...
  if (url.includes('github.com') || url.includes('raw.githubusercontent.com')) {
    let rawDirectUrl = url;
    if (url.includes('github.com') && url.includes('/blob/')) {
      // Convert github.com/{user}/{repo}/blob/{branch}/{path} to raw.githubusercontent.com/{user}/{repo}/{branch}/{path}
      rawDirectUrl = url
        .replace('github.com/', 'raw.githubusercontent.com/')
        .replace('/blob/', '/');
    }

    if (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(rawDirectUrl) || rawDirectUrl.includes('raw.githubusercontent.com')) {
      return {
        valid: true,
        provider: 'github',
        originalUrl: url,
        directUrl: rawDirectUrl,
        notice: 'GitHub hosted video detected. Converted to direct raw content stream.',
      };
    }
  }

  // 3. Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      valid: true,
      provider: 'vimeo',
      originalUrl: url,
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&dnt=1`,
      notice: 'Vimeo embed verified.',
    };
  }

  // 4. Google Drive
  if (url.includes('drive.google.com')) {
    const driveMatch =
      url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      return {
        valid: true,
        provider: 'googledrive',
        originalUrl: url,
        videoId: fileId,
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1280`,
        notice: 'Google Drive preview link detected.',
        warning:
          'Google Drive previews cannot hide Google’s pop-out button or enforce expiring playback tokens. Upload to Bunny Stream for domain-locked, expiring playback.',
      };
    }

    return {
      valid: false,
      provider: 'googledrive',
      originalUrl: url,
      error:
        'Invalid Google Drive link. Use a standard share link such as https://drive.google.com/file/d/FILE_ID/view',
    };
  }

  // 5. Direct MP4 / WebM / MOV URL
  const isDirectVideo =
    /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) ||
    url.startsWith('https://commondatastorage.googleapis.com/') ||
    url.includes('/video/');

  if (isDirectVideo) {
    return {
      valid: true,
      provider: 'direct',
      originalUrl: url,
      directUrl: url,
      notice: 'Direct video stream detected.',
      warning:
        'Direct MP4 files disable native browser download buttons in the player UI, but the underlying file URL can still be discovered in network tools. Use Bunny Stream for token-signed playback.',
    };
  }

  // 6. Generic Bunny host catch-all
  if (url.includes('bunnycdn') || url.includes('mediadelivery.net') || url.includes('b-cdn.net')) {
    return {
      valid: false,
      provider: 'bunny',
      originalUrl: url,
      error:
        'Could not extract Bunny Stream Video ID from this link. Paste the iframe embed URL (https://iframe.mediadelivery.net/embed/LIBRARY_ID/VIDEO_ID) or Video GUID.',
    };
  }

  if (/^https?:\/\/.+/i.test(url)) {
    return {
      valid: false,
      provider: 'unsupported',
      originalUrl: url,
      error:
        'Unsupported video URL. Upload directly to Bunny Stream or paste a Bunny, YouTube, Vimeo, Google Drive, or MP4 URL.',
    };
  }

  return {
    valid: false,
    provider: 'unsupported',
    originalUrl: url,
    error: 'Please enter a valid HTTP(S) URL or Bunny Video GUID.',
  };
}

/**
 * Normalizes provider name for storing in portfolio items.
 */
export function normalizeVideoProvider(
  provider: VideoSourceType
): 'r2' | 'youtube' | 'vimeo' | 'googledrive' | 'direct' | 'bunny' | 'placeholder' {
  if (provider === 'r2') return 'r2';
  if (provider === 'youtube') return 'youtube';
  if (provider === 'vimeo') return 'vimeo';
  if (provider === 'googledrive') return 'googledrive';
  if (provider === 'bunny') return 'bunny';
  if (provider === 'direct' || provider === 'github') return 'direct';
  return 'direct';
}
