# 4B HUB - AI Changelog

Purpose

Track major project milestones and development progress.

Every significant implementation should be recorded here.

---

## August 2026

### Knowledge Base

Created AI documentation system.

Added:

- Project Context
- Architecture
- Business Rules
- Feature Specifications
- Module Status
- Current Phase
- Roadmap
- Product Decisions
- AI Instructions
- Technical Decisions
- Glossary

---

### Current Development

Started migrating the legacy static website into the Next.js application.

Current priority:

Dynamic Public Website.

---

### Services & Industries — Dynamic CMS Wiring Complete

Both Services and Industries are now fully dynamic end-to-end: database → admin CMS → public page with ISR.

Services:

- Added a `previewSummary` field to the `Service` model (short preview-card copy, distinct from the longer `summary` used in detail sections) via a Prisma migration.
- Built the shared icon registry, `(public)/_components/Icon.tsx`, mapping DB `icon` keys to the SVGs in `shared/icons/icon-set.json`.
- Wired `(public)/services/page.tsx` to read from `serviceRepository.findAllPublished()` instead of hardcoded JSX, with ISR (`revalidate = 60`) so CMS edits appear without a redeploy.

Seed idempotency fix:

- `seedIndustries()`, `seedCareers()`, and `seedSampleRequests()` were converted from unguarded `.create()` calls to `findFirst`-guarded inserts, matching the existing `seedServices()`/`seedTestimonials()` pattern. Verified by running the seed twice in a row with no row-count growth on the second run.

Database cleanup:

- Removed 17 duplicate rows across Industry/CareerPosting/QuoteRequest/ContactMessage created by a prior non-idempotent seed re-run, and 2 orphan Service rows not present in `database/services.json`.

Industries, built from scratch end-to-end:

- Backend: `industry.schema.ts`, `industry.repository.ts` (extends `BaseContentRepository<Industry>`), `industryManagement.service.ts`.
- 4 API routes under `/api/industries`, guarded by `INDUSTRIES_MANAGE`.
- Full admin CMS: `IndustryForm`, `IndustriesTable`, list/new/edit pages, replacing the old placeholder stub.
- `(public)/industries/page.tsx` wired to the DB with ISR (`revalidate = 60`).
- Deliberate deviation: `industryManagementService` does not call `triggerWebsiteRebuild` — there is no legacy bridge route for Industries, and the public page refreshes via ISR instead.

---

### Website Settings — Dynamic CMS Wiring Complete

Website Settings is now fully wired end-to-end: database → admin CMS → public site, using the existing generic `Setting` key-value model's "general" group (13 `site.*` keys, already seeded).

Backend:

- `PATCH /api/settings/general` + `settings.schema.ts` (`.strict()`, the 13 `site.*` keys plus the nested `site.social_links` object), guarded by `WEBSITE_SETTINGS_MANAGE`.
- `settingsService.setMany()` widened to accept an optional `valueType` per entry, so `site.social_links` saves correctly as `JSON` instead of silently defaulting to `STRING`.
- `9ab250d`

Dashboard form:

- Stub replaced with a real form (`SettingsForm.tsx`), driven by a field-config constant covering company/contact/legal fields plus the social-links sub-object.
- Fixed a silent-failure gap: `applyErrorResponse` (in both `SettingsForm.tsx` and `AboutEditor.tsx`) only ever read `data.issues.fieldErrors`, never `formErrors` — so a malformed body or a `.strict()` unrecognized-key violation produced no visible feedback at all. Fixed identically in both copies.
- `0881c08`

Public-site wiring:

- `(public)/layout.tsx` and `(public)/contact/page.tsx` now read company name, phone, email, address, working hours, emergency note, social links, and registry/license numbers from `settingsService.getGroupAsMap("general")`, with per-key fallback to seed defaults for empty values — mirroring the About page's `revalidate = 60` pattern.
- Gap strings (footer tagline, copyright/"Built for" lines) and the stylized "4 BROTHERS" logo mark stay hardcoded — no matching key, or a deliberate brand-mark exception.
- `c976a6d`

