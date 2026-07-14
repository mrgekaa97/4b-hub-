import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "طلبات التوظيف" };

/**
 * Stub for the "Job Applications" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (JOB_APPLICATIONS_VIEW) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function JobApplicationsStubPage() {
  await requirePermission(PERMISSIONS.JOB_APPLICATIONS_VIEW);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">طلبات التوظيف</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Job Applications) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `JOB_APPLICATIONS_VIEW`.
      </p>
    </div>
  );
}
