import { NextRequest, NextResponse } from 'next/server';
import {
  PutObjectCommand,
  ListObjectsV2Command,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  CompletedPart,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2Client, R2_FREE_TIER } from '@/lib/r2-client';
import { verifyAdminRequest } from '@/lib/auth';

/**
 * GET /api/video/r2/upload
 * Admin only:
 * - ?checkConfig=true -> returns whether R2 is configured and storage stats (estimated usage)
 */
export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized. Admin authentication required.' },
      { status: 401 }
    );
  }

  const r2 = getR2Client();
  const { searchParams } = new URL(req.url);

  if (searchParams.get('checkConfig') === 'true') {
    if (!r2) {
      return NextResponse.json({
        success: true,
        configured: false,
        bucketName: null,
        publicDomain: null,
        freeTier: R2_FREE_TIER,
        storageUsage: null,
      });
    }

    // Basic storage usage visibility from bucket objects
    let totalBytes = 0;
    let objectCount = 0;
    try {
      const listRes = await r2.client.send(
        new ListObjectsV2Command({
          Bucket: r2.config.bucketName,
          MaxKeys: 1000,
        })
      );
      if (listRes.Contents) {
        for (const item of listRes.Contents) {
          totalBytes += item.Size || 0;
          objectCount += 1;
        }
      }
    } catch (err) {
      console.warn('[R2 Usage Check] Failed to list bucket objects:', err);
    }

    const usedPercentage = Number(((totalBytes / R2_FREE_TIER.storageLimitBytes) * 100).toFixed(2));

    return NextResponse.json({
      success: true,
      configured: true,
      bucketName: r2.config.bucketName,
      publicDomain: r2.config.publicDomain || null,
      freeTier: R2_FREE_TIER,
      storageUsage: {
        totalBytes,
        totalMB: Number((totalBytes / (1024 * 1024)).toFixed(2)),
        totalGB: Number((totalBytes / (1024 * 1024 * 1024)).toFixed(3)),
        objectCount,
        limitGB: R2_FREE_TIER.storageLimitGB,
        usedPercentage,
        withinFreeTier: totalBytes <= R2_FREE_TIER.storageLimitBytes,
      },
    });
  }

  return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
}

