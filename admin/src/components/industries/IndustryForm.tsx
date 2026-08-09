"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/notifications/ToastProvider";

/** Same 17 icons used on the live site (shared/icons/icon-set.json) — kept as a small local label map since Arabic labels aren't part of that JSON. */
const ICON_OPTIONS: { key: string; label: string }[] = [
  { key: "I_SHIELD", label: "درع (حراسة عامة)" },
  { key: "I_PATROL", label: "دورية" },
  { key: "I_CCTV", label: "مراقبة" },
  { key: "I_BUILDING", label: "مبنى" },
  { key: "I_EVENT", label: "فعالية" },
  { key: "I_VIP", label: "حماية شخصية" },
  { key: "I_CONSULT", label: "استشارات" },
  { key: "I_HOME", label: "سكني" },
  { key: "I_FACTORY", label: "مصنع" },
  { key: "I_HOSPITAL", label: "مستشفى" },
  { key: "I_HOTEL", label: "فندق" },
  { key: "I_WAREHOUSE", label: "مستودع" },
  { key: "I_SCHOOL", label: "تعليمي" },
  { key: "I_GOV", label: "حكومي" },
  { key: "I_CLOCK", label: "ساعة" },
  { key: "I_CHECK", label: "علامة صح" },
  { key: "I_ARROW", label: "سهم" },
];

interface IndustryFormProps {
  mode: "create" | "edit";
  industryId?: string;
  initial?: {
    icon: string;
    title: string;
    description: string;
    sortOrder: number;
  };
}

const EMPTY = { icon: "I_SHIELD", title: "", description: "", sortOrder: 0 };

export function IndustryForm({ mode, industryId, initial }: IndustryFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [values, setValues] = useState(initial ?? EMPTY);
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
      const endpoint = mode === "create" ? "/api/industries" : `/api/industries/${industryId}`;
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

      showToast(mode === "create" ? "تم إنشاء القطاع كمسودة" : "تم حفظ التعديلات");
      router.push("/dashboard/industries");
      router.refresh();
    } catch {
      setFormError("تعذر الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5" noValidate>
      <FormField label="العنوان" htmlFor="title" required error={errors.title}>
        <Input id="title" value={values.title} onChange={(e) => setField("title", e.target.value)} hasError={!!errors.title} required />
      </FormField>

      <FormField label="الأيقونة" htmlFor="icon" required error={errors.icon}>
        <Select id="icon" value={values.icon} onChange={(e) => setField("icon", e.target.value)}>
          {ICON_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </Select>
      </FormField>

      <FormField label="الوصف" htmlFor="description" required error={errors.description}>
        <Textarea id="description" value={values.description} onChange={(e) => setField("description", e.target.value)} hasError={!!errors.description} required />
      </FormField>

      <FormField label="ترتيب الظهور" htmlFor="sortOrder" helpText="الرقم الأصغر يظهر أولًا">
        <Input id="sortOrder" type="number" dir="ltr" style={{ textAlign: "left" }} value={values.sortOrder} onChange={(e) => setField("sortOrder", Number(e.target.value))} />
      </FormField>

      {formError && (
        <p role="alert" className="rounded-md border border-[#E07856]/40 bg-[#E07856]/10 px-4 py-2 text-sm text-[#E07856]">
          {formError}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          {mode === "create" ? "إنشاء كمسودة" : "حفظ التعديلات"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/industries")}>
          إلغاء
        </Button>
      </div>
      {mode === "create" && (
        <p className="text-xs text-[#9C978A]">يُحفظ القطاع كمسودة أولًا — استخدم زر &quot;نشر&quot; من القائمة لإظهاره على الموقع.</p>
      )}
    </form>
  );
}
