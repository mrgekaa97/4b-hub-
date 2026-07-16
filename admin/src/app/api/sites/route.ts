import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { siteService } from "@/lib/services/site.service";

export async function GET() {
  const result = await requirePermissionApi(PERMISSIONS.SITES_VIEW);
  if (result instanceof NextResponse) return result;

  const sites = await siteService.list();
  return NextResponse.json({ sites });
}

export async function POST(req: NextRequest) {
  const result = await requirePermissionApi(PERMISSIONS.SITES_MANAGE);
  if (result instanceof NextResponse) return result;

  const body = await req.json().catch(() => null);
  try {
    const site = await siteService.create(body, result.id);
    return NextResponse.json({ site }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "بيانات غير صحيحة", issues: err.flatten() }, { status: 400 });
    }
    console.error("Site create error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
