import { prisma } from "@/lib/prisma";

/** Midnight today, in server-local time — attendance records store one row per employee per calendar day. */
function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export interface TodaysOperationsData {
  todaysAttendanceCount: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  outsideRadiusCount: number;
  activeSitesCount: number;
  sitesMissingGuardsCount: number;
  activeContractsCount: number; // mapped 1:1 to activeSitesCount — see note below
  newQuoteRequestsCount: number;
  recruitmentApplicationsCount: number;
  unreadContactMessagesCount: number;
  attendanceRatePercent: number;
  activeEmployeesCount: number;
  activeClientsCount: number;
}

export const dashboardService = {
  /**
   * Backs the "Today's Operations" landing page. A few metrics are
   * deliberate scope calls, documented here rather than silently guessed:
   *
   * - "Active Contracts" has no dedicated model (adding full contract
   *   lifecycle tracking would be ERP scope, explicitly out of bounds for
   *   4B HUB) — it's reported as the Active Sites count, since an active
   *   Site *is* an active client engagement in this product's data model.
   * - "Absent Employees" counts AttendanceRecord rows explicitly marked
   *   ABSENT today (e.g. by a supervisor), not an inferred "expected but
   *   no record" gap — that would require a full per-day shift schedule
   *   this product intentionally doesn't build (Shift has a type/time, not
   *   a calendar of which days it runs).
   * - "Active Clients" is the distinct clientName count across active Sites.
   */
  async getTodaysOperations(): Promise<TodaysOperationsData> {
    const today = startOfToday();

    const [
      todaysRecords,
      activeSitesCount,
      sitesWithAttendanceToday,
      newQuoteRequestsCount,
      recruitmentApplicationsCount,
      unreadContactMessagesCount,
      activeEmployeesCount,
      activeSites,
    ] = await Promise.all([
      prisma.attendanceRecord.findMany({ where: { date: today } }),
      prisma.site.count({ where: { isActive: true } }),
      prisma.attendanceRecord.findMany({
        where: { date: today, checkInAt: { not: null } },
        select: { siteId: true },
        distinct: ["siteId"],
      }),
      prisma.quoteRequest.count({ where: { status: "NEW" } }),
      prisma.jobApplication.count({ where: { status: "NEW" } }),
      prisma.contactMessage.count({ where: { status: "UNREAD" } }),
      prisma.employee.count({ where: { isActive: true } }),
      prisma.site.findMany({ where: { isActive: true }, select: { clientName: true } }),
    ]);

    const presentCount = todaysRecords.filter((r) => r.status === "PRESENT").length;
    const lateCount = todaysRecords.filter((r) => r.status === "LATE").length;
    const absentCount = todaysRecords.filter((r) => r.status === "ABSENT").length;
    const outsideRadiusCount = todaysRecords.filter(
      (r) => r.checkInLocationStatus === "OUTSIDE_SITE" || r.checkOutLocationStatus === "OUTSIDE_SITE"
    ).length;

    const sitesWithGuardsTodayIds = new Set(sitesWithAttendanceToday.map((s) => s.siteId));
    const sitesMissingGuardsCount = Math.max(0, activeSitesCount - sitesWithGuardsTodayIds.size);

    const attendanceRatePercent =
      activeEmployeesCount > 0 ? Math.round((presentCount / activeEmployeesCount) * 100) : 0;

    const activeClientsCount = new Set(activeSites.map((s) => s.clientName)).size;

    return {
      todaysAttendanceCount: todaysRecords.length,
      presentCount,
      lateCount,
      absentCount,
      outsideRadiusCount,
      activeSitesCount,
      sitesMissingGuardsCount,
      activeContractsCount: activeSitesCount,
      newQuoteRequestsCount,
      recruitmentApplicationsCount,
      unreadContactMessagesCount,
      attendanceRatePercent,
      activeEmployeesCount,
      activeClientsCount,
    };
  },
};
