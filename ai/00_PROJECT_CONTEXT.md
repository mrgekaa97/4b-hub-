# 4B HUB - Project Context

## Project Overview

4B HUB is an enterprise management platform designed primarily for security, guarding, facility management, and manpower companies.

The long-term vision is to build a unified platform capable of managing every aspect of the company's operations from a single system.

The platform combines:

- Corporate Website
- Admin CMS
- Employee Portal
- Attendance Management
- Human Resources (HR)
- Operations Management
- Notifications Center
- Reports & Analytics
- Customer Management
- Contracts Management
- Document Management (Future)
- Payroll (Future)

The system is designed to evolve into a complete ERP platform.

---

# Current Development Goal

The current priority is migrating the legacy static website into the existing Next.js application.

Current Architecture:

Legacy Website
website/build.py
↓
Static HTML

Target Architecture:

Next.js Public Website
↓
Repository Layer
↓
Prisma
↓
PostgreSQL (Supabase)

The final application will contain three major sections:

/

Public Website

/admin

Admin CMS

/employee

Employee Portal

All running inside one Next.js application.

The legacy website will eventually be removed after achieving feature parity.

---

# Core Principles

The project follows these principles:

- One application.
- One database.
- One authentication system.
- One deployment pipeline.
- One source of truth.

Business logic must never be duplicated.

Every feature should reuse the existing architecture whenever possible.

---

# Technology Stack

Frontend

- Next.js 14 (App Router)
- React
- TypeScript
- TailwindCSS

Backend

- Next.js Route Handlers
- Prisma ORM
- PostgreSQL (Supabase)

Architecture

- Repository Pattern
- Service Layer
- RBAC
- Server Components First
- Client Components only when necessary

Deployment

- Vercel
- Supabase

---

# Coding Standards

Always preserve the existing architecture.

Never redesign existing UI unless explicitly requested.

Never rewrite working code.

Always prefer extension over replacement.

Avoid introducing unnecessary dependencies.

Keep the codebase modular and maintainable.

Every change should be incremental.

Every task should be completed in small independent steps.

Stop after each completed task.

---

# Long-Term Vision

4B HUB is not intended to remain a simple CMS.

The long-term objective is to become a complete ERP platform for security and facility management companies.

Future modules include:

- Payroll
- Guard Tour
- Fleet Management
- Client Portal
- Mobile Applications
- AI Assistant
- Analytics
- Document Management
- Contract Management

Every architectural decision should support future scalability.