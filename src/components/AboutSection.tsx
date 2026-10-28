'use client';

import React from 'react';
import Image from 'next/image';
import { Locale, SiteSettings, WorkExperience, Education, SkillGroup, LanguageItem } from '@/types/portfolio';
import { translations } from '@/lib/translations';
import {
  Download,
  Briefcase,
  GraduationCap,
  Wrench,
  Languages,
  CheckCircle2,
  Calendar,
  MapPin,
  ExternalLink,
  Award
} from 'lucide-react';

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
  languages
}: AboutSectionProps) {
  const t = translations[locale].about;
  const cvHref = settings.cvFiles?.[locale] || (locale === 'fr' ? '/files/cv/Houssam_CV_FRA.pdf' : '/files/cv/Houssam_CV_ENG.pdf');
  const cvFileName = locale === 'fr' ? 'Houssam_CV_FR.pdf' : 'Houssam_CV_ENG.pdf';

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-purple-400 uppercase mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'Background & Discipline' : 'Parcours & Rigueur'}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            {t.sectionTitle}
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] mt-3">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Profile Card & Bio Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20 items-center">
          {/* Portrait Image Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">
              {/* Purple Glow Accent Background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500" />
              
              <div className="relative rounded-2xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl">
                <img
                  src="/images/houssam-elmsafer.jpg"
                  alt="Houssam Elmsafer - Video Editor and Founder of Evoless"
                  className="w-full h-auto object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />

                <div className="p-4 bg-[var(--bg-surface-elevated)] border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">{settings.editorName}</h3>
                    <p className="text-xs text-purple-400">{settings.editorTitle[locale]}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)]">
                    <MapPin className="w-3 h-3 text-purple-400" />
                    Casablanca
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Text Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4 leading-snug">
              {t.bioTitle}
            </h3>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6 font-light">
              {settings.bioSummary[locale]}
            </p>

            {/* Quick highlight points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{locale === 'en' ? 'Punctual deadlines guaranteed' : 'Délais respectés avec ponctualité'}</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{locale === 'en' ? 'Retention-engineered pacing' : 'Rythme calibré pour la rétention'}</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{locale === 'en' ? 'Commercial & organic reach' : 'Publicités & portée organique'}</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{locale === 'en' ? 'Clear, proactive communication' : 'Communication fluide et réactive'}</span>
              </div>
            </div>

            {/* CV Download Button */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={cvHref}
                download={cvFileName}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm shadow-md shadow-purple-600/25 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>{locale === 'fr' ? t.downloadCvFr : t.downloadCvEn}</span>
              </a>

              <a
                href={settings.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium transition-all"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Work Experience & Education Timeline */}
        <div id="experience" className="pt-8 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Experience Column */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2.5 mb-8">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                  {t.experienceTitle}
                </h3>
              </div>

              <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[var(--border-subtle)]">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-9">
                    {/* Timeline Node */}
                    <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-purple-600 ring-4 ring-[var(--bg-primary)]" />

                    <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-purple-500/30 transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h4 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)]">
                          {exp.title[locale]}
                        </h4>
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
                          {exp.period}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-4">
                        <span className="font-semibold text-purple-300">{exp.company}</span>
                        <span>•</span>
                        <span>{exp.location}</span>
                      </div>

                      <ul className="space-y-2 mb-3">
                        {exp.responsibilities[locale].map((resp, rIdx) => (
                          <li key={rIdx} className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>

                      {exp.verifiedAchievement && (
                        <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-2 text-xs font-semibold text-emerald-400">
                          <Award className="w-4 h-4 shrink-0" />
                          <span>{exp.verifiedAchievement[locale]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Languages Column */}
            <div className="lg:col-span-5 space-y-12">
              {/* Education */}
              <div>
                <div className="flex items-center gap-2.5 mb-8">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                    {t.educationTitle}
                  </h3>
                </div>

                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id} className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                      <span className="font-mono text-xs text-purple-400 block mb-1">
                        {edu.period}
                      </span>
                      <h4 className="font-display font-bold text-base text-[var(--text-primary)] mb-1">
                        {edu.program[locale]}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] mb-4">
                        {edu.institution}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {edu.focusAreas[locale].map((area, aIdx) => (
                          <span
                            key={aIdx}
                            className="px-2 py-0.5 rounded text-[11px] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <Languages className="w-5 h-5 text-purple-400" />
                  <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                    {t.languagesTitle}
                  </h3>
                </div>

                <div className="space-y-3">
                  {languages.map((lang) => (
                    <div
                      key={lang.id}
                      className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between"
                    >
                      <span className="font-semibold text-sm text-[var(--text-primary)]">
                        {lang.name[locale]}
                      </span>
                      <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[var(--bg-surface-elevated)] text-purple-600 dark:text-purple-300 border border-purple-500/20">
                        {lang.level[locale]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Technical Tools Grid */}
        <div className="pt-8">
          <div className="flex items-center gap-2.5 mb-8">
            <Wrench className="w-5 h-5 text-purple-400" />
            <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              {t.skillsTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((group) => (
              <div
                key={group.id}
                className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
              >
                <h4 className="font-display font-bold text-base text-[var(--text-primary)] mb-4 pb-3 border-b border-[var(--border-subtle)]">
                  {group.title[locale]}
                </h4>

                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-purple-500/40 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
