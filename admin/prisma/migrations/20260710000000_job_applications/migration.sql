-- ============================================================
-- Job Applications — additive migration
-- ============================================================
CREATE TYPE "JobApplicationStatus" AS ENUM ('NEW', 'REVIEWING', 'INTERVIEW', 'REJECTED', 'HIRED');

CREATE TABLE "job_applications" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "roleApplied" TEXT NOT NULL,
  "experience" TEXT,
  "message" TEXT,
  "status" "JobApplicationStatus" NOT NULL DEFAULT 'NEW',
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);
