import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale } from '@/types/portfolio';
import {
  getProjectBySlug,
  getCategories,
  getRelatedProjects,
  getSiteSettings
} from '@/lib/cms-store';
import { Navbar } from '@/components/Navbar';
import { CaseStudyDetail } from '@/components/CaseStudyDetail';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Footer } from '@/components/Footer';

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: 'Case Study Not Found' };
  }

  const locale = (lang === 'fr' ? 'fr' : 'en') as Locale;
  const title = `${project.title[locale]} — Case Study`;
  const description = project.shortDescription[locale];

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/work/${slug}`,
      languages: {
        en: `/en/work/${slug}`,
        fr: `/fr/work/${slug}`
      }
    },
    openGraph: {
      title,
      description,
      type: 'video.other',
      url: `https://evoless.com/${lang}/work/${slug}`,
      images: [
        {
          url: project.thumbnail || '/images/houssam-elmsafer.jpg',
          width: 1200,
          height: 675,
          alt: project.title[locale]
        }
      ]
    }
  };
}

export default async function CaseStudyPage({
  params,
  searchParams
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}) {
  const { lang, slug } = await params;
  const search = await searchParams;
  const isPreview = search?.preview === 'true';

  if (lang !== 'en' && lang !== 'fr') {
    notFound();
  }

  const project = getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  // If unpublished and not in draft preview mode, return 404
  if (!project.published && !isPreview) {
    notFound();
  }

  const locale = lang as Locale;
  const categories = getCategories();
  const settings = getSiteSettings();
  const relatedProjects = getRelatedProjects(project, 3);

  // JSON-LD structured data for Video/CreativeWork
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: project.title[locale],
    description: project.shortDescription[locale],
    thumbnailUrl: project.thumbnail ? [`https://evoless.com${project.thumbnail}`] : undefined,
    uploadDate: `${project.year}-01-01T00:00:00Z`,
    creator: {
      '@type': 'Person',
      name: 'Houssam Elmsafer',
      jobTitle: 'Video Editor & Motion Designer'
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar locale={locale} />
      
      <main className="flex-1">
        <CaseStudyDetail
          locale={locale}
          project={project}
          categories={categories}
          relatedProjects={relatedProjects}
          settings={settings}
          isPreview={isPreview}
        />
      </main>

      <FloatingWhatsApp locale={locale} settings={settings} />
      <Footer locale={locale} settings={settings} />
    </div>
  );
}
