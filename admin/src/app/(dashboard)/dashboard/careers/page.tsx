import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "الوظائف" };

/**
 * Stub for the "Careers CMS" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (CAREERS_MANAGE) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function CareersCmsStubPage() {
  await requirePermission(PERMISSIONS.CAREERS_MANAGE);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">الوظائف</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Careers CMS) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `CAREERS_MANAGE`.
      </p>
    </div>
  );
}
