import {
  authService,
  InvalidCredentialsError as UserInvalidCredentials,
  AccountLockedError as UserAccountLocked,
} from "@/lib/services/auth.service";
import {
  employeeAuthService,
  InvalidCredentialsError as EmployeeInvalidCredentials,
  AccountLockedError as EmployeeAccountLocked,
  DevicePendingApprovalError,
  DeviceBlockedError,
} from "@/lib/services/employeeAuth.service";
import { prisma } from "@/lib/prisma";

export type UnifiedLoginResult =
  | { kind: "user"; redirectTo: string }
  | { kind: "employee"; redirectTo: string };

/**
 * "Implement one unified login page... after authentication automatically
 * redirect users according to their role." This function is that dispatch:
 * it does NOT know or care whether the caller thinks they're an admin or an
 * employee — it tries the User table first (small, fixed set of office
 * accounts), then the Employee table, and returns where to send them.
 *
 * Trying User first is a deliberate, cheap default (far fewer admin rows
 * than employee rows, and username collisions across the two tables are
 * avoided by the seed/creation flows using different username conventions —
 * see admin/README.md once the Employees module adds employee creation UI).
 */
export async function unifiedLogin(
  identifier: string,
  password: string,
  context: {
    ipAddress?: string;
    userAgent?: string;
    deviceInfo?: { fingerprint: string; deviceName?: string; browser?: string; operatingSystem?: string };
  }
): Promise<UnifiedLoginResult> {
  const existingUser = await prisma.user.findUnique({ where: { username: identifier } });

  if (existingUser) {
    const user = await authService.login(identifier, password, {
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });
    const role = await prisma.role.findUnique({ where: { id: user.roleId } });
    // Both admin roles land on the same dashboard shell today — the shell
    // renders different widgets/nav items per permission (see Admin
    // Dashboard module), rather than maintaining two separate dashboard
    // route trees for what is fundamentally the same screen. `role` is
    // read here so that decision is visible/traceable, and so a future
    // role (e.g. read-only "Auditor") can redirect elsewhere without
    // touching the login page itself.
    void role;
    return { kind: "user", redirectTo: "/dashboard" };
  }

  // Not an admin username — try the Employee table. Requires deviceInfo;
  // the /login page's client script computes this before submitting (see
  // the Employee Portal module for the actual fingerprinting code).
  if (!context.deviceInfo) {
    throw new EmployeeInvalidCredentials();
  }

  await employeeAuthService.login(identifier, password, context.deviceInfo, {
    ipAddress: context.ipAddress,
  });
  return { kind: "employee", redirectTo: "/employee" };
}

export {
  UserInvalidCredentials,
  UserAccountLocked,
  EmployeeInvalidCredentials,
  EmployeeAccountLocked,
  DevicePendingApprovalError,
  DeviceBlockedError,
};
