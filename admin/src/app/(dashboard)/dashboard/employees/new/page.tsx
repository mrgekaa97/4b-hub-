import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { siteService } from "@/lib/services/site.service";
import { EmployeeForm } from "@/components/employees/EmployeeForm";

export const metadata = { title: "إضافة موظف" };

export default async function NewEmployeePage() {
  await requirePermission(PERMISSIONS.EMPLOYEES_MANAGE);
  const sites = await siteService.list();

  return (
    <div>
      <h1 className="mb-5 text-xl font-black">إضافة موظف جديد</h1>
      <EmployeeForm mode="create" sites={sites.map((s) => ({ id: s.id, name: s.name }))} />
    </div>
  );
}
