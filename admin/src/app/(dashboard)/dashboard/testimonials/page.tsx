import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "آراء العملاء" };

/**
 * Stub for the "Testimonials" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (TESTIMONIALS_MANAGE) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function TestimonialsStubPage() {
  await requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">آراء العملاء</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Testimonials) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `TESTIMONIALS_MANAGE`.
      </p>
    </div>
  );
}
