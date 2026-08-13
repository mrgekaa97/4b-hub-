import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { homeManagementService } from "@/lib/services/homeManagement.service";
import { HomeEditor } from "@/components/home/HomeEditor";
import type { HomeContent } from "@/lib/validation/home.schema";

export const metadata = { title: "الصفحة الرئيسية" };

export default async function HomePageEditorPage() {
  await requirePermission(PERMISSIONS.HOME_MANAGE);
  const page = await homeManagementService.getDraft();

  const draftData = (page?.draftData ?? {}) as Record<string, unknown>;
  const initial = Object.keys(draftData).length === 0 ? undefined : (draftData as unknown as HomeContent);

  return (
    <div>
      <h1 className="mb-5 text-xl font-black">الصفحة الرئيسية</h1>
      <HomeEditor initial={initial} />
    </div>
  );
}
