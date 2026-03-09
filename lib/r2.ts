/**
 * Cloudflare R2 client — S3-compatible storage for media, documents, etc.
 */
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, ""); // trim trailing slash

export function getR2Client(): S3Client | null {
  if (!accountId || !accessKeyId || !secretAccessKey) return null;
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export function getR2Bucket(): string | null {
  return bucketName ?? null;
}

export function getR2PublicUrl(key: string): string {
  const cleanKey = key.replace(/^\//, "");
  if (publicUrl) {
    return `${publicUrl}/${cleanKey}`;
  }
  return `/${cleanKey}`;
}

export function isR2Configured(): boolean {
  return !!(accountId && accessKeyId && secretAccessKey && bucketName);
}

export type UploadOptions = {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
  metadata?: Record<string, string>;
};

export async function uploadToR2(options: UploadOptions): Promise<string | null> {
  const client = getR2Client();
  const bucket = getR2Bucket();
  if (!client || !bucket) return null;

  const { key, body, contentType, metadata } = options;
  const bodyBuffer = typeof body === "string" ? Buffer.from(body, "utf-8") : body;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: bodyBuffer,
      ContentType: contentType ?? "application/octet-stream",
      Metadata: metadata,
    })
  );

  return getR2PublicUrl(key);
}

export async function deleteFromR2(key: string): Promise<boolean> {
  const client = getR2Client();
  const bucket = getR2Bucket();
  if (!client || !bucket) return false;

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
  return true;
}

/**
 * Generate a unique key for a file (e.g. media/images/abc123.jpg)
 */
export function generateFileKey(prefix: string, filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}/${safeName}${ext ? `.${ext}` : ""}`;
}
