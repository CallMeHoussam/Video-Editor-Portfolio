export interface BunnyUploadResult {
  videoId: string;
  libraryId: string;
  embedReference: string;
  thumbnailUrl?: string;
  aspectRatio?: '16:9' | '9:16';
  statusLabel?: string;
}

interface TusInitResponse {
  success: boolean;
  videoId?: string;
  libraryId?: string;
  expirationTime?: number;
  signature?: string;
  tusEndpoint?: string;
  embedReference?: string;
  thumbnailUrl?: string;
  message?: string;
}

function toBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function uploadChunkWithXhr(
  uploadUrl: string,
  chunk: Blob,
  offset: number,
  totalSize: number,
  headers: Record<string, string>,
  onProgress: (percent: number) => void
): Promise<number> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', uploadUrl, true);
    xhr.setRequestHeader('Tus-Resumable', '1.0.0');
    xhr.setRequestHeader('Upload-Offset', String(offset));
    xhr.setRequestHeader('Content-Type', 'application/offset+octet-stream');

    Object.entries(headers).forEach(([k, v]) => {
      xhr.setRequestHeader(k, v);
    });

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && totalSize > 0) {
        const uploadedBytes = Math.min(totalSize, offset + e.loaded);
        onProgress(Math.round((uploadedBytes / totalSize) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const nextOffsetHeader = xhr.getResponseHeader('Upload-Offset');
        const nextOffset = nextOffsetHeader ? parseInt(nextOffsetHeader, 10) : offset + chunk.size;
        resolve(Number.isFinite(nextOffset) ? nextOffset : offset + chunk.size);
      } else {
        reject(new Error(`Bunny upload chunk failed (${xhr.status}).`));
      }
    };

    xhr.onerror = () => reject(new Error('Network interruption while uploading to Bunny Stream.'));
    xhr.send(chunk);
  });
}

/**
 * Direct-to-Bunny Stream TUS upload using a short-lived SHA-256 signature issued
 * by /api/video/bunny/upload. BUNNY_STREAM_API_KEY never reaches the browser.
 */
export async function uploadVideoToBunnyTus(params: {
  file: File;
  title: string;
  onProgress?: (percent: number) => void;
  onStage?: (stage: string) => void;
}): Promise<BunnyUploadResult> {
  const { file, title, onProgress = () => {}, onStage = () => {} } = params;

  onStage('Requesting secure Bunny upload session...');
  const initRes = await fetch('/api/video/bunny/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });

  const initData: TusInitResponse = await initRes.json().catch(() => ({ success: false }));

  if (!initRes.ok || !initData.success || !initData.videoId || !initData.libraryId || !initData.signature || !initData.expirationTime) {
    throw new Error(initData.message || 'Could not start Bunny Stream upload session.');
  }

  const tusEndpoint = initData.tusEndpoint || 'https://video.bunnycdn.com/tusupload';
  const authHeaders: Record<string, string> = {
    AuthorizationSignature: initData.signature,
    AuthorizationExpire: String(initData.expirationTime),
    VideoId: initData.videoId,
    LibraryId: initData.libraryId,
  };

  onStage('Creating stream upload slot...');
  const createUploadRes = await fetch(tusEndpoint, {
    method: 'POST',
    headers: {
      'Tus-Resumable': '1.0.0',
      'Upload-Length': String(file.size),
      'Upload-Metadata': `title ${toBase64Utf8(title)}`,
      ...authHeaders,
    },
  });

  if (!createUploadRes.ok) {
    throw new Error(`Bunny TUS initialization failed (${createUploadRes.status}).`);
  }

  const location = createUploadRes.headers.get('Location');
  if (!location) {
    throw new Error('Bunny Stream did not return an upload Location header.');
  }

  const uploadUrl = new URL(location, tusEndpoint).toString();
  const chunkSize = 4 * 1024 * 1024; // 4 MB chunks
  let offset = 0;

  onStage('Uploading video to Bunny Stream...');
  while (offset < file.size) {
    const end = Math.min(file.size, offset + chunkSize);
    const slice = file.slice(offset, end);
    offset = await uploadChunkWithXhr(
      uploadUrl,
      slice,
      offset,
      file.size,
      authHeaders,
      onProgress
    );
  }

  onProgress(100);
  onStage('Verifying uploaded stream with Bunny...');

  const verifyRes = await fetch(
    `/api/video/bunny/upload?videoId=${encodeURIComponent(initData.videoId)}&libraryId=${encodeURIComponent(initData.libraryId)}`
  );
  const verifyData = await verifyRes.json().catch(() => null);

  return {
    videoId: initData.videoId,
    libraryId: initData.libraryId,
    embedReference:
      verifyData?.embedReference ||
      initData.embedReference ||
      `https://iframe.mediadelivery.net/embed/${initData.libraryId}/${initData.videoId}`,
    thumbnailUrl: verifyData?.thumbnailUrl || initData.thumbnailUrl || '',
    aspectRatio: verifyData?.aspectRatio === '9:16' ? '9:16' : '16:9',
    statusLabel: verifyData?.statusLabel || 'Uploaded',
  };
}

