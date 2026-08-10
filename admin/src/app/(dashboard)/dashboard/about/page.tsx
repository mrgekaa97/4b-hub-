import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { aboutManagementService } from "@/lib/services/aboutManagement.service";
import { AboutEditor } from "@/components/about/AboutEditor";
import type { AboutContent } from "@/lib/validation/about.schema";

export const metadata = { title: "من نحن" };

export default async function AboutPageEditorPage() {
  await requirePermission(PERMISSIONS.ABOUT_MANAGE);
  const page = await aboutManagementService.getDraft();

  const draftData = (page?.draftData ?? {}) as Record<string, unknown>;
  const initial = Object.keys(draftData).length === 0 ? undefined : (draftData as unknown as AboutContent);

  return (
    <div>
      <h1 className="mb-5 text-xl font-black">من نحن</h1>
      <AboutEditor initial={initial} />
    </div>
  );
}
