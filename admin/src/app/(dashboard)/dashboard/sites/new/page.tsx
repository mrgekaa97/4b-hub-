import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { SiteForm } from "@/components/sites/SiteForm";

export const metadata = { title: "إضافة موقع" };

export default async function NewSitePage() {
  await requirePermission(PERMISSIONS.SITES_MANAGE);

  return (
    <div>
      <h1 className="mb-5 text-xl font-black">إضافة موقع جديد</h1>
      <SiteForm mode="create" />
    </div>
  );
}
