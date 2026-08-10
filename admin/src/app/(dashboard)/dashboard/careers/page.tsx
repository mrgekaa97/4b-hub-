import Link from "next/link";
import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { careerManagementService } from "@/lib/services/careerManagement.service";
import { Button } from "@/components/ui/Button";
import { CareerPostingsTable } from "@/components/careers/CareerPostingsTable";

export const metadata = { title: "الوظائف" };

export default async function CareersPage() {
  await requirePermission(PERMISSIONS.CAREERS_MANAGE);
  const careers = await careerManagementService.list();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">الوظائف</h1>
          <p className="text-sm text-[#9C978A]">
            إدارة الوظائف المعروضة في الموقع. الوظيفة تُنشأ كمسودة أولًا، ولا تظهر على الموقع إلا بعد النشر.
          </p>
        </div>
        <Link href="/dashboard/careers/new">
          <Button>+ إضافة وظيفة</Button>
        </Link>
      </div>

      <CareerPostingsTable
        careers={careers.map((c) => ({ id: c.id, title: c.title, type: c.type, status: c.status, isOpen: c.isOpen }))}
      />
    </div>
  );
}
