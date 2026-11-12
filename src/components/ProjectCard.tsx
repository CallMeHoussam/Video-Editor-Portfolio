'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, Project } from '@/types/portfolio';
import { VideoThumbnail } from './VideoThumbnail';

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  folderName?: string;
  showBestOneBadge?: boolean;
  onQuickWatch?: (project: Project) => void;
}

export function ProjectCard({
  project,
  locale,
  folderName,
  showBestOneBadge = false,
  onQuickWatch,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const aspectClass =
    {
      '9:16': 'aspect-[9/16]',
      '16:9': 'aspect-video',
      '1:1': 'aspect-square',
      '4:5': 'aspect-[4/5]',
    }[project.aspectRatio || '16:9'] || 'aspect-video';

  const title = project.title[locale] || project.title.en;
  const role = project.role[locale] || project.role.en;

  const handleFrameClick = (e: React.MouseEvent) => {
    if (onQuickWatch) {
      e.preventDefault();
      onQuickWatch(project);
    }
  };

  return (
    <article
      className="group flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clean video thumbnail frame with exact aspect ratio */}
      <Link
        href={`/${locale}/work/${project.slug}`}
        onClick={handleFrameClick}
        className={`relative block w-full overflow-hidden rounded-md border border-[var(--border-subtle)] group-hover:border-[var(--border-hover)] transition-colors duration-300 bg-[#0E0E12] ${aspectClass}`}
      >
        <VideoThumbnail
          thumbnailUrl={project.thumbnail}
          previewVideo={project.previewVideo}
          title={title}
          folderName={folderName}
          aspectRatio={project.aspectRatio}
          isHovering={isHovered}
        />
      </Link>

      {/* Strictly separated metadata below frame — Best One never overlaps title */}
      <div className="pt-3.5 flex flex-col gap-1">
        {(showBestOneBadge || project.featured) && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--accent)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span>Best One</span>
          </div>
        )}

        <Link
          href={`/${locale}/work/${project.slug}`}
          className="font-display text-base sm:text-[17px] font-medium leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2"
        >
          {title}
        </Link>

        <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
          <span className="truncate">{project.client || role}</span>
          <span className="tabular-nums shrink-0">{project.year}</span>
        </div>
      </div>
    </article>
  );
}
