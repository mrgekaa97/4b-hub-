import { z } from "zod";
import type { DynamicFieldDefinition, DynamicFormSchema } from "./types";

/**
 * Turns a stored field definition (JSON, editable by an admin with no code
 * access) into a real Zod schema, so a dynamically-defined form still gets
 * real server-side validation instead of "anything goes because it's just
 * JSON". This is the piece that makes the Dynamic Form architecture safe to
 * expose to non-developers.
 */
function fieldToZod(field: DynamicFieldDefinition): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case "email":
      schema = z.string().email("بريد إلكتروني غير صحيح");
      break;
    case "number":
      schema = z.coerce.number();
      break;
    case "checkbox":
      schema = z.boolean();
      break;
    case "select":
      schema = z.enum(
        (field.options ?? []).map((o) => o.value) as [string, ...string[]]
      );
      break;
    case "date":
      schema = z.coerce.date();
      break;
    case "tel":
      schema = z.string().min(7, "رقم هاتف غير صحيح");
      break;
    case "textarea":
    case "text":
    default:
      schema = z.string();
  }

  if (!field.required) {
    schema = schema.optional().nullable();
  } else if (field.type === "text" || field.type === "textarea") {
    schema = (schema as z.ZodString).min(1, `${field.label} مطلوب`);
  }

  return schema;
}

export function buildZodSchema(form: DynamicFormSchema): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of form.fields) {
    shape[field.name] = fieldToZod(field);
  }
  return z.object(shape);
}

/** Validates raw submitted data against a dynamic form's schema. Throws ZodError on failure. */
export function validateSubmission(form: DynamicFormSchema, data: unknown) {
  return buildZodSchema(form).parse(data);
}
