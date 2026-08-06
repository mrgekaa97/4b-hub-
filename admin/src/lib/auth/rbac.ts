import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { PermissionKey } from "@/lib/constants/permissions";

/**
 * Loads the set of permission keys granted to a user's role.
 * Wrapped in React's cache() so repeated calls with the same userId within a
 * single request (layout + requirePermission() + any page's own explicit
 * call) reuse the same result instead of each re-querying the DB —
 * request-scoped only, never shared across requests or users, so every
 * requirePermission(X) call still enforces X exactly as before.
 */
export const getUserPermissions = cache(async (userId: string): Promise<Set<PermissionKey>> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: { include: { permissions: { include: { permission: true } } } } },
  });
  if (!user) return new Set();

  return new Set(user.role.permissions.map((rp) => rp.permission.key as PermissionKey));
});

export async function userHasPermission(userId: string, permission: PermissionKey): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.has(permission);
}
