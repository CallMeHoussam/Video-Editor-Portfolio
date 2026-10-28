import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale } from '@/types/portfolio';
import {
  getFolderBySlug,
  getProjectsInFolder,
  getBestOneForFolder,
  getSiteSettings
} from '@/lib/cms-store';
import { Navbar } from '@/components/Navbar';
import { FolderView } from '@/components/FolderView';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Footer } from '@/components/Footer';

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const folder = getFolderBySlug(slug);

  if (!folder) {
    return { title: 'Folder Not Found — Evoless' };
  }

  const locale = (lang === 'fr' ? 'fr' : 'en') as Locale;
  const folderName = folder.name[locale] || folder.name.en || folder.id;
  const description = folder.description?.[locale] || folder.description?.en || `Video portfolio collection for ${folderName}`;

  return {
    title: `${folderName} — Evoless Portfolio`,
    description,
    alternates: {
      canonical: `/${lang}/folder/${slug}`,
      languages: {
        en: `/en/folder/${slug}`,
        fr: `/fr/folder/${slug}`
      }
    }
  };
}

export default async function FolderPage({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  if (lang !== 'en' && lang !== 'fr') {
    notFound();
  }

  const locale = lang as Locale;
  const folder = getFolderBySlug(slug);

  if (!folder) {
    notFound();
  }

  // Get published projects for this folder
  const projects = getProjectsInFolder(folder.id, true);

  // If no published videos in this folder, do not display publicly
  if (projects.length === 0) {
    notFound();
  }

  const bestOne = getBestOneForFolder(folder.id) || projects[0];
  const settings = getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar locale={locale} />

      <main className="flex-1">
        <FolderView
          locale={locale}
          folder={folder}
          projects={projects}
          bestOne={bestOne}
        />
      </main>

      <FloatingWhatsApp locale={locale} settings={settings} />
      <Footer locale={locale} settings={settings} />
    </div>
  );
}
