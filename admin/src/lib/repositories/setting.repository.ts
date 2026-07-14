import { prisma } from "@/lib/prisma";
import { SettingValueType } from "@prisma/client";

export const settingRepository = {
  async getByKey(key: string) {
    return prisma.setting.findUnique({ where: { key } });
  },

  async getByGroup(group: string) {
    return prisma.setting.findMany({ where: { group }, orderBy: { key: "asc" } });
  },

  async getAll() {
    return prisma.setting.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] });
  },

  /** Creates the key if it doesn't exist yet, or updates its value if it does. */
  async upsert(params: {
    key: string;
    group: string;
    valueType: SettingValueType;
    value: unknown;
    label?: string;
    updatedById?: string;
  }) {
    return prisma.setting.upsert({
      where: { key: params.key },
      update: {
        value: params.value as any,
        label: params.label,
        updatedById: params.updatedById,
      },
      create: {
        key: params.key,
        group: params.group,
        valueType: params.valueType,
        value: params.value as any,
        label: params.label,
        updatedById: params.updatedById,
      },
    });
  },

  async delete(key: string) {
    return prisma.setting.delete({ where: { key } });
  },
};
