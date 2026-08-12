export interface SettingsSocialLinks {
  facebook: string;
  linkedin: string;
  whatsapp: string;
}

/** Copied verbatim from database/settings.json — the seed defaults for the "general" Setting group. */
export const SEED_FALLBACK: Record<string, unknown> = {
  "site.company_name_ar": "فور برذرز للأمن والحراسات",
  "site.company_name_en": "4 Brothers Security & Guarding",
  "site.short_name": "4 Brothers",
  "site.phone": "+20 100 000 0000",
  "site.whatsapp_number": "201000000000",
  "site.email": "info@4brothers-security.com",
  "site.address_ar": "القاهرة الجديدة، مصر",
  "site.working_hours_ar": "الأحد – الخميس، 9 ص – 6 م",
  "site.emergency_line_note_ar": "خط الطوارئ متاح على مدار الساعة لعملاء العقود القائمة",
  "site.commercial_registry_no": "000000",
  "site.security_license_no": "0000",
  "site.social_links": {
    facebook: "",
    linkedin: "",
    whatsapp: "https://wa.me/201000000000",
  } as SettingsSocialLinks,
  "site.site_url": "https://www.4brothers-security.com",
};

/**
 * Per-key fallback: an empty/unset live value (not just missing) falls back
 * to the seed default, so a blank admin field doesn't render as blank text.
 */
export function getSetting(settings: Record<string, unknown>, key: string): string {
  const value = settings[key];
  if (typeof value === "string" && value !== "") return value;
  const fallback = SEED_FALLBACK[key];
  return typeof fallback === "string" ? fallback : "";
}

export function getSocialLink(settings: Record<string, unknown>, sub: keyof SettingsSocialLinks): string {
  const social = settings["site.social_links"] as Partial<SettingsSocialLinks> | undefined;
  const value = social?.[sub];
  if (typeof value === "string" && value !== "") return value;
  const fallbackSocial = SEED_FALLBACK["site.social_links"] as SettingsSocialLinks;
  return fallbackSocial[sub] ?? "";
}
