import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  children: ReactNode;
}

/**
 * Every form field in the CMS (login, Settings, Services editor, Employee
 * creation, ...) should be wrapped in this rather than hand-rolling
 * label/error markup per field — this is the reusable unit referenced by
 * the "reusable form components" foundation requirement.
 */
export function FormField({ label, htmlFor, error, required, helpText, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-bold text-[#9C978A]">
        {label} {required && <span className="text-[#C9A227]">*</span>}
      </label>
      {children}
      {helpText && !error && <p className="text-xs text-[#9C978A]">{helpText}</p>}
      {error && <p className="text-xs text-[#E07856]">{error}</p>}
    </div>
  );
}
