'use client';

import React from 'react';
import {
  Locale,
  SiteSettings,
  WorkExperience,
  Education,
  SkillGroup,
  LanguageItem,
} from '@/types/portfolio';
import { translations } from '@/lib/translations';
import { Reveal } from './Reveal';
import { ArrowUpRight } from 'lucide-react';

interface AboutSectionProps {
  locale: Locale;
  settings: SiteSettings;
  experiences: WorkExperience[];
  education: Education[];
  skills: SkillGroup[];
  languages: LanguageItem[];
}

export function AboutSection({
  locale,
  settings,
  experiences,
  education,
  skills,
  languages,
}: AboutSectionProps) {
  const t = translations[locale].about;
  const cvHref =
    settings.cvFiles?.[locale] ||
    (locale === 'fr' ? '/files/cv/Houssam_CV_FRA.pdf' : '/files/cv/Houssam_CV_ENG.pdf');
  const cvFileName = locale === 'fr' ? 'Houssam_CV_FR.pdf' : 'Houssam_CV_ENG.pdf';

  return (
    <section id="about" className="section-rule py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Editorial Intro: Portrait & Biography */}
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pb-16 sm:pb-20 border-b border-[var(--border-subtle)]">
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] max-w-sm">
                <img
                  src="/images/houssam-elmsafer.jpg"
                  alt={`${settings.editorName} — Evoless`}
                  className="w-full h-auto object-cover grayscale contrast-[1.06] hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                />
                <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--text-primary)]">{settings.editorName}</span>
                  <span className="text-[var(--text-muted)]">{settings.location}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-2">
                {locale === 'fr' ? 'Profil' : 'About'}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[var(--text-primary)] mb-2">
                {settings.editorName}
              </h2>
              <p className="text-sm font-medium text-[var(--accent)] mb-6">
                {settings.editorTitle[locale] || settings.editorTitle.en}
              </p>

              <p className="text-base sm:text-[17px] text-[var(--text-secondary)] leading-relaxed max-w-2xl mb-8">
                {settings.bioSummary[locale] || settings.bioSummary.en}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
                <a
                  href={cvHref}
                  download={cvFileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover-bg)] transition-colors"
                >
                  <span>{locale === 'fr' ? t.downloadCvFr : t.downloadCvEn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                {settings.linkedInUrl && (
                  <a
                    href={settings.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline decoration-[var(--border-strong)] underline-offset-4 transition-colors"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Chronological Experience & Education */}
        <Reveal>
          <div
            id="experience"
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 py-16 border-b border-[var(--border-subtle)]"
          >
            {/* Work Experience */}
            <div className="lg:col-span-7">
              <h3 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-8">
                {t.experienceTitle}
              </h3>

              <div className="divide-y divide-[var(--border-subtle)] border-t border-b border-[var(--border-subtle)]">
                {experiences.map((exp) => (
                  <div key={exp.id} className="py-6">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                      <h4 className="font-display text-lg font-medium text-[var(--text-primary)]">
                        {exp.title[locale] || exp.title.en}
                      </h4>
                      <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums shrink-0">
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--accent)] font-medium mb-3">
                      {exp.company} · {exp.location}
                    </p>

                    <ul className="space-y-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                      {(exp.responsibilities[locale] || exp.responsibilities.en).map((resp, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <span className="text-[var(--text-dim)]">—</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>

                    {exp.verifiedAchievement?.[locale] && (
                      <p className="mt-3 text-xs text-[var(--text-primary)] font-medium">
                        {exp.verifiedAchievement[locale]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Languages */}
            <div className="lg:col-span-5 flex flex-col gap-12">
              <div>
                <h3 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-8">
                  {t.educationTitle}
                </h3>

                <div className="divide-y divide-[var(--border-subtle)] border-t border-b border-[var(--border-subtle)]">
                  {education.map((edu) => (
                    <div key={edu.id} className="py-5">
                      <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums block mb-1">
                        {edu.period}
                      </span>
                      <h4 className="font-display text-base font-medium text-[var(--text-primary)] mb-1">
                        {edu.program[locale] || edu.program.en}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] mb-2">
                        {edu.institution}
                      </p>
                      {(edu.focusAreas[locale] || edu.focusAreas.en)?.length > 0 && (
                        <p className="text-xs text-[var(--text-muted)]">
                          {(edu.focusAreas[locale] || edu.focusAreas.en).join(' · ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {languages.length > 0 && (
                <div>
                  <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-5">
                    {t.languagesTitle}
                  </h3>
                  <div className="divide-y divide-[var(--border-subtle)] border-t border-b border-[var(--border-subtle)]">
                    {languages.map((lang) => (
                      <div key={lang.id} className="py-3 flex items-center justify-between text-sm">
                        <span className="font-medium text-[var(--text-primary)]">
                          {lang.name[locale] || lang.name.en}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          {lang.level[locale] || lang.level.en}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Disciplines & Software */}
        {skills.length > 0 && (
          <Reveal>
            <div className="pt-14">
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-8">
                {t.skillsTitle}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {skills.map((group) => (
                  <div key={group.id} className="border-t border-[var(--border-subtle)] pt-4">
                    <h4 className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)] mb-3">
                      {group.title[locale] || group.title.en}
                    </h4>
                    <ul className="space-y-1.5 text-sm text-[var(--text-primary)]">
                      {group.skills.map((skill, sIdx) => (
                        <li key={sIdx}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
