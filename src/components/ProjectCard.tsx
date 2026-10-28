'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Locale, Project, Category } from '@/types/portfolio';
import { Play, ArrowUpRight, Film, Star } from 'lucide-react';
import { VideoThumbnail } from './VideoThumbnail';

interface ProjectCardProps {
  project: Project;
  locale: Locale;
  categories: Category[];
}

export function ProjectCard({ project, locale, categories }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVertical = project.aspectRatio === '9:16';
  const categoryNames = project.categories.map(
    catId => categories.find(c => c.id === catId)?.name[locale] || catId
  );

  useEffect(() => {
    if (isHovered && videoRef.current && project.previewVideo) {
      videoRef.current.play().catch(() => {});
    } else if (!isHovered && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered, project.previewVideo]);

  // Pause preview when another video on the page begins playing
  useEffect(() => {
    const handleGlobalPlay = (e: Event) => {
      if (videoRef.current && e.target !== videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };
    window.addEventListener('play', handleGlobalPlay, true);
    return () => window.removeEventListener('play', handleGlobalPlay, true);
  }, []);

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] hover:border-purple-500/40 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1"
    >
      {/* Media Container */}
      <Link
        href={`/${locale}/work/${project.slug}`}
        className="relative overflow-hidden bg-black/40 block focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        aria-label={`Open case study for ${project.title[locale]}`}
      >
        <div className={`w-full overflow-hidden ${isVertical ? 'aspect-[4/5] sm:aspect-[3/4]' : 'aspect-video'}`}>
          {/* Optional Video preview on hover */}
          {project.previewVideo ? (
            <video
              ref={videoRef}
              src={project.previewVideo}
              loop
              muted
              playsInline
              preload="none"
              onLoadedData={() => setVideoLoaded(true)}
              className={`w-full h-full object-cover scale-105 transition-all duration-500 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 pointer-events-none'
              }`}
            />
          ) : null}

          {/* Poster Image / Fallback Card */}
          <div
            className={`w-full h-full transition-all duration-500 group-hover:scale-105 relative ${
              isHovered && project.previewVideo && videoLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <VideoThumbnail
              thumbnailUrl={project.thumbnail}
              title={project.title[locale]}
              folderName={project.client || categoryNames[0]}
              aspectRatio={project.aspectRatio || '16:9'}
            />
          </div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
            <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-mono">
              {project.year}
            </span>

            {project.results?.metrics?.[0] && (
              <span className="px-2.5 py-1 rounded-md bg-purple-600/90 backdrop-blur-md text-white text-[11px] font-semibold">
                {project.results.metrics[0].value}
              </span>
            )}
          </div>

          {/* Format Badge Bottom */}
          <div className="absolute bottom-3 left-3 pointer-events-none z-10">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/60 backdrop-blur-sm text-purple-300 border border-purple-500/20">
              {project.format}
            </span>
          </div>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Category Pills (Multi-category support) */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {categoryNames.slice(0, 3).map((catName, idx) => (
              <span
                key={idx}
                className="text-[10px] uppercase font-semibold tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded"
              >
                {catName}
              </span>
            ))}
          </div>

          {/* Title on the left, Best One badge on the right on the same row */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] group-hover:text-purple-400 transition-colors leading-snug flex-1 min-w-0">
              <Link href={`/${locale}/work/${project.slug}`}>
                {project.title[locale]}
              </Link>
            </h3>

            {project.featured && (
              <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold shadow-sm whitespace-nowrap mt-0.5">
                <Star className="w-3 h-3 fill-amber-300" />
                <span>Best One</span>
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
            {project.shortDescription[locale]}
          </p>
        </div>

        {/* Bottom Action Footer */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)] font-medium">
            {project.client}
          </span>

          <Link
            href={`/${locale}/work/${project.slug}`}
            className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium group/link"
          >
            <span>{locale === 'en' ? 'View Case Study' : "Voir l'étude"}</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
