import { S3Client } from '@aws-sdk/client-s3';

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicDomain?: string;
  signingSecret?: string;
}

export function getR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucketName = process.env.R2_BUCKET_NAME?.trim();
  const publicDomain = process.env.R2_PUBLIC_DOMAIN?.trim();
  const signingSecret = process.env.R2_SIGNING_SECRET?.trim();

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    return null;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicDomain: publicDomain ? publicDomain.replace(/^https?:\/\//i, '').replace(/\/$/, '') : undefined,
    signingSecret,
  };
}

let cachedS3Client: { client: S3Client; accountId: string; accessKeyId: string } | null = null;

export function getR2Client(): { client: S3Client; config: R2Config } | null {
  const config = getR2Config();
  if (!config) return null;

  if (
    !cachedS3Client ||
    cachedS3Client.accountId !== config.accountId ||
    cachedS3Client.accessKeyId !== config.accessKeyId
  ) {
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });

    cachedS3Client = {
      client,
      accountId: config.accountId,
      accessKeyId: config.accessKeyId,
    };
  }

  return { client: cachedS3Client.client, config };
}

/**
 * Free-tier constants for Cloudflare R2 Standard Storage:
 * - 10 GB-month standard storage (10 * 1024 * 1024 * 1024 bytes)
 * - 1,000,000 Class A operations/month (PutObject, ListObjects, CreateMultipartUpload, etc.)
 * - 10,000,000 Class B operations/month (GetObject, HeadObject, etc.)
 * - Free egress bandwidth to internet
 */
export const R2_FREE_TIER = {
  storageLimitBytes: 10 * 1024 * 1024 * 1024, // 10 GB
  storageLimitGB: 10,
  classALimit: 1_000_000,
  classBLimit: 10_000_000,
} as const;

