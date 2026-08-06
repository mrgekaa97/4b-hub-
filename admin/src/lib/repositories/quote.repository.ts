import { prisma } from "@/lib/prisma";

export interface QuoteRequestCreateData {
  company: string;
  contactName: string;
  phone: string;
  email: string;
  industry: string;
  guardsRange?: string;
  location: string;
  preferredContact?: string;
  message?: string;
}

export const quoteRepository = {
  // status defaults to NEW and submittedAt to now() at the Prisma schema
  // level — neither is set here.
  async create(data: QuoteRequestCreateData) {
    return prisma.quoteRequest.create({ data });
  },

  /** Powers the admin Quote Requests listing. */
  async findAll() {
    return prisma.quoteRequest.findMany({ orderBy: { submittedAt: "desc" } });
  },

  /** Powers the admin Quote Requests detail page. */
  async findById(id: string) {
    return prisma.quoteRequest.findUnique({ where: { id } });
  },
};
