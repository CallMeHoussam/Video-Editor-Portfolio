import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioData, savePortfolioData } from '@/lib/cms-store';
import { Project } from '@/types/portfolio';
import { verifyAdminRequest } from '@/lib/auth';
import { parseVideoUrl, normalizeVideoProvider } from '@/lib/video-utils';
import { revalidatePath } from 'next/cache';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdminRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin authentication required.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const updates: Partial<Project> = await req.json();

    const data = getPortfolioData();
    const index = data.projects.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    const existing = data.projects[index];

    // If video URL changed, validate it
    let provider = existing.videoProvider;
    let videoUrl = updates.videoUrl !== undefined ? updates.videoUrl : existing.videoUrl;
    let thumbnail = updates.thumbnail !== undefined ? updates.thumbnail : existing.thumbnail;

    if (updates.videoUrl && updates.videoUrl !== existing.videoUrl) {
      const parsed = parseVideoUrl(updates.videoUrl);
      if (!parsed.valid) {
        return NextResponse.json({ success: false, message: parsed.error || 'Invalid video URL.' }, { status: 400 });
      }
      provider = normalizeVideoProvider(parsed.provider);
      videoUrl = parsed.directUrl || parsed.embedUrl || updates.videoUrl;
      if (!thumbnail && parsed.thumbnailUrl) {
        thumbnail = parsed.thumbnailUrl;
      }
    }

    const targetFolderId = updates.folderId !== undefined ? updates.folderId : existing.folderId;

    // Handle Best One toggle: if setting to true, clear any other featured video in this folder
    if (updates.featured === true) {
      data.projects.forEach(p => {
        if (p.id !== id && (p.folderId === targetFolderId || (!p.folderId && targetFolderId === 'general'))) {
          p.featured = false;
        }
      });
    }

    // Merge updates cleanly
    data.projects[index] = {
      ...existing,
      ...updates,
      id, // Preserve id
      videoUrl,
      videoProvider: provider,
      thumbnail: thumbnail || '',
      folderId: targetFolderId,
      categories: updates.categories || [targetFolderId || 'general']
    };

    savePortfolioData(data);
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, project: data.projects[index] });
  } catch (err) {
    console.error('Error updating project:', err);
    return NextResponse.json({ success: false, message: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdminRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin authentication required.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const data = getPortfolioData();
    const filtered = data.projects.filter(p => p.id !== id);

    if (filtered.length === data.projects.length) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    data.projects = filtered;
    savePortfolioData(data);
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    return NextResponse.json({ success: false, message: 'Failed to delete project' }, { status: 500 });
  }
}
