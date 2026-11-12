'use client';

import React from 'react';
import { Locale, SiteSettings } from '@/types/portfolio';
import { translations } from '@/lib/translations';
import { Reveal } from './Reveal';
import { ArrowUpRight } from 'lucide-react';

interface ContactSectionProps {
  locale: Locale;
  settings: SiteSettings;
}

export function ContactSection({ locale, settings }: ContactSectionProps) {
  const t = translations[locale].contact;

  const whatsappStarter =
    settings.whatsappStarterMessage?.[locale] ||
    (locale === 'fr'
      ? "Bonjour Houssam, j'aimerais échanger avec vous au sujet d'un projet de montage vidéo."
      : "Hi Houssam, I'd like to discuss a video editing project.");

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    whatsappStarter
  )}`;

  return (
    <section id="contact" className="section-rule py-20 sm:py-28 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Editorial Call to Action */}
            <div className="lg:col-span-6">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2">
                {locale === 'fr' ? 'Contact' : 'Inquiries'}
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.025em] leading-[1.08] text-[var(--text-primary)] mb-5">
                {t.sectionTitle}
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-md mb-8">
                {locale === 'fr'
                  ? 'Disponible pour des projets ponctuels, campagnes publicitaires ou collaborations régulières. Partagez votre brief ou un lien vers vos rushs.'
                  : 'Open for commercial commissions, retainer cuts, and campaign work. Share a brief or footage reference to get started.'}
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover-bg)] text-sm font-medium transition-colors"
              >
                <span>{t.optionABtn}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {/* Direct Channels Index */}
            <div className="lg:col-span-6 divide-y divide-[var(--border-subtle)] border-t border-b border-[var(--border-subtle)]">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-5 flex items-center justify-between gap-4 group"
              >
                <div>
                  <span className="block text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] mb-1">
                    WhatsApp
                  </span>
                  <span className="text-base sm:text-lg font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors tabular-nums">
                    {settings.phone}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
              </a>

              <a
                href={`mailto:${settings.contactEmail}`}
                className="py-5 flex items-center justify-between gap-4 group"
              >
                <div>
                  <span className="block text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] mb-1">
                    Email
                  </span>
                  <span className="text-base sm:text-lg font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors break-all">
                    {settings.contactEmail}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
              </a>

              {settings.linkedInUrl && (
                <a
                  href={settings.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-5 flex items-center justify-between gap-4 group"
                >
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] mb-1">
                      LinkedIn
                    </span>
                    <span className="text-base sm:text-lg font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {settings.editorName}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                </a>
              )}

              <div className="py-5 flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] mb-1">
                    {locale === 'fr' ? 'Basé à' : 'Based in'}
                  </span>
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    {settings.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
