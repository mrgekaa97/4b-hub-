import { NextRequest, NextResponse } from "next/server";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { careerManagementService } from "@/lib/services/careerManagement.service";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePermissionApi(PERMISSIONS.CAREERS_MANAGE);
  if (result instanceof NextResponse) return result;

  const career = await careerManagementService.unpublish(params.id, result.id);
  return NextResponse.json({ career });
}
