import Link from "next/link";
import { ReactNode } from "react";

interface StatWidgetProps {
  label: string;
  value: string | number;
  href?: string;
  tone?: "default" | "warning" | "danger";
  icon?: ReactNode;
}

const TONE_VALUE_STYLES = {
  default: "text-[#C9A227]",
  warning: "text-[#C9A227]",
  danger: "text-[#E07856]",
};

export function StatWidget({ label, value, href, tone = "default", icon }: StatWidgetProps) {
  const body = (
    <div className="flex h-full flex-col justify-between rounded-lg border border-[rgba(201,162,39,0.16)] bg-[#161514] p-4 transition-colors hover:border-[rgba(201,162,39,0.35)]">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-[#9C978A]">{label}</span>
        {icon && <span aria-hidden="true">{icon}</span>}
      </div>
      <span className={`text-2xl font-black ${TONE_VALUE_STYLES[tone]}`}>{value}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {body}
      </Link>
    );
  }
  return body;
}
