# 4B HUB - Product Decisions

Last Updated: August 2026

---

# Purpose

This document records all major product and business decisions made during the project.

Unlike TECHNICAL_DECISIONS.md, this document focuses on product behavior, user experience, workflows, and business priorities.

These decisions should remain consistent throughout the project.

---

# Product Decision 001

Title

Target Industry

Status

Accepted

Decision

4B HUB is primarily designed for:

- Security Companies
- Guarding Companies
- Facility Management Companies
- Manpower Providers

Future versions may support additional industries without changing the core architecture.

---

# Product Decision 002

Title

Primary Users

Status

Accepted

Decision

The platform serves three user groups:

- Public Visitors
- Company Administrators
- Employees

Future:

- Customers
- Clients
- Partners

---

# Product Decision 003

Title

Employee Identity

Status

Accepted

Decision

Employees use an Employee Code as their primary identity.

Employee Code is unique.

Employees should not use email addresses for daily login.

Reason

Easier for field employees.

Matches real-world security companies.

---

# Product Decision 004

Title

Attendance Method

Status

Accepted

Decision

Attendance requires:

- Trusted Device
- QR Code
- GPS Verification

Attendance should remain simple for employees while providing enough verification for managers.

---

# Product Decision 005

Title

Employee Dashboard

Status

Accepted

Decision

The employee dashboard must focus on daily work.

Priority information:

- Attendance
- Current Shift
- Leave Balance
- Salary Summary
- Notifications
- Company Announcements

The dashboard should avoid unnecessary complexity.

---

# Product Decision 006

Title

Website Content

Status

Accepted

Decision

All public website content must be editable through the CMS.

Administrators should never edit HTML files.

---

# Product Decision 007

Title

User Experience

Status

Accepted

Decision

The platform should be simple enough for employees with minimal technical experience.

Every important action should require as few steps as possible.

---

# Product Decision 008

Title

Employee Self-Service

Status

Accepted

Decision

Employees should be able to perform daily tasks without contacting HR whenever possible.

Examples:

- Attendance
- Leave Requests
- Salary Review
- Notifications
- Profile Updates

---

# Product Decision 009

Title

Management Dashboard

Status

Accepted

Decision

Managers should receive real-time operational information.

Dashboards should prioritize actionable data over decorative charts.

---

# Product Decision 010

Title

Development Philosophy

Status

Accepted

Decision

The project will be built gradually.

A smaller working feature is preferred over a large unfinished module.

Quality and maintainability have higher priority than development speed.

---

# Future Product Decisions

Future product decisions should also be documented here, including:

- Pricing Model
- Multi-Tenant Strategy
- Customer Portal Features
- AI Features
- Mobile Application Experience
- Subscription Plans