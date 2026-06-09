import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getSiteContent,
  getStorageInfo,
  saveSiteContent,
  uploadPhotoFile,
} from "@/lib/data";
import type { Category, Photo } from "@/lib/types";

export async function POST(request: Request) {
  await requireAdmin();
  try {
    const form = await request.formData();
    const files = form
      .getAll("files")
      .filter((value): value is File => value instanceof File);
    const category = String(form.get("category") || "Personal Projects") as Category;
    const content = await getSiteContent();
    const maxOrder = content.photos.reduce((max, photo) => Math.max(max, photo.order), 0);

    const uploaded: Photo[] = [];
    for (const [index, file] of files.entries()) {
      const asset = await uploadPhotoFile(file);
      uploaded.push({
        id: crypto.randomUUID(),
        title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        src: asset.src,
        width: asset.width,
        height: asset.height,
        caption: "",
        location: "",
        date: "",
        camera: "",
        filmStock: "",
        alt: `Photograph titled ${file.name}`,
        categories: [category],
        featured: false,
        hero: false,
        visible: true,
        order: maxOrder + index + 1,
      });
    }

    await saveSiteContent({ ...content, photos: [...content.photos, ...uploaded] });
    return NextResponse.json({
      photos: uploaded,
      content: await getSiteContent(),
      storage: getStorageInfo(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to upload photos.",
        storage: getStorageInfo(),
      },
      { status: 500 },
    );
  }
}
