import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createEmployeeSession, destroyEmployeeSession } from "@/lib/auth/employee-session";
import { activityLogService } from "@/lib/services/activityLog.service";
import { notificationService } from "@/lib/services/notification.service";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export class InvalidCredentialsError extends Error {
  constructor() {
    super("اسم المستخدم أو كلمة المرور غير صحيحة");
    this.name = "InvalidCredentialsError";
  }
}
export class AccountLockedError extends Error {
  constructor(public retryAfterMinutes: number) {
    super(`الحساب مقفل مؤقتًا. حاول مرة أخرى بعد ${retryAfterMinutes} دقيقة`);
    this.name = "AccountLockedError";
  }
}
/** Not an error the login form should show as "wrong password" — the
 * credentials were correct; the device just isn't cleared yet. */
export class DevicePendingApprovalError extends Error {
  constructor() {
    super("هذا الجهاز جديد ويحتاج موافقة المدير قبل استخدامه لأول مرة");
    this.name = "DevicePendingApprovalError";
  }
}
export class DeviceBlockedError extends Error {
  constructor() {
    super("تم إيقاف هذا الجهاز. تواصل مع المدير");
    this.name = "DeviceBlockedError";
  }
}

export const employeeAuthService = {
  /**
   * @param deviceInfo Client-computed fingerprint + parsed UA — see
   *   lib/device/fingerprint.ts for how the fingerprint itself is derived.
   */
  async login(
    username: string,
    password: string,
    deviceInfo: { fingerprint: string; deviceName?: string; browser?: string; operatingSystem?: string },
    meta: { ipAddress?: string } = {}
  ) {
    const employee = await prisma.employee.findUnique({ where: { username } });

    if (!employee || !employee.isActive) {
      throw new InvalidCredentialsError();
    }

    if (employee.lockedUntil && employee.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((employee.lockedUntil.getTime() - Date.now()) / 60000);
      throw new AccountLockedError(minutesLeft);
    }

    const valid = await verifyPassword(password, employee.passwordHash);
    if (!valid) {
      const attempts = employee.failedLoginAttempts + 1;
      const shouldLock = attempts >= MAX_FAILED_ATTEMPTS;
      await prisma.employee.update({
        where: { id: employee.id },
        data: {
          failedLoginAttempts: shouldLock ? 0 : attempts,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000) : employee.lockedUntil,
        },
      });
      if (shouldLock) throw new AccountLockedError(LOCKOUT_MINUTES);
      throw new InvalidCredentialsError();
    }

    // --- Device trust check (per product requirement: first login registers
    // the device; new devices need admin approval — never silently reject
    // the login outright, but don't grant portal access either). ---
    let device = await prisma.device.findUnique({
      where: { employeeId_fingerprint: { employeeId: employee.id, fingerprint: deviceInfo.fingerprint } },
    });

    if (!device) {
      device = await prisma.device.create({
        data: {
          employeeId: employee.id,
          fingerprint: deviceInfo.fingerprint,
          deviceName: deviceInfo.deviceName,
          browser: deviceInfo.browser,
          operatingSystem: deviceInfo.operatingSystem,
          status: "PENDING",
        },
      });

      await notificationService.notifyAllAdmins({
        type: "NEW_TRUSTED_DEVICE_REQUEST",
        title: "طلب جهاز جديد يحتاج موافقة",
        description: `${employee.fullName} حاول الدخول من جهاز غير معروف (${deviceInfo.deviceName ?? "غير معروف"})`,
        priority: "HIGH",
        actionUrl: `/dashboard/devices/${device.id}`,
      });
      await activityLogService.log({
        action: "CREATE",
        entityType: "Device",
        entityId: device.id,
        summary: `جهاز جديد بانتظار الموافقة لموظف: ${employee.fullName}`,
        ipAddress: meta.ipAddress,
      });

      throw new DevicePendingApprovalError();
    }

    if (device.status === "PENDING") {
      throw new DevicePendingApprovalError();
    }
    if (device.status === "REJECTED" || device.status === "REVOKED") {
      throw new DeviceBlockedError();
    }

    await prisma.device.update({ where: { id: device.id }, data: { lastSeenAt: new Date() } });

    // Successful login
    await prisma.employee.update({
      where: { id: employee.id },
      data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });
    await createEmployeeSession(employee.id, device.id);
    await activityLogService.log({
      action: "LOGIN",
      entityType: "Employee",
      entityId: employee.id,
      summary: `تسجيل دخول موظف: ${employee.fullName}`,
      ipAddress: meta.ipAddress,
    });

    return employee;
  },

  async logout(employeeId?: string) {
    await destroyEmployeeSession();
    if (employeeId) {
      await activityLogService.log({
        action: "LOGOUT",
        entityType: "Employee",
        entityId: employeeId,
        summary: "تسجيل خروج موظف",
      });
    }
  },
};
