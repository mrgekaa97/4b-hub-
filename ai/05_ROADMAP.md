# 4B HUB - Product Roadmap

Last Updated: August 2026

---

# Vision

4B HUB is being developed as a complete ERP platform for security, guarding, facility management, and manpower companies.

The platform is designed to grow gradually while preserving architecture consistency and code quality.

Every version should build upon the previous one without introducing technical debt.

---

# Current Stage

Version 1.1

Primary Focus:

Public Website Migration

Target:

Merge the legacy website into the existing Next.js application and make all public content fully dynamic.

---

# Version 1.1

## Public Website

- Public Route Group
- Dynamic Home Page
- Dynamic Services
- Dynamic About
- Dynamic Industries
- Dynamic Testimonials
- Dynamic Careers
- Dynamic Contact
- Website Settings
- SEO Improvements

## CMS

- Website Settings
- Services Management
- Industries Management
- Testimonials Management
- Careers Management

Goal:

Completely remove the dependency on website/build.py.

---

# Version 1.2

## HR

- Employees CRUD
- Departments
- Job Titles
- Employee Documents

## Operations

- Sites CRUD
- Shift Management
- Shift Assignment
- Attendance Review
- Attendance Corrections

## Reports

- Attendance Reports
- Leave Reports
- Dashboard Analytics

## Media

- Media Library
- Cloud Storage
- Image Optimization

Goal:

Complete daily company operations.

---

# Version 1.3

## Employee Portal

- Leave Requests
- Salary Details
- Monthly Attendance Summary
- Deductions
- Overtime
- Company Announcements
- Employee Documents

## Notifications

- Push Notifications
- Email Notifications
- SMS Notifications
- WhatsApp Notifications

Goal:

Provide employees with a complete self-service portal.

---

# Version 2.0

## Payroll

- Salary Calculation
- Overtime
- Bonuses
- Penalties
- Payslips

## Contracts

- Customer Contracts
- Employee Contracts
- Expiration Alerts

## Customers

- Customer Management
- Branches
- Contacts

Goal:

Transform the platform into a complete business management system.

---

# Version 2.5

## Guard Tour

- QR Checkpoints
- NFC Checkpoints
- BLE Beacon Support
- Patrol Reports
- Missed Checkpoints

## Fleet

- Vehicles
- Drivers
- Maintenance
- Fuel Tracking

Goal:

Support field operations.

---

# Version 3.0

## Artificial Intelligence

- AI Assistant
- AI Reports
- AI Analytics
- AI Recruitment
- AI Document Search

## Mobile

- Android App
- iOS App
- Offline Mode
- Push Notifications

## Customer Portal

- Customer Dashboard
- Attendance Reports
- Invoice Downloads
- Requests
- Live Notifications

Goal:

Become a complete cloud ERP platform.

---

# Development Priorities

The order of implementation should always be:

1. Core Infrastructure
2. Authentication
3. Business Logic
4. Operations
5. Reports
6. Automation
7. Artificial Intelligence

---

# Long-Term Principles

The project should always remain:

- Modular
- Scalable
- Secure
- Mobile First
- API Driven
- Database Driven

Business logic should never be duplicated.

Architecture consistency is more important than development speed.

Every new feature should integrate naturally with the existing architecture.

---

# Success Criteria

The project will be considered complete when:

- Every module is fully dynamic.
- Every module is manageable from the CMS.
- Employees can perform all daily operations digitally.
- Managers can monitor operations in real time.
- Customers have self-service access.
- The platform can support multiple companies in the future (Multi-Tenant Ready).