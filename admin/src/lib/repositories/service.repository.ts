import { prisma } from "@/lib/prisma";
import { ContentStatus, type Service } from "@prisma/client";
import { BaseContentRepository } from "@/lib/repositories/base.repository";

export interface ServiceCreateData {
  slug: string;
  icon: string;
  title: string;
  summary: string;
  includes: string[];
  sortOrder?: number;
}

class ServiceRepository extends BaseContentRepository<Service> {
  protected entityType = "Service";

  protected async findManyImpl() {
    return prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  }

  protected async findByIdImpl(id: string) {
    return prisma.service.findUnique({ where: { id } });
  }

  protected async createImpl(data: Record<string, unknown>) {
    return prisma.service.create({ data: data as unknown as ServiceCreateData });
  }

  protected async updateImpl(id: string, data: Record<string, unknown>) {
    return prisma.service.update({ where: { id }, data: data as unknown as Partial<ServiceCreateData> });
  }

  protected async deleteImpl(id: string) {
    return prisma.service.delete({ where: { id } });
  }

  protected async setStatusImpl(id: string, status: ContentStatus, publishedAt: Date | null) {
    return prisma.service.update({ where: { id }, data: { status, publishedAt } });
  }

  /** Powers the public bridge API — see app/api/public/services/route.ts. */
  async findAllPublished() {
    return prisma.service.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { sortOrder: "asc" },
    });
  }

  async findBySlug(slug: string) {
    return prisma.service.findUnique({ where: { slug } });
  }
}

export const serviceRepository = new ServiceRepository();
