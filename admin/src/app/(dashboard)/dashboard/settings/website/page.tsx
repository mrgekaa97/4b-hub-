import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { settingsService } from "@/lib/services/settings.service";
import { SettingsForm } from "@/components/settings/SettingsForm";

export const metadata = { title: "إعدادات الموقع" };

export default async function WebsiteSettingsPage() {
  await requirePermission(PERMISSIONS.WEBSITE_SETTINGS_MANAGE);
  const settings = await settingsService.getGroupAsMap("general");

  return (
    <div>
      <h1 className="mb-5 text-xl font-black">إعدادات الموقع</h1>
      <SettingsForm initial={settings} />
    </div>
  );
}
