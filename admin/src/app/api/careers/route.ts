import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { careerManagementService } from "@/lib/services/careerManagement.service";

export async function GET() {
  const result = await requirePermissionApi(PERMISSIONS.CAREERS_MANAGE);
  if (result instanceof NextResponse) return result;

  const careers = await careerManagementService.list();
  return NextResponse.json({ careers });
}

export async function POST(req: NextRequest) {
  const result = await requirePermissionApi(PERMISSIONS.CAREERS_MANAGE);
  if (result instanceof NextResponse) return result;

  const body = await req.json().catch(() => null);
  try {
    const career = await careerManagementService.create(body, result.id);
    return NextResponse.json({ career }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "بيانات غير صحيحة", issues: err.flatten() }, { status: 400 });
    }
    console.error("Career create error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
