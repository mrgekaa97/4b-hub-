import { requireUser } from "@/lib/auth/guard";
import { getUserPermissions } from "@/lib/auth/rbac";
import { dashboardService } from "@/lib/services/dashboard.service";
import { activityLogService } from "@/lib/services/activityLog.service";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WidgetGrid, type WidgetDef } from "@/components/dashboard/WidgetGrid";
import { StatWidget } from "@/components/dashboard/StatWidget";

export const metadata = { title: "عمليات اليوم" };

/**
 * The default landing page for Super Admin and Operations Manager per the
 * product doc — operational awareness first, not analytical reports (those
 * live in the Reports module). Every number here comes from a real query in
 * dashboard.service.ts; see that file's comments for the two metrics that
 * are deliberately mapped from existing data (Active Contracts, Active
 * Clients) rather than backed by dedicated models that don't exist yet.
 */
export default async function TodaysOperationsPage() {
  const user = await requireUser();
  const permissions = Array.from(await getUserPermissions(user.id));
  const data = await dashboardService.getTodaysOperations();
  const recentActivity = await activityLogService.recent(6);

  const widgets: WidgetDef[] = [
    { key: "todaysAttendance", label: "حضور اليوم", element: <StatWidget label="حضور اليوم" value={data.todaysAttendanceCount} href="/dashboard/attendance" /> },
    { key: "present", label: "الحاضرون", element: <StatWidget label="الحاضرون" value={data.presentCount} href="/dashboard/attendance?status=PRESENT" /> },
    { key: "late", label: "المتأخرون", element: <StatWidget label="المتأخرون" value={data.lateCount} tone="warning" href="/dashboard/attendance?status=LATE" /> },
    { key: "absent", label: "الغائبون", element: <StatWidget label="الغائبون" value={data.absentCount} tone="danger" href="/dashboard/attendance?status=ABSENT" /> },
    { key: "outsideRadius", label: "خارج نطاق الموقع", element: <StatWidget label="خارج نطاق الموقع" value={data.outsideRadiusCount} tone="danger" href="/dashboard/attendance?flag=outside" /> },
    { key: "activeSites", label: "المواقع النشطة", element: <StatWidget label="المواقع النشطة" value={data.activeSitesCount} href="/dashboard/sites" /> },
    { key: "sitesMissingGuards", label: "مواقع بدون تغطية", element: <StatWidget label="مواقع بدون تغطية" value={data.sitesMissingGuardsCount} tone={data.sitesMissingGuardsCount > 0 ? "danger" : "default"} href="/dashboard/sites?filter=missing_guards" /> },
    { key: "activeContracts", label: "العقود النشطة", element: <StatWidget label="العقود النشطة" value={data.activeContractsCount} href="/dashboard/sites" /> },
    { key: "newQuoteRequests", label: "طلبات عروض أسعار جديدة", element: <StatWidget label="طلبات عروض أسعار جديدة" value={data.newQuoteRequestsCount} href="/dashboard/quote-requests" /> },
    { key: "recruitment", label: "طلبات توظيف جديدة", element: <StatWidget label="طلبات توظيف جديدة" value={data.recruitmentApplicationsCount} href="/dashboard/job-applications" /> },
    { key: "contactMessages", label: "رسائل غير مقروءة", element: <StatWidget label="رسائل غير مقروءة" value={data.unreadContactMessagesCount} href="/dashboard/contact-messages" /> },
    { key: "attendanceRate", label: "نسبة الحضور", element: <StatWidget label="نسبة الحضور" value={`${data.attendanceRatePercent}%`} /> },
    { key: "activeEmployees", label: "الموظفون النشطون", element: <StatWidget label="الموظفون النشطون" value={data.activeEmployeesCount} href="/dashboard/employees" /> },
    { key: "activeClients", label: "العملاء النشطون", element: <StatWidget label="العملاء النشطون" value={data.activeClientsCount} /> },
  ];

  return (
    <div>
      <h1 className="mb-1 text-xl font-black">عمليات اليوم</h1>
      <p className="mb-5 text-sm text-[#9C978A]">
        {new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>

      <QuickActions grantedPermissions={permissions} />
      <WidgetGrid widgets={widgets} />

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-[#9C978A]">آخر النشاطات</h2>
        <div className="rounded-lg border border-[rgba(201,162,39,0.16)] bg-[#161514]">
          {recentActivity.length === 0 ? (
            <p className="p-4 text-center text-sm text-[#9C978A]">لا يوجد نشاط بعد</p>
          ) : (
            recentActivity.map((log) => (
              <div key={log.id} className="flex items-center justify-between border-b border-[rgba(201,162,39,0.08)] px-4 py-3 text-sm last:border-0">
                <span>{log.summary}</span>
                <span className="text-xs text-[#9C978A]">{log.createdAt.toLocaleString("ar-EG")}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

