import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "الصفحة الرئيسية" };

/**
 * Stub for the "Home Page Editor" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (HOME_MANAGE) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function HomePageEditorStubPage() {
  await requirePermission(PERMISSIONS.HOME_MANAGE);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">الصفحة الرئيسية</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Home Page Editor) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `HOME_MANAGE`.
      </p>
    </div>
  );
}
