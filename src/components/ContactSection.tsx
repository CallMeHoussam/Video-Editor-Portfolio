'use client';

import React from 'react';
import { Locale, SiteSettings } from '@/types/portfolio';
import { translations } from '@/lib/translations';
import { MessageSquare, Mail, Phone, MapPin, Clock, ShieldCheck, ArrowUpRight, Sparkles } from 'lucide-react';
import { LinkedInIcon } from './SocialIcons';

interface ContactSectionProps {
  locale: Locale;
  settings: SiteSettings;
  preselectedService?: string;
}

export function ContactSection({ locale, settings }: ContactSectionProps) {
  const t = translations[locale].contact;

  // Direct WhatsApp Link with pre-filled message configurable via site settings
  const whatsappStarter = settings.whatsappStarterMessage?.[locale] || (
    locale === 'fr'
      ? "Bonjour Houssam, j'aimerais échanger avec vous au sujet d'un projet de montage vidéo."
      : "Hi Houssam, I'd like to discuss a video editing project."
  );

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(whatsappStarter)}`;

  return (
    <section id="contact" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-purple-400 uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'Start a Project' : 'Démarrer un Projet'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            {t.sectionTitle}
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] mt-3">
            {locale === 'en'
              ? 'Connect directly on WhatsApp to check availability, share footage references, or discuss turnarounds.'
              : 'Contactez-moi directement sur WhatsApp pour vérifier ma disponibilité, envoyer des rushs ou discuter de vos délais.'}
          </p>
        </div>

        {/* Dual Cards: Primary WhatsApp Card + Direct Channels Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch max-w-5xl mx-auto">
          {/* PRIMARY: DIRECT WHATSAPP CARD */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[var(--bg-surface-elevated)] to-[var(--bg-surface)] border border-purple-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span>{locale === 'en' ? 'Primary & Fastest Response' : 'Réponse la Plus Rapide'}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
                {locale === 'en' ? 'Direct WhatsApp Conversation' : 'Échange Direct sur WhatsApp'}
              </h3>

              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                {locale === 'en'
                  ? 'The quickest way to reach me directly. Drop your project brief, send a Google Drive/Dropbox footage link, or ask about timeline availability.'
                  : 'Le moyen le plus direct et efficace pour me joindre. Partagez votre brief, un lien Google Drive/Dropbox vers vos rushs ou vos impératifs de planning.'}
              </p>

              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] block font-mono">
                      {locale === 'en' ? 'WhatsApp Direct Line' : 'Ligne Directe WhatsApp'}
                    </span>
                    <span className="text-lg font-bold text-[var(--text-primary)] font-mono">
                      {settings.phone}
                    </span>
                  </div>
                </div>

                <span className="hidden sm:inline-block px-2.5 py-1 rounded-md text-[11px] font-mono bg-purple-500/15 text-purple-300">
                  +212 Morocco
                </span>
              </div>
            </div>

            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{t.optionABtn} ({settings.phone})</span>
              </a>

              <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{locale === 'en' ? 'Replies within 1–2 hours' : 'Réponse sous 1 à 2h'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{locale === 'en' ? 'Strict client NDA respected' : 'Confidentialité assurée'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECONDARY: DIRECT CONTACT DETAILS CARD */}
          <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-6">
                <span>{locale === 'en' ? 'Direct Channels' : 'Coordonnées Directes'}</span>
              </div>

              <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-3">
                {locale === 'en' ? 'Alternative Reach' : 'Autres Moyens de Contact'}
              </h3>

              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">
                {locale === 'en'
                  ? 'Prefer formal correspondence? You can also email me directly or connect professionally on LinkedIn.'
                  : 'Vous préférez un échange par email ou professionnel ? Écrivez-moi directement ou retrouvez-moi sur LinkedIn.'}
              </p>

              <div className="space-y-4">
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-purple-500/40 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[var(--text-muted)] block font-mono">Email</span>
                      <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] group-hover:text-purple-400 transition-colors">
                        {settings.contactEmail}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>

                <a
                  href={`tel:${settings.phone.replace(/[\s-]/g, '')}`}
                  className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-purple-500/40 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-[var(--text-muted)] block font-mono">
                        {locale === 'en' ? 'Direct Phone Call' : 'Appel Direct'}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] group-hover:text-purple-400 transition-colors font-mono">
                        {settings.phone}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>

                {settings.linkedInUrl && (
                  <a
                    href={settings.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-purple-500/40 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                        <LinkedInIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] text-[var(--text-muted)] block font-mono">LinkedIn</span>
                        <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] group-hover:text-purple-400 transition-colors">
                          linkedin.com/in/elmsafer-houssam
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex items-center gap-2.5 text-xs text-[var(--text-muted)]">
              <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{settings.location} · {locale === 'en' ? 'GMT+1 Morocco Time' : 'Fuseau horaire Maroc GMT+1'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
