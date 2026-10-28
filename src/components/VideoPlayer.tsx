'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, AlertCircle } from 'lucide-react';
import { VideoProvider } from '@/types/portfolio';

interface VideoPlayerProps {
  provider: VideoProvider;
  url: string;
  poster?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5';
  title?: string;
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
  bunnyLibraryId,
  bunnyVideoId,
  autoPlayMuted = false,
  className = ''
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(autoPlayMuted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [signedEmbedUrl, setSignedEmbedUrl] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Aspect ratio class helper
  const aspectClass = {
    '16:9': 'aspect-video w-full',
    '9:16': 'aspect-[9/16] w-full max-w-[380px] mx-auto shadow-2xl rounded-2xl',
    '1:1': 'aspect-square w-full max-w-[500px] mx-auto rounded-2xl',
    '4:5': 'aspect-[4/5] w-full max-w-[440px] mx-auto rounded-2xl'
  }[aspectRatio] || 'aspect-video w-full';

  // Coordinate global single playback (pause other videos when any video plays)
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

  // Request signed token for Bunny Stream if needed
  useEffect(() => {
    if (provider === 'bunny' && (bunnyVideoId || url)) {
      const vidId = bunnyVideoId || url.split('/').pop()?.split('?')[0];
      if (vidId) {
        fetch('/api/video/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId: vidId, libraryId: bunnyLibraryId })
        })
          .then(res => res.json())
          .then(data => {
            if (data.embedUrl) {
              setSignedEmbedUrl(data.embedUrl);
            }
          })
          .catch(() => {
            // Fallback direct embed
            setSignedEmbedUrl(`https://iframe.mediadelivery.net/embed/${bunnyLibraryId || ''}/${vidId}?autoplay=false`);
          });
      }
    }
  }, [provider, bunnyVideoId, bunnyLibraryId, url]);

  // Extract Embed URLs for Bunny, Vimeo, YouTube, and Google Drive
  const getEmbedUrl = () => {
    if (provider === 'bunny') {
      return signedEmbedUrl || (bunnyVideoId ? `https://iframe.mediadelivery.net/embed/${bunnyLibraryId || ''}/${bunnyVideoId}` : url);
    }

    if (provider === 'googledrive' || (url && url.includes('drive.google.com'))) {
      const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
        url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
      }
      return url.includes('/preview') ? url : null;
    }

    if (provider === 'vimeo' || (url && url.includes('vimeo.com'))) {
      const match = url.match(/(?:vimeo\.com\/|video\/)(\d+)/);
      const vimeoId = match ? match[1] : url;
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=0&muted=0&color=8b5cf6&title=0&byline=0&portrait=0`;
    }

    if (provider === 'youtube' || (url && (url.includes('youtube.com') || url.includes('youtu.be')))) {
      let ytId = url;
      const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/);
      if (ytMatch && ytMatch[1]) {
        ytId = ytMatch[1];
      }
      return `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&color=white`;
    }

    return null;
  };

  const embedSrc = getEmbedUrl();

  // Direct Video Handlers
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

  // If using external embed (Bunny, Vimeo, YouTube)
  // Elegant replaceable placeholder if actual footage is unavailable
  if (provider === 'placeholder' || (!url && !embedSrc)) {
    return (
      <div
        className={`relative group overflow-hidden bg-gradient-to-br from-[#181326] via-[#0E0C15] to-[#08070D] border border-purple-500/20 rounded-2xl select-none flex flex-col items-center justify-center p-6 text-center ${aspectClass} ${className}`}
      >
        {/* Subtle ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18)_0,transparent_70%)] pointer-events-none" />

        {/* Cinematic Header Badges */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-[10px] sm:text-xs font-mono text-purple-300/80 tracking-widest uppercase">
          EVOLESS // EDITORIAL SHOWREEL
        </div>
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[10px] sm:text-xs font-mono px-2.5 py-0.5 rounded bg-purple-900/40 border border-purple-500/30 text-purple-200 font-semibold tracking-wide">
          4K UHD · 24 FPS
        </div>

        {/* Center Brand Reel Indicator */}
        <div className="relative z-10 max-w-md mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 bg-purple-600/20 border-2 border-purple-500 flex items-center justify-center text-purple-300 shadow-xl shadow-purple-950/60 group-hover:scale-105 transition-transform duration-300">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-purple-300" />
          </div>

          <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white mb-2">
            {title || 'Evoless — Creative Showreel'}
          </h3>

          <p className="text-xs sm:text-sm text-purple-200/80 mb-4 px-4 py-2 rounded-xl bg-purple-950/30 border border-purple-500/20 max-w-sm mx-auto leading-relaxed">
            Commercial Advertising · High-Retention Social Reels · Motion Design
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available for New Projects</span>
          </div>
        </div>

        {/* Cinematic Bottom Metadata Bar */}
        <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 flex items-center justify-between text-[10px] sm:text-xs font-mono text-zinc-400 border-t border-white/5 pt-2">
          <span>CINEMATIC SOUND DESIGN</span>
          <span className="text-purple-400">COLOR MASTERED (REC.709)</span>
        </div>
      </div>
    );
  }

  if (embedSrc) {

    return (
      <div className={`relative overflow-hidden bg-black/40 border border-purple-500/20 rounded-2xl ${aspectClass} ${className}`}>
        <iframe
          src={embedSrc}
          title={title}
          className="w-full h-full border-0 rounded-2xl"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  // Direct HTML5 Video Player with cinematic controls
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative group overflow-hidden bg-[#0B0A0F] border border-purple-500/20 rounded-2xl select-none ${aspectClass} ${className}`}
    >
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#15121C] text-[#A7A1B3]">
          <AlertCircle className="w-10 h-10 text-purple-400 mb-2" />
          <p className="text-sm font-medium">Video preview unavailable.</p>
          <p className="text-xs text-muted-foreground mt-1">Please check source link or verify video hosting.</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={url}
            poster={poster}
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={() => setHasError(true)}
            onClick={handlePlayToggle}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Large Center Play Button when paused */}
          {!isPlaying && (
            <button
              onClick={handlePlayToggle}
              aria-label="Play video"
              className="absolute inset-0 m-auto w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-purple-600/90 text-white shadow-2xl backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-300 z-10"
            >
              <Play className="w-8 h-8 md:w-10 md:h-10 ml-1 fill-white" />
            </button>
          )}

          {/* Ambient Film Vignette Gradient */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Floating Glass Control Bar */}
          <div
            className={`absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 z-20 transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 md:px-4 md:py-2.5 flex flex-col gap-1.5 shadow-2xl">
              {/* Progress Scrubber Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Video scrubber"
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:h-2 transition-all"
                />
              </div>

              {/* Bottom Row Controls */}
              <div className="flex items-center justify-between text-xs text-white/90">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayToggle}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button
                    onClick={handleMuteToggle}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-purple-300" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="font-mono text-[11px] text-white/70">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFullscreen}
                    aria-label="Toggle Fullscreen"
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
