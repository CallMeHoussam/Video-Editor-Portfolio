'use client';

import React, { useState } from 'react';
import { Locale, Service } from '@/types/portfolio';
import { translations } from '@/lib/translations';
import { Reveal } from './Reveal';
import { Plus, Minus, ArrowUpRight } from 'lucide-react';

interface ServicesSectionProps {
  locale: Locale;
  services: Service[];
  onSelectService?: (serviceTitle: string) => void;
}

export function ServicesSection({ locale, services, onSelectService }: ServicesSectionProps) {
  const t = translations[locale].services;
  const [openId, setOpenId] = useState<string | null>(services[0]?.id || null);

  const handleInquireService = (title: string) => {
    if (onSelectService) {
      onSelectService(title);
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (services.length === 0) return null;

  return (
    <section id="services" className="section-rule py-20 sm:py-28 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Sticky Editorial Heading Column */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2">
                {locale === 'fr' ? 'Prestations' : 'Craft'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[var(--text-primary)] mb-3">
                {t.sectionTitle}
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-sm">
                {t.sectionSubtitle}
              </p>
            </div>

            {/* Clean Expandable Index Rows */}
            <div className="lg:col-span-8 divide-y divide-[var(--border-subtle)] border-t border-b border-[var(--border-subtle)]">
              {services.map((service, idx) => {
                const isOpen = openId === service.id;
                const num = String(service.order || idx + 1).padStart(2, '0');
                const title = service.title[locale] || service.title.en;
                const tagline = service.tagline?.[locale] || service.tagline?.en;
                const description = service.description?.[locale] || service.description?.en;
                const deliverables = service.deliverables?.[locale] || [];

                return (
                  <div key={service.id} className="py-6 sm:py-7">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : service.id)}
                      aria-expanded={isOpen}
                      className="w-full text-left flex items-start justify-between gap-6 group cursor-pointer"
                    >
                      <div className="flex items-baseline gap-4 sm:gap-6">
                        <span className="font-mono text-xs tabular-nums text-[var(--text-muted)] shrink-0">
                          {num}
                        </span>
                        <div>
                          <h3 className="font-display text-xl sm:text-2xl font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                            {title}
                          </h3>
                          {tagline && (
                            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                              {tagline}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="p-1.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:border-[var(--border-hover)] transition-colors shrink-0 mt-1">
                        {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="mt-5 pl-8 sm:pl-11 pr-2 animate-fade-in">
                        {description && (
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 max-w-2xl">
                            {description}
                          </p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-4 border-t border-[var(--border-subtle)]">
                          {deliverables.length > 0 && (
                            <div className="sm:col-span-7">
                              <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2.5">
                                {t.deliverables}
                              </p>
                              <ul className="space-y-1.5 text-xs sm:text-sm text-[var(--text-primary)]">
                                {deliverables.map((del, dIdx) => (
                                  <li key={dIdx} className="flex items-start gap-2">
                                    <span className="text-[var(--accent)]">—</span>
                                    <span>{del}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="sm:col-span-5 flex flex-col justify-between gap-4">
                            {service.tools && service.tools.length > 0 && (
                              <div>
                                <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2">
                                  {t.toolsUsed}
                                </p>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                  {service.tools.join(' · ')}
                                </p>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => handleInquireService(title)}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-primary)] hover:text-[var(--accent)] underline decoration-[var(--border-strong)] underline-offset-4 self-start transition-colors cursor-pointer"
                            >
                              <span>{t.bookService}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
