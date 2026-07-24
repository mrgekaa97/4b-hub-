import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { serviceManagementService } from "@/lib/services/serviceManagement.service";
import { ServiceForm } from "@/components/services/ServiceForm";

export const metadata = { title: "تعديل خدمة" };

export default async function EditServicePage({ params }: { params: { id: string } }) {
  await requirePermission(PERMISSIONS.SERVICES_MANAGE);
  const service = await serviceManagementService.get(params.id);
  if (!service) notFound();

  return (
    <div>
      <h1 className="mb-5 text-xl font-black">تعديل خدمة: {service.title}</h1>
      <ServiceForm
        mode="edit"
        serviceId={service.id}
        initial={{
          slug: service.slug,
          icon: service.icon,
          title: service.title,
          summary: service.summary,
          includes: service.includes as string[],
          sortOrder: service.sortOrder,
        }}
      />
    </div>
  );
}
