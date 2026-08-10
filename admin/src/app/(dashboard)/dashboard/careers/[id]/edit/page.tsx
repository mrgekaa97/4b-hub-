import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { careerManagementService } from "@/lib/services/careerManagement.service";
import { CareerPostingForm } from "@/components/careers/CareerPostingForm";

export const metadata = { title: "تعديل وظيفة" };

export default async function EditCareerPostingPage({ params }: { params: { id: string } }) {
  await requirePermission(PERMISSIONS.CAREERS_MANAGE);
  const career = await careerManagementService.get(params.id);
  if (!career) notFound();

  return (
    <div>
      <h1 className="mb-5 text-xl font-black">تعديل وظيفة: {career.title}</h1>
      <CareerPostingForm
        mode="edit"
        careerId={career.id}
        initial={{
          title: career.title,
          type: career.type,
          description: career.description,
          requirements: career.requirements as string[],
          isOpen: career.isOpen,
        }}
      />
    </div>
  );
}
