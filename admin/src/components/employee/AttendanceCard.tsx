"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { computeDeviceFingerprint, guessDeviceName } from "@/lib/device/clientFingerprint";

interface AttendanceCardProps {
  siteName: string | null;
  shiftLabel: string | null;
  todayCheckInAt: string | null;
  todayCheckOutAt: string | null;
  lastAttendanceSummary: string | null;
  deviceStatus: "APPROVED" | "PENDING" | "REJECTED" | "REVOKED" | null;
}

/**
 * "Employees should complete attendance within a few seconds" — this is the
 * entire screen: current time, the handful of at-a-glance facts the product
 * doc asks for, and one big button. No menus, no navigation depth.
 */
export function AttendanceCard({
  siteName,
  shiftLabel,
  todayCheckInAt,
  todayCheckOutAt,
  lastAttendanceSummary,
  deviceStatus,
}: AttendanceCardProps) {
  const router = useRouter();
  const [now, setNow] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "locating" | "ready" | "denied">("idle");

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hasCheckedIn = Boolean(todayCheckInAt);
  const hasCheckedOut = Boolean(todayCheckOutAt);
  const action = !hasCheckedIn ? "check-in" : !hasCheckedOut ? "check-out" : "done";

  async function handleAction() {
    setError(null);
    setGpsStatus("locating");
    setIsSubmitting(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("المتصفح لا يدعم تحديد الموقع"));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });
      setGpsStatus("ready");

      const fingerprint = await computeDeviceFingerprint();
      const endpoint = action === "check-in" ? "/api/attendance/check-in" : "/api/attendance/check-out";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracyMeters: position.coords.accuracy,
          deviceFingerprint: fingerprint,
          deviceName: guessDeviceName(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "حدث خطأ");
        return;
      }
      router.refresh();
    } catch (err) {
      const isGeoError = typeof err === "object" && err !== null && "code" in err && "message" in err;
      if (isGeoError) {
        setGpsStatus("denied");
        setError("تعذر الوصول لموقعك — تأكد من تفعيل خدمة الموقع (GPS) للمتصفح");
      } else {
        setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-5 px-5 py-8 text-center">
      <div>
        <p className="text-4xl font-black tabular-nums text-[#C9A227]">
          {now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </p>
        <p className="mt-1 text-sm text-[#9C978A]">
          {now.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      <div className="rounded-lg border border-[rgba(201,162,39,0.16)] bg-[#161514] p-4 text-start text-sm">
        <div className="flex justify-between py-1.5">
          <span className="text-[#9C978A]">الموقع المعيّن</span>
          <span className="font-bold">{siteName ?? "لم يُحدد بعد"}</span>
        </div>
        <div className="flex justify-between border-t border-[rgba(201,162,39,0.08)] py-1.5">
          <span className="text-[#9C978A]">المناوبة الحالية</span>
          <span className="font-bold">{shiftLabel ?? "غير محددة"}</span>
        </div>
        <div className="flex justify-between border-t border-[rgba(201,162,39,0.08)] py-1.5">
          <span className="text-[#9C978A]">آخر حضور</span>
          <span className="font-bold">{lastAttendanceSummary ?? "لا يوجد"}</span>
        </div>
        <div className="flex justify-between border-t border-[rgba(201,162,39,0.08)] py-1.5">
          <span className="text-[#9C978A]">حالة الجهاز</span>
          <Badge tone={deviceStatus === "APPROVED" ? "success" : "warning"}>
            {deviceStatus === "APPROVED" ? "موثوق" : "بانتظار الموافقة"}
          </Badge>
        </div>
        <div className="flex justify-between border-t border-[rgba(201,162,39,0.08)] py-1.5">
          <span className="text-[#9C978A]">حالة GPS</span>
          <Badge tone={gpsStatus === "ready" ? "success" : gpsStatus === "denied" ? "danger" : "neutral"}>
            {gpsStatus === "ready" ? "تم التحديد" : gpsStatus === "denied" ? "مرفوض" : gpsStatus === "locating" ? "جارِ التحديد" : "بانتظار الإجراء"}
          </Badge>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-[#E07856]/40 bg-[#E07856]/10 px-4 py-2 text-sm text-[#E07856]">
          {error}
        </p>
      )}

      {action === "done" ? (
        <div className="rounded-lg border border-[#4C8B5B]/30 bg-[#4C8B5B]/10 px-4 py-6 text-sm font-bold text-[#4C8B5B]">
          تم تسجيل الحضور والانصراف لهذا اليوم ✓
        </div>
      ) : (
        <Button
          onClick={handleAction}
          isLoading={isSubmitting}
          fullWidth
          className="!py-5 !text-lg"
        >
          {action === "check-in" ? "تسجيل الحضور" : "تسجيل الانصراف"}
        </Button>
      )}
    </div>
  );
}
