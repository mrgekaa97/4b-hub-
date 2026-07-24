import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { ServiceForm } from "@/components/services/ServiceForm";

export const metadata = { title: "إضافة خدمة" };

export default async function NewServicePage() {
  await requirePermission(PERMISSIONS.SERVICES_MANAGE);

  return (
    <div>
      <h1 className="mb-5 text-xl font-black">إضافة خدمة جديدة</h1>
      <ServiceForm mode="create" />
    </div>
  );
}
