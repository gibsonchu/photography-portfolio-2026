import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getSiteContent, saveSiteContent } from "@/lib/data";
import type { SiteContent } from "@/lib/types";

export async function GET() {
  await requireAdmin();
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: Request) {
  await requireAdmin();
  const content = (await request.json()) as SiteContent;
  await saveSiteContent(content);
  return NextResponse.json({ ok: true });
}
