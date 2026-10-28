'use client';

import React from 'react';
import { Locale, Service } from '@/types/portfolio';
import { translations } from '@/lib/translations';
import { Sparkles, Check, ArrowRight, Video, Megaphone, Smartphone, Clapperboard, Sparkle } from 'lucide-react';

interface ServicesSectionProps {
  locale: Locale;
  services: Service[];
  onSelectService?: (serviceTitle: string) => void;
}

export function ServicesSection({ locale, services, onSelectService }: ServicesSectionProps) {
  const t = translations[locale].services;

  const getServiceIcon = (index: number) => {
    switch (index % 5) {
      case 0: return <Video className="w-5 h-5 text-purple-400" />;
      case 1: return <Megaphone className="w-5 h-5 text-purple-400" />;
      case 2: return <Smartphone className="w-5 h-5 text-purple-400" />;
      case 3: return <Sparkles className="w-5 h-5 text-purple-400" />;
      default: return <Clapperboard className="w-5 h-5 text-purple-400" />;
    }
  };

  const handleInquireService = (title: string) => {
    if (onSelectService) {
      onSelectService(title);
    }
    // Also scroll down to #contact
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 md:py-28 bg-[var(--bg-secondary)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-purple-400 uppercase mb-3">
            <Sparkle className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'Craft & Capabilities' : 'Expertise & Savoir-faire'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            {t.sectionTitle}
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] mt-3">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-purple-500/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Top Icon & Order */}
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    {getServiceIcon(index)}
                  </div>
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    0{service.order}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-2">
                  {service.title[locale]}
                </h3>
                <p className="text-xs font-medium text-purple-400 mb-4">
                  {service.tagline[locale]}
                </p>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  {service.description[locale]}
                </p>

                {/* Deliverables */}
                <div className="mb-6 pt-4 border-t border-[var(--border-subtle)]">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                    {t.deliverables}
                  </h4>
                  <ul className="space-y-2">
                    {service.deliverables[locale].map((del, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                        <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                {/* Tools Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {service.tools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleInquireService(service.title[locale])}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-purple-500/30 text-xs font-semibold text-purple-600 dark:text-purple-300 hover:bg-purple-600 hover:text-white dark:hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <span>{t.bookService}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
