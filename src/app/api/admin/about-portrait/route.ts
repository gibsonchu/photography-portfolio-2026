import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getSiteContent,
  getStorageInfo,
  saveSiteContent,
  uploadImageAsset,
} from "@/lib/data";

export async function POST(request: Request) {
  await requireAdmin();
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Missing image file" }, { status: 400 });
    }

    const content = await getSiteContent();
    const alt = String(form.get("alt") || "Portrait of Gibson Chu");
    const aboutPortrait = await uploadImageAsset(file, alt);
    const nextContent = { ...content, aboutPortrait };
    await saveSiteContent(nextContent);

    return NextResponse.json({
      aboutPortrait,
      content: await getSiteContent(),
      storage: getStorageInfo(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to upload about portrait.",
        storage: getStorageInfo(),
      },
      { status: 500 },
    );
  }
}
