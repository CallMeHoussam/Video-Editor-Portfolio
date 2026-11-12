import fs from 'fs';
import path from 'path';
import {
  PortfolioData,
  Project,
  Folder,
  SiteSettings,
  Category,
  Service,
  WorkExperience,
  Education,
  SkillGroup
} from '@/types/portfolio';
import { initialPortfolioData } from '@/data/initial-data';
import { loadPortfolioDataFromDb, savePortfolioDataToDb, getDbConfigStatus } from './persistent-db';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'portfolio-store.json');

// Memory cache for serverless environments where fs might be read-only
let memoryStore: PortfolioData | null = null;

const DEFAULT_FOLDERS: Folder[] = [
  {
    id: 'tucoso',
    slug: 'tucoso',
    name: { en: 'TUCOSO', fr: 'TUCOSO' },
    description: {
      en: 'High-CTR e-commerce & commercial video edits engineered for conversion.',
      fr: 'Montages publicitaires et e-commerce haute conversion.'
    },
    order: 1
  },
  {
    id: 'naza-agency',
    slug: 'naza-agency',
    name: { en: 'NAZA AGENCY', fr: 'AGENCE NAZA' },
    description: {
      en: 'Creative agency collaborations, brand spots, and performance campaigns.',
      fr: 'Collaborations agence, spots publicitaires et campagnes de performance.'
    },
    order: 2
  },
  {
    id: 'mama-rahik',
    slug: 'mama-rahik',
    name: { en: 'MAMA RAHIK', fr: 'MAMA RAHIK' },
    description: {
      en: 'Flagship product launch campaign with 100k+ organic views.',
      fr: 'Campagne de lancement produit ayant généré plus de 100 000 vues organiques.'
    },
    order: 3
  },
  {
    id: 'personal-projects',
    slug: 'personal-projects',
    name: { en: 'PERSONAL PROJECTS', fr: 'PROJETS PERSONNELS' },
    description: {
      en: 'Creative explorations, voice talent series, and kinetic experiments.',
      fr: 'Explorations créatives, séries voix off et expérimentations cinétiques.'
    },
    order: 4
  },
  {
    id: 'motion-graphics',
    slug: 'motion-graphics',
    name: { en: 'MOTION GRAPHICS', fr: 'MOTION DESIGN' },
    description: {
      en: 'Visual enhancements, kinetic typography, and animated overlays.',
      fr: 'Habillage visuel, typographie dynamique et incrustations animées.'
    },
    order: 5
  },
  {
    id: 'brand-films',
    slug: 'brand-films',
    name: { en: 'BRAND FILMS', fr: 'FILMS DE MARQUE' },
    description: {
      en: 'Cinematic corporate and architectural showcases.',
      fr: 'Films institutionnels et présentations architecturales cinématographiques.'
    },
    order: 6
  }
];

function ensureFoldersAndMigration(data: PortfolioData): PortfolioData {
  let needsSave = false;

  // Initialize folders if not present
  if (!data.folders || !Array.isArray(data.folders) || data.folders.length === 0) {
    data.folders = JSON.parse(JSON.stringify(DEFAULT_FOLDERS));
    needsSave = true;
  }

  // Ensure every project has a valid folderId pointing to an actual folder or 'general'
  const validFolderIds = new Set((data.folders || []).map((f) => f.id));
  data.projects.forEach(project => {
    const hasValidFolder = project.folderId === 'general' || (project.folderId && validFolderIds.has(project.folderId));
    if (!hasValidFolder) {
      if (project.slug.includes('mama-rahik') && validFolderIds.has('mama-rahik')) {
        project.folderId = 'mama-rahik';
      } else if (project.slug.includes('tucoso') && validFolderIds.has('tucoso')) {
        project.folderId = 'tucoso';
      } else if ((project.slug.includes('sidepark') || project.slug.includes('attijariwafa')) && validFolderIds.has('brand-films')) {
        project.folderId = 'brand-films';
      } else {
        const categoryAsFolder = project.categories?.find((c) => validFolderIds.has(c));
        project.folderId = categoryAsFolder || 'general';
      }
      needsSave = true;
    }
  });

  if (needsSave) {
    try {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // Ignore in read-only environments
    }
  }

  return data;
}

export function getPortfolioData(): PortfolioData {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(fileContent);
      const migrated = ensureFoldersAndMigration(parsed);
      memoryStore = migrated;
      return migrated;
    } else {
      // Initialize on disk for persistent zero-code editing
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const initial = JSON.parse(JSON.stringify(initialPortfolioData));
      const migrated = ensureFoldersAndMigration(initial);
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(migrated, null, 2), 'utf-8');
      memoryStore = migrated;
      return memoryStore;
    }
  } catch (err) {
    console.warn('[CMS Store] Failed to read data file, using default data:', err);
  }

  if (memoryStore) {
    return memoryStore;
  }
  // Fallback to initial data
  const fallback = JSON.parse(JSON.stringify(initialPortfolioData));
  memoryStore = ensureFoldersAndMigration(fallback);
  return memoryStore;
}

