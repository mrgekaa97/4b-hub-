import { z } from "zod";

export const aboutSchema = z.object({
  hero: z.object({
    eyebrow: z.string().min(1, "مطلوب"),
    title: z.string().min(2, "العنوان مطلوب"),
    lead: z.string().min(10, "النص قصير جدًا"),
  }),
  story: z.object({
    eyebrow: z.string().min(1, "مطلوب"),
    title: z.string().min(2, "العنوان مطلوب"),
    body: z.string().min(10, "النص قصير جدًا"),
    imageLabel: z.string().min(1, "مطلوب"),
  }),
  values: z
    .array(
      z.object({
        icon: z.string().min(1, "اختر أيقونة"),
        title: z.string().min(2, "العنوان مطلوب"),
        text: z.string().min(2, "النص مطلوب"),
      })
    )
    .min(1, "أضف قيمة واحدة على الأقل"),
  stats: z
    .array(
      z.object({
        count: z.coerce.number().int(),
        suffix: z.string(),
        caption: z.string().min(1, "الوصف مطلوب"),
      })
    )
    .min(1, "أضف إحصائية واحدة على الأقل"),
  license: z.object({
    eyebrow: z.string().min(1, "مطلوب"),
    title: z.string().min(2, "العنوان مطلوب"),
    imageLabel: z.string().min(1, "مطلوب"),
    items: z.array(z.string().min(1)).min(1, "أضف عنصرًا واحدًا على الأقل"),
  }),
});

export type AboutContent = z.infer<typeof aboutSchema>;
