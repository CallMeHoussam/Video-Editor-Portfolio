'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, Project, Folder, Category } from '@/types/portfolio';
import { Sparkles, Folder as FolderIcon, Film, Star, ArrowRight, Layers } from 'lucide-react';
import { VideoThumbnail } from './VideoThumbnail';
import { ProjectCard } from './ProjectCard';

interface PortfolioSectionProps {
  locale: Locale;
  projects: Project[];
  categories?: Category[];
  folders?: Folder[];
}

export function PortfolioSection({
  locale,
  projects,
  categories = [],
  folders = []
}: PortfolioSectionProps) {
  const [viewMode, setViewMode] = useState<'folders' | 'all'>('folders');

  // Compute published folders with videos (Do not display empty folders)
  const publishedFolders = folders
    .map(folder => {
      const folderProjects = projects.filter(
        p => p.folderId === folder.id || p.folderId === folder.slug
      );
      if (folderProjects.length === 0) return null;
      const bestOne = folderProjects.find(p => p.featured) || folderProjects[0];
      return {
        folder,
        projects: folderProjects,
        bestOne,
        count: folderProjects.length
      };
    })
    .filter(Boolean) as {
      folder: Folder;
      projects: Project[];
      bestOne: Project;
      count: number;
    }[];

  // General portfolio videos (not assigned to a specific folder or assigned to 'general')
  const generalProjects = projects.filter(
    p => !p.folderId || p.folderId === 'general'
  );

  return (
    <section id="work" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-purple-400 uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Curated Portfolio' : 'Portfolio Sélectionné'}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight">
              {locale === 'en' ? 'SELECTED WORK' : 'RÉALISATIONS'}
            </h2>
            <p className="text-base text-[var(--text-secondary)] mt-2 max-w-xl">
              {locale === 'en'
                ? 'Client folders, advertising campaigns, and motion design collections.'
                : 'Dossiers clients, campagnes publicitaires et collections motion design.'}
            </p>
          </div>

          {/* View Mode Toggle: Folders vs All Videos */}
          <div className="flex items-center p-1 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-medium self-start md:self-end">
            <button
              onClick={() => setViewMode('folders')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'folders'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <FolderIcon className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Folders' : 'Dossiers'}</span>
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'All Videos' : 'Toutes les vidéos'}</span>
            </button>
          </div>
        </div>

        {/* 1. FOLDERS VIEW (PRIMARY) */}
        {viewMode === 'folders' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {publishedFolders.map(({ folder, projects: folderVideos, bestOne, count }) => {
              const folderTitle = folder.name[locale] || folder.name.en || folder.id;
              const folderDesc = folder.description?.[locale] || folder.description?.en || '';
              const bestOneTitle = bestOne.title[locale] || bestOne.title.en;
              const thumbnail = folder.coverImage || bestOne.thumbnail || '';

              return (
                <Link
                  key={folder.id}
                  href={`/${locale}/folder/${folder.slug || folder.id}`}
                  className="group flex flex-col bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] hover:border-purple-500/50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Folder Visual Card Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[#0e0c15]">
                    <VideoThumbnail
                      thumbnailUrl={thumbnail}
                      title={bestOneTitle}
                      folderName={folderTitle}
                      aspectRatio="16:9"
                      showPlayButton={false}
                    />

                    {/* Video Count Badge */}
                    <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[11px] font-mono border border-white/10">
                      {count} {count === 1 ? 'Video' : 'Videos'}
                    </div>
                  </div>

                  {/* Folder Information */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
                        <FolderIcon className="w-3.5 h-3.5" />
                        <span>{locale === 'en' ? 'Project Folder' : 'Dossier Projet'}</span>
                      </div>

                      {/* Title on left, Best One badge on right on same row */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)] group-hover:text-purple-400 transition-colors uppercase tracking-tight flex-1 min-w-0">
                          {folderTitle}
                        </h3>

                        {bestOne && (
                          <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold shadow-sm whitespace-nowrap mt-1">
                            <Star className="w-2.5 h-2.5 fill-amber-300" />
                            <span>Best One</span>
                          </span>
                        )}
                      </div>

                      {folderDesc && (
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed">
                          {folderDesc}
                        </p>
                      )}

                      <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
                        <span className="text-[11px] font-mono text-[var(--text-muted)] block line-clamp-1">
                          ★ Best One: {bestOneTitle}
                        </span>
                      </div>
                    </div>

                    {/* CTA Footer */}
                    <div className="mt-5 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                      <span>{locale === 'en' ? 'Open Folder' : 'Ouvrir le dossier'}</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* General Portfolio collection card if there are unassigned videos */}
            {generalProjects.length > 0 && (
              <div className="group flex flex-col bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] hover:border-purple-500/50 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1">
                <div className="relative aspect-video w-full overflow-hidden bg-[#0e0c15]">
                  <VideoThumbnail
                    thumbnailUrl={generalProjects[0].thumbnail}
                    title={generalProjects[0].title[locale] || generalProjects[0].title.en}
                    folderName="General Portfolio"
                    aspectRatio="16:9"
                    showPlayButton={false}
                  />
                  <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[11px] font-mono border border-white/10">
                    {generalProjects.length} Videos
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
                      <Film className="w-3.5 h-3.5" />
                      <span>{locale === 'en' ? 'Direct Showcase' : 'Vitrine Directe'}</span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)] group-hover:text-purple-400 transition-colors uppercase tracking-tight">
                      {locale === 'en' ? 'GENERAL PORTFOLIO' : 'PORTFOLIO GÉNÉRAL'}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed">
                      {locale === 'en'
                        ? 'Standalone video edits and creative highlights.'
                        : 'Montages vidéo indépendants et réalisations marquantes.'}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between text-xs font-semibold text-purple-400">
                    <button
                      onClick={() => setViewMode('all')}
                      className="inline-flex items-center gap-1.5 hover:underline cursor-pointer"
                    >
                      <span>{locale === 'en' ? 'Browse All Videos' : 'Voir toutes les vidéos'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. ALL VIDEOS ARCHIVE VIEW */}
        {viewMode === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                locale={locale}
                categories={categories}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PortfolioSection;
