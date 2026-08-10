import { z } from "zod";

export const careerSchema = z.object({
  title: z.string().min(2, "العنوان مطلوب"),
  type: z.string().min(1, "نوع الدوام مطلوب"),
  description: z.string().min(10, "الوصف قصير جدًا"),
  requirements: z.array(z.string().min(1)).min(1, "أضف عنصرًا واحدًا على الأقل"),
  isOpen: z.boolean().default(true),
});

export type CareerInput = z.infer<typeof careerSchema>;
