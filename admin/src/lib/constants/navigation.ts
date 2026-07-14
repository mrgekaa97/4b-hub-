import { PERMISSIONS, type PermissionKey } from "@/lib/constants/permissions";

export interface NavItem {
  label: string;
  href: string;
  icon: string; // emoji for now — swap for lucide-react icons when the icon set is wired in
  permission: PermissionKey;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * One list, filtered per-request by the logged-in user's actual
 * permissions (see Sidebar.tsx) — this is what makes "Super Admin" and
 * "Operations Manager" feel like two different, purpose-built dashboards
 * while being the exact same code and the exact same route tree.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "نظرة عامة",
    items: [{ label: "عمليات اليوم", href: "/dashboard", icon: "📊", permission: PERMISSIONS.DASHBOARD_VIEW }],
  },
  {
    label: "الموظفون والمواقع",
    items: [
      { label: "الموظفون", href: "/dashboard/employees", icon: "👥", permission: PERMISSIONS.EMPLOYEES_VIEW },
      { label: "المواقع", href: "/dashboard/sites", icon: "📍", permission: PERMISSIONS.SITES_VIEW },
      { label: "الحضور", href: "/dashboard/attendance", icon: "🕐", permission: PERMISSIONS.ATTENDANCE_VIEW },
      { label: "الأجهزة الموثوقة", href: "/dashboard/devices", icon: "📱", permission: PERMISSIONS.DEVICES_VIEW },
    ],
  },
  {
    label: "الموقع الإلكتروني",
    items: [
      { label: "الصفحة الرئيسية", href: "/dashboard/home", icon: "🏠", permission: PERMISSIONS.HOME_MANAGE },
      { label: "من نحن", href: "/dashboard/about", icon: "ℹ️", permission: PERMISSIONS.ABOUT_MANAGE },
      { label: "الخدمات", href: "/dashboard/services", icon: "🛡️", permission: PERMISSIONS.SERVICES_MANAGE },
      { label: "القطاعات", href: "/dashboard/industries", icon: "🏢", permission: PERMISSIONS.INDUSTRIES_MANAGE },
      { label: "الوظائف", href: "/dashboard/careers", icon: "💼", permission: PERMISSIONS.CAREERS_MANAGE },
      { label: "آراء العملاء", href: "/dashboard/testimonials", icon: "💬", permission: PERMISSIONS.TESTIMONIALS_MANAGE },
      { label: "مكتبة الميديا", href: "/dashboard/media", icon: "🖼️", permission: PERMISSIONS.MEDIA_VIEW },
    ],
  },
  {
    label: "الطلبات",
    items: [
      { label: "طلبات عروض الأسعار", href: "/dashboard/quote-requests", icon: "📄", permission: PERMISSIONS.QUOTE_REQUESTS_VIEW },
      { label: "رسائل التواصل", href: "/dashboard/contact-messages", icon: "✉️", permission: PERMISSIONS.CONTACT_MESSAGES_VIEW },
      { label: "طلبات التوظيف", href: "/dashboard/job-applications", icon: "📋", permission: PERMISSIONS.JOB_APPLICATIONS_VIEW },
    ],
  },
  {
    label: "التقارير والنظام",
    items: [
      { label: "التقارير", href: "/dashboard/reports", icon: "📈", permission: PERMISSIONS.REPORTS_VIEW },
      { label: "إعدادات SEO", href: "/dashboard/settings/seo", icon: "🔍", permission: PERMISSIONS.SEO_SETTINGS_MANAGE },
      { label: "إعدادات الموقع", href: "/dashboard/settings/website", icon: "⚙️", permission: PERMISSIONS.WEBSITE_SETTINGS_MANAGE },
      { label: "المستخدمون", href: "/dashboard/users", icon: "🔑", permission: PERMISSIONS.USERS_MANAGE },
      { label: "سجل النشاط", href: "/dashboard/activity-log", icon: "🗂️", permission: PERMISSIONS.ACTIVITY_LOG_VIEW },
    ],
  },
];
