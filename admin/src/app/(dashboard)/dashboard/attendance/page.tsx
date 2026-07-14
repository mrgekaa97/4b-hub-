import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "الحضور" };

/**
 * Stub for the "Attendance" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (ATTENDANCE_VIEW) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function AttendanceStubPage() {
  await requirePermission(PERMISSIONS.ATTENDANCE_VIEW);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">الحضور</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Attendance) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `ATTENDANCE_VIEW`.
      </p>
    </div>
  );
}
