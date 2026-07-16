import Link from "next/link";
import { requirePermission } from "@/lib/auth/guard";
import { getUserPermissions } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { employeeService } from "@/lib/services/employee.service";
import { Button } from "@/components/ui/Button";
import { EmployeesTable } from "@/components/employees/EmployeesTable";

export const metadata = { title: "الموظفون" };

export default async function EmployeesPage() {
  const user = await requirePermission(PERMISSIONS.EMPLOYEES_VIEW);
  const permissions = await getUserPermissions(user.id);
  const canManage = permissions.has(PERMISSIONS.EMPLOYEES_MANAGE);
  const employees = await employeeService.list();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">الموظفون</h1>
          <p className="text-sm text-[#9C978A]">إدارة حسابات أفراد الأمن والمشرفين وربطهم بالمواقع.</p>
        </div>
        {canManage && (
          <Link href="/dashboard/employees/new">
            <Button>+ إضافة موظف</Button>
          </Link>
        )}
      </div>

      <EmployeesTable employees={employees} canManage={canManage} />
    </div>
  );
}
