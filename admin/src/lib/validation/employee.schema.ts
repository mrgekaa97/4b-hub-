import { z } from "zod";

const baseFields = {
  fullName: z.string().min(2, "الاسم بالكامل مطلوب"),
  phone: z.string().min(8, "رقم هاتف غير صحيح"),
  email: z.string().email("بريد إلكتروني غير صحيح").optional().or(z.literal("")),
  nationalId: z.string().optional().or(z.literal("")),
  isSupervisor: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
  assignedSiteId: z.string().optional().or(z.literal("")),
};

/** employeeCode is auto-generated server-side (see employee.service.ts) — never accepted from the client. */
export const createEmployeeSchema = z.object({
  ...baseFields,
  username: z
    .string()
    .min(3, "اسم المستخدم قصير جدًا")
    .regex(/^[a-zA-Z0-9._-]+$/, "اسم المستخدم يجب أن يحتوي على حروف إنجليزية وأرقام فقط"),
  password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
});

/** username and password are not editable through this form — see employee.repository.ts note on why. */
export const updateEmployeeSchema = z.object(baseFields).partial();

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
