import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { attendanceService } from "@/lib/services/attendance.service";

const notesSchema = z.object({ notes: z.string().max(2000) });

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.ATTENDANCE_VIEW);
  if (result instanceof NextResponse) return result;

  const record = await attendanceService.getByIdForAdmin(params.id);
  if (!record) return NextResponse.json({ error: "السجل غير موجود" }, { status: 404 });
  return NextResponse.json({ record });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.ATTENDANCE_MANAGE);
  if (result instanceof NextResponse) return result;

  const parsed = notesSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }

  const record = await attendanceService.updateNotes(params.id, parsed.data.notes, result.id);
  return NextResponse.json({ record });
}
