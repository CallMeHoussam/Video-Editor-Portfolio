/**
 * Client-side video frame capture to JPEG base64
 * Extracts a frame at ~1.5s (or 20% into video) using HTML5 video and canvas.
 */
export async function captureVideoFrame(file: File, timeOffsetSeconds = 1.5): Promise<{
  base64Data: string;
  width: number;
  height: number;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
} | null> {
  if (typeof window === 'undefined') return null;

  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const fileUrl = URL.createObjectURL(file);
    video.src = fileUrl;

    let seeked = false;

    const cleanup = () => {
      URL.revokeObjectURL(fileUrl);
      video.remove();
    };

    video.onloadedmetadata = () => {
      const duration = video.duration || 10;
      const targetTime = Math.min(timeOffsetSeconds, Math.max(0.5, duration * 0.2));
      video.currentTime = targetTime;
    };

    video.onseeked = () => {
      if (seeked) return;
      seeked = true;

      try {
        const width = video.videoWidth || 1280;
        const height = video.videoHeight || 720;

        let aspectRatio: '16:9' | '9:16' | '1:1' | '4:5' = '16:9';
        const ratio = width / height;
        if (ratio < 0.65) {
          aspectRatio = '9:16';
        } else if (ratio < 0.9) {
          aspectRatio = '4:5';
        } else if (ratio < 1.15) {
          aspectRatio = '1:1';
        } else {
          aspectRatio = '16:9';
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.min(width, 1280);
        canvas.height = Math.round(canvas.width / ratio);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          resolve(null);
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Data = canvas.toDataURL('image/jpeg', 0.85);

        cleanup();
        resolve({
          base64Data,
          width,
          height,
          aspectRatio,
        });
      } catch {
        cleanup();
        resolve(null);
      }
    };

    video.onerror = () => {
      cleanup();
      resolve(null);
    };

    // 10s fallback timeout
    setTimeout(() => {
      if (!seeked) {
        cleanup();
        resolve(null);
      }
    }, 10000);
  });
}

export interface R2UploadProgress {
  percentage: number;
  stage: string;
}

/**
 * Uploads a local video file directly to Cloudflare R2 using presigned URLs.
 * Uses single PUT for files < 80MB, or multipart chunked upload for larger files.
 */
export async function uploadVideoToR2({
  file,
  onProgress,
  onStage,
}: {
  file: File;
  onProgress?: (percent: number) => void;
  onStage?: (stage: string) => void;
}): Promise<{
  key: string;
  referenceUrl: string;
  streamRouteUrl: string;
  size: number;
}> {
  const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB parts for multipart
  const isLarge = file.size > 80 * 1024 * 1024;

  if (!isLarge) {
    onStage?.('Requesting upload authorization...');
    onProgress?.(5);

    const initRes = await fetch('/api/video/r2/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'presign-put',
        fileName: file.name,
        contentType: file.type || 'video/mp4',
        fileSize: file.size,
      }),
    });

    const initData = await initRes.json();
    if (!initRes.ok || !initData.success) {
      throw new Error(initData.message || 'Failed to authorize R2 upload.');
    }

    onStage?.('Uploading directly to Cloudflare R2...');

    // Use XMLHttpRequest for live upload progress
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', initData.uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type || 'video/mp4');

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 90) + 5;
          onProgress?.(pct);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.(100);
          resolve();
        } else {
          reject(new Error(`R2 upload failed with HTTP status ${xhr.status}.`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during R2 upload.'));
      xhr.send(file);
    });

    return {
      key: initData.key,
      referenceUrl: initData.referenceUrl || `r2://${initData.key}`,
      streamRouteUrl: `/api/video/r2/stream?key=${encodeURIComponent(initData.key)}`,
      size: file.size,
    };
  }

  // Multipart upload for large files
  onStage?.('Initiating multipart R2 upload...');
  onProgress?.(2);

  const startRes = await fetch('/api/video/r2/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'multipart-start',
      fileName: file.name,
      contentType: file.type || 'video/mp4',
    }),
  });

  const startData = await startRes.json();
  if (!startRes.ok || !startData.success) {
    throw new Error(startData.message || 'Failed to initiate multipart R2 upload.');
  }

  const { uploadId, key } = startData;
  const totalParts = Math.ceil(file.size / CHUNK_SIZE);
  const completedParts: { PartNumber: number; ETag: string }[] = [];

  try {
    for (let i = 0; i < totalParts; i++) {
      const partNumber = i + 1;
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      onStage?.(`Uploading part ${partNumber} of ${totalParts}...`);

      const partPresignRes = await fetch('/api/video/r2/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'multipart-part',
          key,
          uploadId,
          partNumber,
        }),
      });

      const partData = await partPresignRes.json();
      if (!partPresignRes.ok || !partData.success) {
        throw new Error(`Failed to sign part ${partNumber}.`);
      }

      const etag = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', partData.partUploadUrl, true);
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const rawEtag = xhr.getResponseHeader('ETag') || '';
            resolve(rawEtag.replace(/"/g, ''));
          } else {
            reject(new Error(`Part ${partNumber} failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error(`Network error on part ${partNumber}`));
        xhr.send(chunk);
      });

      completedParts.push({ PartNumber: partNumber, ETag: etag });
      const overallPercent = Math.round(((i + 1) / totalParts) * 90) + 5;
      onProgress?.(overallPercent);
    }

    onStage?.('Finalizing video in Cloudflare R2...');

    const completeRes = await fetch('/api/video/r2/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'multipart-complete',
        key,
        uploadId,
        parts: completedParts,
      }),
    });

    const completeData = await completeRes.json();
    if (!completeRes.ok || !completeData.success) {
      throw new Error(completeData.message || 'Failed to complete multipart upload.');
    }

    onProgress?.(100);

    return {
      key,
      referenceUrl: completeData.referenceUrl || `r2://${key}`,
      streamRouteUrl: `/api/video/r2/stream?key=${encodeURIComponent(key)}`,
      size: file.size,
    };
  } catch (err) {
    // Abort on error
    fetch('/api/video/r2/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'multipart-abort',
        key,
        uploadId,
      }),
    }).catch(() => {});
    throw err;
  }
}

