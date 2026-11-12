'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Locale, Project, Folder, Category } from '@/types/portfolio';
import { translations } from '@/lib/translations';
import { VideoThumbnail } from './VideoThumbnail';
import { VideoPlayer } from './VideoPlayer';
import { ProjectCard } from './ProjectCard';
import { Reveal } from './Reveal';
import { ArrowUpRight, Play, X } from 'lucide-react';

interface PortfolioSectionProps {
  locale: Locale;
  projects: Project[];
  categories?: Category[];
  folders?: Folder[];
}

export function PortfolioSection({
  locale,
  projects,
  folders = [],
}: PortfolioSectionProps) {
  const t = translations[locale].portfolio;
  const [viewMode, setViewMode] = useState<'folders' | 'all'>('folders');
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string>('all');
  const [activeTheaterProject, setActiveTheaterProject] = useState<Project | null>(null);
  const [hoveredBestId, setHoveredBestId] = useState<string | null>(null);

  // Close inline theater on Escape
  useEffect(() => {
    if (!activeTheaterProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveTheaterProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeTheaterProject]);

  // Group published projects by active folder (empty folders stay hidden publicly)
  const publishedFolders = folders
    .map((folder) => {
      const folderProjects = projects.filter(
        (p) => p.folderId === folder.id || p.folderId === folder.slug
      );
      if (folderProjects.length === 0) return null;
      const bestOne = folderProjects.find((p) => p.featured) || folderProjects[0];
      const remaining = folderProjects.filter((p) => p.id !== bestOne.id);
      return {
        folder,
        projects: folderProjects,
        bestOne,
        remaining,
        count: folderProjects.length,
      };
    })
    .filter(Boolean) as {
      folder: Folder;
      projects: Project[];
      bestOne: Project;
      remaining: Project[];
      count: number;
    }[];

  const matchedFolderIds = new Set(publishedFolders.flatMap((f) => [f.folder.id, f.folder.slug]));

  // Catch any general or unmatched published project so work is never silently dropped
  const unfolderedProjects = projects.filter(
    (p) => !p.folderId || p.folderId === 'general' || !matchedFolderIds.has(p.folderId)
  );

  const visibleFolders =
    selectedFolderFilter === 'all'
      ? publishedFolders
      : publishedFolders.filter((entry) => entry.folder.id === selectedFolderFilter);

  const filteredAllProjects =
    selectedFolderFilter === 'all'
      ? projects
      : projects.filter((p) => p.folderId === selectedFolderFilter);

  const renderSeparatedAspectGrid = (items: Project[], folderName?: string) => {
    const portraitItems = items.filter(
      (p) => p.aspectRatio === '9:16' || p.aspectRatio === '4:5'
    );
    const landscapeItems = items.filter(
      (p) => p.aspectRatio !== '9:16' && p.aspectRatio !== '4:5'
    );

    return (
      <div className="flex flex-col gap-10">
        {portraitItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
            {portraitItems.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                locale={locale}
                folderName={folderName}
                onQuickWatch={setActiveTheaterProject}
              />
            ))}
          </div>
        )}

        {landscapeItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {landscapeItems.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                locale={locale}
                folderName={folderName}
                onQuickWatch={setActiveTheaterProject}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="work" className="section-rule py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Minimal Editorial Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2">
                {locale === 'fr' ? 'Portfolio' : 'Index'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
                {t.sectionTitle}
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 max-w-lg">
                {t.sectionSubtitle}
              </p>
            </div>

            {/* Clean understated view mode switch */}
            <div className="flex items-center gap-6 text-xs tracking-wide border-b border-[var(--border-subtle)] self-start md:self-end">
              <button
                type="button"
                onClick={() => setViewMode('folders')}
                className={`pb-2.5 -mb-px transition-colors cursor-pointer ${
                  viewMode === 'folders'
                    ? 'text-[var(--text-primary)] font-semibold border-b-2 border-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {locale === 'fr' ? 'Dossiers Clients' : 'Client Folders'}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`pb-2.5 -mb-px transition-colors cursor-pointer ${
                  viewMode === 'all'
                    ? 'text-[var(--text-primary)] font-semibold border-b-2 border-[var(--accent)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {locale === 'fr' ? `Toutes les coupes (${projects.length})` : `All Cuts (${projects.length})`}
              </button>
            </div>
          </div>

          {/* Client Folder Filter Strip when multiple folders are active */}
          {publishedFolders.length > 1 && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-12 text-xs">
              <button
                type="button"
                onClick={() => setSelectedFolderFilter('all')}
                className={`py-1 transition-colors cursor-pointer ${
                  selectedFolderFilter === 'all'
                    ? 'text-[var(--text-primary)] font-semibold underline decoration-[var(--accent)] underline-offset-4'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t.allCategories}
              </button>

              {publishedFolders.map(({ folder, count }) => (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setSelectedFolderFilter(folder.id)}
                  className={`py-1 transition-colors cursor-pointer ${
                    selectedFolderFilter === folder.id
                      ? 'text-[var(--text-primary)] font-semibold underline decoration-[var(--accent)] underline-offset-4'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {folder.name[locale] || folder.name.en}{' '}
                  <span className="text-[var(--text-dim)] tabular-nums">({count})</span>
                </button>
              ))}
            </div>
          )}
        </Reveal>

        {/* Empty State */}
        {projects.length === 0 ? (
          <div className="py-20 text-center border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface)]">
            <h3 className="font-display text-lg font-medium text-[var(--text-primary)] mb-2">
              {t.emptyTitle}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              {t.emptySubtitle}
            </p>
          </div>
        ) : viewMode === 'folders' ? (
          /* ============================================== */
          /* CLIENT FOLDERS EDITORIAL ORGANIZATION          */
          /* ============================================== */
          <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
            {visibleFolders.map(({ folder, bestOne, remaining, count }, idx) => {
              const folderName = folder.name[locale] || folder.name.en;
              const bestTitle = bestOne.title[locale] || bestOne.title.en;
              const bestSummary = bestOne.shortDescription[locale] || bestOne.shortDescription.en;
              const isPortraitLead =
                bestOne.aspectRatio === '9:16' || bestOne.aspectRatio === '4:5';

              return (
                <Reveal key={folder.id} delayMs={Math.min(idx * 60, 180)}>
                  <div className="py-12 first:pt-2 last:pb-0">
                    {/* Folder Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-8">
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-xs tabular-nums text-[var(--text-muted)]">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                            {folderName}
                          </h3>
                          {(folder.description?.[locale] || folder.description?.en) && (
                            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                              {folder.description[locale] || folder.description.en}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-5 text-xs shrink-0">
                        <span className="text-[var(--text-muted)] tabular-nums">
                          {count}{' '}
                          {locale === 'fr'
                            ? count > 1
                              ? 'vidéos'
                              : 'vidéo'
                            : count > 1
                              ? 'videos'
                              : 'video'}
                        </span>
                        <Link
                          href={`/${locale}/folder/${folder.slug}`}
                          className="inline-flex items-center gap-1 font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                        >
                          <span>{locale === 'fr' ? 'Ouvrir le dossier' : 'Open folder'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Prominent Best One Showcase — Best One label strictly separate from title */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 sm:p-7">
                      <div
                        className={
                          isPortraitLead
                            ? 'lg:col-span-5 flex justify-center bg-[#09090B] rounded-md p-4 border border-[var(--border-subtle)]'
                            : 'lg:col-span-7'
                        }
                        onMouseEnter={() => setHoveredBestId(bestOne.id)}
                        onMouseLeave={() => setHoveredBestId(null)}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveTheaterProject(bestOne)}
                          aria-label={`Play ${bestTitle}`}
                          className={`group relative block w-full overflow-hidden rounded cursor-pointer border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors ${
                            bestOne.aspectRatio === '9:16'
                              ? 'aspect-[9/16] max-w-[270px]'
                              : bestOne.aspectRatio === '4:5'
                                ? 'aspect-[4/5] max-w-[320px]'
                                : bestOne.aspectRatio === '1:1'
                                  ? 'aspect-square max-w-[440px]'
                                  : 'aspect-video'
                          }`}
                        >
                          <VideoThumbnail
                            thumbnailUrl={bestOne.thumbnail}
                            previewVideo={bestOne.previewVideo}
                            title={bestTitle}
                            folderName={folderName}
                            aspectRatio={bestOne.aspectRatio}
                            isHovering={hoveredBestId === bestOne.id}
                          />
                        </button>
                      </div>

                      <div className={isPortraitLead ? 'lg:col-span-7' : 'lg:col-span-5'}>
                        {/* Clean non-overlapping Best One eyebrow */}
                        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--accent)] mb-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                          <span>{t.featuredBadge}</span>
                        </div>

                        <h4 className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.015em] text-[var(--text-primary)] leading-snug mb-3">
                          <Link
                            href={`/${locale}/work/${bestOne.slug}`}
                            className="hover:text-[var(--accent)] transition-colors"
                          >
                            {bestTitle}
                          </Link>
                        </h4>

                        {bestSummary && (
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 line-clamp-3">
                            {bestSummary}
                          </p>
                        )}

                        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-t border-b border-[var(--border-subtle)] text-xs mb-6">
                          <div>
                            <dt className="text-[var(--text-muted)] mb-0.5">
                              {locale === 'fr' ? 'Rôle' : 'Role'}
                            </dt>
                            <dd className="text-[var(--text-primary)] font-medium truncate">
                              {bestOne.role[locale] || bestOne.role.en}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[var(--text-muted)] mb-0.5">Format</dt>
                            <dd className="text-[var(--text-primary)] font-medium">
                              {bestOne.aspectRatio || '16:9'}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[var(--text-muted)] mb-0.5">
                              {locale === 'fr' ? 'Année' : 'Year'}
                            </dt>
                            <dd className="text-[var(--text-primary)] font-medium tabular-nums">
                              {bestOne.year}
                            </dd>
                          </div>
                        </dl>

                        <div className="flex flex-wrap items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setActiveTheaterProject(bestOne)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover-bg)] text-xs font-medium transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{locale === 'fr' ? 'Lire la vidéo' : 'Watch Film'}</span>
                          </button>

                          <Link
                            href={`/${locale}/work/${bestOne.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline decoration-[var(--border-strong)] underline-offset-4 transition-colors"
                          >
                            <span>{t.viewProject}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Remaining folder videos displayed cleanly below Best One */}
                    {remaining.length > 0 && (
                      <div className="mt-10">
                        {renderSeparatedAspectGrid(remaining, folderName)}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}

            {/* Any orphan/general published videos */}
            {selectedFolderFilter === 'all' && unfolderedProjects.length > 0 && (
              <div className="py-12 last:pb-0">
                <h3 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-8">
                  {locale === 'fr' ? 'Autres réalisations' : 'Other Cuts'}
                </h3>
                {renderSeparatedAspectGrid(unfolderedProjects)}
              </div>
            )}
          </div>
        ) : (
          /* ============================================== */
          /* ALL CUTS GRID                                  */
          /* ============================================== */
          <div>{renderSeparatedAspectGrid(filteredAllProjects)}</div>
        )}
      </div>

      {/* Controlled In-Site Theater Player Modal */}
      {activeTheaterProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={activeTheaterProject.title[locale] || activeTheaterProject.title.en}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveTheaterProject(null);
          }}
        >
          <div className="w-full max-w-4xl flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4 text-[#F3F2EF]">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#A1A0AA]">
                  {activeTheaterProject.client} · {activeTheaterProject.year}
                </p>
                <h3 className="font-display text-base sm:text-lg font-medium truncate">
                  {activeTheaterProject.title[locale] || activeTheaterProject.title.en}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/${locale}/work/${activeTheaterProject.slug}`}
                  onClick={() => setActiveTheaterProject(null)}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded border border-white/20 text-xs text-[#F3F2EF] hover:bg-white/10 transition-colors"
                >
                  <span>{t.viewProject}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveTheaterProject(null)}
                  aria-label="Close player"
                  className="p-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <VideoPlayer
              provider={activeTheaterProject.videoProvider}
              url={activeTheaterProject.videoUrl}
              poster={activeTheaterProject.thumbnail}
              aspectRatio={activeTheaterProject.aspectRatio}
              title={activeTheaterProject.title[locale] || activeTheaterProject.title.en}
              r2Key={activeTheaterProject.r2Key}
              bunnyLibraryId={activeTheaterProject.bunnyLibraryId}
              bunnyVideoId={activeTheaterProject.bunnyVideoId}
            />
          </div>
        </div>
      )}
    </section>
  );
}
