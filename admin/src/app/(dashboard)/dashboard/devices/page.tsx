import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "الأجهزة الموثوقة" };

/**
 * Stub for the "Devices" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (DEVICES_VIEW) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function DevicesStubPage() {
  await requirePermission(PERMISSIONS.DEVICES_VIEW);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">الأجهزة الموثوقة</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Devices) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `DEVICES_VIEW`.
      </p>
    </div>
  );
}
