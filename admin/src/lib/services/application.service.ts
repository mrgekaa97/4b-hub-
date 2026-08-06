import { applicationSchema } from "@/lib/validation/application.schema";
import { applicationRepository } from "@/lib/repositories/application.repository";
import { activityLogService } from "@/lib/services/activityLog.service";

export const applicationService = {
  async list() {
    return applicationRepository.findAll();
  },

  async getById(id: string) {
    return applicationRepository.findById(id);
  },

  async submit(raw: unknown, meta: { ipAddress?: string } = {}) {
    const data = applicationSchema.parse(raw);

    if (data.honeypot) {
      // Spam: a bot filled the hidden field. Report success-shaped and don't
      // write or log anything, so the caller gets no signal it was caught —
      // an identical response to a real submission.
      return { spam: true as const };
    }

    const { honeypot, ...applicationData } = data;
    const jobApplication = await applicationRepository.create(applicationData);

    // Public, unauthenticated submission — no logged-in user, so userId is
    // intentionally omitted rather than set to a fixed string: ActivityLog.userId
    // is a nullable foreign key to User, and a fake string value would violate
    // that constraint. Omitting it (NULL) is the valid way to log a systemless/
    // anonymous action with the existing activityLogService as-is.
    await activityLogService.log({
      action: "CREATE",
      entityType: "JobApplication",
      entityId: jobApplication.id,
      summary: `طلب توظيف جديد من "${jobApplication.fullName}" — ${jobApplication.roleApplied}`,
      ipAddress: meta.ipAddress,
    });

    return { spam: false as const, jobApplication };
  },
};
