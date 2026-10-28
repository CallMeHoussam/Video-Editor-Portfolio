'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, SiteSettings } from '@/types/portfolio';
import { translations } from '@/lib/translations';
import { VideoPlayer } from './VideoPlayer';
import { ArrowDownRight, MapPin, Film, CheckCircle2, MessageSquare } from 'lucide-react';

interface CinematicHeroProps {
  locale: Locale;
  settings: SiteSettings;
}

export function CinematicHero({ locale, settings }: CinematicHeroProps) {
  const t = translations[locale].hero;

  const specialties = [
    { en: 'Short-Form Retention (9:16)', fr: 'Rétention Formats Courts (9:16)' },
    { en: 'Commercial Brand Spots', fr: 'Spots Publicitaires & Marques' },
    { en: 'Kinetic Typography & Motion', fr: 'Typographie Cinétique & Motion' },
    { en: 'Multi-Track Sound Design', fr: 'Sound Design Multi-Pistes' },
    { en: 'Color Grading & Pacing', fr: 'Étalonnage & Rythme' },
  ];

  // Showreel visibility: Only render if enabled (or not explicitly disabled) AND a videoUrl exists
  const isShowreelVisible = settings.showreel?.enabled !== false && Boolean(settings.showreel?.videoUrl?.trim());

  // Dynamic hero texts customizable via admin settings
  const headline = settings.heroHeadline?.[locale] || (
    locale === 'en' ? 'I TURN IDEAS INTO VISUAL EXPERIENCES.' : 'JE TRANSFORME LES IDÉES EN EXPÉRIENCES VISUELLES.'
  );

  const subheadline = settings.heroSubheadline?.[locale] || t.subheadline;
  const availableBadge = settings.availableBadge?.[locale] || t.availableBadge;

  const whatsappMessage = settings.whatsappStarterMessage?.[locale] || (
    locale === 'fr'
      ? "Bonjour Houssam, j'aimerais échanger avec vous au sujet d'un projet de montage vidéo."
      : "Hi Houssam, I'd like to discuss a video editing project."
  );

  return (
    <section className="relative min-h-[85vh] pt-28 pb-16 md:pt-36 md:pb-24 flex flex-col justify-center overflow-hidden">
      {/* Subtle controlled ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/8 dark:bg-purple-600/12 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Badges: Availability Status & Location */}
        <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8 text-xs font-medium">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>{availableBadge}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
            <span>{settings.location || t.locationBadge}</span>
          </div>
        </div>

        {/* Hero Editorial Typography */}
        <div className="max-w-4xl">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-[var(--text-primary)] mb-6 uppercase">
            {headline}
          </h1>

          <p className="text-base sm:text-xl font-light text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-10">
            {subheadline}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-12 sm:mb-16">
            {/* 1. Explore My Work (Refined Glass Button) */}
            <a
              id="explore-work-btn"
              href="#work"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--bg-surface-glass)] hover:bg-[var(--bg-surface-elevated)] backdrop-blur-md border border-[var(--border-subtle)] hover:border-purple-500/50 text-[var(--text-primary)] hover:text-purple-400 font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <span>{t.exploreWork}</span>
              <ArrowDownRight className="w-4 h-4" />
            </a>

            {/* 2. Direct WhatsApp Button (Evoless Purple Palette) */}
            <a
              id="whatsapp-hero-btn"
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{locale === 'en' ? 'Chat on WhatsApp' : 'Discuter sur WhatsApp'}</span>
            </a>
          </div>
        </div>

        {/* Showreel Section: Rendered ONLY when enabled and configured. Completely omitted otherwise */}
        {isShowreelVisible && (
          <div className="relative rounded-2xl md:rounded-3xl p-1 bg-gradient-to-b from-purple-500/30 via-purple-500/10 to-transparent shadow-2xl mb-12">
            <div className="bg-[var(--bg-surface)] rounded-[14px] md:rounded-[22px] overflow-hidden border border-[var(--border-subtle)]">
              {/* Showreel Top Bar */}
              <div className="px-4 py-3 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold tracking-wide uppercase text-[11px] text-[var(--text-primary)]">
                    {settings.showreel.title[locale] || settings.showreel.title.en}
                  </span>
                </div>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-mono text-[10px]">
                  {t.showreelBadge}
                </span>
              </div>

              {/* Video Player */}
              <div className="p-2 md:p-3 bg-black/40">
                <VideoPlayer
                  provider={settings.showreel.provider}
                  url={settings.showreel.videoUrl}
                  poster={settings.showreel.poster}
                  aspectRatio="16:9"
                  title={settings.showreel.title[locale] || settings.showreel.title.en}
                  autoPlayMuted={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Editorial Specialties Ticker Bar */}
        <div className="pt-8 border-t border-[var(--border-subtle)] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {specialties.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>{item[locale]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
