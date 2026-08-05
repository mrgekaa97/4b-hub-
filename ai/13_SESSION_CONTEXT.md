# 4B HUB - Session Context

Version: 1.0.0

Status: Active

Last Updated: August 2026

---

# Purpose

This document provides a concise snapshot of the current development session.

Unlike PROJECT_CONTEXT.md, this file changes frequently and should be updated after every completed work session.

Its purpose is to help any AI assistant quickly understand where development stopped and what should happen next.

---

# Current Sprint

Public Website Migration

---

# Current Objective

Migrate the legacy static website into the existing Next.js application while preserving the exact visual appearance.

Replace static content with dynamic CMS-driven content.

---

# Current Status

Project is in active development.

Knowledge Base has been completed.

Architecture documentation is available.

Development follows an incremental task-based workflow.

---

# Completed

- AI Knowledge Base created.
- Project architecture documented.
- Business rules documented.
- Feature specifications documented.
- Product roadmap documented.
- Technical decisions documented.
- Product decisions documented.
- AI working instructions documented.

---

# In Progress

Public Website Migration

Current focus:

Convert the existing static website into a fully dynamic Next.js implementation.

---

# Current Task

Create the infrastructure required for the public website migration without affecting:

- Admin CMS
- Employee Portal
- Authentication
- RBAC

---

# Blockers

Current known blockers:

- Legacy website still relies on static generation.
- CMS integration is partially implemented.
- Public pages are not fully dynamic yet.

---

# Next Planned Tasks

1. Public Route Group
2. Shared Public Components
3. Dynamic Services
4. Website Settings Integration
5. Landing Page
6. About Page
7. Industries
8. Testimonials
9. Careers
10. Contact

---

# Important Decisions

- One Next.js application.
- One PostgreSQL database.
- One deployment.
- Repository Pattern.
- Service Layer.
- Dynamic CMS.
- No redesign during migration.

---

# Working Rules

- Small incremental tasks only.
- Maximum 5 modified files per task.
- Stop after every completed task.
- Never perform unrelated refactoring.
- Never redesign existing UI.
- Preserve existing architecture.

---

# Next AI Action

Read the AI Knowledge Base.

Understand the current sprint.

Wait for the next implementation task.

Do not analyze unrelated parts of the repository.