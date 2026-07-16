import { InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", id, ...rest }, ref) => {
    return (
      <label htmlFor={id} className="flex items-center gap-2 text-sm text-[#F5F0E6]">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={`h-4 w-4 rounded border-[rgba(201,162,39,0.35)] bg-[#161514] accent-[#C9A227] ${className}`}
          {...rest}
        />
        {label}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
