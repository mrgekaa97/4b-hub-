import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "إضافة موظف" };

/**
 * Stub for the "Employees" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (EMPLOYEES_MANAGE) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function EmployeesStubPage() {
  await requirePermission(PERMISSIONS.EMPLOYEES_MANAGE);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">إضافة موظف</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Employees) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `EMPLOYEES_MANAGE`.
      </p>
    </div>
  );
}
