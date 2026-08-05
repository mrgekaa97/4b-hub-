# 4B HUB - System Architecture

## Overview

4B HUB is a modular enterprise platform built as a single Next.js application.

The platform consists of three main applications sharing the same codebase and database.

```
/
Public Website

/admin
Admin CMS

/employee
Employee Portal
```

All applications use the same backend architecture and PostgreSQL database.

---

# Core Architecture

```
Browser

↓

Next.js App Router

↓

Route Handlers (API)

↓

Service Layer

↓

Repository Layer

↓

Prisma ORM

↓

PostgreSQL (Supabase)
```

Business logic must never exist inside UI components.

UI components should only display data and call services.

---

# Public Website

Purpose:

Company marketing website.

Features:

- Home
- About
- Services
- Industries
- Careers
- Contact
- Testimonials

Current Goal:

Migrate from the legacy static website into the Next.js application.

Final Data Flow:

```
CMS

↓

Prisma

↓

Repository

↓

Service

↓

Public API

↓

Next.js Pages
```

The public website must never depend on static HTML generation.

---

# Admin CMS

Purpose:

Manage all company content and operations.

Main Modules:

- Dashboard
- Website Settings
- Services
- Industries
- Careers
- Testimonials
- Media Library
- Employees
- Sites
- Attendance
- Reports
- Notifications
- Users
- Roles

Access:

RBAC Protected

---

# Employee Portal

Purpose:

Provide employees with a secure self-service portal.

Main Modules:

- Attendance
- Leave Requests
- Salary Summary
- Deductions
- Notifications
- Company Announcements
- Profile
- Documents (Future)

Authentication:

Employee Code

+

Password

+

Trusted Device

---

# Attendance Flow

```
Employee Login

↓

Trusted Device

↓

QR Scan

↓

GPS Validation

↓

Attendance Record

↓

Notification (if required)
```

GPS never blocks attendance.

Attendance outside the allowed radius is accepted but flagged for review.

---

# Repository Pattern

The project follows Repository Pattern.

```
Controller

↓

Service

↓

Repository

↓

Prisma

↓

Database
```

Repositories must never contain business rules.

Services contain business logic.

---

# Design Principles

- One Application
- One Database
- One Source of Truth
- Reusable Components
- Modular Architecture
- Mobile First
- Incremental Development

---

# Development Principles

Always extend existing modules.

Never duplicate business logic.

Prefer composition over duplication.

Keep files small and maintainable.

Avoid unnecessary dependencies.

Never redesign existing UI without explicit approval.

Every feature must support future scalability.