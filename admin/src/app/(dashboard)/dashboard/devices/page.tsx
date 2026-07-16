import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { deviceService } from "@/lib/services/device.service";
import { DevicesTable } from "@/components/devices/DevicesTable";

export const metadata = { title: "الأجهزة الموثوقة" };

export default async function DevicesPage() {
  await requirePermission(PERMISSIONS.DEVICES_VIEW);
  const devices = await deviceService.list();

  const rows = devices.map((d) => ({
    id: d.id,
    deviceName: d.deviceName,
    browser: d.browser,
    operatingSystem: d.operatingSystem,
    status: d.status,
    firstSeenAt: d.firstSeenAt.toISOString(),
    lastSeenAt: d.lastSeenAt.toISOString(),
    employee: d.employee,
    approvedBy: d.approvedBy,
  }));

  const pendingCount = devices.filter((d) => d.status === "PENDING").length;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-black">الأجهزة الموثوقة</h1>
        <p className="text-sm text-[#9C978A]">
          كل جهاز يحاول موظف الدخول منه لأول مرة يظهر هنا تلقائيًا بحالة "بانتظار الموافقة".
          {pendingCount > 0 && <span className="font-bold text-[#C9A227]"> يوجد {pendingCount} جهاز بانتظار المراجعة.</span>}
        </p>
      </div>

      <DevicesTable devices={rows} />
    </div>
  );
}
