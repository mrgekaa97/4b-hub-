import { prisma } from "@/lib/prisma";

/**
 * Employees are operational identity records (see prisma/schema.prisma
 * comment on the Employee model for why they're a separate table from
 * admin User) — plain CRUD, not Draft/Publish content.
 */
export const employeeRepository = {
  async findAll() {
    return prisma.employee.findMany({
      orderBy: { fullName: "asc" },
      include: {
        assignedSite: { select: { id: true, name: true } },
        _count: { select: { devices: true, attendanceRecords: true } },
      },
    });
  },

  async findById(id: string) {
    return prisma.employee.findUnique({
      where: { id },
      include: {
        assignedSite: { select: { id: true, name: true } },
        devices: true,
      },
    });
  },

  async findByUsername(username: string) {
    return prisma.employee.findUnique({ where: { username } });
  },

  async count() {
    return prisma.employee.count();
  },

  async create(data: {
    employeeCode: string;
    fullName: string;
    phone: string;
    email?: string;
    username: string;
    passwordHash: string;
    nationalId?: string;
    isSupervisor: boolean;
    isActive: boolean;
    assignedSiteId?: string;
  }) {
    return prisma.employee.create({ data });
  },

  async update(
    id: string,
    data: Partial<{
      fullName: string;
      phone: string;
      email: string | null;
      nationalId: string | null;
      isSupervisor: boolean;
      isActive: boolean;
      assignedSiteId: string | null;
    }>
  ) {
    return prisma.employee.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.employee.delete({ where: { id } });
  },
};
