import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "مكتبة الميديا" };

/**
 * Stub for the "Media Library" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (MEDIA_VIEW) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function MediaLibraryStubPage() {
  await requirePermission(PERMISSIONS.MEDIA_VIEW);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">مكتبة الميديا</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Media Library) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `MEDIA_VIEW`.
      </p>
    </div>
  );
}
