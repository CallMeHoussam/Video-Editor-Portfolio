import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioDataAsync, savePortfolioDataAsync } from '@/lib/cms-store';
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

    const data = await getPortfolioDataAsync();
    const index = data.projects.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    const existing = data.projects[index];

    const envLibraryId = process.env.BUNNY_STREAM_LIBRARY_ID?.trim() || undefined;
    let provider = existing.videoProvider;
    let videoUrl = updates.videoUrl !== undefined ? updates.videoUrl : existing.videoUrl;
    let thumbnail = updates.thumbnail !== undefined ? updates.thumbnail : existing.thumbnail;
    let r2Key = updates.r2Key !== undefined ? updates.r2Key : existing.r2Key;
    const r2ThumbnailKey = updates.r2ThumbnailKey !== undefined ? updates.r2ThumbnailKey : existing.r2ThumbnailKey;
    let bunnyLibraryId = updates.bunnyLibraryId !== undefined ? updates.bunnyLibraryId : existing.bunnyLibraryId;
    let bunnyVideoId = updates.bunnyVideoId !== undefined ? updates.bunnyVideoId : existing.bunnyVideoId;

    if (updates.videoUrl && updates.videoUrl !== existing.videoUrl) {
      const parsed = parseVideoUrl(updates.videoUrl, updates.bunnyLibraryId || envLibraryId);
      if (!parsed.valid) {
        return NextResponse.json({ success: false, message: parsed.error || 'Invalid video URL.' }, { status: 400 });
      }
      provider = normalizeVideoProvider(parsed.provider);
      videoUrl = parsed.directUrl || parsed.embedUrl || updates.videoUrl;
      if (parsed.provider === 'r2') {
        r2Key = parsed.r2Key || r2Key;
      }
      if (parsed.provider === 'bunny') {
        bunnyLibraryId = parsed.libraryId || updates.bunnyLibraryId || envLibraryId;
        bunnyVideoId = parsed.bunnyVideoId || updates.bunnyVideoId;
      } else {
        bunnyLibraryId = undefined;
        bunnyVideoId = undefined;
      }
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
      r2Key,
      r2ThumbnailKey,
      bunnyLibraryId,
      bunnyVideoId,
      thumbnail: thumbnail || '',
      folderId: targetFolderId,
      categories: updates.categories || [targetFolderId || 'general']
    };

    await savePortfolioDataAsync(data);
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
    const data = await getPortfolioDataAsync();
    const filtered = data.projects.filter(p => p.id !== id);

    if (filtered.length === data.projects.length) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    data.projects = filtered;
    await savePortfolioDataAsync(data);
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    return NextResponse.json({ success: false, message: 'Failed to delete project' }, { status: 500 });
  }
}
