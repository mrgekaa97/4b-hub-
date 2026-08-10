import { careerRepository } from "@/lib/repositories/career.repository";
import { careerSchema } from "@/lib/validation/career.schema";
import { activityLogService } from "@/lib/services/activityLog.service";

/**
 * Unlike serviceManagementService, this never calls triggerWebsiteRebuild:
 * Career Postings has no legacy bridge route (website/ is being retired), and
 * the public careers page reads straight from the DB with ISR — there's
 * nothing external left to notify on publish/unpublish/update/delete.
 */
export const careerManagementService = {
  async list() {
    return careerRepository.findAll();
  },

  async get(id: string) {
    return careerRepository.findById(id);
  },

  async create(raw: unknown, actorId?: string) {
    const data = careerSchema.parse(raw);
    const career = await careerRepository.create(data, actorId);
    await activityLogService.log({
      userId: actorId,
      action: "CREATE",
      entityType: "CareerPosting",
      entityId: career.id,
      summary: `إنشاء وظيفة جديدة: ${career.title}`,
    });
    return career;
  },

  async update(id: string, raw: unknown, actorId?: string) {
    const data = careerSchema.partial().parse(raw);
    const career = await careerRepository.update(id, data, actorId);
    await activityLogService.log({
      userId: actorId,
      action: "UPDATE",
      entityType: "CareerPosting",
      entityId: career.id,
      summary: `تحديث وظيفة: ${career.title}`,
    });
    return career;
  },

  async publish(id: string, actorId?: string) {
    const career = await careerRepository.publish(id, actorId);
    await activityLogService.log({
      userId: actorId,
      action: "PUBLISH",
      entityType: "CareerPosting",
      entityId: career.id,
      summary: `نشر وظيفة: ${career.title}`,
    });
    return career;
  },

  async unpublish(id: string, actorId?: string) {
    const career = await careerRepository.unpublish(id, actorId);
    await activityLogService.log({
      userId: actorId,
      action: "UNPUBLISH",
      entityType: "CareerPosting",
      entityId: career.id,
      summary: `إلغاء نشر وظيفة: ${career.title}`,
    });
    return career;
  },

  async delete(id: string, actorId?: string) {
    const career = await careerRepository.findById(id);
    if (!career) return null;

    const deleted = await careerRepository.delete(id);
    await activityLogService.log({
      userId: actorId,
      action: "DELETE",
      entityType: "CareerPosting",
      entityId: id,
      summary: `حذف وظيفة: ${career.title}`,
    });
    return deleted;
  },
};
