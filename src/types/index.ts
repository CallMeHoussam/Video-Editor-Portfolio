export type ProjectCategory =
  | 'All Projects'
  | 'Ads & Commercials'
  | 'UGC'
  | 'Motion Graphics'
  | 'Social Media Content'
  | 'Brand Films'
  | 'Other Projects';

export interface Project {
  id: string;
  slug: string;
  title: string;
  titleFr: string;
  client: string;
  year: string;
  categories: ProjectCategory[];
  descriptionEn: string;
  descriptionFr: string;
  thumbnailUrl: string;
  previewVideoUrl?: string; // Optional short muted video preview
  fullVideoUrl?: string; // Vimeo / YouTube / MP4 url for modal or Phase 2
  roleEn: string;
  roleFr: string;
  duration?: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  deliverablesEn: string[];
  deliverablesFr: string[];
  metrics?: string;
  metricsFr?: string;
  featured?: boolean;
  tools: string[];
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  roleEn: string;
  roleFr: string;
  locationEn: string;
  locationFr: string;
  periodEn: string;
  periodFr: string;
  bulletsEn: string[];
  bulletsFr: string[];
  tags: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degreeEn: string;
  degreeFr: string;
  periodEn: string;
  periodFr: string;
  detailsEn: string[];
  detailsFr: string[];
}

export interface ServiceItem {
  id: string;
  number: string;
  titleEn: string;
  titleFr: string;
  summaryEn: string;
  summaryFr: string;
  deliverablesEn: string[];
  deliverablesFr: string[];
  tools: string[];
}

export interface SkillCategory {
  titleEn: string;
  titleFr: string;
  skills: {
    name: string;
    level?: string;
    levelFr?: string;
    highlight?: boolean;
  }[];
}

export type Language = 'en' | 'fr';
export type Theme = 'dark' | 'light';
