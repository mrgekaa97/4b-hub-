import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { siteService, SiteHasAssignedEmployeesError } from "@/lib/services/site.service";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.SITES_VIEW);
  if (result instanceof NextResponse) return result;

  const site = await siteService.get(params.id);
  if (!site) return NextResponse.json({ error: "الموقع غير موجود" }, { status: 404 });
  return NextResponse.json({ site });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.SITES_MANAGE);
  if (result instanceof NextResponse) return result;

  const body = await req.json().catch(() => null);
  try {
    const site = await siteService.update(params.id, body, result.id);
    return NextResponse.json({ site });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "بيانات غير صحيحة", issues: err.flatten() }, { status: 400 });
    }
    console.error("Site update error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.SITES_MANAGE);
  if (result instanceof NextResponse) return result;

  try {
    await siteService.delete(params.id, result.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof SiteHasAssignedEmployeesError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Site delete error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
