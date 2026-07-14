import { prisma } from "@/lib/prisma";
import type { PermissionKey } from "@/lib/constants/permissions";

/**
 * Loads the set of permission keys granted to a user's role.
 * Kept as its own function (rather than inlined) so it can be swapped
 * for a cached lookup later without touching call sites.
 */
export async function getUserPermissions(userId: string): Promise<Set<PermissionKey>> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: { include: { permissions: { include: { permission: true } } } } },
  });
  if (!user) return new Set();

  return new Set(user.role.permissions.map((rp) => rp.permission.key as PermissionKey));
}

export async function userHasPermission(userId: string, permission: PermissionKey): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.has(permission);
}
