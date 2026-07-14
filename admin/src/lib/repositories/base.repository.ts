import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";

/**
 * Generic repository base for any Prisma model shaped like the content
 * modules (Service, Industry, CareerPosting, ...): has an `id`, a `status`
 * (ContentStatus), and a `publishedAt`.
 *
 * Concrete repositories (e.g. ServiceRepository) extend this and only need
 * to supply the Prisma delegate (`prisma.service`, `prisma.industry`, ...)
 * and their entity name for revision/activity logging. This is what makes
 * "Draft & Publish architecture" and "Repository/Service architecture"
 * apply uniformly across Services/Industries/Careers instead of being
 * reimplemented per module.
 *
 * Deliberately NOT trying to be a generic-over-Prisma-delegate-type utility
 * with perfect TypeScript inference — Prisma's delegate types are awkward to
 * generalize cleanly, and a lightweight CMS doesn't need that; each concrete
 * repository is a thin, explicit subclass (see services.repository.ts once
 * the Services module is built) rather than fighting the type system here.
 */
export abstract class BaseContentRepository<TEntity extends { id: string; status: ContentStatus }> {
  protected abstract entityType: string;

  protected abstract findManyImpl(): Promise<TEntity[]>;
  protected abstract findByIdImpl(id: string): Promise<TEntity | null>;
  protected abstract createImpl(data: Record<string, unknown>): Promise<TEntity>;
  protected abstract updateImpl(id: string, data: Record<string, unknown>): Promise<TEntity>;
  protected abstract deleteImpl(id: string): Promise<TEntity>;
  protected abstract setStatusImpl(id: string, status: ContentStatus, publishedAt: Date | null): Promise<TEntity>;

  async findAll(): Promise<TEntity[]> {
    return this.findManyImpl();
  }

  async findById(id: string): Promise<TEntity | null> {
    return this.findByIdImpl(id);
  }

  async create(data: Record<string, unknown>, actorId?: string): Promise<TEntity> {
    const entity = await this.createImpl(data);
    await this.recordRevision(entity, actorId);
    return entity;
  }

  async update(id: string, data: Record<string, unknown>, actorId?: string): Promise<TEntity> {
    const entity = await this.updateImpl(id, data);
    await this.recordRevision(entity, actorId);
    return entity;
  }

  async delete(id: string): Promise<TEntity> {
    return this.deleteImpl(id);
  }

  /** Marks the entity PUBLISHED — the live website's build step is what actually reads published content. */
  async publish(id: string, actorId?: string): Promise<TEntity> {
    const entity = await this.setStatusImpl(id, ContentStatus.PUBLISHED, new Date());
    await this.recordRevision(entity, actorId);
    return entity;
  }

  /** Reverts to DRAFT without deleting — the entity stops appearing in the next site build. */
  async unpublish(id: string, actorId?: string): Promise<TEntity> {
    const entity = await this.setStatusImpl(id, ContentStatus.DRAFT, null);
    await this.recordRevision(entity, actorId);
    return entity;
  }

  async revisionHistory(entityId: string) {
    return prisma.contentRevision.findMany({
      where: { entityType: this.entityType, entityId },
      orderBy: { createdAt: "desc" },
      include: { createdBy: { select: { displayName: true } } },
    });
  }

  private async recordRevision(entity: TEntity, actorId?: string) {
    await prisma.contentRevision.create({
      data: {
        entityType: this.entityType,
        entityId: entity.id,
        // Prisma's Json input type is intentionally loose (JsonValue) — a
        // plain serializable entity snapshot always satisfies it at runtime.
        data: entity as any,
        createdById: actorId ?? null,
      },
    });
  }
}
