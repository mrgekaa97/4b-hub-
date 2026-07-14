import { settingRepository } from "@/lib/repositories/setting.repository";
import { activityLogService } from "@/lib/services/activityLog.service";
import { SettingValueType } from "@prisma/client";

/**
 * Thin service layer on top of settingRepository. The repository knows how
 * to talk to Prisma; the service knows the CMS-level rules — e.g. that every
 * settings write should be logged, and that reads often want a plain
 * key->value map rather than the raw Setting[] rows.
 */
export const settingsService = {
  async getGroupAsMap(group: string): Promise<Record<string, unknown>> {
    const rows = await settingRepository.getByGroup(group);
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  },

  async set(
    key: string,
    value: unknown,
    opts: { group: string; valueType?: SettingValueType; label?: string; actorId?: string }
  ) {
    const previous = await settingRepository.getByKey(key);
    const updated = await settingRepository.upsert({
      key,
      group: opts.group,
      valueType: opts.valueType ?? SettingValueType.STRING,
      value,
      label: opts.label,
      updatedById: opts.actorId,
    });

    await activityLogService.log({
      userId: opts.actorId,
      action: previous ? "UPDATE" : "CREATE",
      entityType: "Setting",
      entityId: updated.id,
      summary: `${previous ? "تحديث" : "إنشاء"} الإعداد: ${opts.label ?? key}`,
    });

    return updated;
  },

  /** Bulk-set convenience for a settings-page form submitting many fields at once. */
  async setMany(
    entries: Array<{ key: string; value: unknown; group: string; label?: string }>,
    actorId?: string
  ) {
    const results = [];
    for (const entry of entries) {
      results.push(await this.set(entry.key, entry.value, { group: entry.group, label: entry.label, actorId }));
    }
    return results;
  },
};
