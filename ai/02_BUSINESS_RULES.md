# 4B HUB - Business Rules

## Overview

This document defines the official business rules for the 4B HUB platform.

These rules are the single source of truth.

If any implementation conflicts with this document, this document takes priority.

---

# Authentication

## Admin

Administrators log in using:

- Username
- Password

RBAC controls all permissions.

---

## Employee

Employees log in using:

- Employee Code
- Password

Future authentication may support:

- Face Recognition
- Fingerprint
- OTP

---

# Trusted Device

Every employee must have one approved trusted device.

Rules:

- First login requires device registration.
- New devices remain pending until approved.
- Employees cannot approve their own devices.
- Administrators approve or reject devices.

---

# Attendance

Attendance requires:

- Authenticated employee.
- Trusted device.
- QR Code scan.
- GPS verification.

Attendance flow:

Employee Login

↓

Scan QR Code

↓

GPS Verification

↓

Attendance Recorded

↓

Notification if needed

---

# QR Code

Each work site has its own QR Code.

The QR Code identifies:

- Site
- Checkpoint
- Shift (Future)

Future versions will support:

- Rotating QR Codes
- NFC
- BLE Beacons

---

# GPS Verification

GPS is used for validation only.

GPS never blocks attendance.

Cases:

Inside Radius

Attendance Approved.

Outside Radius

Attendance Approved.

Status = Outside Radius.

Operations Manager receives notification.

GPS data must always be stored.

---

# Attendance States

Attendance Status:

- Present
- Late
- Absent
- On Leave
- Holiday
- Weekend
- Outside Radius

---

# Shift Management

Each employee belongs to:

- Site
- Shift

Shift defines:

- Start Time
- End Time
- Grace Period
- Overtime Rules

Late calculations depend on Shift settings.

---

# Employee Dashboard

Employee home screen displays:

- Profile Photo
- Employee Name
- Employee Code
- Job Title
- Department
- Assigned Site
- Current Shift
- Attendance Status
- Attendance Button
- Monthly Attendance Summary
- Monthly Absence Count
- Leave Balance
- Salary Summary
- Notifications
- Company Announcements

---

# Leave Management

Employees can:

- View Leave Balance
- Submit Leave Requests
- Track Request Status

Managers can:

- Approve Leave
- Reject Leave
- Request Additional Information

Leave Status:

- Pending
- Approved
- Rejected
- Cancelled

---

# Salary

Employees can view:

- Basic Salary
- Allowances
- Bonuses
- Overtime
- Deductions
- Penalties
- Net Salary

Employees cannot edit salary information.

---

# Notifications

Notifications are centralized.

Examples:

- Attendance Alerts
- Device Approval
- Leave Updates
- Company Announcements
- Payroll Notifications
- System Alerts

Notifications support:

- Read
- Unread

Future:

- Push Notifications
- Email
- SMS
- WhatsApp

---

# Public Website

The public website must always display live CMS data.

Changes made in the CMS must appear immediately.

No manual build process should be required.

The public website must never depend on static HTML generation.

---

# CMS

The CMS manages:

- Website Settings
- Pages
- Services
- Industries
- Careers
- Testimonials
- Employees
- Sites
- Reports

All changes must be validated before saving.

---

# Security

Business rules:

- Employees cannot access Admin routes.
- Admins cannot bypass RBAC.
- Every critical operation must be logged.
- Sensitive actions require authentication.
- Audit logs must be preserved.

---

# Future Modules

The architecture must support:

- Payroll
- Contracts
- Guard Tour
- Fleet Management
- Client Portal
- AI Assistant
- Mobile Application
- Analytics

Future modules must reuse existing architecture.