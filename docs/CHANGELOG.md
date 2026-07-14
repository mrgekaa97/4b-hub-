# Changelog — 4 Brothers Security & Guarding Website

## Version 1.0 Final — July 2026

### Added — Initial build
- 6 core pages: Home, About, Services, Industries, Careers, Contact.
- Dark luxury black & gold design system (design tokens, Cairo/IBM Plex Sans Arabic typography, four-pillar signature motif).
- RTL-first Arabic layout throughout.
- Shared, reusable navbar, footer, and button/card components across all pages.
- Working quote-request form (Contact) and application form (Careers) with client-side validation.
- FAQ accordions, testimonial carousel, animated statistics, scroll-reveal animations.
- Mobile-first responsive layout (tested at 375/768/1024/1440px).

### Added — Version 1.1 polish pass
- **Branding**: Replaced the placeholder shield mark with the official uploaded 4 Brothers eagle-crest logo, generated as a full asset set (nav/footer size, hero size, square crop, favicons at all standard sizes, PWA icons) in both PNG and WebP.
- **Logo placement**: Wired the real logo into the navbar, footer, browser favicon, loading screen, and a hero background watermark.
- **Loading screen**: Full-screen branded loading transition on every page (respects `prefers-reduced-motion`, with a safety timeout).
- **Back-to-top button**: Floating button, appears after scrolling, smooth-scrolls to top; stacked above the WhatsApp button so both are reachable without overlap.
- **Home page**: Added a "Why Choose 4 Brothers" visual card section, a "How We Work" timeline component, an "Our Clients" section (placeholder logos, clearly labeled as such pending real client logos), and strengthened hero CTAs (primary "Request a Quote" + a direct "Call Now" action).
- **Services page**: Every one of the 9 services now has its own full detail section (anchor-linked, with an includes checklist and its own "Request This Service" button), plus a quick-jump nav at the top of the page.
- **Careers page**: Expanded benefits to 6 cards, added a 5-step recruitment process timeline, added a careers-specific FAQ section.
- **Contact page**: Added an inline WhatsApp CTA button, a 24/7 emergency contact band, a styled Google Maps placeholder (see `DEPLOYMENT.md` §5 to activate the live embed), and restructured the quote form into labeled sections with a visual progress indicator for clearer UX.
- **SEO**: Per-page canonical URLs, complete Open Graph + Twitter Card tags, JSON-LD `SecurityService` structured data on every page, `robots.txt`, `sitemap.xml`, and `site.webmanifest`.
- **Accessibility**: Skip-to-content link, `aria-label`s on all icon-only controls, `alt` text on every image, visible focus states on all interactive elements, and every form label now programmatically associated with its input via matching `id`/`for` pairs.
- **Performance**: Minified CSS/JS (`styles.min.css`, `main.min.js`) referenced by all live pages; all images given explicit `loading="eager"` or `loading="lazy"`; the large hero watermark image now serves a 48KB WebP to modern browsers instead of the original 608KB PNG; all PNG icon/logo assets re-compressed with palette reduction (roughly 50–60% smaller with no visible quality loss).
- **New page**: Added a minimal `privacy.html` so the footer's "Privacy Policy" link no longer points to a dead `#` anchor.

### Fixed
- A missing `<section>` opening tag on the Contact page (introduced mid-edit) that would have broken the quote form's placement in the DOM — caught by automated structural QA before shipping.
- Form labels were visually associated with their inputs but not programmatically (no `id`/`for` pairing) — fixed across both the Careers and Contact forms.
- Hero watermark and several icon assets were unnecessarily large (300–600KB) for decorative/small-display use — recompressed and switched to WebP-first delivery.

### QA performed before marking Version 1 Final
- Automated structural audit: balanced tags, no duplicate IDs, no broken in-page or cross-page anchors, every image has `alt` text, every form has client-side validation — all pages pass.
- Automated SEO audit: title length, meta description length/presence, canonical tag, complete Open Graph set, valid JSON-LD, single `<h1>` per page, `lang`/`dir` attributes — all pages pass.
- WCAG contrast audit on every text/background color combination in the design system — all combinations pass AA (ratios range from 6.3:1 to 17.4:1).
- Functional/interactive testing via automated browser (Playwright): loading screen dismiss, scroll-reveal animations, animated stat counters, back-to-top visibility/behavior, keyboard tab order and focus visibility, FAQ accordion toggle, mobile menu open/close, testimonial carousel, and both forms (empty-submit validation blocking + successful submit confirmation) — all verified working on both the Careers and Contact forms.
- Manual verification: `robots.txt`, `sitemap.xml` (valid XML, 7 URLs), and `site.webmanifest` (valid JSON, correct icon references) all confirmed correct.
- Responsive layout checked at mobile (390px), tablet (820px), and desktop (1440px) viewports across all 7 pages.

### Known limitations (see README §4 for the full list)
- English version of the site has not been built yet — Arabic RTL is the complete, shippable experience for V1.
- Several fields are still placeholders pending real company details: phone/WhatsApp number, email, office address, commercial registry/license numbers, client logos, social media URLs, and the live Google Maps embed.

---

## Version 1.0 — 4B HUB Platform (July 2026)

Scope expanded from "website + lightweight CMS" to the full **4B HUB** platform: corporate website (unchanged, see above) + Admin CMS + Employee Portal, sharing one Next.js application, one PostgreSQL database, and one design system.

