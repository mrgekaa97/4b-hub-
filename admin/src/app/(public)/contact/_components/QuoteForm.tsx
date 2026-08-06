"use client";

import { useRef, useState } from "react";

export function QuoteForm() {
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
      const res = await fetch("/api/public/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: get("company"),
          contactName: get("contact_name"),
          phone: get("phone"),
          email: get("email"),
          industry: get("industry"),
          location: get("location"),
          guardsRange: get("guards"),
          preferredContact: get("preferred_contact"),
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
        <div className="form-progress" aria-hidden="true">
          <span className="is-active"></span>
          <span className="is-active"></span>
          <span></span>
        </div>
        <div className="form-grid">
          <div className="form-section-label">بيانات التواصل</div>
          <div className="field">
            <label htmlFor="q-company">اسم الشركة *</label>
            <input id="q-company" type="text" name="company" required autoComplete="organization" />
            <span className="error">برجاء إدخال اسم الشركة.</span>
          </div>
          <div className="field">
            <label htmlFor="q-contact_name">اسم المسؤول *</label>
            <input id="q-contact_name" type="text" name="contact_name" required autoComplete="name" />
            <span className="error">برجاء إدخال اسم المسؤول.</span>
          </div>
          <div className="field">
            <label htmlFor="q-phone">رقم الهاتف *</label>
            <input id="q-phone" type="tel" name="phone" required autoComplete="tel" placeholder="01xxxxxxxxx" />
            <span className="error">برجاء إدخال رقم هاتف صحيح.</span>
          </div>
          <div className="field">
            <label htmlFor="q-email">البريد الإلكتروني *</label>
            <input id="q-email" type="email" name="email" required autoComplete="email" />
            <span className="error">برجاء إدخال بريد إلكتروني صحيح.</span>
          </div>

          <div className="form-section-label">تفاصيل الموقع</div>
          <div className="field">
            <label htmlFor="q-industry">نوع المنشأة *</label>
            <select id="q-industry" name="industry" required defaultValue="">
              <option value="">اختر نوع المنشأة</option>
              <option>مصنع</option>
              <option>مستشفى</option>
              <option>فندق</option>
              <option>مجمع سكني</option>
              <option>مبنى تجاري / إداري</option>
              <option>مستودع / مركز توزيع</option>
              <option>مؤسسة تعليمية</option>
              <option>جهة حكومية</option>
            </select>
            <span className="error">برجاء اختيار نوع المنشأة.</span>
          </div>
          <div className="field">
            <label htmlFor="q-guards">عدد أفراد الأمن المطلوب تقريبًا</label>
            <select id="q-guards" name="guards" defaultValue="">
              <option value="">اختر النطاق</option>
              <option>1 – 3 أفراد</option>
              <option>4 – 10 أفراد</option>
              <option>11 – 25 فرد</option>
              <option>أكثر من 25 فرد</option>
            </select>
          </div>
          <div className="field full">
            <label htmlFor="q-location">موقع المنشأة (المدينة / المنطقة) *</label>
            <input id="q-location" type="text" name="location" required />
            <span className="error">برجاء إدخال موقع المنشأة.</span>
          </div>
          <div className="field">
            <label htmlFor="q-preferred_contact">طريقة التواصل المفضلة</label>
            <select id="q-preferred_contact" name="preferred_contact" defaultValue="">
              <option value="">اختر الطريقة</option>
              <option>مكالمة هاتفية</option>
              <option>واتساب</option>
              <option>بريد إلكتروني</option>
            </select>
          </div>

          <div className="form-section-label">تفاصيل إضافية</div>
          <div className="field full">
            <label htmlFor="q-message">تفاصيل إضافية</label>
            <textarea
              id="q-message"
              name="message"
              placeholder="مواعيد التشغيل، طبيعة المخاطر، أو أي متطلبات خاصة بالموقع"
            ></textarea>
          </div>
        </div>
        {/*
          Honeypot — intentional, documented deviation from verbatim legacy
          markup (same category as the item-7 mobile-menu CSS patch). Real
          users/screen-readers never see or reach this field (off-screen,
          aria-hidden, unfocusable); a bot that blindly fills every input it
          finds fills it, and the backend (quote.service.ts) silently drops
          any submission where it's non-empty. Field name matches
          quote.schema.ts's `honeypot` key exactly.
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
          إرسال طلب عرض السعر
        </button>
        {submitError && (
          <p style={{ color: "var(--danger)", fontSize: ".85rem", marginTop: ".8rem" }}>
            حدث خطأ أثناء إرسال الطلب. برجاء المحاولة مرة أخرى.
          </p>
        )}
        <p className="form-note">سيتواصل معك أحد مستشارينا خلال يوم عمل واحد لتحديد موعد معاينة الموقع.</p>
      </form>
      <div className="form-success" ref={successRef}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l3 3 5-6" />
        </svg>
        <h3 className="h3">تم استلام طلبك بنجاح</h3>
        <p className="lead" style={{ marginTop: ".5rem" }}>
          سيتواصل معك فريقنا خلال يوم عمل واحد لتحديد موعد المعاينة.
        </p>
      </div>
    </>
  );
}
