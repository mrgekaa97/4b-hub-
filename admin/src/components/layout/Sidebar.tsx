"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { NAV_GROUPS } from "@/lib/constants/navigation";
import type { PermissionKey } from "@/lib/constants/permissions";
import { BRANDING } from "@/lib/constants/branding";

interface SidebarProps {
  grantedPermissions: PermissionKey[];
}

export function Sidebar({ grantedPermissions }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const granted = new Set(grantedPermissions);

  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => granted.has(item.permission)),
  })).filter((group) => group.items.length > 0);

  const content = (
    <nav className="flex h-full flex-col">
      <div className="border-b border-[rgba(201,162,39,0.16)] px-5 py-5">
        <p className="text-lg font-black text-[#F5F0E6]">{BRANDING.productName}</p>
        <p className="mt-0.5 text-[11px] text-[#9C978A]">{BRANDING.companyNameAr}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {visibleGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wide text-[#9C978A]">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                      ${isActive ? "bg-[#C9A227]/10 text-[#C9A227]" : "text-[#F5F0E6]/85 hover:bg-[#1D1B18] hover:text-[#F5F0E6]"}`}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[rgba(201,162,39,0.16)] px-5 py-3 text-[11px] text-[#9C978A]">
        {BRANDING.poweredByLineAr}
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile top bar toggle */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="فتح القائمة"
        className="fixed start-4 top-4 z-30 rounded-md border border-[rgba(201,162,39,0.16)] bg-[#161514] p-2 md:hidden"
      >
        ☰
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-e border-[rgba(201,162,39,0.16)] bg-[#0E0E0E] md:block">
        {content}
      </aside>

      {/* Mobile off-canvas */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setIsOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-72 bg-[#0E0E0E]">{content}</aside>
        </div>
      )}
    </>
  );
}
