import { put, list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { defaultContent } from "./default-data";
import type { Photo, SiteContent, Submission } from "./types";

const localDataPath = path.join(process.cwd(), "data", "content.json");
const blobDataPath = "site-data/content.json";

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function sortContent(content: SiteContent): SiteContent {
  return {
    ...content,
    photos: [...content.photos].sort((a, b) => a.order - b.order),
    submissions: [...content.submissions].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    ),
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  if (hasBlob()) {
    const blobs = await list({ prefix: blobDataPath, limit: 1 });
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
  const normalized = sortContent(content);
  if (hasBlob()) {
    await put(blobDataPath, JSON.stringify(normalized, null, 2), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
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
  if (hasBlob()) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
    const blob = await put(`photos/${Date.now()}-${safeName}`, file, {
      access: "public",
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

export function publicPhotos(content: SiteContent) {
  return content.photos.filter((photo) => photo.visible);
}

export function photosFor(content: SiteContent, category: string) {
  return publicPhotos(content).filter((photo) => photo.categories.includes(category as never));
}
