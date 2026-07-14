import { prisma } from "@/lib/prisma";
import type { NotificationType, NotificationPriority } from "@prisma/client";

/**
 * One service for the whole Notification Center, regardless of recipient
 * type. Exactly one of userId / employeeId must be passed — enforced here
 * (not at the DB level, see schema comment) so every call site goes through
 * this single check rather than each module inventing its own rule.
 *
 * "Prepare the architecture for future real-time notifications": this
 * service is the seam where that plugs in later — e.g. notify() could also
 * publish to a WebSocket/SSE channel or a push service, without changing
 * any caller, since callers only ever see notify()/list()/markRead().
 */
function assertSingleRecipient(userId?: string, employeeId?: string) {
  if ((userId && employeeId) || (!userId && !employeeId)) {
    throw new Error("notify() requires exactly one of userId or employeeId");
  }
}

export const notificationService = {
  async notify(params: {
    userId?: string;
    employeeId?: string;
    type: NotificationType;
    title: string;
    description: string;
    priority?: NotificationPriority;
    actionUrl?: string;
  }) {
    assertSingleRecipient(params.userId, params.employeeId);
    return prisma.notification.create({
      data: {
        recipientUserId: params.userId,
        recipientEmployeeId: params.employeeId,
        type: params.type,
        title: params.title,
        description: params.description,
        priority: params.priority ?? "NORMAL",
        actionUrl: params.actionUrl,
      },
    });
  },

  /** Convenience for events that should reach every admin/ops user (e.g. a new device request). */
  async notifyAllAdmins(params: {
    type: NotificationType;
    title: string;
    description: string;
    priority?: NotificationPriority;
    actionUrl?: string;
  }) {
    const admins = await prisma.user.findMany({ where: { isActive: true }, select: { id: true } });
    await Promise.all(
      admins.map((a) =>
        this.notify({ userId: a.id, type: params.type, title: params.title, description: params.description, priority: params.priority, actionUrl: params.actionUrl })
      )
    );
  },

  async listForUser(userId: string, opts: { unreadOnly?: boolean; limit?: number } = {}) {
    return prisma.notification.findMany({
      where: { recipientUserId: userId, ...(opts.unreadOnly ? { isRead: false } : {}) },
      orderBy: { createdAt: "desc" },
      take: opts.limit ?? 20,
    });
  },

  async listForEmployee(employeeId: string, opts: { unreadOnly?: boolean; limit?: number } = {}) {
    return prisma.notification.findMany({
      where: { recipientEmployeeId: employeeId, ...(opts.unreadOnly ? { isRead: false } : {}) },
      orderBy: { createdAt: "desc" },
      take: opts.limit ?? 20,
    });
  },

  async markRead(notificationId: string) {
    return prisma.notification.update({ where: { id: notificationId }, data: { isRead: true } });
  },

  async markAllReadForUser(userId: string) {
    return prisma.notification.updateMany({ where: { recipientUserId: userId, isRead: false }, data: { isRead: true } });
  },

  async markAllReadForEmployee(employeeId: string) {
    return prisma.notification.updateMany({ where: { recipientEmployeeId: employeeId, isRead: false }, data: { isRead: true } });
  },
};
