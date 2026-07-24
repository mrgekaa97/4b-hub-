import { serviceRepository } from "@/lib/repositories/service.repository";
import { serviceSchema } from "@/lib/validation/service.schema";
import { activityLogService } from "@/lib/services/activityLog.service";
import { triggerWebsiteRebuild } from "@/lib/services/websiteBridge.service";

export class SlugTakenError extends Error {
  constructor(slug: string) {
    super(`الرابط المختصر "${slug}" مستخدم بالفعل`);
    this.name = "SlugTakenError";
  }
}

export const serviceManagementService = {
  async list() {
    return serviceRepository.findAll();
  },

  async get(id: string) {
    return serviceRepository.findById(id);
  },

  async create(raw: unknown, actorId?: string) {
    const data = serviceSchema.parse(raw);
    const existing = await serviceRepository.findBySlug(data.slug);
    if (existing) throw new SlugTakenError(data.slug);

    const service = await serviceRepository.create(data, actorId);
    await activityLogService.log({
      userId: actorId,
      action: "CREATE",
      entityType: "Service",
      entityId: service.id,
      summary: `إنشاء خدمة جديدة: ${service.title}`,
    });
    return service;
  },

  async update(id: string, raw: unknown, actorId?: string) {
    const data = serviceSchema.partial().parse(raw);
    const service = await serviceRepository.update(id, data, actorId);

    await activityLogService.log({
      userId: actorId,
      action: "UPDATE",
      entityType: "Service",
      entityId: service.id,
      summary: `تحديث خدمة: ${service.title}`,
    });

    if (service.status === "PUBLISHED") {
      await triggerWebsiteRebuild(`service updated: ${service.slug}`);
    }
    return service;
  },

  async publish(id: string, actorId?: string) {
    const service = await serviceRepository.publish(id, actorId);
    await activityLogService.log({
      userId: actorId,
      action: "PUBLISH",
      entityType: "Service",
      entityId: service.id,
      summary: `نشر خدمة: ${service.title}`,
    });
    await triggerWebsiteRebuild(`service published: ${service.slug}`);
    return service;
  },

  async unpublish(id: string, actorId?: string) {
    const service = await serviceRepository.unpublish(id, actorId);
    await activityLogService.log({
      userId: actorId,
      action: "UNPUBLISH",
      entityType: "Service",
      entityId: service.id,
      summary: `إلغاء نشر خدمة: ${service.title}`,
    });
    await triggerWebsiteRebuild(`service unpublished: ${service.slug}`);
    return service;
  },

  async delete(id: string, actorId?: string) {
    const service = await serviceRepository.findById(id);
    if (!service) return null;

    const deleted = await serviceRepository.delete(id);
    await activityLogService.log({
      userId: actorId,
      action: "DELETE",
      entityType: "Service",
      entityId: id,
      summary: `حذف خدمة: ${service.title}`,
    });

    if (service.status === "PUBLISHED") {
      await triggerWebsiteRebuild(`service deleted: ${service.slug}`);
    }
    return deleted;
  },
};
