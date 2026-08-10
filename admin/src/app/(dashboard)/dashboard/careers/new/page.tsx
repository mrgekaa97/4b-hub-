import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { CareerPostingForm } from "@/components/careers/CareerPostingForm";

export const metadata = { title: "إضافة وظيفة" };

export default async function NewCareerPostingPage() {
  await requirePermission(PERMISSIONS.CAREERS_MANAGE);

  return (
    <div>
      <h1 className="mb-5 text-xl font-black">إضافة وظيفة جديدة</h1>
      <CareerPostingForm mode="create" />
    </div>
  );
}
