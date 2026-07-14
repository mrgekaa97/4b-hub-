"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { computeDeviceFingerprint, guessDeviceName } from "@/lib/device/clientFingerprint";

/**
 * One form for everyone — Super Admin, Operations Manager, and Employee all
 * type a username/password here. The server (unifiedLogin) figures out
 * which identity table matched and where to send them; this component only
 * needs to know how to display whatever error code comes back, including
 * the employee-only "device pending approval" case.
 */
export function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devicePending, setDevicePending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setDevicePending(false);
    setIsLoading(true);

    try {
      const fingerprint = await computeDeviceFingerprint();
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          password,
          deviceFingerprint: fingerprint,
          deviceName: guessDeviceName(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.code === "DEVICE_PENDING") {
          setDevicePending(true);
        } else {
          setError(data.error ?? "حدث خطأ غير متوقع");
        }
        return;
      }

      router.push(data.redirectTo);
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم. حاول مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  }

  if (devicePending) {
    return (
      <div className="text-center" role="status">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(201,162,39,0.14)]">
          <span className="text-2xl" aria-hidden="true">⏳</span>
        </div>
        <h2 className="mb-2 text-lg font-bold text-[#F5F0E6]">جهازك بانتظار الموافقة</h2>
        <p className="text-sm text-[#9C978A]">
          هذا أول تسجيل دخول من هذا الجهاز. تم إرسال طلب إلى المدير للموافقة عليه — حاول الدخول مرة أخرى بعد إشعارك بالموافقة.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <FormField label="اسم المستخدم" htmlFor="identifier" required>
        <Input
          id="identifier"
          name="identifier"
          autoComplete="username"
          dir="ltr"
          style={{ textAlign: "left" }}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
      </FormField>

      <FormField label="كلمة المرور" htmlFor="password" required>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          dir="ltr"
          style={{ textAlign: "left" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </FormField>

      {error && (
        <p role="alert" className="rounded-md border border-[#E07856]/40 bg-[#E07856]/10 px-4 py-2 text-sm text-[#E07856]">
          {error}
        </p>
      )}

      <Button type="submit" isLoading={isLoading} fullWidth>
        تسجيل الدخول
      </Button>
    </form>
  );
}
