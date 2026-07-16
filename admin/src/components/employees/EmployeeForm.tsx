"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { Checkbox } from "@/components/ui/Checkbox";
import { useToast } from "@/components/notifications/ToastProvider";

interface SiteOption {
  id: string;
  name: string;
}

interface EmployeeFormProps {
  mode: "create" | "edit";
  employeeId?: string;
  sites: SiteOption[];
  initial?: {
    fullName: string;
    phone: string;
    email: string;
    nationalId: string;
    isSupervisor: boolean;
    isActive: boolean;
    assignedSiteId: string;
  };
}

const EMPTY = {
  fullName: "",
  phone: "",
  email: "",
  nationalId: "",
  isSupervisor: false,
  isActive: true,
  assignedSiteId: "",
  username: "",
  password: "",
};

export function EmployeeForm({ mode, employeeId, sites, initial }: EmployeeFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [values, setValues] = useState(initial ? { ...EMPTY, ...initial } : EMPTY);
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
      const endpoint = mode === "create" ? "/api/employees" : `/api/employees/${employeeId}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const payload = mode === "create" ? values : { ...values, username: undefined, password: undefined };

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

      showToast(mode === "create" ? "تم إضافة الموظف بنجاح" : "تم تحديث بيانات الموظف بنجاح");
      router.push("/dashboard/employees");
      router.refresh();
    } catch {
      setFormError("تعذر الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5" noValidate>
      <FormField label="الاسم بالكامل" htmlFor="fullName" required error={errors.fullName}>
        <Input id="fullName" value={values.fullName} onChange={(e) => setField("fullName", e.target.value)} hasError={!!errors.fullName} required />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="رقم الهاتف" htmlFor="phone" required error={errors.phone}>
          <Input id="phone" type="tel" dir="ltr" style={{ textAlign: "left" }} value={values.phone} onChange={(e) => setField("phone", e.target.value)} hasError={!!errors.phone} required />
        </FormField>
        <FormField label="البريد الإلكتروني" htmlFor="email" error={errors.email}>
          <Input id="email" type="email" dir="ltr" style={{ textAlign: "left" }} value={values.email} onChange={(e) => setField("email", e.target.value)} hasError={!!errors.email} />
        </FormField>
      </div>

      <FormField label="الرقم القومي" htmlFor="nationalId" error={errors.nationalId}>
        <Input id="nationalId" dir="ltr" style={{ textAlign: "left" }} value={values.nationalId} onChange={(e) => setField("nationalId", e.target.value)} hasError={!!errors.nationalId} />
      </FormField>

      <FormField label="الموقع المعيّن" htmlFor="assignedSiteId" helpText="الموقع اللي هيسجّل عليه الموظف حضوره">
        <Select id="assignedSiteId" value={values.assignedSiteId} onChange={(e) => setField("assignedSiteId", e.target.value)}>
          <option value="">بدون تعيين</option>
          {sites.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </Select>
      </FormField>

      {mode === "create" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="اسم المستخدم" htmlFor="username" required error={errors.username} helpText="لتسجيل الدخول لتطبيق الموظفين">
              <Input id="username" dir="ltr" style={{ textAlign: "left" }} value={values.username} onChange={(e) => setField("username", e.target.value)} hasError={!!errors.username} required />
            </FormField>
            <FormField label="كلمة المرور الأولية" htmlFor="password" required error={errors.password}>
              <Input id="password" type="password" dir="ltr" style={{ textAlign: "left" }} value={values.password} onChange={(e) => setField("password", e.target.value)} hasError={!!errors.password} required />
            </FormField>
          </div>
          <p className="text-xs text-[#9C978A]">
            سيحتاج الموظف تغيير كلمة المرور هذه عند أول تسجيل دخول له.
          </p>
        </>
      )}

      <div className="flex gap-6">
        <Checkbox id="isSupervisor" label="مشرف موقع" checked={values.isSupervisor} onChange={(e) => setField("isSupervisor", e.target.checked)} />
        <Checkbox id="isActive" label="حساب نشط" checked={values.isActive} onChange={(e) => setField("isActive", e.target.checked)} />
      </div>

      {formError && (
        <p role="alert" className="rounded-md border border-[#E07856]/40 bg-[#E07856]/10 px-4 py-2 text-sm text-[#E07856]">
          {formError}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          {mode === "create" ? "إضافة الموظف" : "حفظ التعديلات"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/employees")}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
