import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { verifyAdminRequest } from '@/lib/auth';

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

export async function POST(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized. Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'No image file provided.' },
        { status: 400 }
      );
    }

    const ext = MIME_TO_EXT[file.type.toLowerCase()];
    if (!ext) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unsupported image format. Please upload JPG, PNG, WebP, or SVG.',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, message: 'Image must be 4 MB or smaller.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = `thumb-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
    const targetDir = path.join(process.cwd(), 'public', 'uploads', 'thumbnails');

    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.writeFileSync(path.join(targetDir, safeName), buffer);
    } catch (fsErr) {
      console.error('[Thumbnail Upload] Filesystem write failed:', fsErr);
      return NextResponse.json(
        {
          success: false,
          code: 'READ_ONLY_FS',
          message:
            'This hosting environment does not allow local file writes. Paste a thumbnail image URL or Bunny CDN thumbnail instead.',
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      url: `/api/media/thumbnails/${safeName}`,
      size: file.size,
      mimeType: file.type,
    });
  } catch (err) {
    console.error('[Thumbnail Upload] Failed:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to process thumbnail upload.' },
      { status: 500 }
    );
  }
}

