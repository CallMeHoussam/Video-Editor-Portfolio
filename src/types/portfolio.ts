export type Locale = 'en' | 'fr';
export type ExtendedLocale = 'en' | 'fr' | 'ary';

export type VideoProvider = 'bunny' | 'vimeo' | 'youtube' | 'googledrive' | 'direct' | 'placeholder';

export interface LocalizedString {
  en: string;
  fr: string;
  ary?: string; // Prepared for Moroccan Darija (الدارجة المغربية)
}

export interface LocalizedList {
  en: string[];
  fr: string[];
  ary?: string[]; // Prepared for Moroccan Darija
}

export interface MetricItem {
  label: LocalizedString;
  value: string;
}

export interface BreakdownItem {
  id: string;
  title: LocalizedString;
  type: 'before-after' | 'hook' | 'motion' | 'sound' | 'timeline' | 'text';
  content: LocalizedString;
  mediaUrl?: string;
  beforeMedia?: string;
  afterMedia?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  categories: string[]; // category IDs
  folderId?: string; // Client, agency, category, or collection folder ID
  tags: string[];
  year: string;
  client: string;
  role: LocalizedString;
  format: string; // e.g., "9:16 Vertical Reel" or "16:9 4K Commercial"
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  software: string[];
  thumbnail: string;
  previewVideo?: string;
  videoProvider: VideoProvider;
  videoUrl: string;
  bunnyLibraryId?: string;
  bunnyVideoId?: string;
  brief: LocalizedString;
  creativeApproach: {
    rhythm?: LocalizedString;
    hookStrategy?: LocalizedString;
    visualHierarchy?: LocalizedString;
    captionStrategy?: LocalizedString;
    soundDesign?: LocalizedString;
    motionGraphics?: LocalizedString;
    colorTreatment?: LocalizedString;
  };
  breakdowns?: BreakdownItem[];
  results?: {
    metrics?: MetricItem[];
    description?: LocalizedString;
  };
  editorsNotes?: {
    note: LocalizedString;
    detailThatMatters?: LocalizedString;
    detailMediaUrl?: string;
  };
  featured: boolean;
  published: boolean;
  order: number;
}

export interface Folder {
  id: string;
  slug: string;
  name: LocalizedString;
  description?: LocalizedString;
  coverImage?: string;
  order: number;
}

export interface Category {
  id: string;
  slug: string;
  name: LocalizedString;
  order: number;
}

export interface Service {
  id: string;
  slug: string;
  title: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  deliverables: LocalizedList;
  tools: string[];
  highlight: LocalizedString;
  order: number;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: LocalizedString;
  location: string;
  period: string;
  responsibilities: LocalizedList;
  verifiedAchievement?: LocalizedString;
  order: number;
}

export interface Education {
  id: string;
  institution: string;
  program: LocalizedString;
  period: string;
  focusAreas: LocalizedList;
  order: number;
}

export interface SkillGroup {
  id: string;
  title: LocalizedString;
  skills: string[];
  order: number;
}

export interface LanguageItem {
  id: string;
  name: LocalizedString;
  level: LocalizedString;
}

export interface SiteSettings {
  brandName: string;
  editorName: string;
  editorTitle: LocalizedString;
  bioSummary: LocalizedString;
  location: string;
  phone: string;
  whatsappNumber: string;
  whatsappStarterMessage?: LocalizedString;
  contactEmail: string;
  linkedInUrl: string;
  instagramUrl?: string;
  xUrl?: string;
  youtubeUrl?: string;
  showreel: {
    enabled?: boolean;
    provider: VideoProvider;
    videoUrl: string;
    poster: string;
    title: LocalizedString;
    bunnyLibraryId?: string;
    bunnyVideoId?: string;
  };
  cvFiles: {
    en: string;
    fr: string;
  };
  heroHeadline?: LocalizedString;
  heroSubheadline?: LocalizedString;
  availableBadge?: LocalizedString;
  sectionsVisibility?: {
    hero?: boolean;
    showreel?: boolean;
    portfolio?: boolean;
    services?: boolean;
    about?: boolean;
    experience?: boolean;
    contact?: boolean;
  };
}

export interface PortfolioData {
  settings: SiteSettings;
  categories: Category[];
  folders?: Folder[];
  projects: Project[];
  services: Service[];
  experiences: WorkExperience[];
  education: Education[];
  skills: SkillGroup[];
  languages: LanguageItem[];
}
