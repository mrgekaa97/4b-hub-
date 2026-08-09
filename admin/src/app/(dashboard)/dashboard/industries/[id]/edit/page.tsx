import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { industryManagementService } from "@/lib/services/industryManagement.service";
import { IndustryForm } from "@/components/industries/IndustryForm";

export const metadata = { title: "تعديل قطاع" };

export default async function EditIndustryPage({ params }: { params: { id: string } }) {
  await requirePermission(PERMISSIONS.INDUSTRIES_MANAGE);
  const industry = await industryManagementService.get(params.id);
  if (!industry) notFound();

  return (
    <div>
      <h1 className="mb-5 text-xl font-black">تعديل قطاع: {industry.title}</h1>
      <IndustryForm
        mode="edit"
        industryId={industry.id}
        initial={{
          icon: industry.icon,
          title: industry.title,
          description: industry.description,
          sortOrder: industry.sortOrder,
        }}
      />
    </div>
  );
}
