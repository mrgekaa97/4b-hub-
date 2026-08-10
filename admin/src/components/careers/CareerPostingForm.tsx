"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/ui/FormField";
import { Checkbox } from "@/components/ui/Checkbox";
import { useToast } from "@/components/notifications/ToastProvider";

interface CareerPostingFormProps {
  mode: "create" | "edit";
  careerId?: string;
  initial?: {
    title: string;
    type: string;
    description: string;
    requirements: string[];
    isOpen: boolean;
  };
}

const EMPTY = { title: "", type: "", description: "", requirements: [""], isOpen: true };

export function CareerPostingForm({ mode, careerId, initial }: CareerPostingFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [values, setValues] = useState(initial ?? EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function setField<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updateRequirement(index: number, value: string) {
    setValues((prev) => ({ ...prev, requirements: prev.requirements.map((v, i) => (i === index ? value : v)) }));
  }
  function addRequirement() {
    setValues((prev) => ({ ...prev, requirements: [...prev.requirements, ""] }));
  }
  function removeRequirement(index: number) {
    setValues((prev) => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setFormError(null);
    setIsSubmitting(true);

    try {
      const payload = { ...values, requirements: values.requirements.filter((v) => v.trim() !== "") };
      const endpoint = mode === "create" ? "/api/careers" : `/api/careers/${careerId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

      showToast(mode === "create" ? "تم إنشاء الوظيفة كمسودة" : "تم حفظ التعديلات");
      router.push("/dashboard/careers");
      router.refresh();
    } catch {
      setFormError("تعذر الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5" noValidate>
      <FormField label="المسمى الوظيفي" htmlFor="title" required error={errors.title}>
        <Input id="title" value={values.title} onChange={(e) => setField("title", e.target.value)} hasError={!!errors.title} required />
      </FormField>

      <FormField label="نوع الدوام" htmlFor="type" required error={errors.type} helpText="مثال: دوام كامل">
        <Input id="type" value={values.type} onChange={(e) => setField("type", e.target.value)} hasError={!!errors.type} required />
      </FormField>

      <FormField label="الوصف" htmlFor="description" required error={errors.description}>
        <Textarea id="description" value={values.description} onChange={(e) => setField("description", e.target.value)} hasError={!!errors.description} required />
      </FormField>

      <div>
        <p className="mb-2 text-sm font-bold text-[#9C978A]">المتطلبات *</p>
        <div className="flex flex-col gap-2">
          {values.requirements.map((item, i) => (
            <div key={i} className="flex gap-2">
              <Input value={item} onChange={(e) => updateRequirement(i, e.target.value)} placeholder="عنصر..." />
              {values.requirements.length > 1 && (
                <button type="button" onClick={() => removeRequirement(i)} className="px-3 text-[#E07856] hover:underline">
                  حذف
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.requirements && <p className="mt-1 text-xs text-[#E07856]">{errors.requirements}</p>}
        <button type="button" onClick={addRequirement} className="mt-2 text-xs font-bold text-[#C9A227] hover:underline">
          + إضافة عنصر
        </button>
      </div>

      <Checkbox
        id="isOpen"
        label="الوظيفة مفتوحة للتقديم"
        checked={values.isOpen}
        onChange={(e) => setField("isOpen", e.target.checked)}
      />

      {formError && (
        <p role="alert" className="rounded-md border border-[#E07856]/40 bg-[#E07856]/10 px-4 py-2 text-sm text-[#E07856]">
          {formError}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          {mode === "create" ? "إنشاء كمسودة" : "حفظ التعديلات"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/careers")}>
          إلغاء
        </Button>
      </div>
      {mode === "create" && (
        <p className="text-xs text-[#9C978A]">تُحفظ الوظيفة كمسودة أولًا — استخدم زر &quot;نشر&quot; من القائمة لإظهارها على الموقع.</p>
      )}
    </form>
  );
}
