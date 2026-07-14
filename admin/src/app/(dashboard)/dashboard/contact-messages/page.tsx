import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";

export const metadata = { title: "رسائل التواصل" };

/**
 * Stub for the "Contact Messages" module — implemented in its own turn per the
 * agreed build order. This page already enforces the real permission
 * (CONTACT_MESSAGES_VIEW) so RBAC is demonstrably working on every nav destination,
 * not just the pages that happen to be built first.
 */
export default async function ContactMessagesStubPage() {
  await requirePermission(PERMISSIONS.CONTACT_MESSAGES_VIEW);

  return (
    <div>
      <h1 className="mb-2 text-xl font-black">رسائل التواصل</h1>
      <p className="text-sm text-[#9C978A]">
        هذه الوحدة (Contact Messages) قيد الإنشاء ضمن الترتيب المتفق عليه. الوصول محمي بالفعل بصلاحية `CONTACT_MESSAGES_VIEW`.
      </p>
    </div>
  );
}