Separately, `c74cc9d` fixed RTL ordering of Latin/numeric brand text (logo mark, copyright line, a missed phone link) on the same pages — a related bug found during this work, not itself Website Settings scope. One remaining flipped-logo occurrence exists only in the legacy `website/*.html` static site — tracked as `docs/KNOWN_ISSUES.md` item 17, deferred to legacy-site decommissioning.

---

### Home CMS — CTA & Hero Complete

The Home page CMS prototype is now wired end-to-end for its first two sections, CTA and Hero: database → admin CMS → public page with ISR.

Data model:

- A single `home` `Page` row holds all Home sections together in one `publishedData`/`draftData` JSON, validated by `home.schema.ts` (`.strict()` at every level).
- `homeManagementService` follows the Industries deviation — no `triggerWebsiteRebuild`; the public page refreshes via ISR instead.

Dashboard:

- `HomeEditor` (dashboard, guarded by `HOME_MANAGE`) edits both sections with save-draft + publish, mirroring `AboutEditor`.
- Hero carries a three-part split title (plain line + gold-highlight word) plus two arrays — stats and panel rows — with add/remove UI copied from the About module's array pattern.

Public wiring:

- `(public)/page.tsx` reads the published `home` row and resolves each section as `published?.section ?? HARDCODED_*`, so the page renders exactly as before when never-published. `revalidate = 60` preserved; the hero stat count-up animation and both hero `<a>` buttons were left untouched.
- Last HEAD: `d0942bd`.

---

### Home CMS — Why Us & Timeline Complete

The Home CMS prototype now has all four planned sections wired end-to-end — CTA, Hero, Why Us, and Timeline — following the same schema → dashboard editor → public page pattern established for CTA/Hero.

Why Us:

- 6-card array (`icon`, `title`, `text`), mirroring About's `values` array field definitions with Home's own `.strict()` convention on every object level.
- Icons are picked from the existing `ICON_OPTIONS` key list (the same 17-key registry About uses), never free-text or raw SVG — the dashboard's icon `<Select>` is copied verbatim from `AboutEditor`. The public page swaps the previously-hardcoded inline `<svg>` per card for `<Icon name={card.icon} />`, which resolves the key against `shared/icons/icon-set.json` — confirmed during exploration to render byte-identical SVGs to what was hardcoded before.

Timeline:

- Eyebrow + heading + a 4-step array (`num`, `title`, `text`). `num` is kept as a **string** (`"01"`–`"04"`), not a coerced number, so the leading zero and display formatting are preserved — a deliberate schema choice.
- Decision: Timeline (and Why Us) are modeled **per-page** inside `home.schema.ts`, not as a shared content type. Exploration found Services has its own separately-hardcoded, still-unwired Timeline with near-identical but not word-for-word-identical copy (a one-word discrepancy surfaced), and About has no Timeline section at all — a shared table would have forced either duplicate rows or lossy content unification across pages that don't actually agree.

Two things learned building this out that apply to any future Home section:

- **Per-section merge in `useState`:** each time a new top-level section (`whyUs`, then `timeline`) was added to `homeSchema`, older saved drafts from before that key existed lacked it — reading e.g. `values.whyUs.eyebrow` on such a draft threw. Fixed once, generally: `HomeEditor`'s `useState` initializer resolves each section independently (`initial?.whyUs ?? EMPTY_HOME.whyUs`, etc.) instead of falling back to `EMPTY_HOME` only when `initial` is entirely `undefined`. Any future section addition must extend this same per-section list.
- **Publish replaces the hardcoded fallback entirely:** the public page resolves each section as `published?.section ?? HARDCODED_*`. Once *any* draft is published, that section starts reading from the DB — including for fields the admin left empty — so a section must be filled out completely in the dashboard before publishing it, or the public page renders blank/incomplete content instead of falling back to the hardcoded values.

Last HEAD: `e2da555`.

---

### Next Steps

- Services Migration
- Website Settings
- Landing Page
- About Page
- Testimonials