import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getSessionEmployee } from "@/lib/auth/employee-session";
import { notificationService } from "@/lib/services/notification.service";

export async function GET(req: NextRequest) {
  const unreadOnly = req.nextUrl.searchParams.get("unreadOnly") === "true";

  const user = await getSessionUser();
  if (user) {
    const notifications = await notificationService.listForUser(user.id, { unreadOnly });
    return NextResponse.json({ notifications });
  }

  const employee = await getSessionEmployee();
  if (employee) {
    const notifications = await notificationService.listForEmployee(employee.id, { unreadOnly });
    return NextResponse.json({ notifications });
  }

  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  // Body: { id: string } to mark one read, or { all: true } to mark all read.
  const body = await req.json().catch(() => ({}));

  const user = await getSessionUser();
  const employee = user ? null : await getSessionEmployee();
  if (!user && !employee) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (body.all) {
    if (user) await notificationService.markAllReadForUser(user.id);
    else if (employee) await notificationService.markAllReadForEmployee(employee.id);
    return NextResponse.json({ ok: true });
  }

  if (typeof body.id === "string") {
    await notificationService.markRead(body.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "bad request" }, { status: 400 });
}
