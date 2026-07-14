import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "من نحن" };

/**
 * Stub for the "About Page Editor" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (ABOUT_MANAGE) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function AboutPageEditorStubPage() {
  await requirePermission(PERMISSIONS.ABOUT_MANAGE);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">من نحن</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (About Page Editor) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `ABOUT_MANAGE`.
      </p>
    </div>
  );
}
