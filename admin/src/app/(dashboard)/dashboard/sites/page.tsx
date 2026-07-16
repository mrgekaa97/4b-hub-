import Link from "next/link";
import { requirePermission } from "@/lib/auth/guard";
import { getUserPermissions } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { siteService } from "@/lib/services/site.service";
import { Button } from "@/components/ui/Button";
import { SitesTable } from "@/components/sites/SitesTable";

export const metadata = { title: "المواقع" };

export default async function SitesPage() {
  const user = await requirePermission(PERMISSIONS.SITES_VIEW);
  const permissions = await getUserPermissions(user.id);
  const canManage = permissions.has(PERMISSIONS.SITES_MANAGE);
  const sites = await siteService.list();

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">المواقع</h1>
          <p className="text-sm text-[#9C978A]">إدارة مواقع العملاء المتعاقدين — الحضور والانصراف يتم التحقق منه بناءً على إحداثيات كل موقع هنا.</p>
        </div>
        {canManage && (
          <Link href="/dashboard/sites/new">
            <Button>+ إضافة موقع</Button>
          </Link>
        )}
      </div>

      <SitesTable sites={sites} canManage={canManage} />
    </div>
  );
}
