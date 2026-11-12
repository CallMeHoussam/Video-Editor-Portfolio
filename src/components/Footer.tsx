'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, SiteSettings } from '@/types/portfolio';
import { translations } from '@/lib/translations';
import { LinkedInIcon, InstagramIcon, XIcon, YouTubeIcon } from './SocialIcons';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  locale: Locale;
  settings: SiteSettings;
}

export function Footer({ locale, settings }: FooterProps) {
  const t = translations[locale].footer;
  const tNav = translations[locale].nav;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cvHref =
    settings.cvFiles?.[locale] ||
    (locale === 'fr' ? '/files/cv/Houssam_CV_FRA.pdf' : '/files/cv/Houssam_CV_ENG.pdf');
  const cvFileName = locale === 'fr' ? 'Houssam_CV_FR.pdf' : 'Houssam_CV_ENG.pdf';

  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          {/* Identity */}
          <div className="md:col-span-5">
            <Link
              href={`/${locale}`}
              className="inline-flex items-baseline gap-1 font-display text-xl font-semibold tracking-[-0.025em] text-[var(--text-primary)] mb-3"
            >
              <span>Evoless</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            </Link>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed mb-5">
              {t.brandTagline}
            </p>

            <div className="flex items-center gap-3 text-[var(--text-muted)]">
              {settings.linkedInUrl && (
                <a
                  href={settings.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2 rounded border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
                >
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.xUrl && (
                <a
                  href={settings.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="p-2 rounded border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="p-2 rounded border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
                >
                  <YouTubeIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] mb-4">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
              <li>
                <Link href={`/${locale}#work`} className="hover:text-[var(--text-primary)] transition-colors">
                  {tNav.work}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#services`} className="hover:text-[var(--text-primary)] transition-colors">
                  {tNav.services}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#about`} className="hover:text-[var(--text-primary)] transition-colors">
                  {tNav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#contact`} className="hover:text-[var(--text-primary)] transition-colors">
                  {tNav.contact}
                </Link>
              </li>
              <li>
                <a
                  href={cvHref}
                  download={cvFileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  {tNav.downloadCv}
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] mb-4">
              {t.contactDirect}
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
              <a
                href={`mailto:${settings.contactEmail}`}
                className="block hover:text-[var(--text-primary)] transition-colors"
              >
                {settings.contactEmail}
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono tabular-nums hover:text-[var(--text-primary)] transition-colors"
              >
                {settings.phone}
              </a>
              <p className="text-[var(--text-muted)]">{settings.location}</p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Discreet Studio Access */}
        <div className="pt-7 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <Link
            id="copyright-admin-link"
            href="/studio"
            className="text-inherit hover:text-[var(--text-secondary)] transition-colors cursor-pointer select-none"
          >
            © {new Date().getFullYear()} Evoless · Houssam Elmsafer. {t.rights}
          </Link>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <span>{t.backToTop}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
