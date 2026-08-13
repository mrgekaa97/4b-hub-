import { z } from "zod";

export const homeSchema = z
  .object({
    cta: z
      .object({
        heading: z.string().min(2, "العنوان مطلوب"),
        lead: z.string().min(2, "النص مطلوب"),
        primaryButton: z
          .object({
            label: z.string().min(1, "مطلوب"),
            href: z.string().min(1, "مطلوب"),
          })
          .strict(),
        secondaryButton: z
          .object({
            label: z.string().min(1, "مطلوب"),
            href: z.string().min(1, "مطلوب"),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();

export type HomeContent = z.infer<typeof homeSchema>;
