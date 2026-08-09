import { industryRepository } from "@/lib/repositories/industry.repository";
import { industrySchema } from "@/lib/validation/industry.schema";
import { activityLogService } from "@/lib/services/activityLog.service";

/**
 * Unlike serviceManagementService, this never calls triggerWebsiteRebuild:
 * Industries has no legacy bridge route (website/ is being retired), and the
 * public industries page reads straight from the DB with ISR — there's
 * nothing external left to notify on publish/unpublish/update/delete.
 */
export const industryManagementService = {
  async list() {
    return industryRepository.findAll();
  },

  async get(id: string) {
    return industryRepository.findById(id);
  },

  async create(raw: unknown, actorId?: string) {
    const data = industrySchema.parse(raw);
    const industry = await industryRepository.create(data, actorId);
    await activityLogService.log({
      userId: actorId,
      action: "CREATE",
      entityType: "Industry",
      entityId: industry.id,
      summary: `إنشاء قطاع جديد: ${industry.title}`,
    });
    return industry;
  },

  async update(id: string, raw: unknown, actorId?: string) {
    const data = industrySchema.partial().parse(raw);
    const industry = await industryRepository.update(id, data, actorId);
    await activityLogService.log({
      userId: actorId,
      action: "UPDATE",
      entityType: "Industry",
      entityId: industry.id,
      summary: `تحديث قطاع: ${industry.title}`,
    });
    return industry;
  },

  async publish(id: string, actorId?: string) {
    const industry = await industryRepository.publish(id, actorId);
    await activityLogService.log({
      userId: actorId,
      action: "PUBLISH",
      entityType: "Industry",
      entityId: industry.id,
      summary: `نشر قطاع: ${industry.title}`,
    });
    return industry;
  },

  async unpublish(id: string, actorId?: string) {
    const industry = await industryRepository.unpublish(id, actorId);
    await activityLogService.log({
      userId: actorId,
      action: "UNPUBLISH",
      entityType: "Industry",
      entityId: industry.id,
      summary: `إلغاء نشر قطاع: ${industry.title}`,
    });
    return industry;
  },

  async delete(id: string, actorId?: string) {
    const industry = await industryRepository.findById(id);
    if (!industry) return null;

    const deleted = await industryRepository.delete(id);
    await activityLogService.log({
      userId: actorId,
      action: "DELETE",
      entityType: "Industry",
      entityId: id,
      summary: `حذف قطاع: ${industry.title}`,
    });
    return deleted;
  },
};
