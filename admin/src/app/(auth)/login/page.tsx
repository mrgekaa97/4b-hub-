import { LoginForm } from "@/components/auth/LoginForm";
import { BRANDING } from "@/lib/constants/branding";

export const metadata = {
  title: `تسجيل الدخول | ${BRANDING.productName}`,
};

export default function LoginPage() {
  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4"
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black text-[#F5F0E6]">
            {BRANDING.productName}
          </h1>
          <p className="mt-1 text-sm text-[#C9A227]">{BRANDING.companyNameAr}</p>
        </div>

        <div className="rounded-lg border border-[rgba(201,162,39,0.16)] bg-[#161514] p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-[#9C978A]">{BRANDING.poweredByLineAr}</p>
      </div>
    </main>
  );
}
