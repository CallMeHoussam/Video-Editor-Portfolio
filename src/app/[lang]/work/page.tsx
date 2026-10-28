import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale } from '@/types/portfolio';
import { getPortfolioData, getPublishedProjects, getFolders, getCategories, getSiteSettings } from '@/lib/cms-store';
import { Navbar } from '@/components/Navbar';
import { PortfolioSection } from '@/components/PortfolioSection';
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
    ? 'Tous les Projets — Portfolio Evoless'
    : 'Selected Work Archive — Evoless Portfolio';

  const description = isFrench
    ? 'Explorez l\'ensemble des réalisations de Houssam Elmsafer (Evoless) : publicités e-commerce, vidéos UGC, motion design et films de marque.'
    : 'Explore all video editing case studies by Houssam Elmsafer (Evoless): commercial advertising, high-retention UGC, motion graphics, and brand films.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/work`,
      languages: {
        en: '/en/work',
        fr: '/fr/work'
      }
    }
  };
}

export default async function WorkArchivePage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'en' && lang !== 'fr') {
    notFound();
  }

  const locale = lang as Locale;
  const settings = getSiteSettings();
  const projects = getPublishedProjects();
  const folders = getFolders();
  const categories = getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar locale={locale} />

      <main className="flex-1 pt-24">
        <PortfolioSection
          locale={locale}
          projects={projects}
          folders={folders}
          categories={categories}
        />
      </main>

      <FloatingWhatsApp locale={locale} settings={settings} />
      <Footer locale={locale} settings={settings} />
    </div>
  );
}
