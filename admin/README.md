# admin/ — 4B HUB (Admin CMS + Employee Portal)

Next.js 14 (App Router) + TypeScript + PostgreSQL + Prisma. One application, one unified `/login`, serving three kinds of users — see `docs/PROJECT-STRUCTURE.md` for why the Employee Portal lives in here rather than a separate top-level folder.

## Status at a glance

See `docs/PROJECT_STATUS.md` for the authoritative, up-to-date module-by-module status. Summary: **Authentication, RBAC foundation, the Admin Dashboard shell (Today's Operations), and the Employee Portal's attendance screen are built.** Every other module (Employees, Sites, Services CMS, etc.) exists as a real, permission-guarded route that currently renders a "being built next" message instead of 404ing.

## Running this locally

```bash
cd admin
cp .env.example .env        # then fill in DATABASE_URL and SESSION_SECRET
npm install
npx prisma migrate dev      # applies prisma/migrations/* to your Postgres database
SEED_ADMIN_PASSWORD="a-real-temporary-password" npm run db:seed
npm run dev
```

Then visit `http://localhost:3000` — it redirects to `/login`. Log in with username `admin` and the password you set via `SEED_ADMIN_PASSWORD` (if you didn't set one, check the seed script's console output for a generated one-time password).

**This has not been run against a real Postgres database or `npm install`** — it was built in a sandboxed environment without network/database access. Every file was written to be correct and was validated statically (see `docs/PROJECT_STATUS.md` → Production Readiness). Running the commands above for the first time, for real, is expected to surface small issues a live environment catches that static review can't — budget time for that first real run before treating this as done-done.

## Folder map

```
admin/
├── prisma/
│   ├── schema.prisma              27 models — see file comments for design rationale
│   ├── seed.ts                    seeds RBAC, one admin user, and real content from ../database/*.json
│   └── migrations/                hand-authored (see each migration.sql's header comment on how to verify/regenerate properly)
├── src/
│   ├── app/
│   │   ├── (auth)/login/          unified login page
│   │   ├── (dashboard)/           Super Admin + Operations Manager — one shell, permission-filtered nav
│   │   ├── (employee)/employee/   the Employee Portal's one attendance screen
│   │   ├── api/                   route handlers (auth, attendance, notifications)
│   │   └── 403/                   shown when a logged-in user lacks permission for a page
│   ├── components/
│   │   ├── ui/                    Button, Input, FormField, Card, Table, Modal, ConfirmDialog, Badge — reused everywhere
│   │   ├── layout/                Sidebar, Topbar, DashboardShell
│   │   ├── notifications/         ToastProvider (ephemeral), NotificationBell (persisted Notification Center)
│   │   ├── dashboard/             StatWidget, WidgetGrid, QuickActions
│   │   ├── employee/              AttendanceCard, EmployeeLogoutButton
│   │   └── auth/                  LoginForm
│   └── lib/
│       ├── auth/                  password hashing, admin sessions, employee sessions, RBAC checks, page/API guards
│       ├── repositories/          base repository (Draft/Publish + revision history), settings repository
│       ├── services/              auth, employeeAuth, settings, activityLog, notification, dashboard, attendance
│       ├── dynamic-form/          field-schema types + Zod builder for future ad-hoc forms
│       ├── device/                UA parsing (server) + fingerprint computation (client)
│       └── constants/             permissions registry, navigation config, branding
└── public/robots.txt              Disallow: / — this app must never be indexed, it's a private platform
```

## Key architectural decisions (read before extending)

- **Two identity tables, one login.** Admin `User`/`Role`/RBAC is separate from `Employee`. `/api/auth/login` tries `User` first, then `Employee`, and returns where to redirect. See `src/lib/auth/unified-login.ts`.
- **Device trust only applies to Employees**, not admin Users — see the `Device` model's comment in `schema.prisma`. This was a deliberate scope call, not an oversight.
- **GPS classifies, never rejects.** `attendance.service.ts`'s `classifyLocation()` always returns `INSIDE_SITE` / `NEAR_SITE` / `OUTSIDE_SITE` and always lets the check-in/out through — `OUTSIDE_SITE` triggers an admin notification instead of a block.
- **"Active Contracts" and "Active Clients"** on the dashboard are computed from the `Site` model (no separate Contract entity — that would be ERP scope). Documented in `dashboard.service.ts`.
- **Late/overtime minutes are not yet computed** (`lateMinutes` etc. default to `0`) — that requires matching against the employee's assigned `Shift.startTime`, which needs the Shifts module's assignment UI to be meaningful. Flagged inline in `attendance.service.ts`.
- **Widget Show/Hide is real (localStorage); drag-and-drop reordering and a server-persisted personal layout are deferred** — see `WidgetGrid.tsx` comment for why (needs a small new `UserPreference` model, deliberately not rushed in).

## Non-goals (still true)

Not an ERP/CRM/payroll/accounting/inventory system. No contract lifecycle management. Keep additions aligned with: corporate website (already live) + lightweight CMS + lightweight employee attendance portal.
