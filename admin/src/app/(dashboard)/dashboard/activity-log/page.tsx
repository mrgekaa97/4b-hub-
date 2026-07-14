import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "سجل النشاط" };

/**
 * Stub for the "Activity Log" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (ACTIVITY_LOG_VIEW) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function ActivityLogStubPage() {
  await requirePermission(PERMISSIONS.ACTIVITY_LOG_VIEW);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">سجل النشاط</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Activity Log) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `ACTIVITY_LOG_VIEW`.
      </p>
    </div>
  );
}
