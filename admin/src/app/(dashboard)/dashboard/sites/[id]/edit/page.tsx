import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { siteService } from "@/lib/services/site.service";
import { SiteForm } from "@/components/sites/SiteForm";

export const metadata = { title: "تعديل موقع" };

export default async function EditSitePage({ params }: { params: { id: string } }) {
  await requirePermission(PERMISSIONS.SITES_MANAGE);
  const site = await siteService.get(params.id);
  if (!site) notFound();

  return (
    <div>
      <h1 className="mb-5 text-xl font-black">تعديل موقع: {site.name}</h1>
      <SiteForm
        mode="edit"
        siteId={site.id}
        initial={{
          name: site.name,
          clientName: site.clientName,
          address: site.address,
          latitude: site.latitude,
          longitude: site.longitude,
          allowedRadiusMeters: site.allowedRadiusMeters,
          isActive: site.isActive,
        }}
      />
    </div>
  );
}
