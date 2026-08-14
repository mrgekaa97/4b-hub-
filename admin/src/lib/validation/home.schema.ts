import { z } from "zod";

export const homeSchema = z
  .object({
    hero: z
      .object({
        eyebrow: z.string().min(1, "العنوان الفرعي مطلوب"),

        // Title is split into three parts (design decision): the page composes them as
        // titleLine1 <br/> <span class="gold-text">titleHighlight</span> titleSuffix.
        // This preserves the current markup without HTML injection.
        titleLine1: z.string().min(1, "السطر الأول مطلوب"),
        titleHighlight: z.string().min(1, "الكلمة المميزة مطلوبة"),
        titleSuffix: z.string().min(1, "بقية العنوان مطلوبة"),

        lead: z.string().min(2, "النص مطلوب"),

        // Stats: mirror About's field definitions exactly (count coerces string form-input to
        // number; suffix is a FREE string with NO min so it allows "+" AND worded values like
        // "دقيقة"; caption requires content). Wrap with a .min(1) so at least one stat exists.
        stats: z
          .array(
            z
              .object({
                count: z.coerce.number().int(),
                suffix: z.string(),
                caption: z.string().min(1, "الوصف مطلوب"),
              })
              .strict()
          )
          .min(1, "أضف إحصائية واحدة على الأقل"),

        // Panel: an eyebrow + rows of {label, value} string pairs (no icon).
        panelEyebrow: z.string().min(1, "عنوان اللوحة مطلوب"),
        panelRows: z
          .array(
            z
              .object({
                label: z.string().min(1, "التسمية مطلوبة"),
                value: z.string().min(1, "القيمة مطلوبة"),
              })
              .strict()
          )
          .min(1, "أضف صفًا واحدًا على الأقل"),
      })
      .strict(),
    whyUs: z
      .object({
        eyebrow: z.string().min(1, "العنوان الفرعي مطلوب"),
        heading: z.string().min(2, "العنوان مطلوب"),
        cards: z
          .array(
            z
              .object({
                icon: z.string().min(1, "اختر أيقونة"),
                title: z.string().min(2, "العنوان مطلوب"),
                text: z.string().min(2, "النص مطلوب"),
              })
              .strict()
          )
          .min(1, "أضف بطاقة واحدة على الأقل"),
      })
      .strict(),
    timeline: z
      .object({
        eyebrow: z.string().min(1, "العنوان الفرعي مطلوب"),
        heading: z.string().min(2, "العنوان مطلوب"),
        steps: z
          .array(
            z
              .object({
                num: z.string().min(1, "الرقم مطلوب"),
                title: z.string().min(2, "العنوان مطلوب"),
                text: z.string().min(2, "النص مطلوب"),
              })
              .strict()
          )
          .min(1, "أضف خطوة واحدة على الأقل"),
      })
      .strict(),
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
