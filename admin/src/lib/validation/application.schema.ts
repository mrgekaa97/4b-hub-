import { z } from "zod";

export const applicationSchema = z
  .object({
    fullName: z.string().min(2, "الاسم بالكامل مطلوب"),
    phone: z.string().min(6, "رقم هاتف غير صحيح"),
    roleApplied: z.string().min(1, "برجاء اختيار الوظيفة"),
    // Optional in the model, and the form doesn't mark it required — so an
    // empty string (what a blank field submits as) must be accepted too, not
    // just `undefined`. Plain `.email().optional()` would reject "" since
    // it's a defined-but-invalid-email value, not an absent one.
    email: z.union([z.literal(""), z.string().email("بريد إلكتروني غير صحيح")]).optional(),
    experience: z.string().optional(),
    message: z.string().optional(),
    // Honeypot: a hidden field real users never see/fill (wired on the
    // frontend in a later task). Must stay empty — any value means a bot
    // filled every field it could find. Kept optional/unconstrained here so
    // parsing never throws on it; the service layer decides what a non-empty
    // value means, not this schema.
    honeypot: z.string().optional(),
  })
  .strict();

export type ApplicationInput = z.infer<typeof applicationSchema>;
