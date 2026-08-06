import { prisma } from "@/lib/prisma";

export interface JobApplicationCreateData {
  fullName: string;
  phone: string;
  roleApplied: string;
  email?: string;
  experience?: string;
  message?: string;
}

export const applicationRepository = {
  // status defaults to NEW and submittedAt to now() at the Prisma schema
  // level — neither is set here.
  async create(data: JobApplicationCreateData) {
    return prisma.jobApplication.create({ data });
  },

  /** Powers the admin Job Applications listing. */
  async findAll() {
    return prisma.jobApplication.findMany({ orderBy: { submittedAt: "desc" } });
  },

  /** Powers the admin Job Applications detail page. */
  async findById(id: string) {
    return prisma.jobApplication.findUnique({ where: { id } });
  },
};
