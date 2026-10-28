export type VideoSourceType = 'youtube' | 'vimeo' | 'googledrive' | 'direct' | 'bunny' | 'unsupported';

export interface ParsedVideoInfo {
  valid: boolean;
  provider: VideoSourceType;
  originalUrl: string;
  embedUrl?: string;
  directUrl?: string;
  videoId?: string;
  thumbnailUrl?: string;
  notice?: string;
  error?: string;
}

/**
 * Parses and validates any video URL input.
 * Supports YouTube, Vimeo, Google Drive share links, direct MP4/video files, and Bunny Stream.
 */
export function parseVideoUrl(rawUrl: string): ParsedVideoInfo {
  const url = (rawUrl || '').trim();

  if (!url) {
    return {
      valid: false,
      provider: 'unsupported',
      originalUrl: '',
      error: 'Please enter a video URL.'
    };
  }

  // 1. YouTube
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
      notice: 'YouTube video detected with official thumbnail auto-generation.'
    };
  }

  // 2. Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      valid: true,
      provider: 'vimeo',
      originalUrl: url,
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?color=8b5cf6&title=0&byline=0`,
      notice: 'Vimeo video detected. Embed ready.'
    };
  }

  // 3. Google Drive
  if (url.includes('drive.google.com')) {
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      const driveThumb = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1280`;
      return {
        valid: true,
        provider: 'googledrive',
        originalUrl: url,
        videoId: fileId,
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        thumbnailUrl: driveThumb,
        notice: "Google Drive link verified. If file sharing is set to 'Anyone with the link can view', the thumbnail will load automatically. Otherwise, you can enter a custom image or use the styled poster card."
      };
    } else {
      return {
        valid: false,
        provider: 'googledrive',
        originalUrl: url,
        error: "Invalid Google Drive link format. Please provide a standard share link like: https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
      };
    }
  }

  // 4. Bunny Stream
  if (url.includes('iframe.mediadelivery.net') || url.includes('bunnycdn') || url.includes('b-cdn.net')) {
    return {
      valid: true,
      provider: 'bunny',
      originalUrl: url,
      embedUrl: url,
      notice: 'Bunny Stream video detected.'
    };
  }

  // 5. Direct MP4 / WebM / Video URL
  const isDirectVideo = /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) ||
    url.startsWith('https://commondatastorage.googleapis.com/') ||
    url.includes('/video/') ||
    url.includes('sample/ForBiggerBlazes');

  if (isDirectVideo) {
    return {
      valid: true,
      provider: 'direct',
      originalUrl: url,
      directUrl: url,
      notice: 'Direct video file detected. Handled via cinematic HTML5 video player.'
    };
  }

  // 6. Generic HTTP(S) URL fallback or unsupported
  if (/^https?:\/\/.+/i.test(url)) {
    // If it looks like a web link but not recognized
    return {
      valid: false,
      provider: 'unsupported',
      originalUrl: url,
      error: 'Unrecognized video provider. Please provide a YouTube, Vimeo, Google Drive share link, or direct MP4/video link.'
    };
  }

  return {
    valid: false,
    provider: 'unsupported',
    originalUrl: url,
    error: 'Please enter a valid HTTP or HTTPS video URL.'
  };
}

/**
 * Normalizes provider name for storing in portfolio items.
 */
export function normalizeVideoProvider(provider: VideoSourceType): 'youtube' | 'vimeo' | 'googledrive' | 'direct' | 'bunny' | 'placeholder' {
  if (provider === 'youtube') return 'youtube';
  if (provider === 'vimeo') return 'vimeo';
  if (provider === 'googledrive') return 'googledrive';
  if (provider === 'bunny') return 'bunny';
  if (provider === 'direct') return 'direct';
  return 'direct';
}
