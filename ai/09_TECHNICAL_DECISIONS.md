# 4B HUB - Technical Decisions

Last Updated: August 2026

---

# Purpose

This document records all major technical and architectural decisions made during the project's lifetime.

Every future implementation must respect these decisions unless an explicit replacement decision is documented.

If a decision changes, do not overwrite history.

Instead:

- Mark the previous decision as superseded.
- Add the new decision.
- Explain why the decision changed.

---

# Decision 001

Title

Single Application Architecture

Status

Accepted

Decision

The entire platform will run as one Next.js application.

Structure

/

Public Website

/admin

Admin CMS

/employee

Employee Portal

Reason

Simpler deployment.

Shared authentication.

Shared database.

Shared components.

Lower maintenance cost.

---

# Decision 002

Title

Database

Status

Accepted

Decision

Supabase PostgreSQL is the official production database.

Reason

Managed PostgreSQL.

Reliable backups.

Easy Vercel integration.

Scalable.

---

# Decision 003

Title

Public Website Migration

Status

Accepted

Decision

The legacy static website will be migrated into the existing Next.js application.

The legacy website located in:

website/

is temporary.

It will be removed after achieving complete feature parity.

Reason

One deployment.

One architecture.

Live CMS updates.

No manual HTML generation.

---

# Decision 004

Title

Architecture Pattern

Status

Accepted

Decision

The project follows:

Repository Pattern

+

Service Layer

Business logic belongs only inside services.

Repositories only access the database.

---

# Decision 005

Title

Authentication

Status

Accepted

Decision

Admins

↓

Username + Password

Employees

↓

Employee Code + Password

Future support:

Face Recognition

OTP

Fingerprint

---

# Decision 006

Title

Attendance Verification

Status

Accepted

Decision

Attendance requires:

Trusted Device

+

QR Code

+

GPS Verification

GPS never blocks attendance.

Outside Radius

↓

Attendance accepted

↓

Notification sent.

---

# Decision 007

Title

QR Strategy

Status

Accepted

Decision

Each site owns its own QR Code.

Future versions:

Rotating QR

NFC

BLE Beacon

Guard Tour

---

# Decision 008

Title

Dynamic Website

Status

Accepted

Decision

Every public page must read directly from the CMS.

Static HTML generation is prohibited.

No manual rebuilds.

---

# Decision 009

Title

Employee Dashboard

Status

Accepted

Decision

The employee dashboard must display:

Profile Photo

Employee Name

Employee Code

Attendance Button

Current Shift

Attendance Summary

Leave Balance

Salary Summary

Notifications

Announcements

---

# Decision 010

Title

Development Strategy

Status

Accepted

Decision

Development is incremental.

Rules:

Small tasks.

Maximum 5 modified files.

No unrelated refactoring.

Stop after each completed task.

---

# Decision 011

Title

Coding Standards

Status

Accepted

Decision

Never redesign existing UI.

Never duplicate business logic.

Reuse existing components.

Maintain backward compatibility.

Architecture consistency has higher priority than development speed.

---

# Future Decisions

Every future architectural decision must be documented here before implementation.

Examples:

- Multi-Tenant Architecture
- Microservices (if ever adopted)
- AI Infrastructure
- Mobile Backend
- Object Storage
- Queue System
- Search Engine