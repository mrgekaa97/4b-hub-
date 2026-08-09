import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { IndustryForm } from "@/components/industries/IndustryForm";

export const metadata = { title: "إضافة قطاع" };

export default async function NewIndustryPage() {
  await requirePermission(PERMISSIONS.INDUSTRIES_MANAGE);

  return (
    <div>
      <h1 className="mb-5 text-xl font-black">إضافة قطاع جديد</h1>
      <IndustryForm mode="create" />
    </div>
  );
}
