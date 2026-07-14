import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getSessionEmployee } from "@/lib/auth/employee-session";
import { authService } from "@/lib/services/auth.service";
import { employeeAuthService } from "@/lib/services/employeeAuth.service";

export async function POST() {
  const user = await getSessionUser();
  if (user) {
    await authService.logout(user.id);
    return NextResponse.json({ redirectTo: "/login" });
  }

  const employee = await getSessionEmployee();
  if (employee) {
    await employeeAuthService.logout(employee.id);
    return NextResponse.json({ redirectTo: "/login" });
  }

  return NextResponse.json({ redirectTo: "/login" });
}
