import { pageRepository } from "@/lib/repositories/page.repository";
import { homeSchema } from "@/lib/validation/home.schema";
import { activityLogService } from "@/lib/services/activityLog.service";

/**
 * Unlike serviceManagementService, this never calls triggerWebsiteRebuild:
 * the Home page has no legacy bridge route (website/ is being retired), and
 * the public home page reads straight from the DB with ISR — there's
 * nothing external left to notify on save/publish.
 */
export const homeManagementService = {
  async getDraft() {
    return pageRepository.getBySlug("home");
  },

  async saveDraft(raw: unknown, actorId?: string) {
    const data = homeSchema.parse(raw);
    const page = await pageRepository.saveDraft("home", data, actorId);
    await activityLogService.log({
      userId: actorId,
      action: "UPDATE",
      entityType: "Page",
      entityId: page.id,
      summary: "تحديث مسودة الصفحة الرئيسية",
    });
    return page;
  },

  async publish(actorId?: string) {
    const page = await pageRepository.publish("home", actorId);
    await activityLogService.log({
      userId: actorId,
      action: "PUBLISH",
      entityType: "Page",
      entityId: page.id,
      summary: "نشر الصفحة الرئيسية",
    });
    return page;
  },

  async getPublished() {
    return pageRepository.getPublished("home");
  },
};
