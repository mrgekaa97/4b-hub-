import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "إعدادات SEO" };

/**
 * Stub for the "SEO Settings" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (SEO_SETTINGS_MANAGE) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function SeoSettingsStubPage() {
  await requirePermission(PERMISSIONS.SEO_SETTINGS_MANAGE);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">إعدادات SEO</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (SEO Settings) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `SEO_SETTINGS_MANAGE`.
      </p>
    </div>
  );
}
