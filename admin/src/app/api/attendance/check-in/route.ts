import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionEmployee } from "@/lib/auth/employee-session";
import { attendanceService } from "@/lib/services/attendance.service";
import { parseUserAgent } from "@/lib/device/parseUserAgent";

const bodySchema = z.object({
  lat: z.number(),
  lng: z.number(),
  accuracyMeters: z.number(),
  deviceFingerprint: z.string().optional(),
  deviceName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const employee = await getSessionEmployee();
  if (!employee) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });

  const { browser, os: operatingSystem } = (() => {
    const { browser, operatingSystem } = parseUserAgent(req.headers.get("user-agent") ?? "");
    return { browser, os: operatingSystem };
  })();

  try {
    const record = await attendanceService.checkIn(
      employee.id,
      { lat: parsed.data.lat, lng: parsed.data.lng, accuracyMeters: parsed.data.accuracyMeters },
      {
        ip: req.headers.get("x-forwarded-for") ?? undefined,
        deviceFingerprint: parsed.data.deviceFingerprint,
        deviceName: parsed.data.deviceName,
        browser,
        os: operatingSystem,
      }
    );
    return NextResponse.json({ record });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "حدث خطأ" }, { status: 400 });
  }
}
