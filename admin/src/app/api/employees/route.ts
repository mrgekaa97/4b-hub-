import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { employeeService, UsernameTakenError } from "@/lib/services/employee.service";

export async function GET() {
  const result = await requirePermissionApi(PERMISSIONS.EMPLOYEES_VIEW);
  if (result instanceof NextResponse) return result;

  const employees = await employeeService.list();
  return NextResponse.json({ employees });
}

export async function POST(req: NextRequest) {
  const result = await requirePermissionApi(PERMISSIONS.EMPLOYEES_MANAGE);
  if (result instanceof NextResponse) return result;

  const body = await req.json().catch(() => null);
  try {
    const employee = await employeeService.create(body, result.id);
    return NextResponse.json({ employee }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "بيانات غير صحيحة", issues: err.flatten() }, { status: 400 });
    }
    if (err instanceof UsernameTakenError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Employee create error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
