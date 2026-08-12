import { prisma } from "@/lib/prisma";
import { ContentStatus, type Testimonial } from "@prisma/client";
import { BaseContentRepository } from "@/lib/repositories/base.repository";

export interface TestimonialCreateData {
  quoteText: string;
  clientName: string;
  clientRole?: string;
  clientCompany?: string;
  avatarInitial?: string;
  sortOrder?: number;
}

class TestimonialRepository extends BaseContentRepository<Testimonial> {
  protected entityType = "Testimonial";

  protected async findManyImpl() {
    return prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  }

  protected async findByIdImpl(id: string) {
    return prisma.testimonial.findUnique({ where: { id } });
  }

  protected async createImpl(data: Record<string, unknown>) {
    return prisma.testimonial.create({ data: data as unknown as TestimonialCreateData });
  }

  protected async updateImpl(id: string, data: Record<string, unknown>) {
    return prisma.testimonial.update({ where: { id }, data: data as unknown as Partial<TestimonialCreateData> });
  }

  protected async deleteImpl(id: string) {
    return prisma.testimonial.delete({ where: { id } });
  }

  protected async setStatusImpl(id: string, status: ContentStatus, publishedAt: Date | null) {
    return prisma.testimonial.update({ where: { id }, data: { status, publishedAt } });
  }

  async findAllPublished() {
    return prisma.testimonial.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { sortOrder: "asc" },
    });
  }
}

export const testimonialRepository = new TestimonialRepository();
