import { MetadataRoute } from 'next';
import { getPublishedProjects } from '@/lib/cms-store';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://evoless.com';
  const projects = getPublishedProjects();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          fr: `${baseUrl}/fr`,
        },
      },
    },
    {
      url: `${baseUrl}/fr`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          fr: `${baseUrl}/fr`,
        },
      },
    },
  ];

  // Add all project pages in EN and FR
  projects.forEach((proj) => {
    entries.push({
      url: `${baseUrl}/en/work/${proj.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/work/${proj.slug}`,
          fr: `${baseUrl}/fr/work/${proj.slug}`,
        },
      },
    });

    entries.push({
      url: `${baseUrl}/fr/work/${proj.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/work/${proj.slug}`,
          fr: `${baseUrl}/fr/work/${proj.slug}`,
        },
      },
    });
  });

  return entries;
}
