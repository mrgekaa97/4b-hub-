"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/notifications/ToastProvider";
import { ICON_OPTIONS } from "@/lib/constants/icon-options";
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
  whyUs: {
    eyebrow: "",
    heading: "",
    cards: [{ icon: "I_SHIELD", title: "", text: "" }],
  },
  timeline: {
    eyebrow: "",
    heading: "",
    steps: [{ num: "01", title: "", text: "" }],
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
  const [values, setValues] = useState<HomeContent>(() => ({
    hero: initial?.hero ?? EMPTY_HOME.hero,
    whyUs: initial?.whyUs ?? EMPTY_HOME.whyUs,
    timeline: initial?.timeline ?? EMPTY_HOME.timeline,
    cta: initial?.cta ?? EMPTY_HOME.cta,
  }));
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

  function updateWhyUsField(field: "eyebrow" | "heading", val: string) {
    setValues((prev) => ({ ...prev, whyUs: { ...prev.whyUs, [field]: val } }));
  }

  function updateCard<K extends keyof HomeContent["whyUs"]["cards"][number]>(
    i: number,
    field: K,
    val: HomeContent["whyUs"]["cards"][number][K]
  ) {
    setValues((prev) => ({
      ...prev,
      whyUs: { ...prev.whyUs, cards: prev.whyUs.cards.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)) },
    }));
  }
  function addCard() {
    setValues((prev) => ({
      ...prev,
      whyUs: { ...prev.whyUs, cards: [...prev.whyUs.cards, { icon: "I_SHIELD", title: "", text: "" }] },
    }));
  }
  function removeCard(i: number) {
    setValues((prev) => ({
      ...prev,
      whyUs: { ...prev.whyUs, cards: prev.whyUs.cards.filter((_, idx) => idx !== i) },
    }));
  }

  function updateTimelineField(field: "eyebrow" | "heading", val: string) {
    setValues((prev) => ({ ...prev, timeline: { ...prev.timeline, [field]: val } }));
  }

  function updateStep<K extends keyof HomeContent["timeline"]["steps"][number]>(
    i: number,
    field: K,
    val: HomeContent["timeline"]["steps"][number][K]
  ) {
    setValues((prev) => ({
      ...prev,
      timeline: { ...prev.timeline, steps: prev.timeline.steps.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)) },
    }));
  }
  function addStep() {
    setValues((prev) => ({
      ...prev,
      timeline: { ...prev.timeline, steps: [...prev.timeline.steps, { num: "", title: "", text: "" }] },
    }));
  }
  function removeStep(i: number) {
    setValues((prev) => ({
      ...prev,
      timeline: { ...prev.timeline, steps: prev.timeline.steps.filter((_, idx) => idx !== i) },
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

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-black">لماذا نحن</h2>
        {errors.whyUs && <p className="text-xs text-[#E07856]">{errors.whyUs}</p>}

        <FormField label="العنوان الفرعي (Eyebrow)" htmlFor="whyus-eyebrow" required>
          <Input id="whyus-eyebrow" value={values.whyUs.eyebrow} onChange={(e) => updateWhyUsField("eyebrow", e.target.value)} required />
        </FormField>
        <FormField label="العنوان" htmlFor="whyus-heading" required>
          <Input id="whyus-heading" value={values.whyUs.heading} onChange={(e) => updateWhyUsField("heading", e.target.value)} required />
        </FormField>

        <div className="flex flex-col gap-4">
          {values.whyUs.cards.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-md border border-[rgba(201,162,39,0.16)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#9C978A]">بطاقة {i + 1}</span>
                {values.whyUs.cards.length > 1 && (
                  <button type="button" onClick={() => removeCard(i)} className="text-xs font-bold text-[#E07856] hover:underline">
                    حذف
                  </button>
                )}
              </div>
              <FormField label="الأيقونة" htmlFor={`whyus-card-icon-${i}`}>
                <Select id={`whyus-card-icon-${i}`} value={item.icon} onChange={(e) => updateCard(i, "icon", e.target.value)}>
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="العنوان" htmlFor={`whyus-card-title-${i}`}>
                <Input id={`whyus-card-title-${i}`} value={item.title} onChange={(e) => updateCard(i, "title", e.target.value)} />
              </FormField>
              <FormField label="النص" htmlFor={`whyus-card-text-${i}`}>
                <Input id={`whyus-card-text-${i}`} value={item.text} onChange={(e) => updateCard(i, "text", e.target.value)} />
              </FormField>
            </div>
          ))}
        </div>
        <button type="button" onClick={addCard} className="text-xs font-bold text-[#C9A227] hover:underline">
          + إضافة بطاقة
        </button>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-black">آلية العمل</h2>
        {errors.timeline && <p className="text-xs text-[#E07856]">{errors.timeline}</p>}

        <FormField label="العنوان الفرعي (Eyebrow)" htmlFor="timeline-eyebrow" required>
          <Input id="timeline-eyebrow" value={values.timeline.eyebrow} onChange={(e) => updateTimelineField("eyebrow", e.target.value)} required />
        </FormField>
        <FormField label="العنوان" htmlFor="timeline-heading" required>
          <Input id="timeline-heading" value={values.timeline.heading} onChange={(e) => updateTimelineField("heading", e.target.value)} required />
        </FormField>

        <div className="flex flex-col gap-4">
          {values.timeline.steps.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-md border border-[rgba(201,162,39,0.16)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#9C978A]">خطوة {i + 1}</span>
                {values.timeline.steps.length > 1 && (
                  <button type="button" onClick={() => removeStep(i)} className="text-xs font-bold text-[#E07856] hover:underline">
                    حذف
                  </button>
                )}
              </div>
              <FormField label="الرقم" htmlFor={`timeline-step-num-${i}`} helpText="رقم العرض، مثل 01 أو 02">
                <Input id={`timeline-step-num-${i}`} value={item.num} onChange={(e) => updateStep(i, "num", e.target.value)} />
              </FormField>
              <FormField label="العنوان" htmlFor={`timeline-step-title-${i}`}>
                <Input id={`timeline-step-title-${i}`} value={item.title} onChange={(e) => updateStep(i, "title", e.target.value)} />
              </FormField>
              <FormField label="النص" htmlFor={`timeline-step-text-${i}`}>
                <Input id={`timeline-step-text-${i}`} value={item.text} onChange={(e) => updateStep(i, "text", e.target.value)} />
              </FormField>
            </div>
          ))}
        </div>
        <button type="button" onClick={addStep} className="text-xs font-bold text-[#C9A227] hover:underline">
          + إضافة خطوة
        </button>
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
