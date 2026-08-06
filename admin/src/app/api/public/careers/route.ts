import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { applicationService } from "@/lib/services/application.service";

/**
 * Public, unauthenticated — no auth/permission gate, deliberately kept under
 * /api/public/* alongside api/public/services and api/public/quote so it's
 * obvious at a glance which routes are meant to be called from outside the
 * admin app.
 *
 * Spam protection: honeypot only for now (see application.service.ts).
 * IP-based rate-limiting is explicitly deferred as a pre-production
 * improvement.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  try {
    const ipAddress = req.headers.get("x-forwarded-for") ?? req.ip ?? undefined;
    const result = await applicationService.submit(body, { ipAddress });

    if (result.spam) {
      // Honeypot tripped — respond exactly like a real success, no write happened.
      return NextResponse.json({ success: true }, { status: 201 });
    }

    return NextResponse.json({ success: true, id: result.jobApplication.id }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "بيانات الطلب غير صحيحة", issues: err.flatten() }, { status: 400 });
    }
    console.error("Job application submission error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
