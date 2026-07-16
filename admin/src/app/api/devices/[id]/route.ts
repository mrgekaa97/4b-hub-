import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { deviceService } from "@/lib/services/device.service";

const actionSchema = z.object({
  action: z.enum(["approve", "reject", "revoke"]),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.DEVICES_MANAGE);
  if (result instanceof NextResponse) return result;

  const parsed = actionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "إجراء غير صحيح" }, { status: 400 });
  }

  try {
    let device;
    switch (parsed.data.action) {
      case "approve":
        device = await deviceService.approve(params.id, result.id);
        break;
      case "reject":
        device = await deviceService.reject(params.id, result.id);
        break;
      case "revoke":
        device = await deviceService.revoke(params.id, result.id);
        break;
      default:
        return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
    }
    return NextResponse.json({ device });
  } catch (err) {
    console.error("Device status update error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
