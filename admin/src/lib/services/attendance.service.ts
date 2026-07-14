import { prisma } from "@/lib/prisma";
import { notificationService } from "@/lib/services/notification.service";
import { activityLogService } from "@/lib/services/activityLog.service";
import type { LocationStatus } from "@prisma/client";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Haversine distance in meters between two lat/lng points. */
function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Classifies, never rejects, per product requirement. "Near" is a fixed
 * 2x-radius buffer for V1 (simple, predictable) rather than a configurable
 * per-site buffer — easy to promote to a Site field later if needed.
 */
function classifyLocation(distance: number, allowedRadiusMeters: number): LocationStatus {
  if (distance <= allowedRadiusMeters) return "INSIDE_SITE";
  if (distance <= allowedRadiusMeters * 2) return "NEAR_SITE";
  return "OUTSIDE_SITE";
}

function mapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export interface GeoReading {
  lat: number;
  lng: number;
  accuracyMeters: number;
}

export interface RequestContext {
  ip?: string;
  deviceFingerprint?: string;
  browser?: string;
  os?: string;
  deviceName?: string;
}

export const attendanceService = {
  async getTodayRecordForEmployee(employeeId: string) {
    return prisma.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId, date: startOfToday() } },
      include: { site: true },
    });
  },

  async getLastRecordForEmployee(employeeId: string) {
    return prisma.attendanceRecord.findFirst({
      where: { employeeId },
      orderBy: { date: "desc" },
      include: { site: true },
    });
  },

  async checkIn(employeeId: string, geo: GeoReading, ctx: RequestContext) {
    const employee = await prisma.employee.findUniqueOrThrow({ where: { id: employeeId } });
    if (!employee.assignedSiteId) {
      throw new Error("لا يوجد موقع معيّن لهذا الموظف بعد — تواصل مع المدير");
    }
    const site = await prisma.site.findUniqueOrThrow({ where: { id: employee.assignedSiteId } });

    const distance = distanceMeters(geo.lat, geo.lng, site.latitude, site.longitude);
    const locationStatus = classifyLocation(distance, site.allowedRadiusMeters);

    const today = startOfToday();
    const existing = await prisma.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId, date: today } },
    });
    if (existing?.checkInAt) {
      throw new Error("تم تسجيل الحضور بالفعل اليوم");
    }

    // Late-minutes computation deliberately left at 0 here — it depends on
    // matching against the employee's assigned Shift start time, which is
    // real work for the Shifts module (shift assignment isn't built yet).
    // Wiring this is a one-line change in the Shifts module: look up
    // today's ShiftAssignment, diff checkInAt against shift.startTime.
    const record = existing
      ? await prisma.attendanceRecord.update({
          where: { id: existing.id },
          data: {
            checkInAt: new Date(),
            checkInLat: geo.lat,
            checkInLng: geo.lng,
            checkInAccuracyMeters: geo.accuracyMeters,
            checkInMapsLink: mapsLink(geo.lat, geo.lng),
            checkInIp: ctx.ip,
            checkInDeviceFingerprint: ctx.deviceFingerprint,
            checkInBrowser: ctx.browser,
            checkInOs: ctx.os,
            checkInDeviceName: ctx.deviceName,
            checkInLocationStatus: locationStatus,
          },
        })
      : await prisma.attendanceRecord.create({
          data: {
            employeeId,
            siteId: site.id,
            date: today,
            status: "PRESENT",
            checkInAt: new Date(),
            checkInLat: geo.lat,
            checkInLng: geo.lng,
            checkInAccuracyMeters: geo.accuracyMeters,
            checkInMapsLink: mapsLink(geo.lat, geo.lng),
            checkInIp: ctx.ip,
            checkInDeviceFingerprint: ctx.deviceFingerprint,
            checkInBrowser: ctx.browser,
            checkInOs: ctx.os,
            checkInDeviceName: ctx.deviceName,
            checkInLocationStatus: locationStatus,
          },
        });

    await activityLogService.log({
      action: "CREATE",
      entityType: "AttendanceRecord",
      entityId: record.id,
      summary: `تسجيل حضور: ${employee.fullName} (${locationStatus})`,
    });

    if (locationStatus === "OUTSIDE_SITE") {
      await notificationService.notifyAllAdmins({
        type: "ATTENDANCE_OUTSIDE_SITE",
        title: "تسجيل حضور خارج نطاق الموقع",
        description: `${employee.fullName} سجّل حضوره على بعد ${Math.round(distance)} متر من ${site.name}`,
        priority: "HIGH",
        actionUrl: `/dashboard/attendance/${record.id}`,
      });
    }
    await notificationService.notifyAllAdmins({
      type: "EMPLOYEE_CHECK_IN",
      title: "تسجيل حضور",
      description: `${employee.fullName} سجّل حضوره في ${site.name}`,
      priority: "LOW",
    });

    return record;
  },

  async checkOut(employeeId: string, geo: GeoReading, ctx: RequestContext) {
    const today = startOfToday();
    const existing = await prisma.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId, date: today } },
      include: { site: true },
    });
    if (!existing || !existing.checkInAt) {
      throw new Error("لم يتم تسجيل حضور اليوم بعد");
    }
    if (existing.checkOutAt) {
      throw new Error("تم تسجيل الانصراف بالفعل اليوم");
    }

    const distance = distanceMeters(geo.lat, geo.lng, existing.site.latitude, existing.site.longitude);
    const locationStatus = classifyLocation(distance, existing.site.allowedRadiusMeters);
    const workDurationMinutes = Math.round((Date.now() - existing.checkInAt.getTime()) / 60000);

    const record = await prisma.attendanceRecord.update({
      where: { id: existing.id },
      data: {
        checkOutAt: new Date(),
        checkOutLat: geo.lat,
        checkOutLng: geo.lng,
        checkOutAccuracyMeters: geo.accuracyMeters,
        checkOutMapsLink: mapsLink(geo.lat, geo.lng),
        checkOutIp: ctx.ip,
        checkOutDeviceFingerprint: ctx.deviceFingerprint,
        checkOutBrowser: ctx.browser,
        checkOutOs: ctx.os,
        checkOutDeviceName: ctx.deviceName,
        checkOutLocationStatus: locationStatus,
        workDurationMinutes,
      },
    });

    const employee = await prisma.employee.findUniqueOrThrow({ where: { id: employeeId } });
    await activityLogService.log({
      action: "UPDATE",
      entityType: "AttendanceRecord",
      entityId: record.id,
      summary: `تسجيل انصراف: ${employee.fullName} (${workDurationMinutes} دقيقة عمل)`,
    });
    await notificationService.notifyAllAdmins({
      type: "EMPLOYEE_CHECK_OUT",
      title: "تسجيل انصراف",
      description: `${employee.fullName} سجّل انصرافه بعد ${workDurationMinutes} دقيقة`,
      priority: "LOW",
    });

    return record;
  },
};
