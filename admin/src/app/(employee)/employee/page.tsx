import { getSessionEmployee } from "@/lib/auth/employee-session";
import { attendanceService } from "@/lib/services/attendance.service";
import { prisma } from "@/lib/prisma";
import { AttendanceCard } from "@/components/employee/AttendanceCard";

const SHIFT_TYPE_LABELS_AR: Record<string, string> = {
  MORNING: "صباحية",
  EVENING: "مسائية",
  NIGHT: "ليلية",
  CUSTOM: "مخصصة",
};

export default async function EmployeePortalPage() {
  const employee = await getSessionEmployee();
  if (!employee) return null; // layout already redirects; satisfies TS narrowing

  const [site, todayRecord, lastRecord, activeDevice, shiftAssignment] = await Promise.all([
    employee.assignedSiteId ? prisma.site.findUnique({ where: { id: employee.assignedSiteId } }) : null,
    attendanceService.getTodayRecordForEmployee(employee.id),
    attendanceService.getLastRecordForEmployee(employee.id),
    prisma.device.findFirst({ where: { employeeId: employee.id, status: "APPROVED" } }),
    prisma.shiftAssignment.findFirst({ where: { employeeId: employee.id }, include: { shift: true } }),
  ]);

  const shiftLabel = shiftAssignment
    ? `${SHIFT_TYPE_LABELS_AR[shiftAssignment.shift.type] ?? shiftAssignment.shift.type} (${shiftAssignment.shift.startTime} - ${shiftAssignment.shift.endTime})`
    : null;

  const lastAttendanceSummary = lastRecord?.checkInAt
    ? `${lastRecord.date.toLocaleDateString("ar-EG")} — ${lastRecord.checkInAt.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}`
    : null;

  return (
    <AttendanceCard
      siteName={site?.name ?? null}
      shiftLabel={shiftLabel}
      todayCheckInAt={todayRecord?.checkInAt?.toISOString() ?? null}
      todayCheckOutAt={todayRecord?.checkOutAt?.toISOString() ?? null}
      lastAttendanceSummary={lastAttendanceSummary}
      deviceStatus={activeDevice ? "APPROVED" : "PENDING"}
    />
  );
}

