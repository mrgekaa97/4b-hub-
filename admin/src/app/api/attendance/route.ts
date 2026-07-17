import { NextRequest, NextResponse } from "next/server";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { attendanceService } from "@/lib/services/attendance.service";

export async function GET(req: NextRequest) {
  const result = await requirePermissionApi(PERMISSIONS.ATTENDANCE_VIEW);
  if (result instanceof NextResponse) return result;

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  const records = await attendanceService.listForAdmin({
    siteId: params.get("siteId") ?? undefined,
    status: status === "PRESENT" || status === "LATE" || status === "ABSENT" || status === "EARLY_LEAVE" ? status : undefined,
    dateFrom: params.get("dateFrom") ?? undefined,
    dateTo: params.get("dateTo") ?? undefined,
    outsideOnly: params.get("outsideOnly") === "true",
  });

  return NextResponse.json({ records });
}
