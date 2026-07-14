/**
 * Dynamic Form architecture — lets a new form be defined as data (stored in
 * DynamicFormDefinition.fieldsSchema) instead of requiring a new Prisma
 * model + migration + page every time. Intended for future/occasional forms
 * (e.g. "Partner Inquiry"); Quote Requests and Contact Messages stay as
 * their own first-class tables (see prisma/schema.prisma comment) because
 * they're core and queried constantly.
 */

export type DynamicFieldType =
  | "text"
  | "textarea"
  | "email"
  | "tel"
  | "number"
  | "select"
  | "checkbox"
  | "date";

export interface DynamicFieldOption {
  label: string;
  value: string;
}

export interface DynamicFieldDefinition {
  name: string; // becomes the key in the submitted data JSON
  label: string;
  type: DynamicFieldType;
  required: boolean;
  placeholder?: string;
  options?: DynamicFieldOption[]; // only for "select"
  helpText?: string;
}

export interface DynamicFormSchema {
  key: string;
  name: string;
  fields: DynamicFieldDefinition[];
}
