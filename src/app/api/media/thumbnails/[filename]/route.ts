import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const EXT_TO_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

const SAFE_FILENAME_RE = /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp|svg)$/;

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  if (!filename || !SAFE_FILENAME_RE.test(filename)) {
    return NextResponse.json({ success: false, message: 'Invalid thumbnail path.' }, { status: 400 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = EXT_TO_MIME[ext];
  if (!contentType) {
    return NextResponse.json({ success: false, message: 'Unsupported media type.' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', 'thumbnails', filename);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ success: false, message: 'Thumbnail not found.' }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  const headers: Record<string, string> = {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'public, max-age=31536000, immutable',
  };

  if (ext === '.svg') {
    headers['Content-Security-Policy'] = "default-src 'none'; style-src 'unsafe-inline'; sandbox";
  }

  return new NextResponse(buffer, { status: 200, headers });
}

