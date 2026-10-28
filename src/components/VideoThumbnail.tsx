'use client';

import React, { useState } from 'react';
import { Play, Film } from 'lucide-react';

interface VideoThumbnailProps {
  thumbnailUrl?: string;
  title: string;
  folderName?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5';
  className?: string;
  showPlayButton?: boolean;
}

export function VideoThumbnail({
  thumbnailUrl,
  title,
  folderName,
  aspectRatio = '16:9',
  className = '',
  showPlayButton = true
}: VideoThumbnailProps) {
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(thumbnailUrl && thumbnailUrl.trim() && !imageError);

  if (hasImage) {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#0e0c15] ${className}`}>
        <img
          src={thumbnailUrl}
          alt={title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg shadow-purple-950/50 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              <Play className="w-5 h-5 ml-0.5 fill-white" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback Poster Card (High-production aesthetic, dark glass, purple glow)
  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-[#1b152b] via-[#0f0c18] to-[#07060d] border border-purple-500/20 flex flex-col justify-between p-5 select-none ${className}`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-indigo-600/15 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between">
        {folderName ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/15 border border-purple-500/25 text-[10px] sm:text-xs font-mono font-medium tracking-wide uppercase text-purple-300">
            <Film className="w-3 h-3 text-purple-400" />
            <span>{folderName}</span>
          </span>
        ) : <span />}
      </div>

      {/* Center Play Indicator */}
      <div className="relative z-10 my-auto text-center flex flex-col items-center">
        {showPlayButton && (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-200 shadow-xl shadow-purple-950/60 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 mb-2">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 fill-current" />
          </div>
        )}
        <h4 className="font-display font-semibold text-xs sm:text-sm text-zinc-100 max-w-[85%] line-clamp-2 leading-snug">
          {title}
        </h4>
      </div>

      {/* Bottom Cinematic Accent */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-white/5 pt-2">
        <span className="text-purple-400/80 uppercase">EVOLESS PORTFOLIO</span>
        <span>WATCH CUT</span>
      </div>
    </div>
  );
}
