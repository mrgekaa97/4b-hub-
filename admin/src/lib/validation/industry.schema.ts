import { z } from "zod";

export const industrySchema = z.object({
  icon: z.string().min(1, "اختر أيقونة"),
  title: z.string().min(2, "العنوان مطلوب"),
  description: z.string().min(10, "الوصف قصير جدًا"),
  sortOrder: z.coerce.number().int().default(0),
});

export type IndustryInput = z.infer<typeof industrySchema>;
