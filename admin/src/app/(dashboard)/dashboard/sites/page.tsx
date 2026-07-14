import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "المواقع" };

/**
 * Stub for the "Sites" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (SITES_VIEW) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function SitesStubPage() {
  await requirePermission(PERMISSIONS.SITES_VIEW);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">المواقع</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Sites) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `SITES_VIEW`.
      </p>
    </div>
  );
}
