import { NextResponse } from "next/server";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { deviceService } from "@/lib/services/device.service";

export async function GET() {
  const result = await requirePermissionApi(PERMISSIONS.DEVICES_VIEW);
  if (result instanceof NextResponse) return result;

  const devices = await deviceService.list();
  return NextResponse.json({ devices });
}
