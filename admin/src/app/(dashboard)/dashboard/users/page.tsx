import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "المستخدمون" };

/**
 * Stub for the "Users / RBAC" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (USERS_MANAGE) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function UsersRbacStubPage() {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">المستخدمون</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Users / RBAC) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `USERS_MANAGE`.
      </p>
    </div>
  );
}
