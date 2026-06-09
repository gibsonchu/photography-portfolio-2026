import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getSiteContent, getStorageInfo, saveSiteContent } from "@/lib/data";
import type { SiteContent } from "@/lib/types";

export async function GET() {
  await requireAdmin();
  return NextResponse.json({
    content: await getSiteContent(),
    storage: getStorageInfo(),
  });
}

export async function PUT(request: Request) {
  await requireAdmin();
  try {
    const content = (await request.json()) as SiteContent;
    await saveSiteContent(content);
    return NextResponse.json({
      ok: true,
      content: await getSiteContent(),
      storage: getStorageInfo(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Unable to save content.",
        storage: getStorageInfo(),
      },
      { status: 500 },
    );
  }
}