### Added — Architecture foundation
- PostgreSQL + Prisma schema: 27 models covering RBAC (User/Role/Permission), Sessions, dynamic Settings (KV), Activity Log, Draft/Publish content revisions, Services/Industries/Careers/Testimonials, Media Assets, Quote Requests/Contact Messages/Job Applications, and the full Employee Portal domain (Employee, Device, Site, Shift, AttendanceRecord, Notification).
- Two hand-authored migrations (`20260707000000_init`, `20260709000000_employee_portal`, `20260710000000_job_applications`) — see each file's header for why they're hand-authored and how to verify/regenerate them against a live database.
- Repository/Service layered architecture: a generic `BaseContentRepository` (Draft/Publish + revision history, inherited by every content module) plus dedicated services for auth, settings, activity logging, notifications, dashboard aggregation, and attendance.
- RBAC foundation: a single permission registry (`lib/constants/permissions.ts`) with two seeded roles (Administrator, Operations Manager) and per-role default permission presets — designed so a third role is a data change, not a code change.
- Dynamic Form architecture: field-schema types + a runtime Zod schema builder, so a future ad-hoc form doesn't need a new migration.

### Added — Authentication
- Unified `/login` for Super Admin, Operations Manager, and Employee — one form, server-side dispatch decides which identity table matched and where to redirect.
- Server-side sessions (separate cookie namespaces for admin vs. employee) with brute-force lockout (5 failed attempts → 15-minute lock) on both identity types.
- Trusted Device flow for Employees: first login registers a device as `PENDING`; login is blocked (not silently allowed) until an admin approves it; every subsequent request re-checks device status, not just at login.

### Added — Admin Dashboard
- Reusable UI kit: Button, Input, FormField, Card, Table (responsive — stacks to cards on mobile), Modal, ConfirmDialog, Badge.
- Sidebar + Topbar + DashboardShell, with navigation filtered per-user by actual granted permissions (Super Admin and Operations Manager see different nav items from the same code).
- "Today's Operations" dashboard: 14 real widgets (attendance counts, site coverage, quote/message/application counts, attendance rate, etc.) backed by real Prisma queries, Quick Actions row, and a recent-activity feed. Widget Show/Hide is real and persisted (localStorage); drag-and-drop reordering and a server-persisted personal layout are explicitly deferred (see `WidgetGrid.tsx`).
- Unified Notification Center: one `Notification` model for both admin Users and Employees, a bell dropdown with unread count and mark-as-read, and a separate ephemeral Toast system for one-off "saved successfully" feedback (deliberately not conflated with persisted notifications).
- 22 permission-guarded stub pages covering every nav/quick-action destination, so nothing 404s while each module is built in turn.

### Added — Employee Portal
- One screen: current time, assigned site, current shift, last attendance, attendance status, GPS status, and trusted-device status — a single large Check In / Check Out button, per the "few seconds, no menus" requirement.
- GPS is classified (Inside/Near/Outside Site via Haversine distance vs. the site's configured radius), never used to block a check-in/out — an outside-radius event notifies admins instead.
- Client-side device fingerprint (stable per-browser, persisted via localStorage) sent with every login and attendance action.

### Fixed during QA
- A relation-pairing script (every `@relation("Name")` must appear on exactly two sides) was run after each schema extension specifically because an earlier mistake in this same build (the original `Setting.updatedBy` relation, missing its back-reference field on `User`) had already been caught and fixed once — the validator exists so that class of mistake gets caught immediately next time rather than only at `prisma generate` time.
- A stray unused import and an unnecessary `as any` cast were cleaned up in the dashboard page and unified-login module.
- Added `.gitignore`, `.eslintrc.json`, and `public/robots.txt` (`Disallow: /` — this app must never be indexed) to the admin app, which were missing.

### QA performed
- Static structural validation across all 79 TypeScript/TSX files: brace balance, every `@/` import resolves to a real file, every named import matches a real export, every `(dashboard)`/`(employee)` page calls a real auth guard.
- RBAC consistency check: every `PERMISSIONS.*` reference in code resolves to a key actually defined in the registry; every navigation/quick-action link resolves to a real page file.
- Compound unique-key consistency check between `schema.prisma` and the services that query by them (`employeeId_date`, `employeeId_fingerprint`).
- Accessibility spot-check: icon-only buttons carry `aria-label`; login form's labels are correctly associated with their inputs via matching `id`/`htmlFor`.
- N+1 query scan across all service files — none found; the dashboard's 8 metrics are fetched via `Promise.all`, not sequential awaits in a loop.

### Known limitations (see `docs/PROJECT_STATUS.md` for the full, current list)
- Never run against a real Node.js/npm/PostgreSQL environment — built and validated statically in a sandbox with no network or database access. Treat the first real `npm install && prisma migrate dev` as part of finishing this work, not as a formality.
- Most CMS modules (Employees, Sites, Shifts, Services/Industries/Careers CMS, Quote Requests, Contact Messages, Job Applications, Media Library, SEO/Website Settings, Reports, Users/Roles UI) are permission-guarded stub pages, not working CRUD yet.
- Late/overtime-minute calculation isn't wired (needs the Shifts module). PWA requirements (manifest, service worker, installability) are not yet built.
