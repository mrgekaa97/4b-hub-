-- ============================================================
-- 4 Brothers Admin CMS — initial migration
-- Mirrors prisma/schema.prisma exactly.
--
-- NOTE ON HOW THIS FILE WAS PRODUCED:
-- This migration was authored by hand against the schema, because
-- generating it normally requires `prisma migrate dev` to run against
-- a live PostgreSQL connection, which wasn't available while building
-- this foundation. Before relying on it:
--   1. Point DATABASE_URL at a real empty Postgres database.
--   2. Run `npx prisma migrate resolve --applied 20260707000000_init`
--      only if you're SURE the schema below already matches the DB;
--      otherwise, safer path: delete this folder and run
--      `npx prisma migrate dev --name init` to have Prisma generate
--      (and verify) this file itself from schema.prisma.
-- Either way, `npx prisma validate` should be run first.
-- ============================================================

-- Enums
CREATE TYPE "SettingValueType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'JSON');
CREATE TYPE "ActivityAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'UNPUBLISH', 'LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'STATUS_CHANGE');
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED');
CREATE TYPE "QuoteRequestStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');
CREATE TYPE "ContactMessageStatus" AS ENUM ('UNREAD', 'READ');

-- Roles
CREATE TABLE "roles" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "isSystem" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "roles_key_key" ON "roles"("key");

-- Permissions
CREATE TABLE "permissions" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "description" TEXT,
  "group" TEXT NOT NULL,
  CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- Role <-> Permission join table
CREATE TABLE "role_permissions" (
  "roleId" TEXT NOT NULL,
  "permissionId" TEXT NOT NULL,
  CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId", "permissionId")
);
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey"
  FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey"
  FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Users
CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "email" TEXT,
  "displayName" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "roleId" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
  "lockedUntil" TIMESTAMP(3),
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey"
  FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Sessions
CREATE TABLE "sessions" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),
  CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "sessions_tokenHash_key" ON "sessions"("tokenHash");
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Settings (dynamic key/value)
CREATE TABLE "settings" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "group" TEXT NOT NULL,
  "valueType" "SettingValueType" NOT NULL DEFAULT 'STRING',
  "value" JSONB NOT NULL,
  "label" TEXT,
  "updatedById" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");
CREATE INDEX "settings_group_idx" ON "settings"("group");
ALTER TABLE "settings" ADD CONSTRAINT "settings_updatedById_fkey"
  FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Activity log
CREATE TABLE "activity_logs" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "action" "ActivityAction" NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "summary" TEXT NOT NULL,
  "metadata" JSONB,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "activity_logs_entityType_entityId_idx" ON "activity_logs"("entityType", "entityId");
CREATE INDEX "activity_logs_createdAt_idx" ON "activity_logs"("createdAt");
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Content revisions (shared draft/publish history)
CREATE TABLE "content_revisions" (
  "id" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "content_revisions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "content_revisions_entityType_entityId_idx" ON "content_revisions"("entityType", "entityId");
ALTER TABLE "content_revisions" ADD CONSTRAINT "content_revisions_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Pages (Home / About editors)
CREATE TABLE "pages" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "draftData" JSONB NOT NULL,
  "publishedData" JSONB,
  "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- Media assets
CREATE TABLE "media_assets" (
  "id" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "altText" TEXT,
  "label" TEXT,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "uploadedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploadedById_fkey"
  FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Services
CREATE TABLE "services" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "includes" JSONB NOT NULL,
  "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- Industries
CREATE TABLE "industries" (
  "id" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "industries_pkey" PRIMARY KEY ("id")
);

-- Career postings
CREATE TABLE "career_postings" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "requirements" JSONB NOT NULL,
  "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "isOpen" BOOLEAN NOT NULL DEFAULT true,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "career_postings_pkey" PRIMARY KEY ("id")
);

-- Quote requests
CREATE TABLE "quote_requests" (
  "id" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "contactName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "industry" TEXT NOT NULL,
  "guardsRange" TEXT,
  "location" TEXT NOT NULL,
  "preferredContact" TEXT,
  "message" TEXT,
  "status" "QuoteRequestStatus" NOT NULL DEFAULT 'NEW',
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "quote_requests_pkey" PRIMARY KEY ("id")
);

-- Contact messages
CREATE TABLE "contact_messages" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "subject" TEXT,
  "message" TEXT NOT NULL,
  "status" "ContactMessageStatus" NOT NULL DEFAULT 'UNREAD',
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- Dynamic form definitions + submissions
CREATE TABLE "dynamic_form_definitions" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "fieldsSchema" JSONB NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "dynamic_form_definitions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "dynamic_form_definitions_key_key" ON "dynamic_form_definitions"("key");

CREATE TABLE "dynamic_form_submissions" (
  "id" TEXT NOT NULL,
  "formId" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "dynamic_form_submissions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "dynamic_form_submissions_formId_idx" ON "dynamic_form_submissions"("formId");
ALTER TABLE "dynamic_form_submissions" ADD CONSTRAINT "dynamic_form_submissions_formId_fkey"
  FOREIGN KEY ("formId") REFERENCES "dynamic_form_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
