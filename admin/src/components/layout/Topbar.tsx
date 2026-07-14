"use client";

import { useRouter } from "next/navigation";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface TopbarProps {
  displayName: string;
  roleLabel: string;
}

export function Topbar({ displayName, roleLabel }: TopbarProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[rgba(201,162,39,0.16)] bg-[#0A0A0A]/95 px-5 py-3 backdrop-blur">
      {/* Left space reserved for the mobile sidebar toggle button (fixed-position, rendered by Sidebar) */}
      <div className="ms-10 md:ms-0" />

      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="hidden text-end sm:block">
          <p className="text-sm font-bold text-[#F5F0E6]">{displayName}</p>
          <p className="text-xs text-[#9C978A]">{roleLabel}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-md border border-[rgba(201,162,39,0.35)] px-3 py-1.5 text-xs font-bold text-[#F5F0E6] hover:border-[#C9A227] hover:text-[#C9A227]"
        >
          تسجيل الخروج
        </button>
      </div>
    </header>
  );
}
