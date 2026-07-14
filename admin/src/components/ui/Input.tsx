import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError, className = "", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-md border bg-[#161514] px-4 py-2.5 text-[#F5F0E6] placeholder:text-[#9C978A]
          transition-colors duration-200 focus:outline-none
          ${hasError ? "border-[#E07856]" : "border-[rgba(201,162,39,0.16)] focus:border-[#C9A227]"}
          ${className}`}
        {...rest}
      />
    );
  }
);
Input.displayName = "Input";
