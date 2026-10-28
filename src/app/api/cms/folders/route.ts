import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioData, savePortfolioData } from '@/lib/cms-store';
import { Folder } from '@/types/portfolio';
import { verifyAdminRequest } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const data = getPortfolioData();
  const folders = (data.folders || []).sort((a, b) => a.order - b.order);
  return NextResponse.json({ success: true, folders });
}

export async function POST(req: NextRequest) {
  try {
    if (!verifyAdminRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin authentication required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const name = typeof body.name === 'string' ? body.name.trim() : body.name?.en?.trim();

    if (!name) {
      return NextResponse.json({ success: false, message: 'Folder name is required.' }, { status: 400 });
    }

    const data = getPortfolioData();
    data.folders = data.folders || [];

    let slug = body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug) slug = `folder-${Date.now()}`;

    // Collision check
    if (data.folders.some(f => f.id === slug || f.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newFolder: Folder = {
      id: slug,
      slug,
      name: {
        en: name,
        fr: (typeof body.name === 'object' && body.name?.fr) ? body.name.fr : name
      },
      description: {
        en: (typeof body.description === 'object' ? body.description?.en : body.description) || '',
        fr: (typeof body.description === 'object' ? body.description?.fr : body.description) || ''
      },
      coverImage: body.coverImage || '',
      order: typeof body.order === 'number' ? body.order : data.folders.length + 1
    };

    data.folders.push(newFolder);
    savePortfolioData(data);
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, folder: newFolder });
  } catch (err) {
    console.error('Error creating folder:', err);
    return NextResponse.json({ success: false, message: 'Failed to create folder.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!verifyAdminRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin authentication required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const data = getPortfolioData();
    data.folders = data.folders || [];

    // Support batch reorder: { reorderIds: string[] }
    if (Array.isArray(body.reorderIds)) {
      body.reorderIds.forEach((id: string, index: number) => {
        const folder = data.folders?.find(f => f.id === id || f.slug === id);
        if (folder) {
          folder.order = index + 1;
        }
      });
      savePortfolioData(data);
      revalidatePath('/', 'layout');
      return NextResponse.json({ success: true, folders: data.folders });
    }

    const folderId = body.id || body.slug;
    if (!folderId) {
      return NextResponse.json({ success: false, message: 'Folder ID is required.' }, { status: 400 });
    }

    const index = data.folders.findIndex(f => f.id === folderId || f.slug === folderId);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Folder not found.' }, { status: 404 });
    }

    const existing = data.folders[index];
    const name = typeof body.name === 'string' ? body.name.trim() : body.name?.en?.trim() || existing.name.en;

    data.folders[index] = {
      ...existing,
      name: {
        en: name,
        fr: (typeof body.name === 'object' && body.name?.fr) ? body.name.fr : (existing.name.fr || name)
      },
      description: {
        en: (typeof body.description === 'object' ? body.description?.en : body.description) ?? existing.description?.en ?? '',
        fr: (typeof body.description === 'object' ? body.description?.fr : body.description) ?? existing.description?.fr ?? ''
      },
      coverImage: body.coverImage !== undefined ? body.coverImage : existing.coverImage,
      order: typeof body.order === 'number' ? body.order : existing.order
    };

    savePortfolioData(data);
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, folder: data.folders[index] });
  } catch (err) {
    console.error('Error updating folder:', err);
    return NextResponse.json({ success: false, message: 'Failed to update folder.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!verifyAdminRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin authentication required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Folder ID is required.' }, { status: 400 });
    }

    const data = getPortfolioData();
    data.folders = data.folders || [];

    const filtered = data.folders.filter(f => f.id !== id && f.slug !== id);
    if (filtered.length === data.folders.length) {
      return NextResponse.json({ success: false, message: 'Folder not found.' }, { status: 404 });
    }

    // Move any projects inside this deleted folder to 'general'
    data.projects.forEach(p => {
      if (p.folderId === id) {
        p.folderId = 'general';
      }
    });

    data.folders = filtered;
    savePortfolioData(data);
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, message: 'Folder deleted successfully.' });
  } catch (err) {
    console.error('Error deleting folder:', err);
    return NextResponse.json({ success: false, message: 'Failed to delete folder.' }, { status: 500 });
  }
}
