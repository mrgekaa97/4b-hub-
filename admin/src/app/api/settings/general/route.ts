import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { SettingValueType } from "@prisma/client";
import { requirePermissionApi } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { settingsService } from "@/lib/services/settings.service";
import { settingsGeneralSchema } from "@/lib/validation/settings.schema";

export async function PATCH(req: NextRequest) {
  const result = await requirePermissionApi(PERMISSIONS.WEBSITE_SETTINGS_MANAGE);
  if (result instanceof NextResponse) return result;

  const body = await req.json().catch(() => null);
  try {
    const data = settingsGeneralSchema.parse(body);

    // Only keys present in the payload get written — a partial body is valid.
    // valueType mirrors seedSettings()'s own logic: object values are JSON,
    // everything else is left undefined so set() defaults it to STRING.
    const entries = Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => ({
        key,
        value,
        group: "general",
        valueType: typeof value === "object" ? SettingValueType.JSON : undefined,
      }));

    const settings = await settingsService.setMany(entries, result.id);
    return NextResponse.json({ settings });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: "بيانات غير صحيحة", issues: err.flatten() }, { status: 400 });
    }
    console.error("Settings save error:", err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
