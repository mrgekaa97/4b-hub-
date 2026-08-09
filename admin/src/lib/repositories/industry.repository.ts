import { prisma } from "@/lib/prisma";
import { ContentStatus, type Industry } from "@prisma/client";
import { BaseContentRepository } from "@/lib/repositories/base.repository";

export interface IndustryCreateData {
  icon: string;
  title: string;
  description: string;
  sortOrder?: number;
}

class IndustryRepository extends BaseContentRepository<Industry> {
  protected entityType = "Industry";

  protected async findManyImpl() {
    return prisma.industry.findMany({ orderBy: { sortOrder: "asc" } });
  }

  protected async findByIdImpl(id: string) {
    return prisma.industry.findUnique({ where: { id } });
  }

  protected async createImpl(data: Record<string, unknown>) {
    return prisma.industry.create({ data: data as unknown as IndustryCreateData });
  }

  protected async updateImpl(id: string, data: Record<string, unknown>) {
    return prisma.industry.update({ where: { id }, data: data as unknown as Partial<IndustryCreateData> });
  }

  protected async deleteImpl(id: string) {
    return prisma.industry.delete({ where: { id } });
  }

  protected async setStatusImpl(id: string, status: ContentStatus, publishedAt: Date | null) {
    return prisma.industry.update({ where: { id }, data: { status, publishedAt } });
  }

  async findAllPublished() {
    return prisma.industry.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { sortOrder: "asc" },
    });
  }
}

export const industryRepository = new IndustryRepository();
