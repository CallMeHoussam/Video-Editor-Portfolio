'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, AlertCircle } from 'lucide-react';
import { VideoProvider } from '@/types/portfolio';
import { parseBunnyReference } from '@/lib/video-utils';

interface VideoPlayerProps {
  provider: VideoProvider;
  url: string;
  poster?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5';
  title?: string;
  r2Key?: string;
  bunnyLibraryId?: string;
  bunnyVideoId?: string;
  autoPlayMuted?: boolean;
  className?: string;
}

export function VideoPlayer({
  provider,
  url,
  poster,
  aspectRatio = '16:9',
  title = 'Video Player',
  r2Key,
  bunnyLibraryId,
  bunnyVideoId,
  autoPlayMuted = false,
  className = '',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(autoPlayMuted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [r2PlaybackUrl, setR2PlaybackUrl] = useState<string | null>(null);
  const [r2Loading, setR2Loading] = useState(provider === 'r2');
  const [bunnyState, setBunnyState] = useState<{
    status: 'idle' | 'loading' | 'ready' | 'error';
    embedUrl: string | null;
    errorMessage?: string;
  }>(() => ({
    status: provider === 'bunny' ? 'loading' : 'idle',
    embedUrl: null,
  }));
  const [showControls, setShowControls] = useState(true);
  const [retryNonce, setRetryNonce] = useState(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const aspectClass =
    {
      '16:9': 'aspect-video w-full',
      '9:16': 'aspect-[9/16] w-full max-w-[380px] mx-auto',
      '1:1': 'aspect-square w-full max-w-[500px] mx-auto',
      '4:5': 'aspect-[4/5] w-full max-w-[440px] mx-auto',
    }[aspectRatio] || 'aspect-video w-full';

  // Resolve Cloudflare R2 signed playback URL
  useEffect(() => {
    if (provider !== 'r2') return;

    let cancelled = false;
    let refreshTimer: NodeJS.Timeout | null = null;

    async function fetchR2SignedPlayback() {
      await Promise.resolve();
      if (cancelled) return;
      setR2Loading(true);

      try {
        const res = await fetch('/api/video/r2/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: r2Key, url, expiresIn: 3600 }),
        });

        const data = await res.json().catch(() => ({}));
        if (cancelled) return;

        if (res.ok && data.success && data.playbackUrl) {
          setR2PlaybackUrl(data.playbackUrl);
          setR2Loading(false);

          // Seamless auto-refresh 5 minutes before the 1-hour expiration
          const refreshMs = Math.max(60000, ((data.expiresInSeconds || 3600) - 300) * 1000);
          refreshTimer = setTimeout(() => {
            if (!cancelled) fetchR2SignedPlayback();
          }, refreshMs);
        } else {
          // If direct token generation fails or R2 isn't configured, fall back to stream route
          const streamUrl = `/api/video/r2/stream?key=${encodeURIComponent(r2Key || url.replace(/^r2:\/\//, ''))}`;
          setR2PlaybackUrl(streamUrl);
          setR2Loading(false);
        }
      } catch {
        if (cancelled) return;
        const streamUrl = `/api/video/r2/stream?key=${encodeURIComponent(r2Key || url.replace(/^r2:\/\//, ''))}`;
        setR2PlaybackUrl(streamUrl);
        setR2Loading(false);
      }
    }

    fetchR2SignedPlayback();

    return () => {
      cancelled = true;
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  }, [provider, url, r2Key, retryNonce]);
  useEffect(() => {
    const handleGlobalPlay = (e: Event) => {
      if (videoRef.current && e.target !== videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('play', handleGlobalPlay, true);
    return () => window.removeEventListener('play', handleGlobalPlay, true);
  }, []);

  const parsedBunny = parseBunnyReference(url || '', bunnyLibraryId);
  const resolvedVideoId = bunnyVideoId || parsedBunny.videoId || '';
  const resolvedLibraryId = bunnyLibraryId || parsedBunny.libraryId || '';

  useEffect(() => {
    if (provider !== 'bunny') return;

    let cancelled = false;
    async function authorizeBunnyPlayback() {
      await Promise.resolve();
      if (cancelled) return;

      if (!resolvedVideoId && !url) {
        setBunnyState({
          status: 'error',
          embedUrl: null,
          errorMessage: 'Bunny Stream video reference is missing.',
        });
        return;
      }

      setBunnyState((prev) =>
        prev.status === 'loading' ? prev : { status: 'loading', embedUrl: null }
      );

      try {
        const res = await fetch('/api/video/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoId: resolvedVideoId || undefined,
            libraryId: resolvedLibraryId || undefined,
            url: url || undefined,
            autoplay: autoPlayMuted,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (cancelled) return;

        if (res.ok && data.success && data.embedUrl) {
          setBunnyState({
            status: 'ready',
            embedUrl: data.embedUrl,
          });
        } else {
          setBunnyState({
            status: 'error',
            embedUrl: null,
            errorMessage: data.message || 'Protected playback session could not be established.',
          });
        }
      } catch {
        if (cancelled) return;
        setBunnyState({
          status: 'error',
          embedUrl: null,
          errorMessage: 'Unable to reach playback authorization service.',
        });
      }
    }

    authorizeBunnyPlayback();
    return () => {
      cancelled = true;
    };
  }, [provider, url, resolvedVideoId, resolvedLibraryId, autoPlayMuted, retryNonce]);

  const getNonBunnyEmbedUrl = (): string | null => {
    if (provider === 'bunny') return null;

    if (provider === 'googledrive' || (url && url.includes('drive.google.com'))) {
      const driveMatch =
        url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
      }
      return url.includes('/preview') ? url : null;
    }

    if (provider === 'vimeo' || (url && url.includes('vimeo.com'))) {
      const match = url.match(/(?:vimeo\.com\/|video\/)(\d+)/);
      const vimeoId = match ? match[1] : url;
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=${autoPlayMuted ? 1 : 0}&muted=${autoPlayMuted ? 1 : 0}&title=0&byline=0&portrait=0&dnt=1`;
    }

    if (provider === 'youtube' || (url && (url.includes('youtube.com') || url.includes('youtu.be')))) {
      let ytId = url;
      const ytMatch = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/
      );
      if (ytMatch && ytMatch[1]) {
        ytId = ytMatch[1];
      }
      return `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&color=white`;
    }

    return null;
  };

  const embedSrc = provider === 'bunny' ? bunnyState.embedUrl : getNonBunnyEmbedUrl();

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    if (autoPlayMuted) {
      videoRef.current.muted = true;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const targetTime = parseFloat(e.target.value);
    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Bunny Stream states: never render raw/unsigned iframe while loading or errored
  if (provider === 'bunny') {
    if (bunnyState.status === 'loading' || bunnyState.status === 'idle') {
      return (
        <div
          onContextMenu={preventContextMenu}
          className={`relative overflow-hidden bg-[#0B0B0E] border border-[var(--border-subtle)] rounded-lg select-none flex flex-col items-center justify-center p-6 text-center ${aspectClass} ${className}`}
        >
          <div className="w-7 h-7 rounded-full border-2 border-white/15 border-t-[var(--accent)] animate-spin mb-3" />
          <p className="text-xs tracking-wide text-[#9E9CA6]">Preparing video playback</p>
        </div>
      );
    }

    if (bunnyState.status === 'error' || !embedSrc) {
      return (
        <div
          onContextMenu={preventContextMenu}
          className={`relative overflow-hidden bg-[#0B0B0E] border border-[var(--border-subtle)] rounded-lg select-none flex flex-col items-center justify-center p-6 text-center ${aspectClass} ${className}`}
        >
          <AlertCircle className="w-6 h-6 text-[#9E9CA6] mb-3" />
          <p className="text-sm font-medium text-[#F4F3F0] mb-1">Video playback unavailable</p>
          <p className="text-xs text-[#9E9CA6] max-w-sm mb-4">
            {bunnyState.errorMessage || 'Unable to verify playback authorization.'}
          </p>
          <button
            type="button"
            onClick={() => setRetryNonce((n) => n + 1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded border border-white/15 text-xs text-[#F4F3F0] hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      );
    }

    return (
      <div
        onContextMenu={preventContextMenu}
        className={`relative overflow-hidden bg-[#070709] border border-[var(--border-subtle)] rounded-lg select-none ${aspectClass} ${className}`}
      >
        <iframe
          src={embedSrc}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="origin"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  // Unavailable or unlinked video placeholder (minimal editorial slate)
  if (provider === 'placeholder' || (!url && !embedSrc)) {
    return (
      <div
        onContextMenu={preventContextMenu}
        className={`relative overflow-hidden bg-[#0D0D11] border border-[var(--border-subtle)] rounded-lg select-none flex flex-col items-center justify-center p-8 text-center ${aspectClass} ${className}`}
      >
        {poster && (
          <img
            src={poster}
            alt={title}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
        )}
        <div className="relative z-10 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 bg-white/5 border border-white/15 flex items-center justify-center text-[#F4F3F0]">
            <Play className="w-4 h-4 ml-0.5 fill-current" />
          </div>
          <p className="text-sm font-medium text-[#F4F3F0] mb-1">
            {title || 'Video not yet linked'}
          </p>
          <p className="text-xs text-[#9E9CA6]">
            Connect a Bunny Stream asset or supported video link in Studio.
          </p>
        </div>
      </div>
    );
  }

  if (embedSrc) {
    return (
      <div
        onContextMenu={preventContextMenu}
        className={`relative overflow-hidden bg-[#070709] border border-[var(--border-subtle)] rounded-lg select-none ${aspectClass} ${className}`}
      >
        <iframe
          src={embedSrc}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="origin"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  // Cloudflare R2 loading state
  if (provider === 'r2' && r2Loading && !r2PlaybackUrl) {
    return (
      <div
        onContextMenu={preventContextMenu}
        className={`relative overflow-hidden bg-[#0B0B0E] border border-[var(--border-subtle)] rounded-lg select-none flex flex-col items-center justify-center p-6 text-center ${aspectClass} ${className}`}
      >
        <div className="w-7 h-7 rounded-full border-2 border-white/15 border-t-[var(--accent)] animate-spin mb-3" />
        <p className="text-xs tracking-wide text-[#9E9CA6]">Authorizing private playback session...</p>
      </div>
    );
  }

  // Active video source: R2 signed URL, or direct URL (handling GitHub raw conversions)
  let activeVideoSrc = provider === 'r2' ? (r2PlaybackUrl || url) : url;
  if (activeVideoSrc && activeVideoSrc.includes('github.com') && activeVideoSrc.includes('/blob/')) {
    activeVideoSrc = activeVideoSrc.replace('github.com/', 'raw.githubusercontent.com/').replace('/blob/', '/');
  }

  // Custom restrained HTML5 Player for direct video files and Cloudflare R2
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onContextMenu={preventContextMenu}
      className={`relative group overflow-hidden bg-[#070709] border border-[var(--border-subtle)] rounded-lg select-none ${aspectClass} ${className}`}
    >
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0D0D11] text-[#9E9CA6]">
          <AlertCircle className="w-7 h-7 text-[#9E9CA6] mb-2" />
          <p className="text-sm font-medium text-[#F4F3F0]">Video preview unavailable.</p>
          <p className="text-xs text-[#9E9CA6] mt-1">Verify the source stream in Studio.</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={activeVideoSrc}
            poster={poster}
            playsInline
            preload="metadata"
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            onContextMenu={preventContextMenu}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onError={() => setHasError(true)}
            onClick={handlePlayToggle}
            className="w-full h-full object-cover cursor-pointer"
          />

          {!isPlaying && (
            <button
              type="button"
              onClick={handlePlayToggle}
              aria-label="Play video"
              className="absolute inset-0 m-auto w-14 h-14 flex items-center justify-center rounded-full bg-[#0A0A0C]/80 border border-white/25 text-white backdrop-blur-sm hover:scale-105 transition-transform duration-200 z-10"
            >
              <Play className="w-5 h-5 ml-0.5 fill-white" />
            </button>
          )}

          <div
            className={`absolute bottom-3 left-3 right-3 z-20 transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="bg-[#0B0B0E]/85 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 flex flex-col gap-1.5">
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                aria-label="Video scrubber"
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#8B74FF]"
              />

              <div className="flex items-center justify-between text-xs text-white/90">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handlePlayToggle}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleMuteToggle}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white/60" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>

                  <span className="font-mono text-[11px] tabular-nums text-white/70">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleFullscreen}
                  aria-label="Toggle Fullscreen"
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <Maximize className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
