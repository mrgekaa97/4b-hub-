import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import type { PermissionKey } from "@/lib/constants/permissions";

interface DashboardShellProps {
  displayName: string;
  roleLabel: string;
  grantedPermissions: PermissionKey[];
  children: ReactNode;
}

export function DashboardShell({ displayName, roleLabel, grantedPermissions, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#F5F0E6]">
      <Sidebar grantedPermissions={grantedPermissions} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar displayName={displayName} roleLabel={roleLabel} />
        <main className="flex-1 p-5">{children}</main>
      </div>
    </div>
  );
}
