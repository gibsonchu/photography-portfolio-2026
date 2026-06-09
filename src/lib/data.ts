import { put, list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { defaultContent } from "./default-data";
import type { ImageAsset, Photo, SiteContent, StorageInfo, Submission } from "./types";

const localDataPath = path.join(process.cwd(), "data", "content.json");
const blobDataPath = "site-data/content.json";

function getBlobToken() {
  return process.env.PORTFOLIO_BLOB_READ_WRITE_TOKEN;
}

function hasBlob() {
  return Boolean(getBlobToken());
}

function isVercelRuntime() {
  return Boolean(process.env.VERCEL);
}

export function getStorageInfo(): StorageInfo {
  if (hasBlob()) {
    return {
      mode: "vercel-blob",
      durable: true,
      writable: true,
      message:
        `Using Vercel Blob for durable content metadata and uploaded images. Store ID: ${process.env.PORTFOLIO_BLOB_STORE_ID || "not provided"}. Webhook key: ${process.env.PORTFOLIO_BLOB_WEBHOOK_PUBLIC_KEY ? "configured" : "not provided"}.`,
    };
  }

  if (isVercelRuntime()) {
    return {
      mode: "local-file",
      durable: false,
      writable: false,
      message:
        "PORTFOLIO_BLOB_READ_WRITE_TOKEN is missing. Vercel cannot persist runtime file writes, so admin saves and uploads are disabled until the connected Portfolio Blob store is available to Production.",
    };
  }

  return {
    mode: "local-file",
    durable: false,
    writable: true,
    message:
      "Using local JSON and public/uploads for development. This survives local refreshes but not Vercel deploys or other devices.",
  };
}

function assertWritableStorage() {
  const storage = getStorageInfo();
  if (!storage.writable) {
    throw new Error(storage.message);
  }
}

function normalizeContent(content: SiteContent): SiteContent {
  return {
    ...content,
    homeIntro: content.homeIntro || defaultContent.homeIntro,
    aboutText: content.aboutText || defaultContent.aboutText,
    aboutPortrait: content.aboutPortrait || defaultContent.aboutPortrait,
    photos: content.photos || [],
    submissions: content.submissions || [],
    updatedAt: content.updatedAt,
  };
}

function sortContent(content: SiteContent): SiteContent {
  const normalized = normalizeContent(content);
  return {
    ...normalized,
    photos: [...normalized.photos].sort((a, b) => a.order - b.order),
    submissions: [...normalized.submissions].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    ),
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  if (hasBlob()) {
    const blobs = await list({
      prefix: blobDataPath,
      limit: 1,
      token: getBlobToken(),
    });
    const match = blobs.blobs.find((blob) => blob.pathname === blobDataPath);
    if (match) {
      const response = await fetch(match.url, { cache: "no-store" });
      if (response.ok) {
        return sortContent((await response.json()) as SiteContent);
      }
    }
    await saveSiteContent(defaultContent);
    return sortContent(defaultContent);
  }

  try {
    const file = await fs.readFile(localDataPath, "utf8");
    return sortContent(JSON.parse(file) as SiteContent);
  } catch {
    await saveSiteContent(defaultContent);
    return sortContent(defaultContent);
  }
}

export async function saveSiteContent(content: SiteContent) {
  assertWritableStorage();
  const normalized = sortContent({
    ...content,
    updatedAt: new Date().toISOString(),
  });
  if (hasBlob()) {
    await put(blobDataPath, JSON.stringify(normalized, null, 2), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      token: getBlobToken(),
    });
    return;
  }

  await fs.mkdir(path.dirname(localDataPath), { recursive: true });
  await fs.writeFile(localDataPath, JSON.stringify(normalized, null, 2));
}

export async function addSubmission(submission: Submission) {
  const content = await getSiteContent();
  await saveSiteContent({
    ...content,
    submissions: [submission, ...content.submissions],
  });
}

export async function uploadPhotoFile(file: File): Promise<Pick<Photo, "src" | "width" | "height">> {
  assertWritableStorage();
  if (hasBlob()) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
    const blob = await put(`photos/${Date.now()}-${safeName}`, file, {
      access: "public",
      token: getBlobToken(),
    });
    return { src: blob.url, width: 1600, height: 1067 };
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const filename = `${Date.now()}-${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir, filename), bytes);
  return { src: `/uploads/${filename}`, width: 1600, height: 1067 };
}

export async function uploadImageAsset(file: File, alt: string): Promise<ImageAsset> {
  const asset = await uploadPhotoFile(file);
  return {
    ...asset,
    alt,
  };
}

export function publicPhotos(content: SiteContent) {
  return content.photos.filter((photo) => photo.visible);
}

export function photosFor(content: SiteContent, category: string) {
  return publicPhotos(content).filter((photo) => photo.categories.includes(category as never));
}
