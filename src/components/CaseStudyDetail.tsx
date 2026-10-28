'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, Project, Category, SiteSettings } from '@/types/portfolio';
import { translations } from '@/lib/translations';
import { VideoPlayer } from './VideoPlayer';
import {
  ArrowLeft,
  Calendar,
  User,
  Film,
  Layers,
  Sparkles,
  CheckCircle2,
  Volume2,
  Scissors,
  Eye,
  Sliders,
  Award,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Tag,
  MessageSquare
} from 'lucide-react';

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
  settings,
  isPreview = false
}: CaseStudyDetailProps) {
  const t = translations[locale].caseStudy;
  const isVertical = project.aspectRatio === '9:16';

  const categoryNames = project.categories.map(
    catId => categories.find(c => c.id === catId)?.name[locale] || catId
  );

  return (
    <div className="pt-28 pb-20 md:pt-36 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Draft Preview Notification Banner */}
        {isPreview && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                Draft Preview
              </span>
              <p className="text-xs sm:text-sm font-medium">
                {locale === 'en'
                  ? 'This case study is in draft mode. It is hidden from public listings.'
                  : 'Cette étude de cas est en mode brouillon. Elle est masquée des visiteurs.'}
              </p>
            </div>
            <Link
              href="/studio"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
            >
              {locale === 'en' ? 'Back to Studio CMS' : 'Retour au Studio CMS'}
            </Link>
          </div>
        )}

        {/* Back Link */}
        <div className="mb-8">
          <Link
            href={`/${locale}#work`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToWork}</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {categoryNames.map((catName, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20"
              >
                {catName}
              </span>
            ))}
            <span className="text-xs font-mono text-[var(--text-muted)] ml-2">
              {project.year} • {project.client}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-[1.1] mb-6">
            {project.title[locale]}
          </h1>

          <p className="text-base sm:text-xl text-[var(--text-secondary)] leading-relaxed font-light">
            {project.shortDescription[locale]}
          </p>
        </div>

        {/* Large Cinematic Video Player Area (Preserves Native Aspect Ratio!) */}
        <div className="mb-16 md:mb-24">
          <div className="p-2 sm:p-4 rounded-3xl bg-gradient-to-b from-purple-500/20 to-transparent border border-purple-500/30 shadow-2xl">
            <div className={`overflow-hidden rounded-2xl ${isVertical ? 'max-w-[420px] mx-auto' : 'w-full'}`}>
              <VideoPlayer
                provider={project.videoProvider}
                url={project.videoUrl}
                poster={project.thumbnail}
                aspectRatio={project.aspectRatio}
                title={project.title[locale]}
                bunnyLibraryId={project.bunnyLibraryId}
                bunnyVideoId={project.bunnyVideoId}
                autoPlayMuted={false}
              />
            </div>
          </div>
        </div>

        {/* Project Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] mb-16 shadow-sm">
          <div>
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)] block mb-1">
              {t.client}
            </span>
            <span className="text-sm font-bold text-[var(--text-primary)]">
              {project.client}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)] block mb-1">
              {t.year}
            </span>
            <span className="text-sm font-bold text-[var(--text-primary)]">
              {project.year}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)] block mb-1">
              {t.role}
            </span>
            <span className="text-sm font-bold text-[var(--text-primary)]">
              {project.role[locale]}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)] block mb-1">
              {t.format}
            </span>
            <span className="text-sm font-bold text-purple-400 font-mono">
              {project.format}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-2">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)] block mb-1">
              {t.software}
            </span>
            <div className="flex flex-wrap gap-1">
              {project.software.map((sw, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-mono"
                >
                  {sw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Two-Column Deep Case Study Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Main Column: The Brief, Creative Approach, Breakdowns */}
          <div className="lg:col-span-8 space-y-14">
            {/* The Brief (Only when provided) */}
            {project.brief?.[locale] && (
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-purple-400 uppercase mb-3">
                  <Film className="w-4 h-4" />
                  <span>{t.theBrief}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4">
                  {locale === 'en' ? 'Challenge & Objectives' : 'Objectifs & Défi Créatif'}
                </h2>
                <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] leading-relaxed text-sm sm:text-base text-[var(--text-secondary)]">
                  {project.brief[locale]}
                </div>
              </div>
            )}

            {/* Creative Approach (Only when provided) */}
            {project.creativeApproach && Object.values(project.creativeApproach).some(v => Boolean(v && typeof v === 'object' && (v as any)[locale])) && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-purple-400 uppercase mb-3">
                <Scissors className="w-4 h-4" />
                <span>{t.creativeApproach}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6">
                {locale === 'en' ? 'Editorial Decisions & Rhythm' : 'Choix de Montage & Cadence'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.creativeApproach.hookStrategy && (
                  <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">
                      {t.hookStrategy}
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {project.creativeApproach.hookStrategy[locale]}
                    </p>
                  </div>
                )}

                {project.creativeApproach.rhythm && (
                  <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">
                      {t.rhythm}
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {project.creativeApproach.rhythm[locale]}
                    </p>
                  </div>
                )}

                {project.creativeApproach.soundDesign && (
                  <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">
                      {t.soundDesign}
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {project.creativeApproach.soundDesign[locale]}
                    </p>
                  </div>
                )}

                {project.creativeApproach.captionStrategy && (
                  <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">
                      {t.captionStrategy}
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {project.creativeApproach.captionStrategy[locale]}
                    </p>
                  </div>
                )}

                {project.creativeApproach.motionGraphics && (
                  <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">
                      {t.motionGraphics}
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {project.creativeApproach.motionGraphics[locale]}
                    </p>
                  </div>
                )}

                {project.creativeApproach.colorTreatment && (
                  <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">
                      {t.colorTreatment}
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {project.creativeApproach.colorTreatment[locale]}
                    </p>
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Editing Breakdowns */}
            {project.breakdowns && project.breakdowns.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-purple-400 uppercase mb-3">
                  <Layers className="w-4 h-4" />
                  <span>{t.editingBreakdown}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6">
                  {locale === 'en' ? 'Technical Dissections' : 'Dissections Techniques'}
                </h2>

                <div className="space-y-4">
                  {project.breakdowns.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
                    >
                      <h4 className="font-display font-bold text-base text-[var(--text-primary)] mb-2">
                        {item.title[locale]}
                      </h4>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {item.content[locale]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Sidebar: Results, Editor's Notes, Tags */}
          <div className="lg:col-span-4 space-y-8">
            {/* Verified Results Card (Only when metrics or description exist) */}
            {Boolean(project.results?.metrics?.length || project.results?.description?.[locale]) && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 via-[var(--bg-surface)] to-[var(--bg-surface)] border border-purple-500/40 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300 mb-4">
                  <Award className="w-4 h-4" />
                  <span>{t.results}</span>
                </div>

                {project.results?.metrics && project.results.metrics.length > 0 && (
                  <div className="space-y-4 mb-4">
                    {project.results.metrics.map((metric, idx) => (
                      <div key={idx} className="pb-3 border-b border-purple-500/20 last:border-0 last:pb-0">
                        <span className="font-display text-3xl font-black text-white block">
                          {metric.value}
                        </span>
                        <span className="text-xs text-purple-300">
                          {metric.label[locale]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {project.results?.description?.[locale] && (
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-2">
                    {project.results.description[locale]}
                  </p>
                )}
              </div>
            )}

            {/* Editor's Notes Card (Only when notes provided) */}
            {Boolean(project.editorsNotes?.note?.[locale] || project.editorsNotes?.detailThatMatters?.[locale]) && (
              <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
                {project.editorsNotes?.note?.[locale] && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
                    <Scissors className="w-4 h-4" />
                    <span>{t.editorsNotes}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed italic">
                    "{project.editorsNotes.note[locale]}"
                  </p>
                </div>
                )}

                {project.editorsNotes?.detailThatMatters?.[locale] && (
                  <div className="pt-4 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                      <Lightbulb className="w-4 h-4" />
                      <span>{t.theDetailThatMatters}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {project.editorsNotes.detailThatMatters[locale]}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tags Box */}
            <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-3">
                {t.tags}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Project Call to Action Banner (Direct WhatsApp) */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-900/40 via-[var(--bg-surface)] to-[var(--bg-surface)] border border-purple-500/40 shadow-2xl mb-24 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{locale === 'en' ? 'Direct WhatsApp Reach' : 'Contact Direct WhatsApp'}</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-2">
              {locale === 'en' ? 'Need an edit like this? Let\'s talk on WhatsApp.' : 'Besoin d\'un montage similaire ? Échangeons sur WhatsApp.'}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {locale === 'en'
                ? 'Send your brief, footage references, or question directly. Available worldwide with fast turnarounds.'
                : 'Envoyez votre brief, vos rushs ou votre question directement. Disponible à distance avec des délais rapides.'}
            </p>
          </div>

          <a
            href={`https://wa.me/${settings?.whatsappNumber || '212774288879'}?text=${encodeURIComponent(
              locale === 'fr'
                ? (settings?.whatsappStarterMessage?.fr
                    ? `${settings.whatsappStarterMessage.fr} (Projet : "${project.title.fr}")`
                    : `Bonjour Houssam, j'ai vu votre projet "${project.title.fr}" sur Evoless et j'aimerais échanger sur un projet de montage vidéo.`)
                : (settings?.whatsappStarterMessage?.en
                    ? `${settings.whatsappStarterMessage.en} (Referencing project: "${project.title.en}")`
                    : `Hi Houssam, I saw your project "${project.title.en}" on Evoless and I'd like to discuss a video editing project.`)
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-xl shadow-emerald-600/30 hover:scale-105 transition-all duration-200"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{locale === 'en' ? `Chat on WhatsApp (${settings?.phone || '+212 774-288879'})` : `Discuter sur WhatsApp (${settings?.phone || '+212 774-288879'})`}</span>
          </a>
        </div>

        {/* More Like This (Deterministic Recommendations) */}
        {relatedProjects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                {t.moreLikeThis}
              </h3>
              <Link
                href={`/${locale}#work`}
                className="text-xs font-semibold text-purple-400 hover:underline"
              >
                {locale === 'en' ? 'View all work' : 'Voir tous les projets'}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/${locale}/work/${rel.slug}`}
                  className="group flex flex-col rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-purple-500/40 overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="aspect-video w-full bg-[#15121C] overflow-hidden relative">
                    {rel.thumbnail && (
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${rel.thumbnail})` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white">
                      {rel.year}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <h4 className="font-display font-bold text-sm text-[var(--text-primary)] group-hover:text-purple-400 transition-colors mb-1 line-clamp-1">
                      {rel.title[locale]}
                    </h4>
                    <span className="text-xs text-[var(--text-muted)]">
                      {rel.client}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
