import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioData, savePortfolioData } from '@/lib/cms-store';
import { Project } from '@/types/portfolio';
import { verifyAdminRequest } from '@/lib/auth';
import { parseVideoUrl, normalizeVideoProvider } from '@/lib/video-utils';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    if (!verifyAdminRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin authentication required.' },
        { status: 401 }
      );
    }

    const payload: Partial<Project> = await req.json();

    const titleEn = typeof payload.title === 'string' ? payload.title : payload.title?.en;
    if (!titleEn || !titleEn.trim()) {
      return NextResponse.json({ success: false, message: 'Video title is required.' }, { status: 400 });
    }

    const videoUrl = (payload.videoUrl || '').trim();
    if (!videoUrl) {
      return NextResponse.json({ success: false, message: 'Video URL is required.' }, { status: 400 });
    }

    // Validate video URL
    const parsed = parseVideoUrl(videoUrl);
    if (!parsed.valid) {
      return NextResponse.json({ success: false, message: parsed.error || 'Invalid video URL.' }, { status: 400 });
    }

    const data = getPortfolioData();

    // Auto-generate slug if not provided
    let slug = payload.slug || titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug) slug = `video-${Date.now()}`;

    // Collision check: if slug exists, append timestamp
    if (data.projects.some(p => p.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const folderId = payload.folderId || 'general';
    const isFeatured = Boolean(payload.featured);

    // If marked as Best One for this folder, unset any other featured in the same folder
    if (isFeatured) {
      data.projects.forEach(p => {
        if (p.folderId === folderId) {
          p.featured = false;
        }
      });
    }

    const id = payload.id || `project-${Date.now()}`;

    // Determine thumbnail: use manually entered thumbnail, or auto YouTube thumbnail if available, or empty for fallback
    let thumbnail = (payload.thumbnail || '').trim();
    if (!thumbnail && parsed.thumbnailUrl) {
      thumbnail = parsed.thumbnailUrl;
    }

    const projectToSave: Project = {
      id,
      slug,
      title: {
        en: titleEn,
        fr: (typeof payload.title === 'object' && payload.title.fr) ? payload.title.fr : titleEn
      },
      shortDescription: {
        en: (typeof payload.shortDescription === 'object' ? payload.shortDescription.en : payload.shortDescription) || '',
        fr: (typeof payload.shortDescription === 'object' ? payload.shortDescription.fr : payload.shortDescription) || ''
      },
      folderId,
      categories: payload.categories || [folderId],
      tags: payload.tags || [],
      year: payload.year || new Date().getFullYear().toString(),
      client: payload.client || '',
      role: {
        en: payload.role?.en || 'Video Editor',
        fr: payload.role?.fr || 'Monteur Vidéo'
      },
      format: payload.format || (payload.aspectRatio === '9:16' ? '9:16 Vertical Reel' : '16:9 4K Video'),
      aspectRatio: payload.aspectRatio || '16:9',
      software: payload.software || ['Adobe Premiere Pro'],
      thumbnail,
      previewVideo: payload.previewVideo || '',
      videoProvider: normalizeVideoProvider(parsed.provider),
      videoUrl: parsed.directUrl || parsed.embedUrl || videoUrl,
      brief: {
        en: payload.brief?.en || '',
        fr: payload.brief?.fr || ''
      },
      creativeApproach: payload.creativeApproach || {},
      breakdowns: payload.breakdowns || [],
      results: payload.results || { metrics: [], description: { en: '', fr: '' } },
      editorsNotes: payload.editorsNotes || { note: { en: '', fr: '' }, detailThatMatters: { en: '', fr: '' } },
      featured: isFeatured,
      published: payload.published !== false,
      order: typeof payload.order === 'number' ? payload.order : data.projects.length + 1
    };

    data.projects.push(projectToSave);
    savePortfolioData(data);
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, project: projectToSave });
  } catch (err) {
    console.error('Error creating project:', err);
    return NextResponse.json({ success: false, message: 'Failed to create project.' }, { status: 500 });
  }
}