export async function getPortfolioDataAsync(): Promise<PortfolioData> {
  const dbStatus = getDbConfigStatus();
  if (dbStatus.isConfigured) {
    try {
      const dbData = await loadPortfolioDataFromDb();
      if (dbData) {
        const migrated = ensureFoldersAndMigration(dbData);
        memoryStore = migrated;
        return migrated;
      } else {
        // First run with persistent DB configured: seed it from existing local JSON store or initial data
        const localData = getPortfolioData();
        await savePortfolioDataToDb(localData);
        memoryStore = localData;
        return localData;
      }
    } catch (err) {
      console.warn('[CMS Store] Failed to load from persistent database, falling back to local store:', err);
    }
  }

  return getPortfolioData();
}

export async function savePortfolioDataAsync(data: PortfolioData): Promise<boolean> {
  memoryStore = data;

  const dbStatus = getDbConfigStatus();
  if (dbStatus.isConfigured) {
    try {
      await savePortfolioDataToDb(data);
    } catch (err) {
      console.error('[CMS Store] Failed to persist data to database:', err);
    }
  }

  return savePortfolioData(data);
}

export function savePortfolioData(data: PortfolioData): boolean {
  memoryStore = data;

  // Background sync to database if configured
  const dbStatus = getDbConfigStatus();
  if (dbStatus.isConfigured) {
    savePortfolioDataToDb(data).catch((err) => {
      console.error('[CMS Store Background Sync Error]:', err);
    });
  }

  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('[CMS Store] Failed to write data file to disk:', err);
    return true;
  }
}

// ==========================================
// FOLDER HELPERS
// ==========================================

export function getFolders(): Folder[] {
  const data = getPortfolioData();
  const folders = data.folders || [];
  return [...folders].sort((a, b) => a.order - b.order);
}

export function getFolderBySlug(slug: string): Folder | undefined {
  const folders = getFolders();
  return folders.find(f => f.slug === slug || f.id === slug);
}

/**
 * Returns only folders that contain at least one published video.
 * Do not display empty folders publicly.
 */
export function getPublishedFolders(): {
  folder: Folder;
  projects: Project[];
  bestOne: Project;
  count: number;
}[] {
  const folders = getFolders();
  const publishedProjects = getPublishedProjects();

  const results: {
    folder: Folder;
    projects: Project[];
    bestOne: Project;
    count: number;
  }[] = [];

  for (const folder of folders) {
    const folderProjects = publishedProjects.filter(p => p.folderId === folder.id || p.folderId === folder.slug);
    if (folderProjects.length > 0) {
      // Find Best One or default to the first published video in folder
      const bestOne = folderProjects.find(p => p.featured) || folderProjects[0];
      results.push({
        folder,
        projects: folderProjects,
        bestOne,
        count: folderProjects.length
      });
    }
  }

  return results;
}

export function getProjectsInFolder(folderId: string, onlyPublished = true): Project[] {
  const data = getPortfolioData();
  const projects = data.projects.filter(p => p.folderId === folderId);
  const filtered = onlyPublished ? projects.filter(p => p.published) : projects;
  return filtered.sort((a, b) => a.order - b.order);
}

export function getBestOneForFolder(folderId: string): Project | undefined {
  const folderProjects = getProjectsInFolder(folderId, true);
  if (folderProjects.length === 0) return undefined;
  // Look for featured, or sensible default (first published project)
  return folderProjects.find(p => p.featured) || folderProjects[0];
}

export function getGeneralProjects(onlyPublished = true): Project[] {
  const data = getPortfolioData();
  const projects = data.projects.filter(p => !p.folderId || p.folderId === 'general');
  const filtered = onlyPublished ? projects.filter(p => p.published) : projects;
  return filtered.sort((a, b) => a.order - b.order);
}

// ==========================================
// PROJECT HELPERS
// ==========================================

export function getPublishedProjects(): Project[] {
  const data = getPortfolioData();
  return data.projects
    .filter(p => p.published)
    .sort((a, b) => a.order - b.order);
}

export function getAllProjects(): Project[] {
  const data = getPortfolioData();
  return data.projects.sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  const data = getPortfolioData();
  return data.projects.find(p => p.slug === slug);
}

export function getRelatedProjects(currentProject: Project, limit = 3): Project[] {
  const all = getPublishedProjects().filter(p => p.id !== currentProject.id);

  // Score by shared folder, categories, or aspect ratio
  const scored = all.map(p => {
    let score = 0;
    if (p.folderId && currentProject.folderId && p.folderId === currentProject.folderId) {
      score += 5;
    }
    const sharedCategories = (p.categories || []).filter(c => (currentProject.categories || []).includes(c));
    score += sharedCategories.length * 3;

    if (p.aspectRatio === currentProject.aspectRatio) {
      score += 1;
    }

    return { project: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(item => item.project);
}

// ==========================================
// METADATA & SETTINGS HELPERS
// ==========================================

export function getCategories(): Category[] {
  const data = getPortfolioData();
  return (data.categories || []).sort((a, b) => a.order - b.order);
}

export function getServices(): Service[] {
  const data = getPortfolioData();
  return (data.services || []).sort((a, b) => a.order - b.order);
}

export function getExperiences(): WorkExperience[] {
  const data = getPortfolioData();
  return (data.experiences || []).sort((a, b) => a.order - b.order);
}

export function getEducation(): Education[] {
  const data = getPortfolioData();
  return (data.education || []).sort((a, b) => a.order - b.order);
}

export function getSkills(): SkillGroup[] {
  const data = getPortfolioData();
  return (data.skills || []).sort((a, b) => a.order - b.order);
}

export function getSiteSettings(): SiteSettings {
  const data = getPortfolioData();
  return data.settings;
}
