import { NextRequest, NextResponse } from "next/server";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { serviceManagementService } from "@/lib/services/serviceManagement.service";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.SERVICES_MANAGE);
  if (result instanceof NextResponse) return result;

  const service = await serviceManagementService.publish(params.id, result.id);
  return NextResponse.json({ service });
}
