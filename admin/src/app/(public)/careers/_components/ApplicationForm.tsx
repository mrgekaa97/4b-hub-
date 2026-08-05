"use client";

import { useRef } from "react";

export function ApplicationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

    form.style.display = "none";
    successRef.current?.classList.add("is-visible");
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
        <button type="submit" className="btn btn--primary btn--block" style={{ marginTop: "1.5rem" }}>
          إرسال طلب التقديم
        </button>
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
