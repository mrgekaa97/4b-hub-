import { redirect } from "next/navigation";
import { getSessionEmployee } from "@/lib/auth/employee-session";
import { BRANDING } from "@/lib/constants/branding";
import { EmployeeLogoutButton } from "@/components/employee/EmployeeLogoutButton";

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const employee = await getSessionEmployee();
  if (!employee) {
    redirect("/login");
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#0A0A0A] text-[#F5F0E6]">
      <header className="border-b border-[rgba(201,162,39,0.16)] px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="font-black text-[#C9A227]">{BRANDING.productName}</span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#9C978A]">{employee.fullName}</span>
            <EmployeeLogoutButton />
          </div>
        </div>
      </header>
      <div>{children}</div>
    </div>
  );
}
