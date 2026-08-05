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

## 11. `/services` — strong candidate for CMS wiring (not implemented)

**What it is:** `(public)/services/page.tsx` (migrated in Task #11) hardcodes 9 services verbatim from the legacy site, each duplicated twice: once as a preview card (icon, title, short description) in the top grid, and once again as a full detail section (icon, title, lead paragraph, 4-item feature list) further down the page.

**Why flagged:** The 9 services map almost 1:1 onto the existing `Service` Prisma model (`admin/prisma/schema.prisma`) — each detail section's anchor `id` (`static-guarding`, `mobile-patrol`, etc.) is exactly a `slug`, the `<h2>` is `title`, the lead paragraph is `summary`, the 4-item check-list is `includes` (already typed as `Json // string[]`), and the SVG icon corresponds to an `icon` key. This is the cleanest content-to-schema match of any page migrated so far.

**Current temporary state:** Both the preview cards and the detail sections are hand-duplicated static JSX — editing a service today means editing two separate places in the same file, with no database involvement at all.

**Real fix (future CMS/improvements phase, not now):** Once the Services CMS module (already partially built per `docs/PROJECT_STATUS.md`) is wired to the public site, both the preview grid and the detail sections should derive from the same 9 `Service` records instead of being duplicated by hand — eliminating the two-places-to-edit problem and making services genuinely CMS-managed on the public page, not just in the admin dashboard.

---

## 12. `/industries` — also CMS-shaped, simpler than Services (not implemented)

**What it is:** `(public)/industries/page.tsx` (migrated in Task #12) hardcodes 8 industry cards verbatim from the legacy site (icon, title, description each).

**Why flagged:** The 8 cards map cleanly onto the existing `Industry` Prisma model (`admin/prisma/schema.prisma`) — `icon`, `title`, `description` correspond directly to the model's fields. Simpler than the Services case (item 11): each industry appears exactly once on this page, so there's no hand-duplication problem to solve — just a straight hardcoded-to-CMS swap once wired.

**Current temporary state:** The 8 cards are static JSX with no database involvement.

**Real fix (future CMS/improvements phase, not now):** Once an Industries CMS module is wired to the public site, the card grid should render from `Industry` records instead of hardcoded JSX.

---

## 13. Careers application form does NOT submit anywhere — visual + validation only

**What it is:** `/careers`'s application form (`(public)/careers/_components/ApplicationForm.tsx`, Task #13) has full client-side validation (required-field checks, email format check, error messages) and shows a "application received" success message on valid submit — **but no data is ever sent, stored, or emailed anywhere.** On successful validation the form is just hidden and the success message shown; the entered values are discarded.

**Why this is not a bug:** This is a **faithful, byte-identical port of the legacy static site's existing behavior** — `website/careers.html`'s form has no `action`/`method` attribute and `main.js`'s validation handler always calls `preventDefault()` with no `fetch`/AJAX call anywhere. The legacy site, live today, has never actually submitted this form's data anywhere. This is not a regression introduced by migration — it's carrying over exactly what already exists in production.

**Current temporary state:** Anyone filling out and submitting the form on `/careers` sees a convincing "success" message, but their application is not saved or sent anywhere. Explicitly flagging this so it is never mistaken for a working submission pipeline.

**Real fix (dedicated future task, deliberately out of scope for the page-migration series — touches `api/*`):** Needs a new `POST /api/careers` (or similar) route with server-side validation (client-side validation alone is never trustworthy), a `JobApplication` DB write — the Prisma model already exists and matches the form fields exactly (`fullName`, `phone`, `email`, `roleApplied`, `experience`, `message`) — spam/rate-limiting on the public unauthenticated endpoint, and wiring results to the still-stubbed `(dashboard)/dashboard/job-applications` admin page so submissions are actually reviewable.

---

## 14. Contact quote-request form does NOT submit anywhere — visual + validation only (highest-traffic instance)

**What it is:** `/contact`'s quote-request form (`(public)/contact/_components/QuoteForm.tsx`, Task #14) has the same shape of problem as the careers form (item 13): full client-side validation and a convincing "request received" success message on valid submit, but **no data is ever sent, stored, or emailed anywhere** — the form is just hidden and the success message shown; entered values are discarded.

**Why this is not a bug:** Same reasoning as item 13 — `website/contact.html`'s `#quote` form has no `action`/`method`, and `main.js`'s shared `form[data-validate]` handler never makes a network request for either form. Faithful port of the legacy site's actual live behavior.

**Why this one matters more:** This is the **highest-traffic non-functional form on the site** — every "اطلب عرض سعر" (request a quote) link sitewide (navbar, mobile-menu, footer, and every page's CTA buttons) points to `/contact#quote`, funneling all quote-intent traffic into this one form. Explicitly flagging so it's never mistaken for a working pipeline, especially since it's the most likely form a real visitor would actually try to use.

**Current temporary state:** Anyone submitting the quote form sees a convincing success message, but nothing is saved or sent.

**Real fix (dedicated future task, deliberately out of scope — touches `api/*`):** Needs a new `POST /api/quote` (or similar) route with server-side validation, a `QuoteRequest` DB write — the Prisma model already matches all 9 form fields exactly (`company`, `contactName`, `phone`, `email`, `industry`, `guardsRange`, `location`, `preferredContact`, `message`) — rate-limiting on the public endpoint, and wiring to the still-unbuilt admin quote-requests dashboard. **Recommend tackling this together with item 13's careers-form backend** in one future task, since both are structurally the same problem (new route + server validation + DB write + rate-limiting + dashboard wiring), just against different models.

---

## 15. Internal links use raw `<a>` on most pages — `<Link>` sweep deferred

**What it is:** Public-site migration parity is complete, and the standing decision going forward is that all *new* markup uses `next/link`'s `<Link>` for internal routes (already followed for the homepage body sections and final CTA added during this session). However, the pages migrated earlier in the sprint (`/about`, `/services`, `/industries`, `/careers`, `/contact`, `/privacy`) plus the navbar/footer in `(public)/layout.tsx` still use raw `<a>` tags for internal routes — confirmed via the earlier link audit at **~62 occurrences**, all fully functional (that audit found **0 broken links**). This is a deliberate, accepted inconsistency this item tracks, **not a bug** — every internal link resolves correctly today; the only thing raw `<a>` misses is Next.js client-side navigation/prefetching for those specific links (full page loads instead of SPA transitions).

**Why deferred:** This is optional polish, not correctness work, so it was deliberately left out of the page-migration/parity sprint. The ~62 occurrences span more than 5 files (`(public)/layout.tsx`, `about/page.tsx`, `services/page.tsx`, `industries/page.tsx`, `careers/page.tsx`, `contact/page.tsx`, `privacy/page.tsx`), which is itself why this must become several small scoped tasks when picked up — e.g. the shared layout first, then one page at a time — rather than one large pass, consistent with how every other change in this migration has been kept small and independently verifiable.

**Sensitive point to flag for whoever picks this up:** converting the `/contact#quote` CTAs specifically (the highest-traffic link on the site — every "request a quote" button sitewide points here) needs a dedicated check, after conversion, that scroll-to-`#quote` still lands correctly. Next.js has historically had hash-scroll quirks with `<Link>` across client-side navigation (scrolling to the fragment isn't always as reliable as a full page load's native anchor behavior), so this specific conversion shouldn't be bundled in casually with the rest of the sweep — it deserves its own explicit before/after verification.

**Current temporary state:** Codebase currently mixes both patterns — `<Link>` in newer markup (Batch 1/2 homepage sections, final CTA), raw `<a>` everywhere else for internal routes. Both work correctly; this is a code-consistency/prefetching gap, not a functional one.

**Real fix:** A dedicated multi-task `<Link>` sweep, one file (or small group) at a time, with the `/contact#quote` conversion treated as its own verified step rather than folded into a page's general sweep.
