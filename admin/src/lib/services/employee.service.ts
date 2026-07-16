import { employeeRepository } from "@/lib/repositories/employee.repository";
import { createEmployeeSchema, updateEmployeeSchema } from "@/lib/validation/employee.schema";
import { hashPassword } from "@/lib/auth/password";
import { activityLogService } from "@/lib/services/activityLog.service";
import { prisma } from "@/lib/prisma";

export class UsernameTakenError extends Error {
  constructor(username: string) {
    super(`اسم المستخدم "${username}" مستخدم بالفعل`);
    this.name = "UsernameTakenError";
  }
}

export class EmployeeHasAttendanceHistoryError extends Error {
  constructor(count: number) {
    super(`لا يمكن حذف هذا الموظف — لديه ${count} سجل حضور مرتبط به. استخدم "إيقاف النشاط" بدلًا من الحذف`);
    this.name = "EmployeeHasAttendanceHistoryError";
  }
}

/** "EMP-0001", "EMP-0002", ... — simple, human-readable, generated server-side so it's never a user-editable field open to typos or collisions. */
async function generateEmployeeCode(): Promise<string> {
  const count = await employeeRepository.count();
  return `EMP-${String(count + 1).padStart(4, "0")}`;
}

function emptyToUndefined(v: string | undefined): string | undefined {
  return v && v.trim() !== "" ? v : undefined;
}
function emptyToNull(v: string | undefined): string | null | undefined {
  if (v === undefined) return undefined;
  return v.trim() !== "" ? v : null;
}

export const employeeService = {
  async list() {
    return employeeRepository.findAll();
  },

  async get(id: string) {
    return employeeRepository.findById(id);
  },

  async create(raw: unknown, actorId?: string) {
    const data = createEmployeeSchema.parse(raw);

    const existing = await employeeRepository.findByUsername(data.username);
    if (existing) throw new UsernameTakenError(data.username);

    const [employeeCode, passwordHash] = await Promise.all([
      generateEmployeeCode(),
      hashPassword(data.password),
    ]);

    const employee = await employeeRepository.create({
      employeeCode,
      fullName: data.fullName,
      phone: data.phone,
      email: emptyToUndefined(data.email),
      username: data.username,
      passwordHash,
      nationalId: emptyToUndefined(data.nationalId),
      isSupervisor: data.isSupervisor,
      isActive: data.isActive,
      assignedSiteId: emptyToUndefined(data.assignedSiteId),
    });

    await activityLogService.log({
      userId: actorId,
      action: "CREATE",
      entityType: "Employee",
      entityId: employee.id,
      summary: `إضافة موظف جديد: ${employee.fullName} (${employee.employeeCode})`,
    });

    return employee;
  },

  async update(id: string, raw: unknown, actorId?: string) {
    const data = updateEmployeeSchema.parse(raw);

    const employee = await employeeRepository.update(id, {
      fullName: data.fullName,
      phone: data.phone,
      email: emptyToNull(data.email),
      nationalId: emptyToNull(data.nationalId),
      isSupervisor: data.isSupervisor,
      isActive: data.isActive,
      assignedSiteId: emptyToNull(data.assignedSiteId),
    });

    await activityLogService.log({
      userId: actorId,
      action: "UPDATE",
      entityType: "Employee",
      entityId: employee.id,
      summary: `تحديث بيانات موظف: ${employee.fullName}`,
    });

    return employee;
  },

  async delete(id: string, actorId?: string) {
    const attendanceCount = await prisma.attendanceRecord.count({ where: { employeeId: id } });
    if (attendanceCount > 0) {
      throw new EmployeeHasAttendanceHistoryError(attendanceCount);
    }

    const employee = await employeeRepository.delete(id);
    await activityLogService.log({
      userId: actorId,
      action: "DELETE",
      entityType: "Employee",
      entityId: id,
      summary: `حذف موظف: ${employee.fullName}`,
    });
    return employee;
  },
};
