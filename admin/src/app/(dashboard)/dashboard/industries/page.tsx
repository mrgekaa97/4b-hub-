import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "القطاعات" };

/**
 * Stub for the "Industries CMS" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (INDUSTRIES_MANAGE) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function IndustriesCmsStubPage() {
  await requirePermission(PERMISSIONS.INDUSTRIES_MANAGE);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">القطاعات</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Industries CMS) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `INDUSTRIES_MANAGE`.
      </p>
    </div>
  );
}
