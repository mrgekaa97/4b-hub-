import { cookies } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { Employee } from "@prisma/client";

const COOKIE_NAME = "4b_employee_session";
const MAX_AGE_DAYS = Number(process.env.SESSION_MAX_AGE_DAYS ?? 7);

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createEmployeeSession(employeeId: string, deviceId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + MAX_AGE_DAYS * 24 * 60 * 60 * 1000);

  await prisma.employeeSession.create({
    data: { employeeId, deviceId, tokenHash: hashToken(token), expiresAt },
  });

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getSessionEmployee(): Promise<Employee | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.employeeSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { employee: true, device: true },
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) return null;
  if (!session.employee.isActive) return null;
  // A device that was trusted at login time but got revoked/rejected since
  // (e.g. by an admin after a phone was reported lost) must not keep working —
  // checked on every request, not just at login.
  if (session.device && session.device.status !== "APPROVED") return null;

  return session.employee;
}

export async function destroyEmployeeSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.employeeSession.updateMany({
      where: { tokenHash: hashToken(token) },
      data: { revokedAt: new Date() },
    });
  }
  cookies().delete(COOKIE_NAME);
}

export async function destroyAllSessionsForEmployee(employeeId: string) {
  await prisma.employeeSession.updateMany({
    where: { employeeId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
