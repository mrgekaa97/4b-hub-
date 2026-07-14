"use client";

import { useRouter } from "next/navigation";

export function EmployeeLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className="text-xs font-bold text-[#9C978A] hover:text-[#C9A227]">
      خروج
    </button>
  );
}
