import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { industryManagementService } from "@/lib/services/industryManagement.service";

export async function GET() {
  const result = await requirePermissionApi(PERMISSIONS.INDUSTRIES_MANAGE);
  if (result instanceof NextResponse) return result;

  const industries = await industryManagementService.list();
  return NextResponse.json({ industries });
}

export async function POST(req: NextRequest) {
  const result = await requirePermissionApi(PERMISSIONS.INDUSTRIES_MANAGE);
  if (result instanceof NextResponse) return result;

  const body = await req.json().catch(() => null);
  try {
    const industry = await industryManagementService.create(body, result.id);
    return NextResponse.json({ industry }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "بيانات غير صحيحة", issues: err.flatten() }, { status: 400 });
    }
    console.error("Industry create error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
