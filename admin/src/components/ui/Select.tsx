import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ hasError, className = "", children, ...rest }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full rounded-md border bg-[#161514] px-4 py-2.5 text-[#F5F0E6]
          transition-colors duration-200 focus:outline-none
          ${hasError ? "border-[#E07856]" : "border-[rgba(201,162,39,0.16)] focus:border-[#C9A227]"}
          ${className}`}
        {...rest}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
