import { z } from "zod";

export const serviceSchema = z.object({
  slug: z
    .string()
    .min(2, "الرابط المختصر مطلوب")
    .regex(/^[a-z0-9-]+$/, "يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط"),
  icon: z.string().min(1, "اختر أيقونة"),
  title: z.string().min(2, "العنوان مطلوب"),
  summary: z.string().min(10, "الوصف قصير جدًا"),
  includes: z.array(z.string().min(1)).min(1, "أضف عنصرًا واحدًا على الأقل"),
  sortOrder: z.coerce.number().int().default(0),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
