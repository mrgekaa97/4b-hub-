import { prisma } from "@/lib/prisma";
import type { SiteInput } from "@/lib/validation/site.schema";

/**
 * Sites are operational data (which client, where, what radius), not
 * publishable website content — so this is a plain repository, not a
 * subclass of BaseContentRepository (that base class is specifically for
 * the Draft/Publish pattern used by Services/Industries/Careers/Pages).
 */
export const siteRepository = {
  async findAll() {
    return prisma.site.findMany({
      orderBy: { name: "asc" },
      include: {
        supervisor: { select: { id: true, fullName: true } },
        _count: { select: { assignedEmployees: true } },
      },
    });
  },

  async findById(id: string) {
    return prisma.site.findUnique({
      where: { id },
      include: {
        supervisor: { select: { id: true, fullName: true } },
        assignedEmployees: { select: { id: true, fullName: true, isActive: true } },
      },
    });
  },

  async create(data: SiteInput) {
    return prisma.site.create({ data });
  },

  async update(id: string, data: Partial<SiteInput>) {
    return prisma.site.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.site.delete({ where: { id } });
  },

  /** Sites with no checked-in attendance today — powers the dashboard's "sites missing guards" and this module's own filter. */
  async findMissingGuardsToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sitesWithAttendance = await prisma.attendanceRecord.findMany({
      where: { date: today, checkInAt: { not: null } },
      select: { siteId: true },
      distinct: ["siteId"],
    });
    const coveredIds = new Set(sitesWithAttendance.map((r) => r.siteId));

    const activeSites = await prisma.site.findMany({ where: { isActive: true } });
    return activeSites.filter((s) => !coveredIds.has(s.id));
  },
};
