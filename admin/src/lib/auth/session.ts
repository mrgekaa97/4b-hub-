import { cookies } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

const COOKIE_NAME = "4b_admin_session";
const MAX_AGE_DAYS = Number(process.env.SESSION_MAX_AGE_DAYS ?? 7);

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a new server-side session row and sets the opaque token as an
 * httpOnly, secure, sameSite=lax cookie. Only the SHA-256 hash of the token
 * is ever persisted — the raw token exists only in the cookie itself, so a
 * database leak alone can't be used to forge a session.
 */
export async function createSession(
  userId: string,
  meta: { userAgent?: string; ipAddress?: string } = {}
) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + MAX_AGE_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
      expiresAt,
    },
  });

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Reads the session cookie (if any) and returns the active User, or null. */
export async function getSessionUser(): Promise<User | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    return null;
  }
  if (!session.user.isActive) {
    return null;
  }
  return session.user;
}

/** Revokes the current session (server-side) and clears the cookie. */
export async function destroySession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.updateMany({
      where: { tokenHash: hashToken(token) },
      data: { revokedAt: new Date() },
    });
  }
  cookies().delete(COOKIE_NAME);
}

/** Revokes every session for a user — used by "log out everywhere" / disabling a user. */
export async function destroyAllSessionsForUser(userId: string) {
  await prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
