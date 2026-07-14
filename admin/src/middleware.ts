import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware runs on the Edge runtime, where Prisma can't run — so this
 * ONLY checks whether the relevant session cookie is present at all. It
 * cannot verify the session is still valid (not expired/revoked) or check
 * RBAC permissions; that full check happens in lib/auth/guard.ts
 * (requireUser / requirePermission), which every (dashboard) and
 * (employee) page/layout calls in a Server Component before rendering
 * anything sensitive. Middleware here is a fast, cheap first gate — not
 * the actual security boundary.
 *
 * "Authentication must always validate: Authentication, Session, Role,
 * Permissions, Trusted Device — before rendering any protected page":
 * that full chain is what guard.ts + rbac.ts + employee-session.ts
 * (device-status re-check on every read) together implement; middleware's
 * job is just to skip the round-trip to a page that will obviously bounce
 * back to /login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isEmployeeRoute = pathname.startsWith("/employee");

  if (isDashboardRoute) {
    const hasSession = request.cookies.has("4b_admin_session");
    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isEmployeeRoute) {
    const hasSession = request.cookies.has("4b_employee_session");
    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/employee/:path*"],
};
