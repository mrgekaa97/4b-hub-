import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { serviceManagementService, SlugTakenError } from "@/lib/services/serviceManagement.service";

export async function GET() {
  const result = await requirePermissionApi(PERMISSIONS.SERVICES_MANAGE);
  if (result instanceof NextResponse) return result;

  const services = await serviceManagementService.list();
  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const result = await requirePermissionApi(PERMISSIONS.SERVICES_MANAGE);
  if (result instanceof NextResponse) return result;

  const body = await req.json().catch(() => null);
  try {
    const service = await serviceManagementService.create(body, result.id);
    return NextResponse.json({ service }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "بيانات غير صحيحة", issues: err.flatten() }, { status: 400 });
    }
    if (err instanceof SlugTakenError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Service create error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
