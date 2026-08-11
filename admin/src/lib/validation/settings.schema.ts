import { z } from "zod";

/** Payload shape for the "general" Setting group. Keys are the full DB keys
 * (with the "site." prefix) so reads via getGroupAsMap("general") and writes
 * through this schema round-trip the exact same shape with no prefix logic. */
export const settingsGeneralSchema = z
  .object({
    "site.company_name_ar": z.string().optional(),
    "site.company_name_en": z.string().optional(),
    "site.short_name": z.string().optional(),
    "site.phone": z.string().optional(),
    "site.whatsapp_number": z.string().optional(),
    "site.email": z.string().optional(),
    "site.address_ar": z.string().optional(),
    "site.working_hours_ar": z.string().optional(),
    "site.emergency_line_note_ar": z.string().optional(),
    "site.commercial_registry_no": z.string().optional(),
    "site.security_license_no": z.string().optional(),
    "site.site_url": z.string().optional(),
    "site.social_links": z
      .object({
        facebook: z.string().optional(),
        linkedin: z.string().optional(),
        whatsapp: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export type SettingsGeneralInput = z.infer<typeof settingsGeneralSchema>;
