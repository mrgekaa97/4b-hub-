import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { serviceManagementService, SlugTakenError } from "@/lib/services/serviceManagement.service";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.SERVICES_MANAGE);
  if (result instanceof NextResponse) return result;

  const service = await serviceManagementService.get(params.id);
  if (!service) return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 });
  return NextResponse.json({ service });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.SERVICES_MANAGE);
  if (result instanceof NextResponse) return result;

  const body = await req.json().catch(() => null);
  try {
    const service = await serviceManagementService.update(params.id, body, result.id);
    return NextResponse.json({ service });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "بيانات غير صحيحة", issues: err.flatten() }, { status: 400 });
    }
    if (err instanceof SlugTakenError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Service update error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.SERVICES_MANAGE);
  if (result instanceof NextResponse) return result;

  await serviceManagementService.delete(params.id, result.id);
  return NextResponse.json({ ok: true });
}
