import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { unifiedLogin } from "@/lib/auth/unified-login";
import { parseUserAgent } from "@/lib/device/parseUserAgent";
import {
  UserInvalidCredentials,
  UserAccountLocked,
  EmployeeInvalidCredentials,
  EmployeeAccountLocked,
  DevicePendingApprovalError,
  DeviceBlockedError,
} from "@/lib/auth/unified-login";

const bodySchema = z.object({
  identifier: z.string().min(1), // username — could be an admin User or an Employee
  password: z.string().min(1),
  // Only present when the client is the Employee Portal's login flow —
  // the admin login form never needs to compute this.
  deviceFingerprint: z.string().optional(),
  deviceName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات الطلب غير صحيحة" }, { status: 400 });
  }

  const { identifier, password, deviceFingerprint, deviceName } = parsed.data;
  const userAgent = req.headers.get("user-agent") ?? "";
  const ipAddress = req.headers.get("x-forwarded-for") ?? req.ip ?? undefined;
  const { browser, operatingSystem } = parseUserAgent(userAgent);

  try {
    const result = await unifiedLogin(identifier, password, {
      ipAddress,
      userAgent,
      deviceInfo: deviceFingerprint
        ? { fingerprint: deviceFingerprint, deviceName, browser, operatingSystem }
        : undefined,
    });
    return NextResponse.json({ redirectTo: result.redirectTo, kind: result.kind });
  } catch (err) {
    if (err instanceof DevicePendingApprovalError) {
      return NextResponse.json({ error: err.message, code: "DEVICE_PENDING" }, { status: 403 });
    }
    if (err instanceof DeviceBlockedError) {
      return NextResponse.json({ error: err.message, code: "DEVICE_BLOCKED" }, { status: 403 });
    }
    if (err instanceof UserAccountLocked || err instanceof EmployeeAccountLocked) {
      return NextResponse.json({ error: err.message, code: "LOCKED" }, { status: 423 });
    }
    if (err instanceof UserInvalidCredentials || err instanceof EmployeeInvalidCredentials) {
      return NextResponse.json({ error: err.message, code: "INVALID_CREDENTIALS" }, { status: 401 });
    }
    console.error("Unexpected login error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
