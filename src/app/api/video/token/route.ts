import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { videoId, libraryId, expirationSeconds = 3600 } = await req.json();

    if (!videoId) {
      return NextResponse.json({ success: false, message: 'Video ID is required' }, { status: 400 });
    }

    const tokenKey = process.env.BUNNY_STREAM_TOKEN_KEY;
    const defaultLibId = libraryId || process.env.BUNNY_STREAM_LIBRARY_ID || '';

    // If Bunny Stream token authentication is configured:
    if (tokenKey) {
      const expires = Math.floor(Date.now() / 1000) + expirationSeconds;
      const hashableBase = `${tokenKey}${videoId}${expires}`;
      const token = crypto.createHash('sha256').update(hashableBase).digest('hex');

      const embedUrl = defaultLibId
        ? `https://iframe.mediadelivery.net/embed/${defaultLibId}/${videoId}?token=${token}&expires=${expires}&autoplay=false`
        : `https://iframe.mediadelivery.net/embed/${videoId}?token=${token}&expires=${expires}&autoplay=false`;

      return NextResponse.json({
        success: true,
        protected: true,
        token,
        expires,
        embedUrl,
        message: 'Signed Bunny Stream playback token generated successfully'
      });
    }

    // Fallback when tokenKey is not set yet in environment
    const publicEmbedUrl = defaultLibId
      ? `https://iframe.mediadelivery.net/embed/${defaultLibId}/${videoId}?autoplay=false`
      : `https://iframe.mediadelivery.net/embed/${videoId}?autoplay=false`;

    return NextResponse.json({
      success: true,
      protected: false,
      token: null,
      expires: null,
      embedUrl: publicEmbedUrl,
      message: 'Running in standard embed mode. To enable signed token protection, configure BUNNY_STREAM_TOKEN_KEY in .env.local.'
    });
  } catch (err) {
    console.error('Error generating video token:', err);
    return NextResponse.json({ success: false, message: 'Error generating video token' }, { status: 500 });
  }
}
