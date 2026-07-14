import { requireUser } from "@/lib/auth/guard";
import { getUserPermissions } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ToastProvider } from "@/components/notifications/ToastProvider";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const role = await prisma.role.findUnique({ where: { id: user.roleId } });
  const permissions = await getUserPermissions(user.id);

  return (
    <ToastProvider>
      <DashboardShell
        displayName={user.displayName}
        roleLabel={role?.name ?? ""}
        grantedPermissions={Array.from(permissions)}
      >
        {children}
      </DashboardShell>
    </ToastProvider>
  );
}

