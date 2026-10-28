import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale } from '@/types/portfolio';
import {
  getPortfolioData,
  getPublishedProjects,
  getFolders,
  getCategories,
  getServices,
  getExperiences,
  getEducation,
  getSkills,
  getSiteSettings
} from '@/lib/cms-store';
import { Navbar } from '@/components/Navbar';
import { CinematicHero } from '@/components/CinematicHero';
import { PortfolioSection } from '@/components/PortfolioSection';
import { ServicesSection } from '@/components/ServicesSection';
import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Footer } from '@/components/Footer';

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFrench = lang === 'fr';

  const title = isFrench
    ? 'Evoless — Monteur Vidéo Créatif & Motion Designer'
    : 'Evoless — Creative Video Editor & Motion Designer';

  const description = isFrench
    ? 'Portfolio de Houssam Elmsafer (Evoless). Montage vidéo professionnel, formats courts à haute rétention, spots publicitaires et motion design à Casablanca, Maroc.'
    : 'Portfolio of Houssam Elmsafer (Evoless). Professional video editing, high-retention social reels, commercial advertising, and motion design based in Casablanca, Morocco.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: '/en',
        fr: '/fr'
      }
    },
    openGraph: {
      title,
      description,
      locale: isFrench ? 'fr_FR' : 'en_US',
      url: `https://evoless.com/${lang}`
    }
  };
}

export default async function LocalizedHomePage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'en' && lang !== 'fr') {
    notFound();
  }

  const locale = lang as Locale;
  const data = getPortfolioData();
  const settings = getSiteSettings();
  const projects = getPublishedProjects();
  const folders = getFolders();
  const categories = getCategories();
  const services = getServices();
  const experiences = getExperiences();
  const education = getEducation();
  const skills = getSkills();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar locale={locale} />
      
      <main className="flex-1">
        {settings.sectionsVisibility?.hero !== false && (
          <CinematicHero locale={locale} settings={settings} />
        )}
        {settings.sectionsVisibility?.portfolio !== false && (
          <PortfolioSection
            locale={locale}
            projects={projects}
            folders={folders}
            categories={categories}
          />
        )}
        {settings.sectionsVisibility?.services !== false && (
          <ServicesSection locale={locale} services={services} />
        )}
        {settings.sectionsVisibility?.about !== false && (
          <AboutSection
            locale={locale}
            settings={settings}
            experiences={experiences}
            education={education}
            skills={skills}
            languages={data.languages}
          />
        )}
        {settings.sectionsVisibility?.contact !== false && (
          <ContactSection locale={locale} settings={settings} />
        )}
      </main>

      <FloatingWhatsApp locale={locale} settings={settings} />
      <Footer locale={locale} settings={settings} />
    </div>
  );
}
