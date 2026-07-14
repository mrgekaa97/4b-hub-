import type { Metadata } from "next";
import { BRANDING } from "@/lib/constants/branding";
import "./globals.css";

export const metadata: Metadata = {
  title: BRANDING.productName,
  description: `${BRANDING.productName} — ${BRANDING.poweredByLine}`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
