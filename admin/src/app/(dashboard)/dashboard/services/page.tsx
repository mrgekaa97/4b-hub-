import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "الخدمات" };

/**
 * Stub for the "Services CMS" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (SERVICES_MANAGE) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function ServicesCmsStubPage() {
  await requirePermission(PERMISSIONS.SERVICES_MANAGE);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">الخدمات</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Services CMS) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `SERVICES_MANAGE`.
      </p>
    </div>
  );
}
