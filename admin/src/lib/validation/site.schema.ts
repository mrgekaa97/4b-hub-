import { z } from "zod";

export const siteSchema = z.object({
  name: z.string().min(2, "اسم الموقع مطلوب"),
  clientName: z.string().min(2, "اسم العميل مطلوب"),
  address: z.string().min(5, "العنوان مطلوب"),
  latitude: z.coerce.number().min(-90).max(90, "خط العرض غير صحيح"),
  longitude: z.coerce.number().min(-180).max(180, "خط الطول غير صحيح"),
  allowedRadiusMeters: z.coerce.number().int().min(10, "النطاق المسموح صغير جدًا").max(5000, "النطاق المسموح كبير جدًا"),
  isActive: z.coerce.boolean().default(true),
});

export type SiteInput = z.infer<typeof siteSchema>;
