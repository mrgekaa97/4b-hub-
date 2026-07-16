import { prisma } from "@/lib/prisma";
import type { DeviceStatus } from "@prisma/client";

export const deviceRepository = {
  async findAll() {
    return prisma.device.findMany({
      // Postgres enums sort by declaration order, and DeviceStatus is declared
      // PENDING, APPROVED, REJECTED, REVOKED — so ascending sort surfaces
      // devices needing a decision first, which is exactly what this list should do.
      orderBy: [{ status: "asc" }, { firstSeenAt: "desc" }],
      include: {
        employee: { select: { id: true, fullName: true, employeeCode: true } },
        approvedBy: { select: { id: true, displayName: true } },
      },
    });
  },

  async findById(id: string) {
    return prisma.device.findUnique({
      where: { id },
      include: { employee: { select: { id: true, fullName: true, employeeCode: true } } },
    });
  },

  async setStatus(id: string, status: DeviceStatus, approvedById?: string) {
    return prisma.device.update({
      where: { id },
      data: {
        status,
        approvedById: status === "APPROVED" ? approvedById : undefined,
        approvedAt: status === "APPROVED" ? new Date() : undefined,
      },
    });
  },

  async delete(id: string) {
    return prisma.device.delete({ where: { id } });
  },
};
