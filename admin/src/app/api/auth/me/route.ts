import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getSessionEmployee } from "@/lib/auth/employee-session";
import { getUserPermissions } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (user) {
    const role = await prisma.role.findUnique({ where: { id: user.roleId } });
    const permissions = await getUserPermissions(user.id);
    return NextResponse.json({
      kind: "user",
      id: user.id,
      displayName: user.displayName,
      role: role?.key,
      permissions: Array.from(permissions),
    });
  }

  const employee = await getSessionEmployee();
  if (employee) {
    return NextResponse.json({
      kind: "employee",
      id: employee.id,
      displayName: employee.fullName,
      isSupervisor: employee.isSupervisor,
      mustChangePassword: employee.mustChangePassword,
    });
  }

  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}
