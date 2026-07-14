# Project Structure — 4 Brothers Security & Guarding

```
/
├── website/      الموقع العام (Public website — live, Version 1 Final)
├── admin/        4B HUB platform: Admin CMS + Employee Portal (single Next.js app — see note below)
├── shared/       المكونات والقيم المشتركة (Shared design tokens + icons)
├── database/     ملفات JSON مرجعية (reference data — the real datastore is now PostgreSQL, see admin/prisma)
├── uploads/      الملفات المرفوعة (Media files served by the website)
└── docs/         التوثيق (All project documentation)
```

> **Architecture note — Employee Portal folder location.** The original 4B HUB
> product brief listed `employee/` as a sibling folder to `admin/`. Once the
> PWA requirement ("reuse the same codebase" for the Employee Portal) and the
> Unified Login requirement (one `/login`, redirecting by role) were added,
> building the Employee Portal as its own separate app would have meant
> duplicating the Prisma client, the session/RBAC guards, and the design
> system wiring. Instead, it lives inside `admin/src/app/(employee)/` —
> a separate Next.js route group in the *same* app as the CMS, sharing one
> codebase, one database connection, and one deploy, exactly as the PWA
> section asked for. There is no top-level `employee/` folder in the
> repository; every place elsewhere in the docs that mentions one refers to
> this route group.

## `website/` — the public site (done, Version 1 Final)

Everything from the previously delivered Version 1 Final build: 7 static HTML pages, the design system CSS/JS, all image assets, `robots.txt`, `sitemap.xml`, `site.webmanifest`, and the `build.py`/`minify.py` scripts that generate the HTML from shared templates. **Nothing about the live site changed in this restructuring** — it was moved as-is, and `build.py`/`minify.py` were updated to use relative paths so they still work correctly from their new location.

To rebuild after any content edit:
```bash
cd website
python3 build.py
python3 minify.py
```

See `docs/WEBSITE_README.md` for full details on this folder.

## `admin/` — 4B HUB: Admin CMS + Employee Portal (Next.js + PostgreSQL + Prisma)

A single Next.js application serving three kinds of logged-in users through
one unified `/login`:

- **Super Admin** and **Operations Manager** (two RBAC roles over the same
  `/dashboard` route tree, differing only in which nav items/widgets their
  permissions unlock)
- **Employee** (guards/supervisors — a separate `Employee` identity table,
  not part of the admin RBAC system) → `/employee`

**Status: Authentication, Admin Dashboard shell, and the Employee Portal's
attendance screen are built and passing static QA (see
`docs/CHANGELOG.md`).** Remaining modules (Website Settings, Media Library,
Employees, Sites, Services/Industries/Careers CMS, Quote Requests, Contact
Messages, Reports) exist as permission-guarded stub pages, being built one
at a time in that order.

See `admin/README.md` for the full module list, how to run it locally
(`npm install`, Postgres connection, `prisma migrate`, `prisma db seed`,
`npm run dev`), and exactly what's real vs. stubbed right now.

## `shared/` — things both sides must agree on

- `design-tokens/tokens.css` — the canonical black & gold color/spacing/type values. The website keeps its own synced copy (for independent deployability); the admin dashboard should read this file directly. Run `shared/design-tokens/check-sync.py` after changing colors anywhere.
- `icons/icon-set.json` — the 17 inline SVG icons used across the site, extracted into one JSON registry so the CMS's icon pickers show the same icons as the live site.

## `database/` — the CMS's datastore

Plain JSON files, not a real database server — appropriate for a lightweight V1 CMS. Holds the site's real content (services, industries, careers, SEO text, settings, media registry) plus sample/demo data for Quote Requests and Contact Messages (see `database/README.md` for the important caveat about why those two are demo data, not live submissions, in Version 1).

## `uploads/` — files the website serves

`uploads/media/` currently holds the 14 real logo/favicon/icon files already in production use. See `uploads/README.md` for the current limitation around uploading genuinely *new* files through the CMS.

## `docs/` — all documentation, in one place

| File | What it covers |
|---|---|
| `PROJECT-STRUCTURE.md` | This file — the overall layout |
| `PROJECT_STATUS.md` | **Start here for current status** — completed modules, TODOs, limitations, V1.1 suggestions, deployment checklist, readiness score |
| `WEBSITE_README.md` | How the `website/` folder works, its design system, and known placeholders |
| `DEPLOYMENT.md` | How to host the public website |
| `ADMIN_DEPLOYMENT.md` | How to deploy the Next.js + PostgreSQL admin/employee app |
| `CHANGELOG.md` | Full history: website Version 1.0 → Version 1 Final, then 4B HUB Version 1.0 |
| `4Brothers_Project_Specification.docx` | The original 10-page project spec (brand identity, sitemap, UI/UX guidelines, tech stack, dev rules) |

`admin/README.md` will get its own changelog entries once the CMS build starts.

## Why this structure, and what didn't change

This reorganization is purely structural — every file that existed before still exists, with the same content, just grouped more clearly so the upcoming admin dashboard has an obvious home (`admin/`) and an obvious datastore (`database/`) without mixing them into the public site's own folder. The public website's behavior, design, and content are unchanged; `python3 build.py && python3 minify.py` inside `website/` produces byte-for-byte the same kind of output as before, just from its new location.
