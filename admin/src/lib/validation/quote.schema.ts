import { z } from "zod";

export const quoteSchema = z
  .object({
    company: z.string().min(2, "اسم الشركة مطلوب"),
    contactName: z.string().min(2, "اسم المسؤول مطلوب"),
    phone: z.string().min(6, "رقم هاتف غير صحيح"),
    email: z.string().email("بريد إلكتروني غير صحيح"),
    industry: z.string().min(1, "برجاء اختيار نوع المنشأة"),
    location: z.string().min(2, "موقع المنشأة مطلوب"),
    guardsRange: z.string().optional(),
    preferredContact: z.string().optional(),
    message: z.string().optional(),
    // Honeypot: a hidden field real users never see/fill (wired on the
    // frontend in a later task). Must stay empty — any value means a bot
    // filled every field it could find. Kept optional/unconstrained here so
    // parsing never throws on it; the service layer decides what a non-empty
    // value means, not this schema.
    honeypot: z.string().optional(),
  })
  .strict();

export type QuoteInput = z.infer<typeof quoteSchema>;
