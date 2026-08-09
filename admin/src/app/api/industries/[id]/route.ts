import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { industryManagementService } from "@/lib/services/industryManagement.service";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.INDUSTRIES_MANAGE);
  if (result instanceof NextResponse) return result;

  const industry = await industryManagementService.get(params.id);
  if (!industry) return NextResponse.json({ error: "القطاع غير موجود" }, { status: 404 });
  return NextResponse.json({ industry });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.INDUSTRIES_MANAGE);
  if (result instanceof NextResponse) return result;

  const body = await req.json().catch(() => null);
  try {
    const industry = await industryManagementService.update(params.id, body, result.id);
    return NextResponse.json({ industry });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "بيانات غير صحيحة", issues: err.flatten() }, { status: 400 });
    }
    console.error("Industry update error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.INDUSTRIES_MANAGE);
  if (result instanceof NextResponse) return result;

  await industryManagementService.delete(params.id, result.id);
  return NextResponse.json({ ok: true });
}
