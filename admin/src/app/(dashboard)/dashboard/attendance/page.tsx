import { requirePermission } from "@/lib/auth/guard";
import { getUserPermissions } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { attendanceService } from "@/lib/services/attendance.service";
import { siteService } from "@/lib/services/site.service";
import { AttendanceExplorer } from "@/components/attendance/AttendanceExplorer";

export const metadata = { title: "الحضور" };

export default async function AttendancePage() {
  const user = await requirePermission(PERMISSIONS.ATTENDANCE_VIEW);
  const permissions = await getUserPermissions(user.id);
  const canManage = permissions.has(PERMISSIONS.ATTENDANCE_MANAGE);

  const [records, sites] = await Promise.all([
    attendanceService.listForAdmin({}),
    siteService.list(),
  ]);

  const rows = records.map((r) => ({
    id: r.id,
    date: r.date.toISOString(),
    status: r.status,
    checkInAt: r.checkInAt?.toISOString() ?? null,
    checkOutAt: r.checkOutAt?.toISOString() ?? null,
    checkInLocationStatus: r.checkInLocationStatus,
    checkOutLocationStatus: r.checkOutLocationStatus,
    lateMinutes: r.lateMinutes,
    earlyLeaveMinutes: r.earlyLeaveMinutes,
    overtimeMinutes: r.overtimeMinutes,
    workDurationMinutes: r.workDurationMinutes,
    notes: r.notes,
    employee: r.employee,
    site: r.site,
    checkInAccuracyMeters: r.checkInAccuracyMeters,
    checkInMapsLink: r.checkInMapsLink,
    checkInDeviceName: r.checkInDeviceName,
    checkInBrowser: r.checkInBrowser,
    checkInOs: r.checkInOs,
    checkOutMapsLink: r.checkOutMapsLink,
  }));

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-black">الحضور</h1>
        <p className="text-sm text-[#9C978A]">سجلات حضور وانصراف الموظفين، مع تفاصيل الموقع الجغرافي والجهاز المستخدم لكل عملية.</p>
      </div>

      <AttendanceExplorer
        initialRecords={rows}
        sites={sites.map((s) => ({ id: s.id, name: s.name }))}
        canManage={canManage}
      />
    </div>
  );
}
