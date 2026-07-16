"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Checkbox } from "@/components/ui/Checkbox";
import { useToast } from "@/components/notifications/ToastProvider";

interface SiteFormProps {
  mode: "create" | "edit";
  siteId?: string;
  initial?: {
    name: string;
    clientName: string;
    address: string;
    latitude: number;
    longitude: number;
    allowedRadiusMeters: number;
    isActive: boolean;
  };
}

const EMPTY = {
  name: "",
  clientName: "",
  address: "",
  latitude: "",
  longitude: "",
  allowedRadiusMeters: "150",
  isActive: true,
};

export function SiteForm({ mode, siteId, initial }: SiteFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [values, setValues] = useState(
    initial
      ? { ...initial, latitude: String(initial.latitude), longitude: String(initial.longitude), allowedRadiusMeters: String(initial.allowedRadiusMeters) }
      : EMPTY
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function setField<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setFormError(null);
    setIsSubmitting(true);

    try {
      const endpoint = mode === "create" ? "/api/sites" : `/api/sites/${siteId}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.issues?.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(data.issues.fieldErrors)) {
            if (Array.isArray(msgs) && msgs.length) fieldErrors[key] = msgs[0] as string;
          }
          setErrors(fieldErrors);
        } else {
          setFormError(data.error ?? "حدث خطأ غير متوقع");
        }
        return;
      }

      showToast(mode === "create" ? "تم إضافة الموقع بنجاح" : "تم تحديث الموقع بنجاح");
      router.push("/dashboard/sites");
      router.refresh();
    } catch {
      setFormError("تعذر الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5" noValidate>
      <FormField label="اسم الموقع" htmlFor="name" required error={errors.name}>
        <Input id="name" value={values.name} onChange={(e) => setField("name", e.target.value)} hasError={!!errors.name} required />
      </FormField>

      <FormField label="اسم العميل" htmlFor="clientName" required error={errors.clientName}>
        <Input id="clientName" value={values.clientName} onChange={(e) => setField("clientName", e.target.value)} hasError={!!errors.clientName} required />
      </FormField>

      <FormField label="العنوان" htmlFor="address" required error={errors.address}>
        <Input id="address" value={values.address} onChange={(e) => setField("address", e.target.value)} hasError={!!errors.address} required />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="خط العرض (Latitude)" htmlFor="latitude" required error={errors.latitude} helpText="مثال: 30.0444">
          <Input id="latitude" dir="ltr" style={{ textAlign: "left" }} value={values.latitude} onChange={(e) => setField("latitude", e.target.value)} hasError={!!errors.latitude} required />
        </FormField>
        <FormField label="خط الطول (Longitude)" htmlFor="longitude" required error={errors.longitude} helpText="مثال: 31.2357">
          <Input id="longitude" dir="ltr" style={{ textAlign: "left" }} value={values.longitude} onChange={(e) => setField("longitude", e.target.value)} hasError={!!errors.longitude} required />
        </FormField>
      </div>

      <FormField
        label="النطاق المسموح للحضور (بالمتر)"
        htmlFor="allowedRadiusMeters"
        required
        error={errors.allowedRadiusMeters}
        helpText="المسافة المسموح بها بين موقع الموظف الفعلي وإحداثيات الموقع عند تسجيل الحضور"
      >
        <Input
          id="allowedRadiusMeters"
          type="number"
          dir="ltr"
          style={{ textAlign: "left" }}
          value={values.allowedRadiusMeters}
          onChange={(e) => setField("allowedRadiusMeters", e.target.value)}
          hasError={!!errors.allowedRadiusMeters}
          required
        />
      </FormField>

      <Checkbox
        id="isActive"
        label="الموقع نشط"
        checked={values.isActive}
        onChange={(e) => setField("isActive", e.target.checked)}
      />

      {formError && (
        <p role="alert" className="rounded-md border border-[#E07856]/40 bg-[#E07856]/10 px-4 py-2 text-sm text-[#E07856]">
          {formError}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          {mode === "create" ? "إضافة الموقع" : "حفظ التعديلات"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/sites")}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
