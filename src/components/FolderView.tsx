'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Locale, Folder, Project } from '@/types/portfolio';
import { VideoPlayer } from './VideoPlayer';
import { ProjectCard } from './ProjectCard';
import { ArrowLeft, ArrowUpRight, Play } from 'lucide-react';

interface FolderViewProps {
  locale: Locale;
  folder: Folder;
  projects: Project[];
  bestOne: Project;
}

export function FolderView({
  locale,
  folder,
  projects,
  bestOne,
}: FolderViewProps) {
  const [activeVideo, setActiveVideo] = useState<Project>(bestOne);

  const folderName = folder.name[locale] || folder.name.en;
  const folderDesc = folder.description?.[locale] || folder.description?.en;
  const remainingVideos = projects.filter((p) => p.id !== bestOne.id);
  const activeTitle = activeVideo.title[locale] || activeVideo.title.en;
  const activeDesc = activeVideo.shortDescription?.[locale] || activeVideo.shortDescription?.en;

  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Top Back Navigation */}
        <div className="mb-8">
          <Link
            href={`/${locale}#work`}
            className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Retour aux projets' : 'Back to Selected Work'}</span>
          </Link>
        </div>

        {/* Folder Editorial Header */}
        <header className="pb-10 border-b border-[var(--border-subtle)] mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] mb-2">
              {locale === 'fr' ? 'Dossier Client' : 'Client Folder'}
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
              {folderName}
            </h1>
            {folderDesc && (
              <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-3 max-w-2xl">
                {folderDesc}
              </p>
            )}
          </div>

          <div className="text-xs text-[var(--text-muted)] tabular-nums shrink-0">
            {projects.length}{' '}
            {locale === 'fr'
              ? projects.length > 1
                ? 'vidéos publiées'
                : 'vidéo publiée'
              : projects.length > 1
                ? 'published films'
                : 'published film'}
          </div>
        </header>

        {/* Active Theater / Best One Stage */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-5 sm:p-8">
            <div className="lg:col-span-7 flex justify-center bg-[#09090B] rounded-md p-3 sm:p-5 border border-[var(--border-subtle)]">
              <VideoPlayer
                key={activeVideo.id}
                provider={activeVideo.videoProvider}
                url={activeVideo.videoUrl}
                poster={activeVideo.thumbnail}
                aspectRatio={activeVideo.aspectRatio}
                title={activeTitle}
                bunnyLibraryId={activeVideo.bunnyLibraryId}
                bunnyVideoId={activeVideo.bunnyVideoId}
              />
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Best One badge strictly separate above title */}
                {activeVideo.id === bestOne.id && (
                  <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--accent)] mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    <span>Best One</span>
                  </div>
                )}

                <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] leading-snug mb-3">
                  {activeTitle}
                </h2>

                {activeDesc && (
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                    {activeDesc}
                  </p>
                )}

                <dl className="divide-y divide-[var(--border-subtle)] border-t border-b border-[var(--border-subtle)] text-xs mb-6">
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="text-[var(--text-muted)]">
                      {locale === 'fr' ? 'Client' : 'Client'}
                    </dt>
                    <dd className="text-[var(--text-primary)] font-medium text-right">
                      {activeVideo.client || folderName}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="text-[var(--text-muted)]">
                      {locale === 'fr' ? 'Rôle' : 'Role'}
                    </dt>
                    <dd className="text-[var(--text-primary)] font-medium text-right">
                      {activeVideo.role[locale] || activeVideo.role.en}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="text-[var(--text-muted)]">Format</dt>
                    <dd className="text-[var(--text-primary)] font-medium text-right">
                      {activeVideo.format || activeVideo.aspectRatio}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="text-[var(--text-muted)]">
                      {locale === 'fr' ? 'Année' : 'Year'}
                    </dt>
                    <dd className="text-[var(--text-primary)] font-medium tabular-nums">
                      {activeVideo.year}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-wrap items-center gap-4">
                  {activeVideo.id !== bestOne.id && (
                    <button
                      type="button"
                      onClick={() => setActiveVideo(bestOne)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{locale === 'fr' ? 'Revenir à Best One' : 'Back to Best One'}</span>
                    </button>
                  )}

                  <Link
                    href={`/${locale}/work/${activeVideo.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-[var(--border-strong)] text-xs font-medium text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors"
                  >
                    <span>
                      {locale === 'fr' ? 'Ouvrir la fiche complète' : 'Open Full Case Study'}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Remaining Folder Videos Strictly Below Best One */}
        {remainingVideos.length > 0 && (
          <section className="pt-10 border-t border-[var(--border-subtle)]">
            <div className="flex items-baseline justify-between mb-8">
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">
                {locale === 'fr' ? 'Autres vidéos du dossier' : 'More in this folder'}
              </h3>
              <span className="text-xs text-[var(--text-muted)] tabular-nums">
                {remainingVideos.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {remainingVideos.map((proj) => (
                <div
                  key={proj.id}
                  className={
                    activeVideo.id === proj.id
                      ? 'ring-1 ring-[var(--accent)] rounded-lg p-2 -m-2 transition-all'
                      : ''
                  }
                >
                  <ProjectCard
                    project={proj}
                    locale={locale}
                    folderName={folderName}
                    onQuickWatch={(selected) => {
                      setActiveVideo(selected);
                      window.scrollTo({ top: 140, behavior: 'smooth' });
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
