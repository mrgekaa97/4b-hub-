import { quoteSchema } from "@/lib/validation/quote.schema";
import { quoteRepository } from "@/lib/repositories/quote.repository";
import { activityLogService } from "@/lib/services/activityLog.service";

export const quoteService = {
  async list() {
    return quoteRepository.findAll();
  },

  async getById(id: string) {
    return quoteRepository.findById(id);
  },

  async submit(raw: unknown, meta: { ipAddress?: string } = {}) {
    const data = quoteSchema.parse(raw);

    if (data.honeypot) {
      // Spam: a bot filled the hidden field. Report success-shaped and don't
      // write or log anything, so the caller gets no signal it was caught —
      // an identical response to a real submission.
      return { spam: true as const };
    }

    const { honeypot, ...quoteData } = data;
    const quoteRequest = await quoteRepository.create(quoteData);

    // Public, unauthenticated submission — no logged-in user, so userId is
    // intentionally omitted rather than set to a fixed string: ActivityLog.userId
    // is a nullable foreign key to User, and a fake string value would violate
    // that constraint. Omitting it (NULL) is the valid way to log a systemless/
    // anonymous action with the existing activityLogService as-is.
    await activityLogService.log({
      action: "CREATE",
      entityType: "QuoteRequest",
      entityId: quoteRequest.id,
      summary: `طلب عرض سعر جديد من "${quoteRequest.company}"`,
      ipAddress: meta.ipAddress,
    });

    return { spam: false as const, quoteRequest };
  },
};
