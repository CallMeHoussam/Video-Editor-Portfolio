'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, Folder, Project } from '@/types/portfolio';
import { VideoPlayer } from './VideoPlayer';
import { VideoThumbnail } from './VideoThumbnail';
import { ArrowLeft, Star, Film, Play, Sparkles } from 'lucide-react';

interface FolderViewProps {
  locale: Locale;
  folder: Folder;
  projects: Project[];
  bestOne: Project;
}

export function FolderView({ locale, folder, projects, bestOne }: FolderViewProps) {
  // Allow user to switch the active video playing in the main theater view
  const [activeVideo, setActiveVideo] = useState<Project>(bestOne);

  const folderName = folder.name[locale] || folder.name.en || folder.id;
  const folderDesc = folder.description?.[locale] || folder.description?.en || '';

  const isCurrentActiveBestOne = activeVideo.id === bestOne.id;
  const otherVideos = projects.filter(p => p.id !== activeVideo.id);

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/${locale}#work`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{locale === 'en' ? 'Back to Portfolio' : 'Retour au Portfolio'}</span>
          </Link>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
            {projects.length} {projects.length === 1 ? (locale === 'en' ? 'Video' : 'Vidéo') : (locale === 'en' ? 'Videos' : 'Vidéos')}
          </span>
        </div>

        {/* Folder Header */}
        <div className="max-w-4xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'Project Collection' : 'Dossier Projet'}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight uppercase">
            {folderName}
          </h1>

          {folderDesc && (
            <p className="text-base sm:text-lg text-[var(--text-secondary)] mt-3 max-w-2xl leading-relaxed">
              {folderDesc}
            </p>
          )}
        </div>

        {/* 1. FEATURED / THEATER VIDEO PRESENTATION */}
        <div className="mb-16">
          <div className="relative rounded-2xl md:rounded-3xl p-1 bg-gradient-to-b from-purple-500/30 via-purple-500/10 to-transparent shadow-2xl">
            <div className="bg-[var(--bg-surface)] rounded-[14px] md:rounded-[22px] overflow-hidden border border-[var(--border-subtle)]">
              {/* Theater Top Bar: Title on Left, Best One Badge on Right */}
              <div className="px-5 py-3.5 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <Play className="w-4 h-4 text-purple-400 shrink-0" />
                  <h2 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)] truncate">
                    {activeVideo.title[locale] || activeVideo.title.en}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isCurrentActiveBestOne && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold text-xs shadow-sm whitespace-nowrap">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>Best One</span>
                    </div>
                  )}

                  {activeVideo.aspectRatio && (
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)]">
                      {activeVideo.aspectRatio}
                    </span>
                  )}
                </div>
              </div>

              {/* Theater Video Player */}
              <div className="p-2 sm:p-4 bg-black/60">
                <VideoPlayer
                  key={activeVideo.id}
                  provider={activeVideo.videoProvider}
                  url={activeVideo.videoUrl}
                  poster={activeVideo.thumbnail}
                  aspectRatio={activeVideo.aspectRatio || '16:9'}
                  title={activeVideo.title[locale] || activeVideo.title.en}
                  autoPlayMuted={false}
                />
              </div>

              {/* Short Description (Only when provided) */}
              {(activeVideo.shortDescription?.[locale] || activeVideo.shortDescription?.en) && (
                <div className="px-6 py-4 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                    {activeVideo.shortDescription?.[locale] || activeVideo.shortDescription?.en}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. REMAINING VIDEOS UNDERNEATH IN CLEAN RESPONSIVE GRID */}
        {otherVideos.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                {locale === 'en' ? `More Videos from ${folderName}` : `Autres vidéos de ${folderName}`}
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                {otherVideos.length} {otherVideos.length === 1 ? 'video' : 'videos'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {otherVideos.map((video) => {
                const videoTitle = video.title[locale] || video.title.en;
                const videoDesc = video.shortDescription?.[locale] || video.shortDescription?.en;
                const isBest = video.id === bestOne.id;

                return (
                  <article
                    key={video.id}
                    onClick={() => {
                      setActiveVideo(video);
                      window.scrollTo({ top: 160, behavior: 'smooth' });
                    }}
                    className="group flex flex-col bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] hover:border-purple-500/40 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Media Card */}
                    <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                      <VideoThumbnail
                        thumbnailUrl={video.thumbnail}
                        title={videoTitle}
                        folderName={folderName}
                        aspectRatio={video.aspectRatio || '16:9'}
                      />

                      {video.aspectRatio && (
                        <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white text-[10px] font-mono">
                          {video.aspectRatio}
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title on Left, Best One Badge on Right */}
                        <div className="flex items-start justify-between gap-2.5 mb-2">
                          <h4 className="font-display text-base font-bold text-[var(--text-primary)] group-hover:text-purple-400 transition-colors leading-snug flex-1 min-w-0">
                            {videoTitle}
                          </h4>

                          {isBest && (
                            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold shadow-sm whitespace-nowrap mt-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-300" />
                              <span>Best One</span>
                            </span>
                          )}
                        </div>

                        {videoDesc && (
                          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                            {videoDesc}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-purple-400 font-semibold">
                        <span>{locale === 'en' ? 'Play in Theater' : 'Lire la vidéo'}</span>
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
