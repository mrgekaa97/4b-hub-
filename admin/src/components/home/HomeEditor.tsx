"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/notifications/ToastProvider";
import type { HomeContent } from "@/lib/validation/home.schema";

interface HomeEditorProps {
  initial?: HomeContent;
}

const EMPTY_HOME: HomeContent = {
  cta: {
    heading: "",
    lead: "",
    primaryButton: { label: "", href: "" },
    secondaryButton: { label: "", href: "" },
  },
};

export function HomeEditor({ initial }: HomeEditorProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [values, setValues] = useState<HomeContent>(initial ?? EMPTY_HOME);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  function updateCta<K extends "heading" | "lead">(field: K, val: string) {
    setValues((prev) => ({ ...prev, cta: { ...prev.cta, [field]: val } }));
  }

  function updateButton(which: "primaryButton" | "secondaryButton", field: "label" | "href", val: string) {
    setValues((prev) => ({
      ...prev,
      cta: { ...prev.cta, [which]: { ...prev.cta[which], [field]: val } },
    }));
  }

  function applyErrorResponse(data: any) {
    if (data.issues?.fieldErrors) {
      const fieldErrors: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(data.issues.fieldErrors)) {
        if (Array.isArray(msgs) && msgs.length) fieldErrors[key] = msgs[0] as string;
      }
      setErrors(fieldErrors);

      if (Array.isArray(data.issues?.formErrors) && data.issues.formErrors.length) {
        setFormError(data.issues.formErrors.join("، "));
      }
    } else {
      setFormError(data.error ?? "حدث خطأ غير متوقع");
    }
  }

  async function handleSaveDraft(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setFormError(null);
    setIsSavingDraft(true);

    try {
      const res = await fetch("/api/home", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        applyErrorResponse(data);
        return;
      }

      showToast("تم حفظ المسودة");
      router.refresh();
    } catch {
      setFormError("تعذر الاتصال بالخادم");
    } finally {
      setIsSavingDraft(false);
    }
  }

  async function handlePublish() {
    setErrors({});
    setFormError(null);
    setIsPublishing(true);

    try {
      const saveRes = await fetch("/api/home", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) {
        applyErrorResponse(saveData);
        return;
      }

      const publishRes = await fetch("/api/home/publish", { method: "POST" });
      if (!publishRes.ok) {
        const publishData = await publishRes.json();
        applyErrorResponse(publishData);
        return;
      }

      showToast("تم نشر الصفحة الرئيسية");
      router.refresh();
    } catch {
      setFormError("تعذر الاتصال بالخادم");
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <form onSubmit={handleSaveDraft} className="flex max-w-3xl flex-col gap-8" noValidate>
      <section className="flex flex-col gap-5">
        <h2 className="text-lg font-black">بانر الدعوة لاتخاذ إجراء (CTA)</h2>
        {errors.cta && <p className="text-xs text-[#E07856]">{errors.cta}</p>}

        <FormField label="العنوان" htmlFor="cta-heading" required>
          <Input id="cta-heading" value={values.cta.heading} onChange={(e) => updateCta("heading", e.target.value)} required />
        </FormField>
        <FormField label="النص" htmlFor="cta-lead" required>
          <Input id="cta-lead" value={values.cta.lead} onChange={(e) => updateCta("lead", e.target.value)} required />
        </FormField>

        <div className="flex flex-col gap-3 rounded-md border border-[rgba(201,162,39,0.16)] p-4">
          <span className="text-sm font-bold text-[#9C978A]">الزر الأساسي</span>
          <FormField label="نص الزر" htmlFor="cta-primary-label" required>
            <Input
              id="cta-primary-label"
              value={values.cta.primaryButton.label}
              onChange={(e) => updateButton("primaryButton", "label", e.target.value)}
              required
            />
          </FormField>
          <FormField label="الرابط" htmlFor="cta-primary-href" required>
            <Input
              id="cta-primary-href"
              dir="ltr"
              style={{ textAlign: "left" }}
              value={values.cta.primaryButton.href}
              onChange={(e) => updateButton("primaryButton", "href", e.target.value)}
              required
            />
          </FormField>
        </div>

        <div className="flex flex-col gap-3 rounded-md border border-[rgba(201,162,39,0.16)] p-4">
          <span className="text-sm font-bold text-[#9C978A]">الزر الثانوي</span>
          <FormField label="نص الزر" htmlFor="cta-secondary-label" required>
            <Input
              id="cta-secondary-label"
              value={values.cta.secondaryButton.label}
              onChange={(e) => updateButton("secondaryButton", "label", e.target.value)}
              required
            />
          </FormField>
          <FormField label="الرابط" htmlFor="cta-secondary-href" required>
            <Input
              id="cta-secondary-href"
              dir="ltr"
              style={{ textAlign: "left" }}
              value={values.cta.secondaryButton.href}
              onChange={(e) => updateButton("secondaryButton", "href", e.target.value)}
              required
            />
          </FormField>
        </div>
      </section>

      {formError && (
        <p role="alert" className="rounded-md border border-[#E07856]/40 bg-[#E07856]/10 px-4 py-2 text-sm text-[#E07856]">
          {formError}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" isLoading={isSavingDraft} disabled={isPublishing}>
          حفظ المسودة
        </Button>
        <Button type="button" variant="ghost" isLoading={isPublishing} disabled={isSavingDraft} onClick={handlePublish}>
          نشر
        </Button>
      </div>
    </form>
  );
}
