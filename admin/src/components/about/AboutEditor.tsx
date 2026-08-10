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
import type { AboutContent } from "@/lib/validation/about.schema";

interface AboutEditorProps {
  initial?: AboutContent;
}

const EMPTY_ABOUT: AboutContent = {
  hero: { eyebrow: "", title: "", lead: "" },
  story: { eyebrow: "", title: "", body: "", imageLabel: "" },
  values: [{ icon: "I_SHIELD", title: "", text: "" }],
  stats: [{ count: 0, suffix: "", caption: "" }],
  license: { eyebrow: "", title: "", imageLabel: "", items: [""] },
};

export function AboutEditor({ initial }: AboutEditorProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [values, setValues] = useState<AboutContent>(initial ?? EMPTY_ABOUT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  function updateHero<K extends keyof AboutContent["hero"]>(field: K, val: AboutContent["hero"][K]) {
    setValues((prev) => ({ ...prev, hero: { ...prev.hero, [field]: val } }));
  }

  function updateStory<K extends keyof AboutContent["story"]>(field: K, val: AboutContent["story"][K]) {
    setValues((prev) => ({ ...prev, story: { ...prev.story, [field]: val } }));
  }

  function updateLicenseField<K extends keyof Omit<AboutContent["license"], "items">>(
    field: K,
    val: AboutContent["license"][K]
  ) {
    setValues((prev) => ({ ...prev, license: { ...prev.license, [field]: val } }));
  }

  function updateValueItem<K extends keyof AboutContent["values"][number]>(
    i: number,
    field: K,
    val: AboutContent["values"][number][K]
  ) {
    setValues((prev) => ({
      ...prev,
      values: prev.values.map((v, idx) => (idx === i ? { ...v, [field]: val } : v)),
    }));
  }
  function addValueItem() {
    setValues((prev) => ({ ...prev, values: [...prev.values, { icon: "I_SHIELD", title: "", text: "" }] }));
  }
  function removeValueItem(i: number) {
    setValues((prev) => ({ ...prev, values: prev.values.filter((_, idx) => idx !== i) }));
  }

  function updateStatItem<K extends keyof AboutContent["stats"][number]>(
    i: number,
    field: K,
    val: AboutContent["stats"][number][K]
  ) {
    setValues((prev) => ({
      ...prev,
      stats: prev.stats.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)),
    }));
  }
  function addStatItem() {
    setValues((prev) => ({ ...prev, stats: [...prev.stats, { count: 0, suffix: "", caption: "" }] }));
  }
  function removeStatItem(i: number) {
    setValues((prev) => ({ ...prev, stats: prev.stats.filter((_, idx) => idx !== i) }));
  }

  function updateLicenseItem(i: number, val: string) {
    setValues((prev) => ({
      ...prev,
      license: { ...prev.license, items: prev.license.items.map((v, idx) => (idx === i ? val : v)) },
    }));
  }
  function addLicenseItem() {
    setValues((prev) => ({ ...prev, license: { ...prev.license, items: [...prev.license.items, ""] } }));
  }
  function removeLicenseItem(i: number) {
    setValues((prev) => ({
      ...prev,
      license: { ...prev.license, items: prev.license.items.filter((_, idx) => idx !== i) },
    }));
  }

  function applyErrorResponse(data: any) {
    if (data.issues?.fieldErrors) {
      const fieldErrors: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(data.issues.fieldErrors)) {
        if (Array.isArray(msgs) && msgs.length) fieldErrors[key] = msgs[0] as string;
      }
      setErrors(fieldErrors);
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
      const res = await fetch("/api/about", {
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
      const saveRes = await fetch("/api/about", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) {
        applyErrorResponse(saveData);
        return;
      }

      const publishRes = await fetch("/api/about/publish", { method: "POST" });
      if (!publishRes.ok) {
        const publishData = await publishRes.json();
        applyErrorResponse(publishData);
        return;
      }

      showToast("تم نشر صفحة من نحن");
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

        <FormField label="العنوان الفرعي (Eyebrow)" htmlFor="hero-eyebrow">
          <Input id="hero-eyebrow" value={values.hero.eyebrow} onChange={(e) => updateHero("eyebrow", e.target.value)} />
        </FormField>
        <FormField label="العنوان الرئيسي" htmlFor="hero-title" required>
          <Input id="hero-title" value={values.hero.title} onChange={(e) => updateHero("title", e.target.value)} required />
        </FormField>
        <FormField label="المقدمة" htmlFor="hero-lead" required>
          <Textarea id="hero-lead" value={values.hero.lead} onChange={(e) => updateHero("lead", e.target.value)} required />
        </FormField>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-lg font-black">قصتنا</h2>
        {errors.story && <p className="text-xs text-[#E07856]">{errors.story}</p>}

        <FormField label="العنوان الفرعي (Eyebrow)" htmlFor="story-eyebrow">
          <Input id="story-eyebrow" value={values.story.eyebrow} onChange={(e) => updateStory("eyebrow", e.target.value)} />
        </FormField>
        <FormField label="العنوان" htmlFor="story-title" required>
          <Input id="story-title" value={values.story.title} onChange={(e) => updateStory("title", e.target.value)} required />
        </FormField>
        <FormField label="النص" htmlFor="story-body" required>
          <Textarea id="story-body" value={values.story.body} onChange={(e) => updateStory("body", e.target.value)} required />
        </FormField>
        <FormField label="وصف الصورة (Image label)" htmlFor="story-image-label" helpText="نص بديل — لا يوجد رفع صور بعد">
          <Input id="story-image-label" value={values.story.imageLabel} onChange={(e) => updateStory("imageLabel", e.target.value)} />
        </FormField>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-black">قيمنا</h2>
        {errors.values && <p className="text-xs text-[#E07856]">{errors.values}</p>}

        <div className="flex flex-col gap-4">
          {values.values.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-md border border-[rgba(201,162,39,0.16)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#9C978A]">قيمة {i + 1}</span>
                {values.values.length > 1 && (
                  <button type="button" onClick={() => removeValueItem(i)} className="text-xs font-bold text-[#E07856] hover:underline">
                    حذف
                  </button>
                )}
              </div>
              <FormField label="الأيقونة" htmlFor={`value-icon-${i}`}>
                <Select id={`value-icon-${i}`} value={item.icon} onChange={(e) => updateValueItem(i, "icon", e.target.value)}>
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="العنوان" htmlFor={`value-title-${i}`}>
                <Input id={`value-title-${i}`} value={item.title} onChange={(e) => updateValueItem(i, "title", e.target.value)} />
              </FormField>
              <FormField label="النص" htmlFor={`value-text-${i}`}>
                <Input id={`value-text-${i}`} value={item.text} onChange={(e) => updateValueItem(i, "text", e.target.value)} />
              </FormField>
            </div>
          ))}
        </div>
        <button type="button" onClick={addValueItem} className="text-xs font-bold text-[#C9A227] hover:underline">
          + إضافة قيمة
        </button>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-black">الإحصائيات</h2>
        {errors.stats && <p className="text-xs text-[#E07856]">{errors.stats}</p>}

        <div className="flex flex-col gap-4">
          {values.stats.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-md border border-[rgba(201,162,39,0.16)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#9C978A]">إحصائية {i + 1}</span>
                {values.stats.length > 1 && (
                  <button type="button" onClick={() => removeStatItem(i)} className="text-xs font-bold text-[#E07856] hover:underline">
                    حذف
                  </button>
                )}
              </div>
              <FormField label="الرقم" htmlFor={`stat-count-${i}`}>
                <Input
                  id={`stat-count-${i}`}
                  type="number"
                  dir="ltr"
                  style={{ textAlign: "left" }}
                  value={item.count}
                  onChange={(e) => updateStatItem(i, "count", Number(e.target.value))}
                />
              </FormField>
              <FormField label="اللاحقة (Suffix)" htmlFor={`stat-suffix-${i}`} helpText="مثال: +">
                <Input id={`stat-suffix-${i}`} dir="ltr" style={{ textAlign: "left" }} value={item.suffix} onChange={(e) => updateStatItem(i, "suffix", e.target.value)} />
              </FormField>
              <FormField label="الوصف" htmlFor={`stat-caption-${i}`}>
                <Input id={`stat-caption-${i}`} value={item.caption} onChange={(e) => updateStatItem(i, "caption", e.target.value)} />
              </FormField>
            </div>
          ))}
        </div>
        <button type="button" onClick={addStatItem} className="text-xs font-bold text-[#C9A227] hover:underline">
          + إضافة إحصائية
        </button>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-lg font-black">الترخيص والاعتماد</h2>
        {errors.license && <p className="text-xs text-[#E07856]">{errors.license}</p>}

        <FormField label="العنوان الفرعي (Eyebrow)" htmlFor="license-eyebrow">
          <Input id="license-eyebrow" value={values.license.eyebrow} onChange={(e) => updateLicenseField("eyebrow", e.target.value)} />
        </FormField>
        <FormField label="العنوان" htmlFor="license-title" required>
          <Input id="license-title" value={values.license.title} onChange={(e) => updateLicenseField("title", e.target.value)} required />
        </FormField>
        <FormField label="وصف الصورة (Image label)" htmlFor="license-image-label" helpText="نص بديل — لا يوجد رفع صور بعد">
          <Input id="license-image-label" value={values.license.imageLabel} onChange={(e) => updateLicenseField("imageLabel", e.target.value)} />
        </FormField>

        <div>
          <p className="mb-2 text-sm font-bold text-[#9C978A]">عناصر القائمة</p>
          <div className="flex flex-col gap-2">
            {values.license.items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input value={item} onChange={(e) => updateLicenseItem(i, e.target.value)} placeholder="عنصر..." />
                {values.license.items.length > 1 && (
                  <button type="button" onClick={() => removeLicenseItem(i)} className="px-3 text-[#E07856] hover:underline">
                    حذف
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addLicenseItem} className="mt-2 text-xs font-bold text-[#C9A227] hover:underline">
            + إضافة عنصر
          </button>
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
