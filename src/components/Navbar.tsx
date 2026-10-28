'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/types/portfolio';
import { translations } from '@/lib/translations';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, Download, Menu, X } from 'lucide-react';

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
      // Trigger scrolled state after 60px of scroll
      const scrolled = window.scrollY > 60;
      setIsScrolled(scrolled);
      if (scrolled) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute opposite language route preserving subpath
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
    if (isScrolled) {
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
    { label: t.experience, href: `/${locale}#experience` },
    { label: t.contact, href: `/${locale}#contact` },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 glass-nav'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Typographic Wordmark: Always visible, clicking returns to top when scrolled */}
        <Link
          href={`/${locale}`}
          onClick={handleLogoClick}
          className="group flex items-center gap-1.5 focus:outline-none cursor-pointer"
          aria-label={isScrolled ? 'Return to top' : 'Evoless Homepage'}
        >
          <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] group-hover:text-purple-400 transition-colors">
            Evoless
          </span>
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse-glow" />
        </Link>

        {/* Desktop Navigation Links: Visible at top, hidden smoothly on scroll */}
        <nav
          className={`hidden md:flex items-center gap-8 text-sm font-medium transition-all duration-300 ${
            isScrolled
              ? 'opacity-0 pointer-events-none -translate-y-2'
              : 'opacity-100 text-[var(--text-secondary)] translate-y-0'
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-purple-400 transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 rounded"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Action Bar (Language switcher, theme toggle, CV button): Hidden on scroll */}
        <div
          className={`flex items-center gap-3 transition-all duration-300 ${
            isScrolled
              ? 'opacity-0 pointer-events-none translate-x-2'
              : 'opacity-100 translate-x-0'
          }`}
        >
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-full p-1 text-xs font-semibold">
            <Link
              href={getOppositeLocaleHref('en')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                locale === 'en'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              EN
            </Link>
            <Link
              href={getOppositeLocaleHref('fr')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                locale === 'fr'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              FR
            </Link>
          </div>

          {/* Theme Switcher */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={t.themeToggle}
            className="p-2 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-purple-400 hover:border-purple-500/40 transition-all focus:outline-none cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* CV Download Button (Desktop) */}
          <a
            href={cvHref}
            download={cvFileName}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white transition-all duration-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadCv}</span>
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? t.menuClose : t.menuOpen}
            className="sm:hidden p-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Only openable when at the top) */}
      {mobileMenuOpen && !isScrolled && (
        <div className="sm:hidden glass-nav border-b border-[var(--border-strong)] px-6 py-6 mt-3 space-y-4 animate-slide-up">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[var(--text-primary)] hover:text-purple-400 py-1 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-3">
            {/* Language Switcher Mobile */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[var(--text-secondary)]">Language</span>
              <div className="flex gap-2">
                <Link
                  href={getOppositeLocaleHref('en')}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-1 rounded-full ${locale === 'en' ? 'bg-purple-600 text-white' : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]'}`}
                >
                  English
                </Link>
                <Link
                  href={getOppositeLocaleHref('fr')}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-1 rounded-full ${locale === 'fr' ? 'bg-purple-600 text-white' : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]'}`}
                >
                  Français
                </Link>
              </div>
            </div>

            {/* CV Download */}
            <a
              href={cvHref}
              download={cvFileName}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadCv}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
