export type SettingsFieldType = "input" | "textarea";

export interface SettingsField {
  key: string;
  label: string;
  type: SettingsFieldType;
}

export interface SettingsSection {
  title: string;
  fields: SettingsField[];
}

/** Drives the Website Settings form — one entry per `site.*` key in the "general" Setting group. */
export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    title: "بيانات الشركة",
    fields: [
      { key: "site.company_name_ar", label: "اسم الشركة (عربي)", type: "input" },
      { key: "site.company_name_en", label: "اسم الشركة (إنجليزي)", type: "input" },
      { key: "site.short_name", label: "الاسم المختصر", type: "input" },
      { key: "site.site_url", label: "رابط الموقع", type: "input" },
    ],
  },
  {
    title: "بيانات التواصل",
    fields: [
      { key: "site.phone", label: "رقم الهاتف", type: "input" },
      { key: "site.whatsapp_number", label: "رقم الواتساب", type: "input" },
      { key: "site.email", label: "البريد الإلكتروني", type: "input" },
      { key: "site.address_ar", label: "العنوان", type: "input" },
      { key: "site.working_hours_ar", label: "مواعيد العمل", type: "textarea" },
      { key: "site.emergency_line_note_ar", label: "ملاحظة خط الطوارئ", type: "textarea" },
    ],
  },
  {
    title: "البيانات القانونية",
    fields: [
      { key: "site.commercial_registry_no", label: "رقم السجل التجاري", type: "input" },
      { key: "site.security_license_no", label: "رقم الترخيص الأمني", type: "input" },
    ],
  },
];

export type SocialLinkKey = "facebook" | "linkedin" | "whatsapp";

export interface SocialLinkField {
  subKey: SocialLinkKey;
  label: string;
}

/** Sub-fields of the single "site.social_links" JSON setting — handled separately from the flat sections above. */
export const SOCIAL_LINK_FIELDS: SocialLinkField[] = [
  { subKey: "facebook", label: "فيسبوك" },
  { subKey: "linkedin", label: "لينكدإن" },
  { subKey: "whatsapp", label: "واتساب" },
];
