# 4B HUB - Current Development Phase

Last Updated: August 14, 2026

---

# Current Version

Version 1.1

Project Status:

In Active Development

---

# Current Sprint

Public Website Migration

---

# Sprint Goal

Migrate the legacy static website into the existing Next.js application without changing the visual design.

The migration must preserve 100% visual consistency while replacing static content with dynamic CMS-driven content.

---

# Primary Objective

Build a single unified application containing:

/

Public Website

/admin

Admin CMS

/employee

Employee Portal

The legacy website located in:

website/

will be removed after achieving full feature parity.

---

# Current Task

Phase 1

Public Website Infrastructure

Tasks:

- Prepare the public route group.
- Reuse existing styles.
- Reuse existing assets.
- Build reusable public components.
- Keep the existing Admin application untouched.

Status:

In Progress

Home CMS:

Home page CMS (CTA + Hero + Why Us + Timeline — all 4 sections) is complete end-to-end — Zod schema, dashboard editor, and public page wired to published data. Why Us and Timeline were decided as per-page content, not a shared content type with About/Services, since their actual step/card content and even presence differ across those pages.

Remaining Home sections (deferred):

- Client logos strip — currently a hardcoded placeholder grid; needs a new Prisma model.
- FAQ — needs a new Prisma model.

---

# Current Working Rules

Only work on the current task.

Do NOT implement future features.

Do NOT redesign any page.

Do NOT modify authentication.

Do NOT modify RBAC.

Do NOT modify Employee Portal.

Do NOT refactor unrelated files.

Every task should be independent and reversible.

---

# Definition of Done

A task is considered complete when:

- Code builds successfully.
- Existing functionality is not broken.
- No duplicate logic is introduced.
- Architecture remains consistent.
- Summary is provided.
- Work stops immediately after completion.

---

# Current Priorities

Priority 1

Public Website Migration

Priority 2

Website Settings

Priority 3

Landing Page Dynamic Content

Priority 4

About Page

Priority 5

Industries

Priority 6

Testimonials

Priority 7

Careers

Priority 8

Contact

---

# Out of Scope

The following modules are NOT part of the current sprint:

- Payroll
- HR
- Contracts
- Reports
- Guard Tour
- Fleet Management
- AI Assistant
- Mobile Application
- Analytics

Do not work on these modules unless explicitly requested.

---

# Development Strategy

The project follows an incremental delivery strategy.

Each task must:

- Modify as few files as possible.
- Be independently testable.
- Avoid unnecessary refactoring.
- Preserve existing architecture.

Large refactoring is prohibited during this phase.

---

# Expected AI Workflow

Before starting any task:

1. Read PROJECT_CONTEXT.md
2. Read ARCHITECTURE.md
3. Read BUSINESS_RULES.md
4. Read FEATURE_SPECIFICATIONS.md
5. Read MODULE_STATUS.md
6. Read CURRENT_PHASE.md
7. Execute only the requested task.

Never skip this workflow.

---

# Success Criteria

The sprint will be considered complete when:

- The public website runs entirely inside Next.js.
- All pages are dynamic.
- CMS changes appear immediately.
- The legacy website is no longer required.
- The Admin CMS remains fully functional.
- The Employee Portal remains fully functional.

No architectural regressions are acceptable.