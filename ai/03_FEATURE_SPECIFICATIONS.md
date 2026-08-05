# 4B HUB - Feature Specifications

## Purpose

This document defines the functional specifications of every module in the system.

Unlike BUSINESS_RULES.md, which defines business logic, this document describes how each feature should work from the user's perspective.

If implementation details conflict with this document, discuss the change before implementation.

---

# Public Website

## Home

Purpose

Present the company professionally and generate leads.

Sections

- Hero Banner
- About Summary
- Services Preview
- Industries
- Statistics
- Why Choose Us
- Testimonials
- Partners
- Contact CTA

Requirements

- Fully dynamic
- Managed through CMS
- SEO optimized
- Mobile first

---

## Services

Purpose

Display company services.

Requirements

- Dynamic list
- Icon
- Title
- Description
- Details
- Display order
- Published / Hidden

Future

Categories

Service search

Related services

---

## Careers

Purpose

Publish available jobs.

Requirements

- Job title
- Department
- Location
- Employment Type
- Salary (optional)
- Apply Form

Future

ATS integration

CV Parser

AI Interview Assistant

---

# Admin Dashboard

Purpose

Provide real-time company overview.

Widgets

- Employees Today
- Attendance
- Absence
- Notifications
- Pending Requests
- Active Sites
- Quick Actions

Requirements

Permission-aware

Responsive

Fast loading

---

# Employee Portal

Purpose

Allow employees to manage daily activities.

Modules

Attendance

Leave Requests

Salary

Notifications

Announcements

Profile

Documents (Future)

---

# Attendance

Current Flow

Employee Login

↓

Trusted Device

↓

QR Scan

↓

GPS Verification

↓

Attendance Recorded

↓

Notification

Future

- QR Rotation
- NFC
- BLE Beacon
- Face Recognition

---

# Leave Requests

Employee

- Create Request
- Cancel Pending Request
- View History

Manager

- Approve
- Reject
- Add Notes

---

# Salary

Employee can view:

- Monthly Salary
- Bonuses
- Deductions
- Overtime
- Penalties
- Net Salary

Historical records should remain accessible.

---

# Reports

Reports include:

- Attendance
- Absence
- Late
- Overtime
- Leave
- Payroll
- Recruitment
- Operations

Reports should support:

- Export PDF
- Export Excel
- Filters
- Date Range

---

# Notifications

Types

- Attendance
- Leave
- Payroll
- Device Approval
- Company News
- System Alerts

Future

Push Notifications

Email

SMS

WhatsApp

---

# Media Library

Features

- Upload
- Organize
- Search
- Replace
- Delete

Future

Cloud Storage

Image Optimization

Version History

---

# Future Modules

Guard Tour

Fleet Management

Payroll

Contracts

Customer Portal

AI Assistant

Mobile Applications

Analytics