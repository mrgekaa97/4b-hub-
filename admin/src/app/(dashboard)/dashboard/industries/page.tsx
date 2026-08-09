import Link from "next/link";
import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { industryManagementService } from "@/lib/services/industryManagement.service";
import { Button } from "@/components/ui/Button";
import { IndustriesTable } from "@/components/industries/IndustriesTable";

export const metadata = { title: "القطاعات" };

export default async function IndustriesPage() {
  await requirePermission(PERMISSIONS.INDUSTRIES_MANAGE);
  const industries = await industryManagementService.list();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">القطاعات</h1>
          <p className="text-sm text-[#9C978A]">
            إدارة القطاعات المعروضة في الموقع. القطاع يُنشأ كمسودة أولًا، ولا يظهر على الموقع إلا بعد النشر.
          </p>
        </div>
        <Link href="/dashboard/industries/new">
          <Button>+ إضافة قطاع</Button>
        </Link>
      </div>

      <IndustriesTable
        industries={industries.map((i) => ({ id: i.id, title: i.title, status: i.status, sortOrder: i.sortOrder }))}
      />
    </div>
  );
}
