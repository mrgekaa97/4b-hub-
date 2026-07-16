import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { employeeService, EmployeeHasAttendanceHistoryError } from "@/lib/services/employee.service";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.EMPLOYEES_VIEW);
  if (result instanceof NextResponse) return result;

  const employee = await employeeService.get(params.id);
  if (!employee) return NextResponse.json({ error: "الموظف غير موجود" }, { status: 404 });
  return NextResponse.json({ employee });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.EMPLOYEES_MANAGE);
  if (result instanceof NextResponse) return result;

  const body = await req.json().catch(() => null);
  try {
    const employee = await employeeService.update(params.id, body, result.id);
    return NextResponse.json({ employee });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "بيانات غير صحيحة", issues: err.flatten() }, { status: 400 });
    }
    console.error("Employee update error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.EMPLOYEES_MANAGE);
  if (result instanceof NextResponse) return result;

  try {
    await employeeService.delete(params.id, result.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof EmployeeHasAttendanceHistoryError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Employee delete error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
