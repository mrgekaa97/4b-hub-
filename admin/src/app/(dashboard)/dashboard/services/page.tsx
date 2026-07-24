import Link from "next/link";
import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { serviceManagementService } from "@/lib/services/serviceManagement.service";
import { Button } from "@/components/ui/Button";
import { ServicesTable } from "@/components/services/ServicesTable";

export const metadata = { title: "الخدمات" };

export default async function ServicesPage() {
  await requirePermission(PERMISSIONS.SERVICES_MANAGE);
  const services = await serviceManagementService.list();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">الخدمات</h1>
          <p className="text-sm text-[#9C978A]">
            إدارة الخدمات المعروضة في الموقع. الخدمة تُنشأ كمسودة أولًا، ولا تظهر على الموقع إلا بعد النشر.
          </p>
        </div>
        <Link href="/dashboard/services/new">
          <Button>+ إضافة خدمة</Button>
        </Link>
      </div>

      <ServicesTable
        services={services.map((s) => ({ id: s.id, title: s.title, slug: s.slug, status: s.status, sortOrder: s.sortOrder }))}
      />
    </div>
  );
}
