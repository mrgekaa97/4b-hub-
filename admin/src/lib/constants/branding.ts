/**
 * Single source of truth for the two brand names in play. See
 * docs/PROJECT-STRUCTURE.md — "Company Brand" is who legally owns and
 * operates the business; "Product Brand" is the name of this internal
 * platform. Every login screen and dashboard footer must show the
 * "poweredByLine" per the product doc — components should import this
 * rather than hardcoding the string so it only ever needs to change here.
 */
export const BRANDING = {
  companyName: "4 Brothers Security & Guarding",
  companyNameAr: "فور برذرز للأمن والحراسات",
  productName: "4B HUB",
  poweredByLine: "Powered by 4 Brothers Security & Guarding",
  poweredByLineAr: "بدعم من فور برذرز للأمن والحراسات",
} as const;
