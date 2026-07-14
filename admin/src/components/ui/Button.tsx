import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary: "bg-[#C9A227] text-[#0A0A0A] hover:bg-[#E4C766]",
  ghost: "bg-transparent text-[#F5F0E6] border border-[rgba(201,162,39,0.35)] hover:border-[#C9A227] hover:text-[#C9A227]",
  danger: "bg-transparent text-[#E07856] border border-[#E07856]/50 hover:bg-[#E07856]/10",
};

/**
 * Base button for the whole CMS + Employee Portal. Colors are set via
 * inline-compatible Tailwind arbitrary values matching shared/design-tokens
 * exactly (not the closest Tailwind palette color) — see shared/README.md
 * for why the two design systems must stay byte-identical in color.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", isLoading, fullWidth, className = "", disabled, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold
          transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A227]
          ${fullWidth ? "w-full" : ""} ${VARIANT_STYLES[variant]} ${className}`}
        {...rest}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
