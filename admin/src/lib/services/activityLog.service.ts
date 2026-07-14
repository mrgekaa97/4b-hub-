import { prisma } from "@/lib/prisma";
import type { ActivityAction } from "@prisma/client";

export const activityLogService = {
  async log(entry: {
    userId?: string;
    action: ActivityAction;
    entityType: string;
    entityId?: string;
    summary: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
  }) {
    return prisma.activityLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        summary: entry.summary,
        metadata: entry.metadata as any,
        ipAddress: entry.ipAddress,
      },
    });
  },

  /** Powers the Dashboard Overview's "recent activity" feed. */
  async recent(limit = 10) {
    return prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { user: { select: { displayName: true } } },
    });
  },

  async forEntity(entityType: string, entityId: string) {
    return prisma.activityLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { displayName: true } } },
    });
  },
};
