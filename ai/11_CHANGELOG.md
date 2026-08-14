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

### Next Steps

- Services Migration
- Website Settings
- Landing Page
- About Page
- Testimonials