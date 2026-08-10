import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { careerManagementService } from "@/lib/services/careerManagement.service";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.CAREERS_MANAGE);
  if (result instanceof NextResponse) return result;

  const career = await careerManagementService.get(params.id);
  if (!career) return NextResponse.json({ error: "الوظيفة غير موجودة" }, { status: 404 });
  return NextResponse.json({ career });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.CAREERS_MANAGE);
  if (result instanceof NextResponse) return result;

  const body = await req.json().catch(() => null);
  try {
    const career = await careerManagementService.update(params.id, body, result.id);
    return NextResponse.json({ career });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "بيانات غير صحيحة", issues: err.flatten() }, { status: 400 });
    }
    console.error("Career update error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.CAREERS_MANAGE);
  if (result instanceof NextResponse) return result;

  await careerManagementService.delete(params.id, result.id);
  return NextResponse.json({ ok: true });
}
