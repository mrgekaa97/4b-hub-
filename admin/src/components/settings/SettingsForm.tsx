"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/ui/FormField";
import { useToast } from "@/components/notifications/ToastProvider";
import { SETTINGS_SECTIONS, SOCIAL_LINK_FIELDS, type SocialLinkKey } from "@/lib/constants/settings-fields";

interface SettingsFormProps {
  initial: Record<string, unknown>;
}

type SocialLinks = Record<SocialLinkKey, string>;

function buildInitialFields(initial: Record<string, unknown>): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const section of SETTINGS_SECTIONS) {
    for (const field of section.fields) {
      fields[field.key] = String(initial[field.key] ?? "");
    }
  }
  return fields;
}

function buildInitialSocial(initial: Record<string, unknown>): SocialLinks {
  const raw = (initial["site.social_links"] ?? null) as Record<string, unknown> | null;
  return {
    facebook: String(raw?.facebook ?? ""),
    linkedin: String(raw?.linkedin ?? ""),
    whatsapp: String(raw?.whatsapp ?? ""),
  };
}

export function SettingsForm({ initial }: SettingsFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [fields, setFields] = useState<Record<string, string>>(() => buildInitialFields(initial));
  const [social, setSocial] = useState<SocialLinks>(() => buildInitialSocial(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function updateField(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function updateSocial(subKey: SocialLinkKey, value: string) {
    setSocial((prev) => ({ ...prev, [subKey]: value }));
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

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setFormError(null);
    setIsSaving(true);

    try {
      const payload: Record<string, unknown> = {
        ...fields,
        "site.social_links": { ...social },
      };

      const res = await fetch("/api/settings/general", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        applyErrorResponse(data);
        return;
      }

      showToast("تم حفظ الإعدادات");
      router.refresh();
    } catch {
      setFormError("تعذر الاتصال بالخادم");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="flex max-w-3xl flex-col gap-8" noValidate>
      {SETTINGS_SECTIONS.map((section) => (
        <section key={section.title} className="flex flex-col gap-5">
          <h2 className="text-lg font-black">{section.title}</h2>
          {section.fields.map((field) => (
            <FormField key={field.key} label={field.label} htmlFor={field.key} error={errors[field.key]}>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.key}
                  value={fields[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  hasError={!!errors[field.key]}
                />
              ) : (
                <Input
                  id={field.key}
                  value={fields[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  hasError={!!errors[field.key]}
                />
              )}
            </FormField>
          ))}
        </section>
      ))}

      <section className="flex flex-col gap-5">
        <h2 className="text-lg font-black">روابط التواصل الاجتماعي</h2>
        {errors["site.social_links"] && <p className="text-xs text-[#E07856]">{errors["site.social_links"]}</p>}

        {SOCIAL_LINK_FIELDS.map((socialField) => (
          <FormField key={socialField.subKey} label={socialField.label} htmlFor={`social-${socialField.subKey}`}>
            <Input
              id={`social-${socialField.subKey}`}
              dir="ltr"
              style={{ textAlign: "left" }}
              value={social[socialField.subKey]}
              onChange={(e) => updateSocial(socialField.subKey, e.target.value)}
            />
          </FormField>
        ))}
      </section>

      {formError && (
        <p role="alert" className="rounded-md border border-[#E07856]/40 bg-[#E07856]/10 px-4 py-2 text-sm text-[#E07856]">
          {formError}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" isLoading={isSaving}>
          حفظ التغييرات
        </Button>
      </div>
    </form>
  );
}
