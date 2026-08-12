# KNOWN_ISSUES.md — Public-Website Migration (deferred items)

Deferred technical items from the ongoing public-website migration into `admin/src/app/(public)`. Tracked here so they aren't lost before the app goes to hosting. Not a full module-status log — see `ai/03A_MODULE_STATUS.md` for overall migration progress.

---

## 1. `uploads/` image serving

**What it is:** Public-site images (logos, favicons, future CMS media) have no real serving mechanism from the Next.js admin app. The repo-root `uploads/media/` folder isn't reachable at any URL the app serves.

**Why deferred:** Decided to serve public-site images from Supabase Storage, but that work is deferred until the app is actually deployed to hosting. No Supabase Storage SDK or bucket exists yet in this project — this belongs to the future Media Library module (the `MediaAsset` Prisma model already exists but isn't wired to any UI/API yet).

**Current temporary state:** Needed images are manually copied file-by-file into `admin/public/uploads/media/` as each page/section is migrated (started in Task #5 for the Hero's logo images).

**Real fix:** Provision a Supabase Storage bucket, wire it to the `MediaAsset` model (upload flow + public URL resolution), point migrated page markup at Storage URLs, then delete the manual copies under `admin/public/uploads/media/`.

---

## 2. Manual image copies in `admin/public/uploads/media/`

**What it is:** A hand-copied subset of `uploads/media/` living inside the Next.js app's static `public/` folder.

**Why deferred:** Stopgap introduced in Task #5 to make the migrated Hero's `<img>`/`<source>` tags resolve, since no real image-serving path existed (see item 1).

**Current temporary state:** Contains only the 4 files needed by the Hero so far (`logo-wide.png/webp`, `logo-nav.png/webp`). Not synced with the source-of-truth `uploads/media/` — will grow as more sections/pages are migrated, and will silently go stale if the root copies change.

**Real fix:** Remove this directory once item 1 (Supabase Storage) is implemented and migrated markup points at Storage URLs instead.

---

## 3. Favicon 404 on `/` — RESOLVED

**What it was:** The `(public)` route group had no favicon configured, so `/` and other public routes requested a favicon that didn't exist — browser tab showed a broken/default icon.

**Resolution:** The `(public)` favicon is now served via explicit `<link rel="icon">` tags added directly in `(public)/layout.tsx`'s JSX — `favicon.ico` (`sizes="any"`), `favicon-32.png`, `favicon-16.png`, and `apple-touch-icon.png` — pointing at `/uploads/media/`. The 4 asset files were copied from repo-root `uploads/media/` into `admin/public/uploads/media/`, the same temporary manual-copy workaround already used for the logo files in items 1/2 — to be superseded when the Supabase Storage migration lands. This approach was chosen over `metadata.icons` or a convention file because it reuses the same already-proven `(public)`-scoped `<link>` mechanism as `site.css`, keeping the favicon isolated to public routes only. Verified in-browser: the favicon shows correctly on public routes with no 404, and does **not** leak into `/login`, `/dashboard`, or `/employee`. `site.webmanifest` and its PWA icons (`icon-192`/`icon-512`) remain a separate, still-open concern, not addressed here.

---

## 4. Google Fonts loaded twice on `/`

**What it is:** The Cairo + IBM Plex Sans Arabic Google Fonts are loaded via two separate `@import` statements on public routes: once from `admin/src/app/globals.css` (always loaded, app-wide) and once from `admin/public/legacy/site.css` (loaded only on `(public)` routes via the scoped `<link>`).

**Why deferred:** Discovered as a byproduct of Task #5's CSS-isolation approach (site.css is a byte-verbatim copy of the legacy stylesheet, which has its own font `@import`). Not addressed because it's harmless.

**Current temporary state:** Browsers dedupe identical font requests by URL, so this causes no visible issue and no real performance cost beyond a redundant `@import` being parsed.

**Real fix:** Once the full public site is migrated and `site.css` is no longer needed as an opaque verbatim copy, consolidate font loading to a single source (likely `globals.css`, or a font strategy using `next/font`).

---

## 5. JavaScript interactions not yet migrated — RESOLVED

**What it was:** Only the scroll-reveal `IntersectionObserver` behavior had been ported (Task #7, as `(public)/_components/ScrollReveal.tsx`). The rest of `website/assets/js/main.js`'s interactive behaviors — stat counters, navbar scroll state, back-to-top, mobile menu toggle, testimonials slider, FAQ accordion, and client-side form validation — were still unmigrated and inert on the migrated `(public)` pages.

**Resolution:** All behaviors originally listed here are now migrated:
- Scroll-reveal (`IntersectionObserver`, fade/translate on scroll into view) → `ScrollReveal.tsx` (Task #7).
- Navbar scroll state (`.is-scrolled` toggle), mobile menu open/close (toggle + `aria-expanded` + body-scroll-lock), back-to-top visibility toggle + smooth-scroll-to-top → `NavbarBehavior.tsx` (Tasks #8/#10).
- FAQ accordion (single-open behavior, inline `max-height` calculated from `scrollHeight`, `aria-expanded` kept in sync) → `FaqAccordion.tsx`, mounted in `(public)/layout.tsx`.
- Testimonials carousel (dot generation, autoplay, pause-on-hover) → `TestimonialSlider.tsx`.
- Animated stat counters (`[data-count-to]` count-up on scroll, ease-out cubic, once-only via `unobserve`) → `StatCounters.tsx`.
- Client-side form validation (`form[data-validate]`) → ported inline into the `ApplicationForm` (Task #13) and `QuoteForm` (Task #14) components, rather than as a shared layout-level component, since it's form-specific logic rather than page-wide chrome behavior.

Common pattern across all of these (except form validation, which lives inside its own form component rather than the shared layout): each behavior is its own scoped `"use client"` component under `(public)/_components/`, mounted in `(public)/layout.tsx` alongside the others, using `usePathname` in its effect dependencies plus listener/observer cleanup so setup correctly re-runs after client-side navigation instead of only on a full page load (which is all the legacy script ever had to handle). All were verified in-browser.

---

## 6. Navbar links 404 until their pages are migrated

**What it is:** The navbar and mobile menu (migrated in Task #8) link to `/about`, `/services`, `/industries`, `/careers`, and `/contact` — the real future Next.js routes, not the legacy `.html` filenames. None of those pages exist yet under `(public)`.

**Why deferred:** Intentional and expected — links were remapped to their final destinations now rather than temporarily pointing at legacy filenames, so no second remapping pass is needed later. Migration is proceeding page-by-page.

**Current temporary state:** Clicking any nav link other than the homepage (`/`) 404s until that page is migrated.

**Real fix:** No fix needed — resolves naturally as each page (`/about`, `/services`, `/industries`, `/careers`, `/contact`) is migrated in its own task.

---

## 7. `.mobile-menu` desktop-visibility patch — deliberate deviation from "verbatim CSS"

**What it is:** The legacy `styles.css`/`site.css` only ever hides `.mobile-menu` inside `@media (max-width: 1180px)` — there is no base/default rule hiding it on wider viewports. At viewports above 1180px, `.mobile-menu` (6 links + a duplicate CTA + a duplicate language switch) rendered in normal document flow with no styling, visually overlapping the fixed `.navbar` sitting on top of it (surfaced as a bug during Task #8 review: duplicated CTA, scattered/overlapping nav content on desktop widths).

**Why deferred / why patched instead of reconciled:** This is a pre-existing gap in the legacy stylesheet itself, not something introduced by the migration — `admin/public/legacy/site.css` remains byte-identical to `website/assets/css/styles.min.css` (verified via diff). Per the standing rule established in Task #5, `site.css` must stay byte-for-byte verbatim, so the fix was applied as an addition in `(public)/layout.tsx` instead of editing the legacy file.

**Current temporary state:** `(public)/layout.tsx` includes an inline `<style>` block, immediately after the `site.css` `<link>`, adding:
```css
@media (min-width: 1181px) { .mobile-menu { display: none; } }
```
`1181px` is the exact complement of site.css's own `max-width: 1180px` breakpoint, so the two rules can never both match the same viewport — no cascade/specificity conflict. This is a **deliberate, documented deviation** from the "verbatim, no new CSS" approach used elsewhere in this migration.

**Real fix:** Correct this in the source stylesheet itself (add a base `.mobile-menu{display:none}` rule, or equivalent, to `website/assets/css/styles.css`/`styles.min.css`) if/when the legacy CSS is ever edited directly — at that point, remove the inline `<style>` patch from `(public)/layout.tsx` and re-copy the corrected file to `admin/public/legacy/site.css`.

---

## 8. Brand name ordering — deferred content preference, not a bug

**What it is:** A preference to display the brand name as "4 BROTHERS" (the "4" before "Brothers") and the corresponding Arabic ordering, instead of the current "BROTHERS 4" / "فور برذرز" ordering that was migrated verbatim from the legacy site.

**Why deferred:** This is a content/design preference, **not** a correction of a migration error — the currently-migrated value is intact and correct as-copied from the legacy source. Per Product Decision 006 (all public-site content is CMS-managed; admins don't edit HTML directly), this change belongs in the CMS as an editable content field, not as a hardcoded per-location markup edit. Deferred until Website Settings / CMS content management is implemented.

**Current temporary state:** The brand name is hardcoded verbatim (current ordering) wherever it appears in migrated markup — currently the navbar (`(public)/layout.tsx`) and Hero (`(public)/page.tsx`); will also apply to the footer and meta/OG tags once those are migrated.

**Real fix:** Once Website Settings / CMS content management exists, the brand name becomes an editable field there, updated centrally in one place — not by hunting down and editing every location it appears (navbar, hero, footer, meta/OG tags, etc.). At that point an admin can simply set the preferred ordering through the admin panel.

---

## 9. Shared footer + WhatsApp FAB + back-to-top — RESOLVED (Task #10)

**What it was:** The site footer, the WhatsApp floating action button, and the back-to-top button exist in every legacy page (`website/index.html`, `website/about.html`, etc.) but hadn't been migrated into `(public)/layout.tsx` yet. Only the navbar/mobile-menu were migrated there (Task #8).

**Resolution:** Migrated in Task #10 — the footer, WhatsApp FAB, and back-to-top button now render in `(public)/layout.tsx` (footer below `{children}`, FAB/back-to-top after it), verbatim markup, on every public page. Internal footer links remapped to real routes (`/about`, `/services`, `/industries`, `/careers`, `/contact`, `/contact#quote`, `/careers#apply`, `/privacy`); the WhatsApp link and the Facebook/LinkedIn `href="#"` placeholders were left exactly as in the legacy source. The back-to-top's scroll-visibility-toggle and smooth-scroll-to-top click handler were ported by extending the existing `NavbarBehavior.tsx` component (reusing its scroll listener) rather than a new component.

---

## 10. Active-nav-link highlighter — RESOLVED

**What it was:** Each legacy page ran its own small inline `<script>` (placed after `</html>`) that added `.is-active` to whichever `[data-nav]` link matched the current page's filename — this drives the gold underline on the current page's nav link (`.nav-links a.is-active` in `site.css`). That per-page filename approach didn't fit the single shared navbar in `(public)/layout.tsx`, so no nav link ever showed the active state on any public page.

**Resolution:** Ported as `(public)/_components/ActiveNavLink.tsx`, a scoped `"use client"` component mounted in `(public)/layout.tsx` alongside the other behavior components (`ScrollReveal`, `NavbarBehavior`, `FaqAccordion`, `TestimonialSlider`, `StatCounters`). It uses `usePathname()` and toggles `is-active` on each `.nav-links a[data-nav]` by exact match (`pathname === the link's href`) — no prefix matching, so the home link (`href="/"`) doesn't match every route. Only the desktop `.nav-links` are handled — the mobile-menu links have no `data-nav` attributes and `site.css` has no `.mobile-menu a.is-active` rule, so there's nothing to do there, matching the legacy site's own behavior. Cleanup removes `is-active` from all links on unmount/re-run so no stale highlight lingers across client-side navigation. Verified in-browser, including the highlight correctly following client-side navigation between pages.

---

## 11. `/services` — CMS wiring — RESOLVED

**What it was:** `(public)/services/page.tsx` hardcoded 9 services verbatim from the legacy site, each duplicated twice: once as a preview card (icon, title, short description) in the top grid, and once again as a full detail section (icon, title, lead paragraph, 4-item feature list) further down the page — no database involvement at all, editing a service meant editing two separate places in the same file.

**Resolution:** A `previewSummary` field was added to the `Service` model (short preview-card copy, distinct from `summary`) via a Prisma migration, and a shared icon registry (`(public)/_components/Icon.tsx`) was built to map DB `icon` keys to the SVGs in `shared/icons/icon-set.json`. `(public)/services/page.tsx` now derives both the preview grid and the detail sections from a single `serviceRepository.findAllPublished()` call, with ISR (`revalidate = 60`) so publish/edit/unpublish changes in the CMS appear on the public page within a minute, without a redeploy.

---

## 12. `/industries` — CMS wiring — RESOLVED

**What it was:** `(public)/industries/page.tsx` hardcoded 8 industry cards verbatim from the legacy site (icon, title, description each), with no database involvement and no Industries CMS module at all — the admin dashboard only had a permission-gated placeholder stub.

**Resolution:** Industries was built end-to-end from scratch: `industry.schema.ts` / `industry.repository.ts` (extends `BaseContentRepository<Industry>`) / `industryManagement.service.ts`, 4 API routes under `/api/industries` guarded by `INDUSTRIES_MANAGE`, and a full admin CMS (`IndustryForm`, `IndustriesTable`, list/new/edit pages) replacing the old stub. `(public)/industries/page.tsx` now renders from `industryRepository.findAllPublished()` with ISR (`revalidate = 60`). Unlike Services, `industryManagementService` deliberately does not call `triggerWebsiteRebuild` — there's no legacy bridge route for Industries, and the public page refreshes via ISR instead.

---

## 13. Careers application form — RESOLVED

**What it was:** `/careers`'s application form (`(public)/careers/_components/ApplicationForm.tsx`) had full client-side validation and a convincing "application received" success message on valid submit, but no data was ever sent, stored, or emailed anywhere — a faithful port of the legacy static site's own non-functional form, not a migration regression.

**Resolution:** The full pipeline was built end-to-end. A public `POST /api/public/careers` endpoint follows the 4-layer house architecture (`route.ts` → `application.service.ts` → `application.schema.ts` (Zod, `.strict()`) → `application.repository.ts`), with mandatory server-side validation, honeypot spam protection (a hidden off-screen field in `ApplicationForm.tsx` that real users/screen-readers never reach; the backend silently drops any submission where it arrives filled, responding success-shaped so bots get no signal), and FK-safe anonymous audit logging (`activityLogService.log()` with `userId` omitted → `NULL`, since `ActivityLog.userId` is a nullable foreign key and a fabricated string actor would violate it). `ApplicationForm.tsx` is wired to actually `POST` on successful client validation, with real success/error handling (no more false-success on failure) and a double-submit guard (disabled submit button while in flight). The admin dashboard's `(dashboard)/dashboard/job-applications` listing and `[id]` detail page are built on the shared `<Table>`/`<Badge>` primitives, guarded by `JOB_APPLICATIONS_VIEW`, so submissions are actually reviewable. All verified end-to-end in-browser: real submissions create `JobApplication` rows, and admins can view them.

**Explicitly still out of scope / deferred (tracked, not forgotten):**
- **IP-based rate-limiting** on the public endpoint — honeypot is the only spam protection today. **Required before production launch.**
- **Status-change / edit actions in the admin** — the detail view is currently read-only; there's no way yet to move an application `NEW→REVIEWING→INTERVIEW→REJECTED/HIRED`. Would need a new edit permission plus a mutation endpoint.

---

## 14. Contact quote-request form — RESOLVED (highest-traffic instance)

**What it was:** `/contact`'s quote-request form (`(public)/contact/_components/QuoteForm.tsx`) had the same shape of problem as the careers form (item 13) — full client-side validation and a convincing success message, but nothing was ever saved or sent. This mattered more than item 13 since every "اطلب عرض سعر" (request a quote) link sitewide funnels into this one form.

**Resolution:** Same full pipeline, built the same way, against `QuoteRequest`. A public `POST /api/public/quote` endpoint follows the identical 4-layer house architecture (`route.ts` → `quote.service.ts` → `quote.schema.ts` (Zod, `.strict()`) → `quote.repository.ts`), with server-side validation, the same honeypot spam-protection pattern (hidden off-screen field + silent success-shaped drop on the backend), and the same FK-safe anonymous audit logging (`userId` omitted → `NULL`). `QuoteForm.tsx` is wired to actually `POST`, with real success/error handling and a double-submit guard. The admin dashboard's `(dashboard)/dashboard/quote-requests` listing and `[id]` detail page are built on the same shared `<Table>`/`<Badge>` primitives, guarded by `QUOTE_REQUESTS_VIEW`. All verified end-to-end in-browser: real submissions create `QuoteRequest` rows, and admins can view them.

**Explicitly still out of scope / deferred (tracked, not forgotten):**
- **IP-based rate-limiting** on the public endpoint — honeypot only for now, same as item 13. **Required before production launch**, and arguably more urgent here given this is the highest-traffic form on the site.
- **Status-change / edit actions in the admin** — read-only detail view only; no way yet to move a request `NEW→CONTACTED→CLOSED`. Same missing piece as item 13 — would need a new edit permission plus a mutation endpoint, and could reasonably be built together with item 13's equivalent since both are structurally the same problem.

---

## 15. Internal links use raw `<a>` on most pages — `<Link>` sweep deferred

**What it is:** Public-site migration parity is complete, and the standing decision going forward is that all *new* markup uses `next/link`'s `<Link>` for internal routes (already followed for the homepage body sections and final CTA added during this session). However, the pages migrated earlier in the sprint (`/about`, `/services`, `/industries`, `/careers`, `/contact`, `/privacy`) plus the navbar/footer in `(public)/layout.tsx` still use raw `<a>` tags for internal routes — confirmed via the earlier link audit at **~62 occurrences**, all fully functional (that audit found **0 broken links**). This is a deliberate, accepted inconsistency this item tracks, **not a bug** — every internal link resolves correctly today; the only thing raw `<a>` misses is Next.js client-side navigation/prefetching for those specific links (full page loads instead of SPA transitions).

**Why deferred:** This is optional polish, not correctness work, so it was deliberately left out of the page-migration/parity sprint. The ~62 occurrences span more than 5 files (`(public)/layout.tsx`, `about/page.tsx`, `services/page.tsx`, `industries/page.tsx`, `careers/page.tsx`, `contact/page.tsx`, `privacy/page.tsx`), which is itself why this must become several small scoped tasks when picked up — e.g. the shared layout first, then one page at a time — rather than one large pass, consistent with how every other change in this migration has been kept small and independently verifiable.

**Sensitive point to flag for whoever picks this up:** converting the `/contact#quote` CTAs specifically (the highest-traffic link on the site — every "request a quote" button sitewide points here) needs a dedicated check, after conversion, that scroll-to-`#quote` still lands correctly. Next.js has historically had hash-scroll quirks with `<Link>` across client-side navigation (scrolling to the fragment isn't always as reliable as a full page load's native anchor behavior), so this specific conversion shouldn't be bundled in casually with the rest of the sweep — it deserves its own explicit before/after verification.

**Current temporary state:** Codebase currently mixes both patterns — `<Link>` in newer markup (Batch 1/2 homepage sections, final CTA), raw `<a>` everywhere else for internal routes. Both work correctly; this is a code-consistency/prefetching gap, not a functional one.

**Real fix:** A dedicated multi-task `<Link>` sweep, one file (or small group) at a time, with the `/contact#quote` conversion treated as its own verified step rather than folded into a page's general sweep.

---

## 16. Admin dashboard + login are slow — DB latency + redundant auth queries

**What it is:** Admin dashboard pages (~3.5s) and login (~2.3s) feel slow, on both localhost and Vercel. Confirmed via a read-only performance diagnosis with concrete timing measurements, not guesswork.

**Root cause (dominant, still open):** the database is a remote Supabase Postgres instance in AWS eu-west-1 (Ireland). Every query — even a trivial `count()` on a 7-row table — takes ~450-570ms due to network round-trip + pooler overhead to a distant region. **This is not a code defect; it's physical distance.** Login makes ~4 sequential DB round-trips (user lookup, failed-attempt reset, session create, activity log) plus `bcrypt.compare()` at 12 rounds (~325ms, using `bcryptjs`, the pure-JS implementation) ≈ **2.3s total**. The dashboard layout+page chain originally made ~7 sequential round-trips ≈ **3.5s total** (see DONE fix below, which reduced the count but not the per-query latency).

**DONE (fix #1, verified):** wrapped `getSessionUser()` (`session.ts`) and `getUserPermissions()` (`rbac.ts`) in React's `cache()` for request-level deduplication. Before this, `(dashboard)/layout.tsx` and every page's `requireUser()`/`requirePermission()` independently re-ran the exact same session lookup and deep user/role/permissions query — up to 2-3 times per single dashboard page view, with zero request-level caching. `cache()` eliminates every redundant round-trip: each unique query now runs exactly once per request, no matter how many call sites (layout, `requirePermission`, any page's own explicit `getUserPermissions` call) ask for it. **Zero behavior/security change** — every `requirePermission(X)` check still enforces `X` exactly as before, same redirects, same 403s; confirmed via build + unauthenticated-request checks across multiple permission-gated pages. Noticeable speed improvement confirmed. **Key finding that corrected the original plan:** the initial idea of just *deleting* the page-level `requireUser()`/`getUserPermissions()` calls (rather than caching them) turned out to be **unsafe** — a prior read-only investigation found that nearly every dashboard page's auth call enforces a **distinct, page-specific permission** the shared layout never checks (the layout only verifies "is logged in," not "authorized for *this* page"); deleting those calls would have silently opened a real authorization hole. `cache()` was the correct approach precisely because it removes the redundant *DB round-trip* without touching *what gets checked or when*.

**STILL OPEN — root cause, larger, deferred:** fix #1 reduced the *number* of round-trips per request, but each remaining round-trip is still slow, because the ~500ms-per-query cost is distance, not redundancy. The real root-cause fixes remain:
- Moving the database to a region closer to where the app is served/used.
- And/or adding a caching layer in front of frequently-read, rarely-changed data.
Both are larger infrastructure/deployment decisions, not a quick code change — not yet done.

**Also still noted for later:**
- Parallelizing the sequential login round-trips where dependencies actually allow it (some are inherently sequential — e.g. session creation needs the user's id from the first query — so this has limited upside).
- `AttendanceRecord` has **no `@@index`** at all, and `dashboardService.getTodaysOperations()` filters `where: { date: today }` on every dashboard load. Harmless now with tiny dev data, but this table grows one row per employee per day, so an unindexed scan will degrade as real attendance data accumulates. Worth an index eventually — not urgent yet.

**Current temporary state:** Fix #1 is live — dashboard/login are noticeably faster, but both remain slower than ideal due to the unresolved DB-region root cause.

**Real fix / planned sequencing:** Fix #1 (this item) is complete. The remaining root-cause options (DB region / caching layer) are deferred as a larger infrastructure decision, to be picked up separately from the day-to-day feature work.

---

## 17. Legacy `website/` shows RTL-flipped brand name ("4 Brothers Security & Guarding")

**What it is:** The bare English company name flips under RTL (renders as "...GUARDING 4") in the legacy `website/*.html` static site. Source: `lib/constants/branding.ts`'s `BRANDING.companyName` is the literal string; live occurrences are in `website/*.html` (meta tags, JSON-LD, and one visible `<span>` per page).

**Why deferred:** Confirmed via search **not present** in the new `(public)` Next.js pages — those were already fixed (see item on RTL logo/text ordering). Only affects the legacy static site, which is slated for removal.

**Real fix:** Resolve when the legacy `website/` directory is decommissioned — no fix needed in the Next.js app.
