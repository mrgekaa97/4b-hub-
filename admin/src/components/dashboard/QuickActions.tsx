import Link from "next/link";
import type { PermissionKey } from "@/lib/constants/permissions";
import { PERMISSIONS } from "@/lib/constants/permissions";

interface QuickAction {
  label: string;
  href: string;
  icon: string;
  permission: PermissionKey;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: "إضافة موظف", href: "/dashboard/employees/new", icon: "➕", permission: PERMISSIONS.EMPLOYEES_MANAGE },
  { label: "إضافة موقع", href: "/dashboard/sites/new", icon: "📍", permission: PERMISSIONS.SITES_MANAGE },
  { label: "إنشاء وظيفة شاغرة", href: "/dashboard/careers/new", icon: "💼", permission: PERMISSIONS.CAREERS_MANAGE },
  { label: "فتح الحضور", href: "/dashboard/attendance", icon: "🕐", permission: PERMISSIONS.ATTENDANCE_VIEW },
  { label: "طلبات عروض الأسعار", href: "/dashboard/quote-requests", icon: "📄", permission: PERMISSIONS.QUOTE_REQUESTS_VIEW },
  { label: "رسائل التواصل", href: "/dashboard/contact-messages", icon: "✉️", permission: PERMISSIONS.CONTACT_MESSAGES_VIEW },
  { label: "إدارة الموقع", href: "/dashboard/home", icon: "🌐", permission: PERMISSIONS.HOME_MANAGE },
  { label: "رفع ميديا", href: "/dashboard/media", icon: "🖼️", permission: PERMISSIONS.MEDIA_MANAGE },
];

export function QuickActions({ grantedPermissions }: { grantedPermissions: PermissionKey[] }) {
  const granted = new Set(grantedPermissions);
  const visible = QUICK_ACTIONS.filter((a) => granted.has(a.permission));

  if (visible.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {visible.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="flex items-center gap-2 rounded-md border border-[rgba(201,162,39,0.35)] bg-[#161514] px-3 py-2 text-sm font-bold text-[#F5F0E6] hover:border-[#C9A227] hover:text-[#C9A227]"
        >
          <span aria-hidden="true">{action.icon}</span>
          {action.label}
        </Link>
      ))}
    </div>
  );
}
