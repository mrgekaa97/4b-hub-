import { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "gold";

const TONE_STYLES: Record<Tone, string> = {
  neutral: "bg-[#1D1B18] text-[#9C978A] border-[rgba(201,162,39,0.16)]",
  success: "bg-[#4C8B5B]/10 text-[#4C8B5B] border-[#4C8B5B]/30",
  warning: "bg-[#C9A227]/10 text-[#C9A227] border-[#C9A227]/30",
  danger: "bg-[#E07856]/10 text-[#E07856] border-[#E07856]/30",
  gold: "bg-[#C9A227] text-[#0A0A0A] border-transparent",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${TONE_STYLES[tone]}`}
    >
      {children}
    </span>
  );
}

/** Maps the common status enums to a consistent tone, so callers don't repeat this switch everywhere. */
export function statusTone(status: string): Tone {
  switch (status) {
    case "PUBLISHED":
    case "APPROVED":
    case "PRESENT":
    case "INSIDE_SITE":
    case "READ":
    case "CONTACTED":
    case "HIRED":
      return "success";
    case "DRAFT":
    case "PENDING":
    case "NEAR_SITE":
    case "NEW":
    case "UNREAD":
    case "REVIEWING":
      return "warning";
    case "REJECTED":
    case "REVOKED":
    case "OUTSIDE_SITE":
    case "ABSENT":
    case "LOCKED":
      return "danger";
    default:
      return "neutral";
  }
}
