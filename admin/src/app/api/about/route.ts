import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { aboutManagementService } from "@/lib/services/aboutManagement.service";

export async function PATCH(req: NextRequest) {
  const result = await requirePermissionApi(PERMISSIONS.ABOUT_MANAGE);
  if (result instanceof NextResponse) return result;

  const body = await req.json().catch(() => null);
  try {
    const page = await aboutManagementService.saveDraft(body, result.id);
    return NextResponse.json({ page });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "بيانات غير صحيحة", issues: err.flatten() }, { status: 400 });
    }
    console.error("About save draft error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
