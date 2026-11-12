'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, Project, SiteSettings } from '@/types/portfolio';
import { translations } from '@/lib/translations';
import { VideoPlayer } from './VideoPlayer';
import { VideoThumbnail } from './VideoThumbnail';
import { Play, X, ArrowUpRight } from 'lucide-react';

interface CinematicHeroProps {
  locale: Locale;
  settings: SiteSettings;
  featuredProjects?: Project[];
}

export function CinematicHero({ locale, settings, featuredProjects = [] }: CinematicHeroProps) {
  const t = translations[locale].hero;
  const [activeIndex, setActiveIndex] = useState(0);
  const [theaterOpen, setTheaterOpen] = useState(false);

  const hasCustomShowreel = Boolean(
    settings.showreel?.enabled &&
      settings.showreel?.videoUrl &&
      settings.showreel?.provider !== 'placeholder'
  );

  // Build showcase items from real published projects (never invented data)
  const showcaseProjects = [
    ...featuredProjects.filter((p) => p.featured),
    ...featuredProjects.filter((p) => !p.featured),
  ].slice(0, 3);

  const activeProject = showcaseProjects[activeIndex] || showcaseProjects[0] || null;
  const headline = settings.heroHeadline?.[locale]?.trim() || t.headline;
  const subheadline = settings.heroSubheadline?.[locale]?.trim() || t.subheadline;
  const availabilityText = settings.availableBadge?.[locale]?.trim() || '';

  return (
    <section
      id="top"
      className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Editorial Identity */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-[0.14em] uppercase text-[var(--text-muted)] mb-6">
              <span>{settings.editorName}</span>
              <span>·</span>
              <span>{settings.location}</span>
              {availabilityText && (
                <>
                  <span>·</span>
                  <span className="text-[var(--accent)] font-medium">{availabilityText}</span>
                </>
              )}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold tracking-[-0.03em] leading-[1.06] text-[var(--text-primary)] mb-6">
              {headline}
            </h1>

            <p className="text-base sm:text-[17px] text-[var(--text-secondary)] leading-relaxed max-w-md mb-9">
              {subheadline}
            </p>

            {/* Minimal, restrained CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/${locale}#work`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover-bg)] text-sm font-medium transition-colors"
              >
                {t.exploreWork}
              </Link>

              {hasCustomShowreel ? (
                <button
                  type="button"
                  onClick={() => setTheaterOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-[var(--border-strong)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{t.watchShowreel}</span>
                </button>
              ) : (
                <Link
                  href={`/${locale}#contact`}
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors underline decoration-[var(--border-strong)] underline-offset-4 hover:decoration-[var(--accent)]"
                >
                  <span>{t.talkCta}</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Composed Film Preview Frame */}
          <div className="lg:col-span-7">
            {activeProject ? (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-stretch bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 sm:p-5">
                {/* Main Preview Frame honoring true project aspect ratio */}
                <div className="sm:col-span-7 flex items-center justify-center bg-[#09090B] rounded-md overflow-hidden border border-[var(--border-subtle)]">
                  <Link
                    href={`/${locale}/work/${activeProject.slug}`}
                    className={`group relative block w-full overflow-hidden ${
                      activeProject.aspectRatio === '9:16'
                        ? 'aspect-[9/16] max-h-[430px] max-w-[242px] mx-auto'
                        : activeProject.aspectRatio === '4:5'
                          ? 'aspect-[4/5] max-h-[420px] max-w-[336px] mx-auto'
                          : 'aspect-video'
                    }`}
                  >
                    <VideoThumbnail
                      thumbnailUrl={activeProject.thumbnail}
                      previewVideo={activeProject.previewVideo}
                      title={activeProject.title[locale] || activeProject.title.en}
                      aspectRatio={activeProject.aspectRatio}
                    />
                  </Link>
                </div>

                {/* Curated Cut Switcher */}
                <div className="sm:col-span-5 flex flex-col justify-between gap-4 py-1">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] mb-3">
                      {locale === 'fr' ? 'Aperçu des réalisations' : 'Selected Cuts'}
                    </p>

                    <div className="divide-y divide-[var(--border-subtle)] border-t border-b border-[var(--border-subtle)]">
                      {showcaseProjects.map((project, idx) => {
                        const isSelected = idx === activeIndex;
                        const projTitle = project.title[locale] || project.title.en;
                        return (
                          <button
                            key={project.id}
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            className={`w-full text-left py-3 px-2 transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                              isSelected
                                ? 'text-[var(--text-primary)] bg-[var(--bg-surface-elevated)]'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            <div className="min-w-0">
                              <span className="block text-[11px] font-mono tabular-nums text-[var(--text-muted)] mb-0.5">
                                0{idx + 1} · {project.aspectRatio}
                              </span>
                              <span className="block text-sm font-medium leading-snug line-clamp-2">
                                {projTitle}
                              </span>
                            </div>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-[var(--text-muted)] truncate pr-2">
                      {activeProject.client}
                    </span>
                    <Link
                      href={`/${locale}/work/${activeProject.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-primary)] hover:text-[var(--accent)] shrink-0 transition-colors"
                    >
                      <span>{locale === 'fr' ? 'Regarder' : 'Watch'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* Fallback Showreel Frame when no projects are published yet */
              <div className="rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <VideoPlayer
                  provider={settings.showreel?.provider || 'placeholder'}
                  url={settings.showreel?.videoUrl || ''}
                  poster={settings.showreel?.poster}
                  bunnyLibraryId={settings.showreel?.bunnyLibraryId}
                  bunnyVideoId={settings.showreel?.bunnyVideoId}
                  aspectRatio="16:9"
                  title={settings.showreel?.title?.[locale] || t.showreelTitle}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inline Distraction-Free Showreel Theater Modal */}
      {theaterOpen && hasCustomShowreel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={t.showreelTitle}
        >
          <div className="w-full max-w-5xl">
            <div className="flex items-center justify-between mb-3 text-[#F3F2EF]">
              <span className="text-xs uppercase tracking-[0.14em] text-[#A1A0AA]">
                {settings.showreel?.title?.[locale] || t.showreelTitle}
              </span>
              <button
                type="button"
                onClick={() => setTheaterOpen(false)}
                aria-label="Close showreel"
                className="p-2 rounded-full border border-white/15 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <VideoPlayer
              provider={settings.showreel.provider}
              url={settings.showreel.videoUrl}
              poster={settings.showreel.poster}
              bunnyLibraryId={settings.showreel.bunnyLibraryId}
              bunnyVideoId={settings.showreel.bunnyVideoId}
              aspectRatio="16:9"
              title={settings.showreel?.title?.[locale] || t.showreelTitle}
            />
          </div>
        </div>
      )}
    </section>
  );
}
