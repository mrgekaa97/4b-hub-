import { prisma } from "@/lib/prisma";
import { ContentStatus, type CareerPosting } from "@prisma/client";
import { BaseContentRepository } from "@/lib/repositories/base.repository";

export interface CareerCreateData {
  title: string;
  type: string;
  description: string;
  requirements: string[];
  isOpen?: boolean;
}

class CareerRepository extends BaseContentRepository<CareerPosting> {
  protected entityType = "CareerPosting";

  protected async findManyImpl() {
    return prisma.careerPosting.findMany({ orderBy: { createdAt: "asc" } });
  }

  protected async findByIdImpl(id: string) {
    return prisma.careerPosting.findUnique({ where: { id } });
  }

  protected async createImpl(data: Record<string, unknown>) {
    return prisma.careerPosting.create({ data: data as unknown as CareerCreateData });
  }

  protected async updateImpl(id: string, data: Record<string, unknown>) {
    return prisma.careerPosting.update({ where: { id }, data: data as unknown as Partial<CareerCreateData> });
  }

  protected async deleteImpl(id: string) {
    return prisma.careerPosting.delete({ where: { id } });
  }

  protected async setStatusImpl(id: string, status: ContentStatus, publishedAt: Date | null) {
    return prisma.careerPosting.update({ where: { id }, data: { status, publishedAt } });
  }

  /**
   * Deliberately different from Service's/Industry's findAllPublished():
   *   - Also filters isOpen: true — a PUBLISHED-but-closed posting shouldn't show an
   *     "apply now" card on the public site.
   *   - Orders by createdAt, not sortOrder — CareerPosting has no sortOrder field.
   * Do not "fix" this to match Service/Industry; the divergence is intentional.
   */
  async findAllPublished() {
    return prisma.careerPosting.findMany({
      where: { status: ContentStatus.PUBLISHED, isOpen: true },
      orderBy: { createdAt: "asc" },
    });
  }
}

export const careerRepository = new CareerRepository();
