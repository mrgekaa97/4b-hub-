"use client";

import { useRef, useState } from "react";

export function ApplicationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    let valid = true;
    form.querySelectorAll("[required]").forEach((field) => {
      const wrap = field.closest(".field");
      const el = field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      const filled = el.type === "checkbox" ? (el as HTMLInputElement).checked : el.value.trim().length > 0;
      if (!filled) {
        valid = false;
        wrap?.classList.add("has-error");
      } else {
        wrap?.classList.remove("has-error");
      }
    });

    const emailField = form.querySelector<HTMLInputElement>('input[type="email"]');
    if (emailField && emailField.value) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value);
      if (!ok) {
        valid = false;
        emailField.closest(".field")?.classList.add("has-error");
      }
    }

    if (!valid) {
      form.querySelector<HTMLElement>(".has-error input, .has-error select, .has-error textarea")?.focus();
      return;
    }

    setSubmitError(false);
    setIsSubmitting(true);

    const data = new FormData(form);
    const get = (name: string) => (data.get(name) as string | null) ?? "";

    try {
      const res = await fetch("/api/public/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: get("full_name"),
          phone: get("phone"),
          email: get("email"),
          roleApplied: get("role"),
          experience: get("experience"),
          message: get("message"),
          honeypot: get("honeypot"),
        }),
      });

      if (!res.ok) throw new Error(`submit failed with status ${res.status}`);

      form.style.display = "none";
      successRef.current?.classList.add("is-visible");
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form data-validate noValidate ref={formRef} onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="c-full_name">الاسم بالكامل *</label>
            <input id="c-full_name" type="text" name="full_name" required />
            <span className="error">برجاء إدخال الاسم بالكامل.</span>
          </div>
          <div className="field">
            <label htmlFor="c-phone">رقم الهاتف *</label>
            <input id="c-phone" type="tel" name="phone" required />
            <span className="error">برجاء إدخال رقم هاتف صحيح.</span>
          </div>
          <div className="field">
            <label htmlFor="c-email">البريد الإلكتروني</label>
            <input id="c-email" type="email" name="email" />
            <span className="error">برجاء إدخال بريد إلكتروني صحيح.</span>
          </div>
          <div className="field">
            <label htmlFor="c-role">الوظيفة المتقدم لها *</label>
            <select id="c-role" name="role" required defaultValue="">
              <option value="">اختر الوظيفة</option>
              <option>فرد أمن وحراسة</option>
              <option>مشرف موقع</option>
              <option>ضابط تطوير أعمال</option>
              <option>مدير عمليات ميدانية</option>
            </select>
            <span className="error">برجاء اختيار الوظيفة.</span>
          </div>
          <div className="field full">
            <label htmlFor="c-experience">سنوات الخبرة</label>
            <input id="c-experience" type="text" name="experience" placeholder="مثال: 4 سنوات في قطاع الحراسة" />
          </div>
          <div className="field full">
            <label htmlFor="c-message">نبذة مختصرة</label>
            <textarea
              id="c-message"
              name="message"
              placeholder="أخبرنا عن خبرتك السابقة ولماذا ترغب في الانضمام لفريق فور برذرز"
            ></textarea>
          </div>
        </div>
        {/*
          Honeypot — intentional, documented deviation from verbatim legacy
          markup (same category as the item-7 mobile-menu CSS patch and
          QuoteForm's honeypot). Real users/screen-readers never see or reach
          this field (off-screen, aria-hidden, unfocusable); a bot that
          blindly fills every input it finds fills it, and the backend
          (application.service.ts) silently drops any submission where it's
          non-empty. Field name matches application.schema.ts's `honeypot`
          key exactly.
        */}
        <div
          style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
          aria-hidden="true"
        >
          <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
        <button
          type="submit"
          className="btn btn--primary btn--block"
          style={{ marginTop: "1.5rem" }}
          disabled={isSubmitting}
        >
          إرسال طلب التقديم
        </button>
        {submitError && (
          <p style={{ color: "var(--danger)", fontSize: ".85rem", marginTop: ".8rem" }}>
            حدث خطأ أثناء إرسال الطلب. برجاء المحاولة مرة أخرى.
          </p>
        )}
        <p className="form-note">بإرسال هذا النموذج، أنت توافق على تواصل فريق فور برذرز معك بخصوص هذا التقديم.</p>
      </form>
      <div className="form-success" ref={successRef}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l3 3 5-6" />
        </svg>
        <h3 className="h3">تم استلام طلبك بنجاح</h3>
        <p className="lead" style={{ marginTop: ".5rem" }}>
          سيتواصل معك فريق التوظيف خلال 5 أيام عمل.
        </p>
      </div>
    </>
  );
}
