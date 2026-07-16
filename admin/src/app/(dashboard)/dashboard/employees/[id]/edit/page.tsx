import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { employeeService } from "@/lib/services/employee.service";
import { siteService } from "@/lib/services/site.service";
import { EmployeeForm } from "@/components/employees/EmployeeForm";

export const metadata = { title: "تعديل موظف" };

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  await requirePermission(PERMISSIONS.EMPLOYEES_MANAGE);
  const [employee, sites] = await Promise.all([employeeService.get(params.id), siteService.list()]);
  if (!employee) notFound();

  return (
    <div>
      <h1 className="mb-5 text-xl font-black">تعديل بيانات: {employee.fullName}</h1>
      <EmployeeForm
        mode="edit"
        employeeId={employee.id}
        sites={sites.map((s) => ({ id: s.id, name: s.name }))}
        initial={{
          fullName: employee.fullName,
          phone: employee.phone,
          email: employee.email ?? "",
          nationalId: employee.nationalId ?? "",
          isSupervisor: employee.isSupervisor,
          isActive: employee.isActive,
          assignedSiteId: employee.assignedSiteId ?? "",
        }}
      />
    </div>
  );
}
