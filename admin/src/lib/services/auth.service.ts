import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { activityLogService } from "@/lib/services/activityLog.service";

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
    super(`الحساب مقفل مؤقتًا بسبب محاولات دخول متكررة. حاول مرة أخرى بعد ${retryAfterMinutes} دقيقة`);
    this.name = "AccountLockedError";
  }
}

export const authService = {
  /**
   * Verifies credentials, enforces lockout, creates a session on success.
   * Every outcome — success or failure — writes to the activity log,
   * because login attempts are exactly the kind of event an audit trail
   * exists for.
   */
  async login(
    username: string,
    password: string,
    meta: { userAgent?: string; ipAddress?: string } = {}
  ) {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !user.isActive) {
      await activityLogService.log({
        action: "LOGIN_FAILED",
        entityType: "User",
        summary: `محاولة دخول فاشلة باسم مستخدم غير موجود: ${username}`,
        ipAddress: meta.ipAddress,
      });
      throw new InvalidCredentialsError();
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new AccountLockedError(minutesLeft);
    }

    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
      const attempts = user.failedLoginAttempts + 1;
      const shouldLock = attempts >= MAX_FAILED_ATTEMPTS;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: shouldLock ? 0 : attempts,
          lockedUntil: shouldLock
            ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
            : user.lockedUntil,
        },
      });

      await activityLogService.log({
        userId: user.id,
        action: "LOGIN_FAILED",
        entityType: "User",
        entityId: user.id,
        summary: shouldLock
          ? `تم قفل الحساب مؤقتًا بعد ${MAX_FAILED_ATTEMPTS} محاولات فاشلة`
          : `محاولة دخول فاشلة (${attempts}/${MAX_FAILED_ATTEMPTS})`,
        ipAddress: meta.ipAddress,
      });

      if (shouldLock) throw new AccountLockedError(LOCKOUT_MINUTES);
      throw new InvalidCredentialsError();
    }

    // Successful login — reset the counter and record it.
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });

    await createSession(user.id, meta);

    await activityLogService.log({
      userId: user.id,
      action: "LOGIN",
      entityType: "User",
      entityId: user.id,
      summary: `تسجيل دخول ناجح: ${user.displayName}`,
      ipAddress: meta.ipAddress,
    });

    return user;
  },

  async logout(userId?: string) {
    await destroySession();
    if (userId) {
      await activityLogService.log({
        userId,
        action: "LOGOUT",
        entityType: "User",
        entityId: userId,
        summary: "تسجيل خروج",
      });
    }
  },
};
