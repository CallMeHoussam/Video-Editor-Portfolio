'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

interface VideoThumbnailProps {
  thumbnailUrl?: string;
  previewVideo?: string;
  title: string;
  folderName?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5';
  className?: string;
  showPlayButton?: boolean;
  isHovering?: boolean;
}

export function VideoThumbnail({
  thumbnailUrl,
  previewVideo,
  title,
  folderName,
  className = '',
  showPlayButton = true,
  isHovering = false,
}: VideoThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);

  const hasImage = Boolean(thumbnailUrl && thumbnailUrl.trim() && !imageError);
  const hasPlayablePreview = Boolean(
    previewVideo &&
      previewVideo.trim() &&
      /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(previewVideo.trim())
  );

  useEffect(() => {
    const vid = previewRef.current;
    if (!vid || !hasPlayablePreview) return;

    if (isHovering) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isHovering, hasPlayablePreview]);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={`relative w-full h-full overflow-hidden bg-[#0E0E12] select-none ${className}`}
    >
      {hasImage ? (
        <img
          src={thumbnailUrl}
          alt={title}
          draggable={false}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] ${
            isHovering && previewReady ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />
      ) : (
        /* Restrained editorial film slate when no image thumbnail exists */
        <div className="relative w-full h-full flex flex-col justify-between p-5 bg-[#101015] text-[#F3F2EF]">
          <div className="flex items-center justify-between text-[10px] tracking-[0.18em] uppercase text-[#767580]">
            <span>{folderName || 'Evoless'}</span>
          </div>

          <div className="my-auto text-center px-3">
            <p className="font-display text-sm sm:text-base font-medium leading-snug line-clamp-3 text-[#F3F2EF]">
              {title}
            </p>
          </div>

          <div className="h-px w-full bg-white/10" />
        </div>
      )}

      {/* Subtle muted hover video preview when a direct preview stream is configured */}
      {hasPlayablePreview && isHovering && (
        <video
          ref={previewRef}
          src={previewVideo}
          muted
          loop
          playsInline
          preload="metadata"
          controlsList="nodownload"
          disablePictureInPicture
          onCanPlay={() => setPreviewReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            previewReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Subtle bottom vignette for crisp frame edge separation */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

      {/* Minimal play indicator centered cleanly over frame */}
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-11 h-11 rounded-full bg-[#09090B]/70 border border-white/25 text-white flex items-center justify-center backdrop-blur-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
            <Play className="w-4 h-4 ml-0.5 fill-white" />
          </div>
        </div>
      )}
    </div>
  );
}
