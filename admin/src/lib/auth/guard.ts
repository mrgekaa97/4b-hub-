import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { userHasPermission } from "@/lib/auth/rbac";
import type { PermissionKey } from "@/lib/constants/permissions";
import type { User } from "@prisma/client";

export class ForbiddenError extends Error {
  constructor(message = "غير مصرح لك بالوصول إلى هذا القسم") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * For Server Components / Server Actions in the (dashboard) route group.
 * Redirects to /login if there's no valid session — never returns null,
 * so callers don't need to null-check afterwards.
 */
export async function requireUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/** Same as requireUser(), plus a specific permission check. */
export async function requirePermission(permission: PermissionKey): Promise<User> {
  const user = await requireUser();
  const allowed = await userHasPermission(user.id, permission);
  if (!allowed) {
    // A logged-in user hitting a page they don't have rights to is a
    // real (if rare, with one role today) case — show a 403, don't
    // silently bounce them back to login as if they weren't authenticated.
    redirect("/403");
  }
  return user;
}

/**
 * For API route handlers, where redirect() doesn't apply — returns either
 * the user or a ready-to-return NextResponse, so the route can do:
 *   const result = await requireUserApi();
 *   if (result instanceof NextResponse) return result;
 *   const user = result;
 */
export async function requireUserApi(): Promise<User | NextResponse> {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return user;
}

export async function requirePermissionApi(
  permission: PermissionKey
): Promise<User | NextResponse> {
  const result = await requireUserApi();
  if (result instanceof NextResponse) return result;

  const allowed = await userHasPermission(result.id, permission);
  if (!allowed) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return result;
}
