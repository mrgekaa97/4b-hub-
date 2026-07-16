import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ hasError, className = "", ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={3}
        className={`w-full resize-y rounded-md border bg-[#161514] px-4 py-2.5 text-[#F5F0E6] placeholder:text-[#9C978A]
          transition-colors duration-200 focus:outline-none
          ${hasError ? "border-[#E07856]" : "border-[rgba(201,162,39,0.16)] focus:border-[#C9A227]"}
          ${className}`}
        {...rest}
      />
    );
  }
);
Textarea.displayName = "Textarea";
