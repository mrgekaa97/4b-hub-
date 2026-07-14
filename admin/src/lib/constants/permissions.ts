/**
 * RBAC permission registry.
 *
 * Every permission the CMS understands is declared here, ONCE, as a plain
 * string constant. Modules should never hardcode a permission string inline
 * (e.g. requirePermission("services.manage")) — they import it from here
 * (requirePermission(PERMISSIONS.SERVICES_MANAGE)) so a typo becomes a
 * compile error instead of a silent authorization hole.
 *
 * Version 1 ships with a single "administrator" role that holds every
 * permission below (see prisma/seed.ts). Version 2 can introduce a second
 * role (e.g. "editor") that only gets a subset, without touching this file
 * or any module code — only the seed/role-assignment data changes.
 */

export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard.view",

  // Content modules
  HOME_MANAGE: "home.manage",
  ABOUT_MANAGE: "about.manage",
  SERVICES_MANAGE: "services.manage",
  INDUSTRIES_MANAGE: "industries.manage",
  CAREERS_MANAGE: "careers.manage",
  JOB_APPLICATIONS_VIEW: "job_applications.view",
  JOB_APPLICATIONS_MANAGE: "job_applications.manage",
  TESTIMONIALS_MANAGE: "testimonials.manage",

  // Inbound requests
  QUOTE_REQUESTS_VIEW: "quote_requests.view",
  QUOTE_REQUESTS_MANAGE: "quote_requests.manage", // change status / delete
  CONTACT_MESSAGES_VIEW: "contact_messages.view",
  CONTACT_MESSAGES_MANAGE: "contact_messages.manage",

  // Media
  MEDIA_VIEW: "media.view",
  MEDIA_MANAGE: "media.manage",

  // Settings
  SEO_SETTINGS_MANAGE: "seo_settings.manage",
  WEBSITE_SETTINGS_MANAGE: "website_settings.manage",

  // System
  USERS_MANAGE: "users.manage",
  ROLES_MANAGE: "roles.manage",
  ACTIVITY_LOG_VIEW: "activity_log.view",

  // Employee Portal — administration side
  EMPLOYEES_VIEW: "employees.view",
  EMPLOYEES_MANAGE: "employees.manage",
  DEVICES_VIEW: "devices.view",
  DEVICES_MANAGE: "devices.manage", // approve/remove trusted devices
  SITES_VIEW: "sites.view",
  SITES_MANAGE: "sites.manage",
  SHIFTS_VIEW: "shifts.view",
  SHIFTS_MANAGE: "shifts.manage",
  ATTENDANCE_VIEW: "attendance.view",
  ATTENDANCE_MANAGE: "attendance.manage", // manual corrections/notes
  REPORTS_VIEW: "reports.view",
  NOTIFICATIONS_VIEW: "notifications.view",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** Grouped for the future "Roles" settings UI — not used by guards directly. */
export const PERMISSION_GROUPS: Record<string, PermissionKey[]> = {
  content: [
    PERMISSIONS.HOME_MANAGE,
    PERMISSIONS.ABOUT_MANAGE,
    PERMISSIONS.SERVICES_MANAGE,
    PERMISSIONS.INDUSTRIES_MANAGE,
    PERMISSIONS.CAREERS_MANAGE,
    PERMISSIONS.JOB_APPLICATIONS_VIEW,
    PERMISSIONS.JOB_APPLICATIONS_MANAGE,
    PERMISSIONS.TESTIMONIALS_MANAGE,
  ],
  requests: [
    PERMISSIONS.QUOTE_REQUESTS_VIEW,
    PERMISSIONS.QUOTE_REQUESTS_MANAGE,
    PERMISSIONS.CONTACT_MESSAGES_VIEW,
    PERMISSIONS.CONTACT_MESSAGES_MANAGE,
  ],
  media: [PERMISSIONS.MEDIA_VIEW, PERMISSIONS.MEDIA_MANAGE],
  settings: [PERMISSIONS.SEO_SETTINGS_MANAGE, PERMISSIONS.WEBSITE_SETTINGS_MANAGE],
  system: [PERMISSIONS.USERS_MANAGE, PERMISSIONS.ROLES_MANAGE, PERMISSIONS.ACTIVITY_LOG_VIEW],
  workforce: [
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.EMPLOYEES_MANAGE,
    PERMISSIONS.DEVICES_VIEW,
    PERMISSIONS.DEVICES_MANAGE,
    PERMISSIONS.SITES_VIEW,
    PERMISSIONS.SITES_MANAGE,
    PERMISSIONS.SHIFTS_VIEW,
    PERMISSIONS.SHIFTS_MANAGE,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MANAGE,
  ],
  reports: [PERMISSIONS.REPORTS_VIEW],
  notifications: [PERMISSIONS.NOTIFICATIONS_VIEW],
};

export const ALL_PERMISSIONS: PermissionKey[] = Object.values(PERMISSIONS);

/**
 * The two admin-side roles Version 1 ships with. "Employee" is intentionally
 * NOT a Role here — employees authenticate against the separate Employee
 * table (see prisma/schema.prisma comment on the Employee model) and don't
 * participate in this RBAC system at all; their portal access is just
 * "logged in as this employee" plus the isSupervisor flag for the one or
 * two supervisor-only affordances (e.g. seeing their site's team roster).
 */
export const SYSTEM_ROLES = {
  ADMINISTRATOR: "administrator",
  OPERATIONS_MANAGER: "operations_manager",
} as const;

/**
 * Default permission set granted to each system role at seed time.
 * Administrator gets everything. Operations Manager gets the day-to-day
 * running of the business (workforce, attendance, requests, reports) but
 * not the site-identity-level settings (Users/Roles, Website/SEO Settings)
 * — a deliberate default, easy to change later since it's just seed data,
 * not code.
 */
export const ROLE_PERMISSION_PRESETS: Record<string, PermissionKey[]> = {
  [SYSTEM_ROLES.ADMINISTRATOR]: ALL_PERMISSIONS,
  [SYSTEM_ROLES.OPERATIONS_MANAGER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    ...PERMISSION_GROUPS.workforce,
    ...PERMISSION_GROUPS.requests,
    PERMISSIONS.JOB_APPLICATIONS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW,
    PERMISSIONS.MEDIA_VIEW,
    PERMISSIONS.ACTIVITY_LOG_VIEW,
  ],
};
