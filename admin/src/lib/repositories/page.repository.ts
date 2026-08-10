import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";

export const pageRepository = {
  async getBySlug(slug: string) {
    return prisma.page.findUnique({ where: { slug } });
  },

  /** Updates only draftData — does not touch publishedData/status. */
  async saveDraft(slug: string, draftData: unknown, actorId?: string) {
    return prisma.page.update({
      where: { slug },
      data: { draftData: draftData as any },
    });
  },

  /** Copies draftData -> publishedData and marks the page live. */
  async publish(slug: string, actorId?: string) {
    const page = await prisma.page.findUniqueOrThrow({ where: { slug } });
    return prisma.page.update({
      where: { slug },
      data: {
        publishedData: page.draftData as any,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  },

  async getPublished(slug: string) {
    const page = await prisma.page.findUnique({ where: { slug } });
    return page?.publishedData ?? null;
  },
};
