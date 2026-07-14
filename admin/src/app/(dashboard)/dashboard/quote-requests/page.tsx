import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "طلبات عروض الأسعار" };

/**
 * Stub for the "Quote Requests" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (QUOTE_REQUESTS_VIEW) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function QuoteRequestsStubPage() {
  await requirePermission(PERMISSIONS.QUOTE_REQUESTS_VIEW);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">طلبات عروض الأسعار</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Quote Requests) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `QUOTE_REQUESTS_VIEW`.
      </p>
    </div>
  );
}
