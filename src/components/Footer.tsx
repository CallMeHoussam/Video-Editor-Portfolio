'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, SiteSettings } from '@/types/portfolio';
import { translations } from '@/lib/translations';
import {
  MessageSquare,
  ArrowUp,
  MapPin,
  Mail,
  Phone,
  FileText
} from 'lucide-react';
import {
  LinkedInIcon,
  InstagramIcon,
  XIcon,
  YouTubeIcon
} from './SocialIcons';

interface FooterProps {
  locale: Locale;
  settings: SiteSettings;
}

export function Footer({ locale, settings }: FooterProps) {
  const t = translations[locale].footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cvHref = locale === 'fr' ? '/files/cv/Houssam_CV_FRA.pdf' : '/files/cv/Houssam_CV_ENG.pdf';
  const cvFileName = locale === 'fr' ? 'Houssam_CV_FR.pdf' : 'Houssam_CV_ENG.pdf';

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14">
          {/* Brand Info Column */}
          <div className="lg:col-span-5 space-y-4">
            <Link
              href={`/${locale}`}
              className="inline-block font-display text-2xl font-black tracking-tight text-[var(--text-primary)]"
            >
              <span>Evoless</span>
              <span className="text-purple-400">.</span>
            </Link>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed">
              {locale === 'en'
                ? 'Dynamic, conversion-focused video editing and motion design for visionary brands, agencies, and creators worldwide.'
                : 'Montage vidéo dynamique axé sur la rétention et motion design pour marques, agences et créateurs.'}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {settings.linkedInUrl && (
                <a
                  href={settings.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-purple-400 hover:border-purple-500/40 transition-all"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
              )}

              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Profile"
                  className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-purple-400 hover:border-purple-500/40 transition-all"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}

              {settings.xUrl && (
                <a
                  href={settings.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X Profile"
                  className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-purple-400 hover:border-purple-500/40 transition-all"
                >
                  <XIcon className="w-4 h-4" />
                </a>
              )}

              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Channel"
                  className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-purple-400 hover:border-purple-500/40 transition-all"
                >
                  <YouTubeIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[var(--text-primary)] mb-4">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
              <li>
                <Link href={`/${locale}#work`} className="hover:text-purple-400 transition-colors">
                  {locale === 'en' ? 'Selected Work' : 'Projets Sélectionnés'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#services`} className="hover:text-purple-400 transition-colors">
                  {locale === 'en' ? 'Craft & Services' : 'Expertise & Savoir-faire'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#about`} className="hover:text-purple-400 transition-colors">
                  {locale === 'en' ? 'About & Skills' : 'À Propos & Compétences'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#experience`} className="hover:text-purple-400 transition-colors">
                  {locale === 'en' ? 'Career Experience' : 'Parcours & Expérience'}
                </Link>
              </li>
              <li>
                <a
                  href={cvHref}
                  download={cvFileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors"
                >
                  {locale === 'en' ? 'Download CV (EN)' : 'Télécharger mon CV (FR)'}
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Contact Column */}
          <div className="lg:col-span-4">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[var(--text-primary)] mb-4">
              {t.contactDirect}
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-[var(--text-secondary)]">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-purple-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="font-mono">{settings.phone}</span>
              </a>

              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-2.5 hover:text-purple-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </a>

              <div className="flex items-center gap-2.5 text-[var(--text-muted)]">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{settings.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright (discreet entry to /studio) & Back to Top */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          {/* Discreet admin entry point: clicking the copyright text itself navigates to /studio */}
          <Link
            id="copyright-admin-link"
            href="/studio"
            className="text-inherit hover:text-[var(--text-secondary)] transition-colors cursor-pointer select-none"
            title=""
          >
            © {new Date().getFullYear()} Evoless · Houssam Elmsafer. {t.rights}
          </Link>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-purple-400 transition-colors cursor-pointer"
          >
            <span>{t.backToTop}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
