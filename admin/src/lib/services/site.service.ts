import { siteRepository } from "@/lib/repositories/site.repository";
import { siteSchema, type SiteInput } from "@/lib/validation/site.schema";
import { activityLogService } from "@/lib/services/activityLog.service";
import { prisma } from "@/lib/prisma";

export class SiteHasAssignedEmployeesError extends Error {
  constructor(count: number) {
    super(`لا يمكن حذف هذا الموقع — يوجد ${count} موظف معيّن عليه حاليًا. أعد تعيينهم أولًا`);
    this.name = "SiteHasAssignedEmployeesError";
  }
}

export const siteService = {
  async list() {
    return siteRepository.findAll();
  },

  async get(id: string) {
    return siteRepository.findById(id);
  },

  async create(raw: unknown, actorId?: string) {
    const data = siteSchema.parse(raw);
    const site = await siteRepository.create(data);
    await activityLogService.log({
      userId: actorId,
      action: "CREATE",
      entityType: "Site",
      entityId: site.id,
      summary: `إنشاء موقع جديد: ${site.name}`,
    });
    return site;
  },

  async update(id: string, raw: unknown, actorId?: string) {
    const data = siteSchema.partial().parse(raw);
    const site = await siteRepository.update(id, data);
    await activityLogService.log({
      userId: actorId,
      action: "UPDATE",
      entityType: "Site",
      entityId: site.id,
      summary: `تحديث موقع: ${site.name}`,
    });
    return site;
  },

  /**
   * Refuses to delete a site with employees still assigned — deleting
   * would silently orphan their assignedSiteId (schema sets it null on
   * delete), which is a real operational footgun (a guard's attendance
   * screen would suddenly show "no site assigned"). Force the admin to
   * reassign employees first, an explicit decision rather than a silent
   * side effect.
   */
  async delete(id: string, actorId?: string) {
    const employeeCount = await prisma.employee.count({ where: { assignedSiteId: id } });
    if (employeeCount > 0) {
      throw new SiteHasAssignedEmployeesError(employeeCount);
    }
    const site = await siteRepository.delete(id);
    await activityLogService.log({
      userId: actorId,
      action: "DELETE",
      entityType: "Site",
      entityId: id,
      summary: `حذف موقع: ${site.name}`,
    });
    return site;
  },

  async missingGuardsToday() {
    return siteRepository.findMissingGuardsToday();
  },
};

export type { SiteInput };
