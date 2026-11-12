'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, Project, Category, SiteSettings } from '@/types/portfolio';
import { translations } from '@/lib/translations';
import { VideoPlayer } from './VideoPlayer';
import { ProjectCard } from './ProjectCard';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

interface CaseStudyDetailProps {
  locale: Locale;
  project: Project;
  categories: Category[];
  relatedProjects: Project[];
  settings?: SiteSettings;
  isPreview?: boolean;
}

export function CaseStudyDetail({
  locale,
  project,
  categories,
  relatedProjects,
  isPreview = false,
}: CaseStudyDetailProps) {
  const t = translations[locale].caseStudy;

  const title = project.title[locale] || project.title.en;
  const shortDesc = project.shortDescription?.[locale] || project.shortDescription?.en;
  const brief = project.brief?.[locale] || project.brief?.en;
  const role = project.role?.[locale] || project.role?.en;

  const categoryLabels = (project.categories || [])
    .map((catId) => categories.find((c) => c.id === catId)?.name[locale] || catId)
    .filter(Boolean);

  const approachItems = [
    { label: t.rhythm, value: project.creativeApproach?.rhythm?.[locale] },
    { label: t.hookStrategy, value: project.creativeApproach?.hookStrategy?.[locale] },
    { label: t.visualHierarchy, value: project.creativeApproach?.visualHierarchy?.[locale] },
    { label: t.captionStrategy, value: project.creativeApproach?.captionStrategy?.[locale] },
    { label: t.soundDesign, value: project.creativeApproach?.soundDesign?.[locale] },
    { label: t.motionGraphics, value: project.creativeApproach?.motionGraphics?.[locale] },
    { label: t.colorTreatment, value: project.creativeApproach?.colorTreatment?.[locale] },
  ].filter((item) => Boolean(item.value && item.value.trim()));

  const hasNotes = Boolean(
    project.editorsNotes?.note?.[locale]?.trim() ||
      project.editorsNotes?.detailThatMatters?.[locale]?.trim()
  );

  const hasResults = Boolean(
    (project.results?.metrics && project.results.metrics.length > 0) ||
      project.results?.description?.[locale]?.trim()
  );

  return (
    <article className="pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Draft Notice */}
        {isPreview && (
          <div className="mb-8 px-4 py-3 rounded-md border border-amber-500/40 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-300">
            <span>
              <strong>Draft Preview</strong> —{' '}
              {locale === 'fr'
                ? 'Cette vidéo est masquée du portfolio public.'
                : 'This film is currently unpublished.'}
            </span>
            <Link
              href="/studio"
              className="underline underline-offset-4 font-medium hover:text-amber-200 shrink-0"
            >
              {locale === 'fr' ? 'Retour au Studio' : 'Back to Studio'}
            </Link>
          </div>
        )}

        {/* Navigation Back */}
        <div className="mb-10">
          <Link
            href={`/${locale}#work`}
            className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.backToWork}</span>
          </Link>
        </div>

        {/* Title & Editorial Intro */}
        <header className="max-w-3xl mb-12">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)] mb-4">
            {project.featured && (
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-medium text-[var(--accent)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                Best One
              </span>
            )}
            {categoryLabels.length > 0 && <span>{categoryLabels.join(' · ')}</span>}
            <span>·</span>
            <span className="tabular-nums">{project.year}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.025em] leading-[1.08] text-[var(--text-primary)] mb-5">
            {title}
          </h1>

          {shortDesc && (
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {shortDesc}
            </p>
          )}
        </header>

        {/* Main Video Stage */}
        <section className="mb-14 bg-[#070709] border border-[var(--border-subtle)] rounded-lg p-3 sm:p-6 flex justify-center">
          <VideoPlayer
            provider={project.videoProvider}
            url={project.videoUrl}
            poster={project.thumbnail}
            aspectRatio={project.aspectRatio}
            title={title}
            r2Key={project.r2Key}
            bunnyLibraryId={project.bunnyLibraryId}
            bunnyVideoId={project.bunnyVideoId}
          />
        </section>

        {/* Clean Typographic Metadata Ledger */}
        <section className="border-t border-b border-[var(--border-subtle)] py-6 mb-16">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            <div>
              <dt className="text-[var(--text-muted)] uppercase tracking-wider mb-1">{t.client}</dt>
              <dd className="text-[var(--text-primary)] font-medium">{project.client || '—'}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)] uppercase tracking-wider mb-1">{t.role}</dt>
              <dd className="text-[var(--text-primary)] font-medium">{role || '—'}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)] uppercase tracking-wider mb-1">{t.format}</dt>
              <dd className="text-[var(--text-primary)] font-medium">
                {project.format || project.aspectRatio}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)] uppercase tracking-wider mb-1">{t.software}</dt>
              <dd className="text-[var(--text-primary)] font-medium">
                {project.software?.length ? project.software.join(', ') : '—'}
              </dd>
            </div>
          </dl>
        </section>

        {/* Optional Written Breakdown Sections */}
        {(brief || approachItems.length > 0 || (project.breakdowns && project.breakdowns.length > 0) || hasNotes || hasResults) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[var(--border-subtle)]">
            <div className="lg:col-span-7 flex flex-col gap-12">
              {brief && (
                <div>
                  <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
                    {t.theBrief}
                  </h2>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                    {brief}
                  </p>
                </div>
              )}

              {approachItems.length > 0 && (
                <div>
                  <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-5">
                    {t.creativeApproach}
                  </h2>
                  <div className="divide-y divide-[var(--border-subtle)] border-t border-b border-[var(--border-subtle)]">
                    {approachItems.map((item, idx) => (
                      <div key={idx} className="py-4">
                        <h3 className="text-xs uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5">
                          {item.label}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.breakdowns && project.breakdowns.length > 0 && (
                <div>
                  <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-5">
                    {t.editingBreakdown}
                  </h2>
                  <div className="flex flex-col gap-5">
                    {project.breakdowns.map((block) => (
                      <div
                        key={block.id}
                        className="border-l-2 border-[var(--border-strong)] pl-4 py-1"
                      >
                        <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">
                          {block.title[locale] || block.title.en}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {block.content[locale] || block.content.en}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(hasNotes || hasResults) && (
              <aside className="lg:col-span-5 flex flex-col gap-8">
                {hasNotes && (
                  <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6">
                    <h2 className="font-display text-base font-semibold text-[var(--text-primary)] mb-4">
                      {t.editorsNotes}
                    </h2>
                    {project.editorsNotes?.note?.[locale] && (
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                        {project.editorsNotes.note[locale]}
                      </p>
                    )}
                    {project.editorsNotes?.detailThatMatters?.[locale] && (
                      <div className="pt-4 border-t border-[var(--border-subtle)]">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--accent)] mb-1.5">
                          {t.theDetailThatMatters}
                        </p>
                        <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                          {project.editorsNotes.detailThatMatters[locale]}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {hasResults && (
                  <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6">
                    <h2 className="font-display text-base font-semibold text-[var(--text-primary)] mb-4">
                      {t.results}
                    </h2>
                    {project.results?.metrics && project.results.metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {project.results.metrics.map((metric, i) => (
                          <div key={i}>
                            <div className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                              {metric.value}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">
                              {metric.label[locale] || metric.label.en}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {project.results?.description?.[locale] && (
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {project.results.description[locale]}
                      </p>
                    )}
                  </div>
                )}
              </aside>
            )}
          </div>
        )}

        {/* Minimal Project CTA */}
        <section className="py-12 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-1">
              {t.projectCtaTitle}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl">
              {t.projectCtaSubtitle}
            </p>
          </div>
          <Link
            href={`/${locale}#contact`}
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-md bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover-bg)] text-xs font-medium transition-colors shrink-0 self-start sm:self-center"
          >
            <span>{t.projectCtaButton}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </section>

        {/* Related Films */}
        {relatedProjects.length > 0 && (
          <section className="pt-14">
            <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-8">
              {t.moreLikeThis}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {relatedProjects.map((rel) => (
                <ProjectCard key={rel.id} project={rel} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
