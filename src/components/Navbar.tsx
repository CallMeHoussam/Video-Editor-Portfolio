'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/types/portfolio';
import { translations } from '@/lib/translations';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, Menu, X } from 'lucide-react';

interface NavbarProps {
  locale: Locale;
}

export function Navbar({ locale }: NavbarProps) {
  const t = translations[locale].nav;
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 56;
      setIsScrolled(scrolled);
      if (scrolled) {
        setMobileMenuOpen(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getOppositeLocaleHref = (targetLocale: Locale) => {
    if (!pathname) return `/${targetLocale}`;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return `/${targetLocale}`;
    if (segments[0] === 'en' || segments[0] === 'fr') {
      segments[0] = targetLocale;
      return `/${segments.join('/')}`;
    }
    return `/${targetLocale}/${segments.join('/')}`;
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
    if (isScrolled && isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cvHref = locale === 'fr' ? '/files/cv/Houssam_CV_FRA.pdf' : '/files/cv/Houssam_CV_ENG.pdf';
  const cvFileName = locale === 'fr' ? 'Houssam_CV_FR.pdf' : 'Houssam_CV_ENG.pdf';

  const navLinks = [
    { label: t.work, href: `/${locale}#work` },
    { label: t.services, href: `/${locale}#services` },
    { label: t.about, href: `/${locale}#about` },
    { label: t.contact, href: `/${locale}#contact` },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 glass-nav' : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-6">
        {/* Wordmark — always anchored; clicks scroll to top when scrolled on homepage */}
        <Link
          href={`/${locale}`}
          onClick={handleLogoClick}
          className="group inline-flex items-baseline gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded"
          aria-label={isScrolled ? 'Return to top' : 'Evoless Homepage'}
        >
          <span className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
            Evoless
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block mb-0.5" />
        </Link>

        {/* Primary Navigation Links — clean unornamented typography, collapses subtly on scroll */}
        <nav
          aria-label="Primary Navigation"
          className={`hidden md:flex items-center gap-9 text-sm transition-all duration-300 ${
            isScrolled
              ? 'opacity-0 pointer-events-none -translate-y-1'
              : 'opacity-100 translate-y-0 text-[var(--text-secondary)]'
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[var(--text-primary)] transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] rounded"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Utility Strip — Language, Theme, CV (stays minimal, fades cleanly on scroll) */}
        <div
          className={`flex items-center gap-4 transition-all duration-300 ${
            isScrolled
              ? 'opacity-0 pointer-events-none translate-x-1'
              : 'opacity-100 translate-x-0'
          }`}
        >
          <div className="hidden sm:flex items-center gap-1.5 text-xs tracking-wide">
            <Link
              href={getOppositeLocaleHref('en')}
              className={`px-1.5 py-0.5 transition-colors ${
                locale === 'en'
                  ? 'text-[var(--text-primary)] font-semibold border-b border-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              EN
            </Link>
            <span className="text-[var(--border-strong)]">/</span>
            <Link
              href={getOppositeLocaleHref('fr')}
              className={`px-1.5 py-0.5 transition-colors ${
                locale === 'fr'
                  ? 'text-[var(--text-primary)] font-semibold border-b border-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              FR
            </Link>
          </div>

          <a
            href={cvHref}
            download={cvFileName}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors underline decoration-[var(--border-strong)] underline-offset-4 hover:decoration-[var(--accent)]"
          >
            {t.downloadCv}
          </a>

          <button
            id="theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            aria-label={t.themeToggle}
            className="p-2 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? t.menuClose : t.menuOpen}
            className="md:hidden p-2 rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Clean Mobile Drawer */}
      {mobileMenuOpen && !isScrolled && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] px-5 py-6 flex flex-col gap-5 animate-fade-in">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-lg font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Link
                href={getOppositeLocaleHref('en')}
                onClick={() => setMobileMenuOpen(false)}
                className={locale === 'en' ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-muted)]'}
              >
                EN
              </Link>
              <span className="text-[var(--border-strong)]">/</span>
              <Link
                href={getOppositeLocaleHref('fr')}
                onClick={() => setMobileMenuOpen(false)}
                className={locale === 'fr' ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-muted)]'}
              >
                FR
              </Link>
            </div>

            <a
              href={cvHref}
              download={cvFileName}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] underline underline-offset-4"
            >
              {t.downloadCv}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
