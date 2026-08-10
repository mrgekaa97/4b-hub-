import { NextRequest, NextResponse } from "next/server";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { aboutManagementService } from "@/lib/services/aboutManagement.service";

export async function POST(_req: NextRequest) {
  const result = await requirePermissionApi(PERMISSIONS.ABOUT_MANAGE);
  if (result instanceof NextResponse) return result;

  const page = await aboutManagementService.publish(result.id);
  return NextResponse.json({ page });
}
