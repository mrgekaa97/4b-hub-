"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/notifications/ToastProvider";
import type { HomeContent } from "@/lib/validation/home.schema";

interface HomeEditorProps {
  initial?: HomeContent;
}

const EMPTY_HOME: HomeContent = {
  hero: {
    eyebrow: "",
    titleLine1: "",
    titleHighlight: "",
    titleSuffix: "",
    lead: "",
    stats: [{ count: 0, suffix: "", caption: "" }],
    panelRows: [{ label: "", value: "" }],
    panelEyebrow: "",
  },
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

  function updateHeroField(
    field: "eyebrow" | "titleLine1" | "titleHighlight" | "titleSuffix" | "lead" | "panelEyebrow",
    val: string
  ) {
    setValues((prev) => ({ ...prev, hero: { ...prev.hero, [field]: val } }));
  }

  function updateStatItem<K extends keyof HomeContent["hero"]["stats"][number]>(
    i: number,
    field: K,
    val: HomeContent["hero"]["stats"][number][K]
  ) {
    setValues((prev) => ({
      ...prev,
      hero: { ...prev.hero, stats: prev.hero.stats.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)) },
    }));
  }
  function addStatItem() {
    setValues((prev) => ({
      ...prev,
      hero: { ...prev.hero, stats: [...prev.hero.stats, { count: 0, suffix: "", caption: "" }] },
    }));
  }
  function removeStatItem(i: number) {
    setValues((prev) => ({
      ...prev,
      hero: { ...prev.hero, stats: prev.hero.stats.filter((_, idx) => idx !== i) },
    }));
  }

  function updatePanelRow<K extends keyof HomeContent["hero"]["panelRows"][number]>(
    i: number,
    field: K,
    val: HomeContent["hero"]["panelRows"][number][K]
  ) {
    setValues((prev) => ({
      ...prev,
      hero: { ...prev.hero, panelRows: prev.hero.panelRows.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)) },
    }));
  }
  function addPanelRow() {
    setValues((prev) => ({
      ...prev,
      hero: { ...prev.hero, panelRows: [...prev.hero.panelRows, { label: "", value: "" }] },
    }));
  }
  function removePanelRow(i: number) {
    setValues((prev) => ({
      ...prev,
      hero: { ...prev.hero, panelRows: prev.hero.panelRows.filter((_, idx) => idx !== i) },
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
        <h2 className="text-lg font-black">الترويسة (Hero)</h2>
        {errors.hero && <p className="text-xs text-[#E07856]">{errors.hero}</p>}

        <FormField label="العنوان الفرعي (Eyebrow)" htmlFor="hero-eyebrow" required>
          <Input id="hero-eyebrow" value={values.hero.eyebrow} onChange={(e) => updateHeroField("eyebrow", e.target.value)} required />
        </FormField>

        <FormField
          label="العنوان — السطر الأول"
          htmlFor="hero-title-line1"
          required
          helpText="يُعرض العنوان مركّبًا هكذا: السطر الأول + سطر جديد + الكلمة المميزة (بلون ذهبي) + بقية العنوان"
        >
          <Input id="hero-title-line1" value={values.hero.titleLine1} onChange={(e) => updateHeroField("titleLine1", e.target.value)} required />
        </FormField>
        <FormField label="العنوان — الكلمة المميزة" htmlFor="hero-title-highlight" required helpText="تظهر بلون ذهبي داخل العنوان">
          <Input id="hero-title-highlight" value={values.hero.titleHighlight} onChange={(e) => updateHeroField("titleHighlight", e.target.value)} required />
        </FormField>
        <FormField label="العنوان — بقية العنوان" htmlFor="hero-title-suffix" required helpText="النص العادي الذي يسبق الكلمة المميزة">
          <Input id="hero-title-suffix" value={values.hero.titleSuffix} onChange={(e) => updateHeroField("titleSuffix", e.target.value)} required />
        </FormField>

        <FormField label="المقدمة" htmlFor="hero-lead" required>
          <Textarea id="hero-lead" value={values.hero.lead} onChange={(e) => updateHeroField("lead", e.target.value)} required />
        </FormField>

        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-[#9C978A]">الإحصائيات</h3>
          {errors.stats && <p className="text-xs text-[#E07856]">{errors.stats}</p>}

          {values.hero.stats.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-md border border-[rgba(201,162,39,0.16)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#9C978A]">إحصائية {i + 1}</span>
                {values.hero.stats.length > 1 && (
                  <button type="button" onClick={() => removeStatItem(i)} className="text-xs font-bold text-[#E07856] hover:underline">
                    حذف
                  </button>
                )}
              </div>
              <FormField label="الرقم" htmlFor={`hero-stat-count-${i}`}>
                <Input
                  id={`hero-stat-count-${i}`}
                  type="number"
                  dir="ltr"
                  style={{ textAlign: "left" }}
                  value={item.count}
                  onChange={(e) => updateStatItem(i, "count", Number(e.target.value))}
                />
              </FormField>
              <FormField label="اللاحقة (Suffix)" htmlFor={`hero-stat-suffix-${i}`} helpText="مثال: + أو دقيقة">
                <Input id={`hero-stat-suffix-${i}`} dir="ltr" style={{ textAlign: "left" }} value={item.suffix} onChange={(e) => updateStatItem(i, "suffix", e.target.value)} />
              </FormField>
              <FormField label="الوصف" htmlFor={`hero-stat-caption-${i}`}>
                <Input id={`hero-stat-caption-${i}`} value={item.caption} onChange={(e) => updateStatItem(i, "caption", e.target.value)} />
              </FormField>
            </div>
          ))}
          <button type="button" onClick={addStatItem} className="text-xs font-bold text-[#C9A227] hover:underline">
            + إضافة إحصائية
          </button>
        </div>

        <FormField label="عنوان اللوحة (Eyebrow)" htmlFor="hero-panel-eyebrow" required>
          <Input id="hero-panel-eyebrow" value={values.hero.panelEyebrow} onChange={(e) => updateHeroField("panelEyebrow", e.target.value)} required />
        </FormField>

        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-[#9C978A]">صفوف اللوحة</h3>
          {errors.panelRows && <p className="text-xs text-[#E07856]">{errors.panelRows}</p>}

          {values.hero.panelRows.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-md border border-[rgba(201,162,39,0.16)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#9C978A]">صف {i + 1}</span>
                {values.hero.panelRows.length > 1 && (
                  <button type="button" onClick={() => removePanelRow(i)} className="text-xs font-bold text-[#E07856] hover:underline">
                    حذف
                  </button>
                )}
              </div>
              <FormField label="التسمية" htmlFor={`hero-panel-label-${i}`}>
                <Input id={`hero-panel-label-${i}`} value={item.label} onChange={(e) => updatePanelRow(i, "label", e.target.value)} />
              </FormField>
              <FormField label="القيمة" htmlFor={`hero-panel-value-${i}`}>
                <Input id={`hero-panel-value-${i}`} value={item.value} onChange={(e) => updatePanelRow(i, "value", e.target.value)} />
              </FormField>
            </div>
          ))}
          <button type="button" onClick={addPanelRow} className="text-xs font-bold text-[#C9A227] hover:underline">
            + إضافة صف
          </button>
        </div>
      </section>

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
