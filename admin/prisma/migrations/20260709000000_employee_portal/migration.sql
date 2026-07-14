-- ============================================================
-- 4B HUB — Employee Portal + Testimonials migration
-- Additive only: does not alter any table from 20260707000000_init.
-- Same caveat as the first migration: hand-authored because no live
-- Postgres connection was available while extending the schema.
-- Run `npx prisma validate` then `npx prisma migrate dev` against a
-- real database to have Prisma verify/regenerate this properly.
-- ============================================================

-- New enums
CREATE TYPE "DeviceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVOKED');
CREATE TYPE "ShiftType" AS ENUM ('MORNING', 'EVENING', 'NIGHT', 'CUSTOM');
CREATE TYPE "LocationStatus" AS ENUM ('INSIDE_SITE', 'NEAR_SITE', 'OUTSIDE_SITE');
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'LATE', 'ABSENT', 'EARLY_LEAVE');
CREATE TYPE "NotificationType" AS ENUM (
  'NEW_QUOTE_REQUEST', 'NEW_CONTACT_MESSAGE', 'NEW_JOB_APPLICATION',
  'EMPLOYEE_CHECK_IN', 'EMPLOYEE_CHECK_OUT', 'ATTENDANCE_OUTSIDE_SITE',
  'UNKNOWN_DEVICE_LOGIN', 'WEBSITE_SETTINGS_UPDATED', 'MEDIA_UPLOADED',
  'NEW_TRUSTED_DEVICE_REQUEST', 'PASSWORD_CHANGED'
);
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- Testimonials
CREATE TABLE "testimonials" (
  "id" TEXT NOT NULL,
  "quoteText" TEXT NOT NULL,
  "clientName" TEXT NOT NULL,
  "clientRole" TEXT,
  "clientCompany" TEXT,
  "avatarInitial" TEXT,
  "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- Sites (created before Employees since Employee.assignedSiteId references it)
CREATE TABLE "sites" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "clientName" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "allowedRadiusMeters" INTEGER NOT NULL DEFAULT 150,
  "supervisorId" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);

-- Employees
CREATE TABLE "employees" (
  "id" TEXT NOT NULL,
  "employeeCode" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "username" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
  "nationalId" TEXT,
  "isSupervisor" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
  "lockedUntil" TIMESTAMP(3),
  "lastLoginAt" TIMESTAMP(3),
  "assignedSiteId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "employees_employeeCode_key" ON "employees"("employeeCode");
CREATE UNIQUE INDEX "employees_username_key" ON "employees"("username");
ALTER TABLE "employees" ADD CONSTRAINT "employees_assignedSiteId_fkey"
  FOREIGN KEY ("assignedSiteId") REFERENCES "sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "sites" ADD CONSTRAINT "sites_supervisorId_fkey"
  FOREIGN KEY ("supervisorId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Devices
CREATE TABLE "devices" (
  "id" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "deviceName" TEXT,
  "browser" TEXT,
  "operatingSystem" TEXT,
  "status" "DeviceStatus" NOT NULL DEFAULT 'PENDING',
  "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "approvedById" TEXT,
  "approvedAt" TIMESTAMP(3),
  CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "devices_employeeId_fingerprint_key" ON "devices"("employeeId", "fingerprint");
ALTER TABLE "devices" ADD CONSTRAINT "devices_employeeId_fkey"
  FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "devices" ADD CONSTRAINT "devices_approvedById_fkey"
  FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Employee sessions
CREATE TABLE "employee_sessions" (
  "id" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "deviceId" TEXT,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),
  CONSTRAINT "employee_sessions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "employee_sessions_tokenHash_key" ON "employee_sessions"("tokenHash");
CREATE INDEX "employee_sessions_employeeId_idx" ON "employee_sessions"("employeeId");
ALTER TABLE "employee_sessions" ADD CONSTRAINT "employee_sessions_employeeId_fkey"
  FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employee_sessions" ADD CONSTRAINT "employee_sessions_deviceId_fkey"
  FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Shifts
CREATE TABLE "shifts" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "ShiftType" NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "siteId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_siteId_fkey"
  FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Shift assignments
CREATE TABLE "shift_assignments" (
  "employeeId" TEXT NOT NULL,
  "shiftId" TEXT NOT NULL,
  "isSupervisorRole" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "shift_assignments_pkey" PRIMARY KEY ("employeeId", "shiftId")
);
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_employeeId_fkey"
  FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_shiftId_fkey"
  FOREIGN KEY ("shiftId") REFERENCES "shifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Attendance records
CREATE TABLE "attendance_records" (
  "id" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "siteId" TEXT NOT NULL,
  "shiftId" TEXT,
  "date" TIMESTAMP(3) NOT NULL,

  "checkInAt" TIMESTAMP(3),
  "checkInLat" DOUBLE PRECISION,
  "checkInLng" DOUBLE PRECISION,
  "checkInAccuracyMeters" DOUBLE PRECISION,
  "checkInMapsLink" TEXT,
  "checkInIp" TEXT,
  "checkInDeviceFingerprint" TEXT,
  "checkInBrowser" TEXT,
  "checkInOs" TEXT,
  "checkInDeviceName" TEXT,
  "checkInLocationStatus" "LocationStatus",

  "checkOutAt" TIMESTAMP(3),
  "checkOutLat" DOUBLE PRECISION,
  "checkOutLng" DOUBLE PRECISION,
  "checkOutAccuracyMeters" DOUBLE PRECISION,
  "checkOutMapsLink" TEXT,
  "checkOutIp" TEXT,
  "checkOutDeviceFingerprint" TEXT,
  "checkOutBrowser" TEXT,
  "checkOutOs" TEXT,
  "checkOutDeviceName" TEXT,
  "checkOutLocationStatus" "LocationStatus",

  "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
  "lateMinutes" INTEGER NOT NULL DEFAULT 0,
  "earlyLeaveMinutes" INTEGER NOT NULL DEFAULT 0,
  "overtimeMinutes" INTEGER NOT NULL DEFAULT 0,
  "workDurationMinutes" INTEGER,
  "notes" TEXT,

  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "attendance_records_employeeId_date_key" ON "attendance_records"("employeeId", "date");
CREATE INDEX "attendance_records_siteId_date_idx" ON "attendance_records"("siteId", "date");
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_employeeId_fkey"
  FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_siteId_fkey"
  FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Notifications
CREATE TABLE "notifications" (
  "id" TEXT NOT NULL,
  "recipientUserId" TEXT,
  "recipientEmployeeId" TEXT,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "priority" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "actionUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "notifications_recipientUserId_idx" ON "notifications"("recipientUserId");
CREATE INDEX "notifications_recipientEmployeeId_idx" ON "notifications"("recipientEmployeeId");
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientUserId_fkey"
  FOREIGN KEY ("recipientUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientEmployeeId_fkey"
  FOREIGN KEY ("recipientEmployeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