export async function POST(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized. Admin authentication required.' },
      { status: 401 }
    );
  }

  const r2 = getR2Client();
  if (!r2) {
    return NextResponse.json(
      {
        success: false,
        code: 'R2_NOT_CONFIGURED',
        message: 'Cloudflare R2 is not configured. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in your environment variables.',
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'presign-put';

    // 1. Single PUT presigned URL for files up to 100MB
    if (action === 'presign-put') {
      const fileName = typeof body.fileName === 'string' ? body.fileName.trim() : '';
      const contentType = typeof body.contentType === 'string' ? body.contentType.trim() : 'video/mp4';

      if (!fileName) {
        return NextResponse.json({ success: false, message: 'fileName is required.' }, { status: 400 });
      }

      const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const safeKey = `videos/${Date.now()}-${cleanFileName}`;

      const command = new PutObjectCommand({
        Bucket: r2.config.bucketName,
        Key: safeKey,
        ContentType: contentType,
      });

      // 15-minute presigned upload window
      const uploadUrl = await getSignedUrl(r2.client, command, { expiresIn: 900 });

      return NextResponse.json({
        success: true,
        uploadUrl,
        key: safeKey,
        bucket: r2.config.bucketName,
        expiresInSeconds: 900,
        referenceUrl: `r2://${safeKey}`,
      });
    }

    // 2. Multipart Upload Start
    if (action === 'multipart-start') {
      const fileName = typeof body.fileName === 'string' ? body.fileName.trim() : '';
      const contentType = typeof body.contentType === 'string' ? body.contentType.trim() : 'video/mp4';

      if (!fileName) {
        return NextResponse.json({ success: false, message: 'fileName is required.' }, { status: 400 });
      }

      const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const safeKey = `videos/${Date.now()}-${cleanFileName}`;

      const createCommand = new CreateMultipartUploadCommand({
        Bucket: r2.config.bucketName,
        Key: safeKey,
        ContentType: contentType,
      });

      const multiRes = await r2.client.send(createCommand);

      return NextResponse.json({
        success: true,
        uploadId: multiRes.UploadId,
        key: safeKey,
      });
    }

    // 3. Multipart Part Presign
    if (action === 'multipart-part') {
      const key = typeof body.key === 'string' ? body.key.trim() : '';
      const uploadId = typeof body.uploadId === 'string' ? body.uploadId.trim() : '';
      const partNumber = Number(body.partNumber);

      if (!key || !uploadId || !partNumber || partNumber < 1) {
        return NextResponse.json({ success: false, message: 'key, uploadId, and partNumber are required.' }, { status: 400 });
      }

      const partCommand = new UploadPartCommand({
        Bucket: r2.config.bucketName,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
      });

      const partUploadUrl = await getSignedUrl(r2.client, partCommand, { expiresIn: 900 });

      return NextResponse.json({
        success: true,
        partUploadUrl,
        partNumber,
      });
    }

    // 4. Multipart Complete
    if (action === 'multipart-complete') {
      const key = typeof body.key === 'string' ? body.key.trim() : '';
      const uploadId = typeof body.uploadId === 'string' ? body.uploadId.trim() : '';
      const parts = Array.isArray(body.parts) ? (body.parts as CompletedPart[]) : [];

      if (!key || !uploadId || parts.length === 0) {
        return NextResponse.json({ success: false, message: 'key, uploadId, and parts are required.' }, { status: 400 });
      }

      const sortedParts = [...parts].sort((a, b) => (a.PartNumber || 0) - (b.PartNumber || 0));

      const completeCommand = new CompleteMultipartUploadCommand({
        Bucket: r2.config.bucketName,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: sortedParts,
        },
      });

      await r2.client.send(completeCommand);

      return NextResponse.json({
        success: true,
        key,
        referenceUrl: `r2://${key}`,
      });
    }

    // 5. Multipart Abort
    if (action === 'multipart-abort') {
      const key = typeof body.key === 'string' ? body.key.trim() : '';
      const uploadId = typeof body.uploadId === 'string' ? body.uploadId.trim() : '';

      if (key && uploadId) {
        try {
          await r2.client.send(
            new AbortMultipartUploadCommand({
              Bucket: r2.config.bucketName,
              Key: key,
              UploadId: uploadId,
            })
          );
        } catch {
          // ignore abort failures
        }
      }

      return NextResponse.json({ success: true });
    }

    // 6. Direct thumbnail image upload to R2
    if (action === 'upload-thumbnail') {
      const base64Data = typeof body.base64Data === 'string' ? body.base64Data : '';
      const fileName = typeof body.fileName === 'string' ? body.fileName : 'thumb.jpg';

      if (!base64Data) {
        return NextResponse.json({ success: false, message: 'base64Data is required.' }, { status: 400 });
      }

      const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(cleanBase64, 'base64');
      const safeKey = `thumbnails/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

      await r2.client.send(
        new PutObjectCommand({
          Bucket: r2.config.bucketName,
          Key: safeKey,
          Body: buffer,
          ContentType: 'image/jpeg',
        })
      );

      return NextResponse.json({
        success: true,
        key: safeKey,
        thumbnailUrl: `/api/video/r2/stream?key=${encodeURIComponent(safeKey)}`,
      });
    }

    return NextResponse.json({ success: false, message: 'Unrecognized action.' }, { status: 400 });
  } catch (err) {
    console.error('[R2 Upload Error]:', err);
    return NextResponse.json({ success: false, message: 'Failed to process R2 upload request.' }, { status: 500 });
  }
}

