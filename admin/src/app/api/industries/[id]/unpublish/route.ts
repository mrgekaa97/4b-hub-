import { NextRequest, NextResponse } from "next/server";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { industryManagementService } from "@/lib/services/industryManagement.service";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.INDUSTRIES_MANAGE);
  if (result instanceof NextResponse) return result;

  const industry = await industryManagementService.unpublish(params.id, result.id);
  return NextResponse.json({ industry });
}
