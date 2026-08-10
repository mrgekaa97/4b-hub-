import { pageRepository } from "@/lib/repositories/page.repository";
import { aboutSchema } from "@/lib/validation/about.schema";
import { activityLogService } from "@/lib/services/activityLog.service";

/**
 * Unlike serviceManagementService, this never calls triggerWebsiteRebuild:
 * the About page has no legacy bridge route (website/ is being retired), and
 * the public about page reads straight from the DB with ISR — there's
 * nothing external left to notify on save/publish.
 */
export const aboutManagementService = {
  async getDraft() {
    return pageRepository.getBySlug("about");
  },

  async saveDraft(raw: unknown, actorId?: string) {
    const data = aboutSchema.parse(raw);
    const page = await pageRepository.saveDraft("about", data, actorId);
    await activityLogService.log({
      userId: actorId,
      action: "UPDATE",
      entityType: "Page",
      entityId: page.id,
      summary: "تحديث مسودة صفحة من نحن",
    });
    return page;
  },

  async publish(actorId?: string) {
    const page = await pageRepository.publish("about", actorId);
    await activityLogService.log({
      userId: actorId,
      action: "PUBLISH",
      entityType: "Page",
      entityId: page.id,
      summary: "نشر صفحة من نحن",
    });
    return page;
  },

  async getPublished() {
    return pageRepository.getPublished("about");
  },
};
