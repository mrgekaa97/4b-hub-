import { deviceRepository } from "@/lib/repositories/device.repository";
import { activityLogService } from "@/lib/services/activityLog.service";
import { notificationService } from "@/lib/services/notification.service";
import { prisma } from "@/lib/prisma";

export const deviceService = {
  async list() {
    return deviceRepository.findAll();
  },

  async approve(id: string, actorId: string) {
    const device = await deviceRepository.setStatus(id, "APPROVED", actorId);
    const employee = await prisma.employee.findUnique({ where: { id: device.employeeId } });

    await activityLogService.log({
      userId: actorId,
      action: "STATUS_CHANGE",
      entityType: "Device",
      entityId: device.id,
      summary: `تمت الموافقة على جهاز: ${device.deviceName ?? "غير معروف"} (${employee?.fullName ?? ""})`,
    });

    if (employee) {
      await notificationService.notify({
        employeeId: employee.id,
        type: "NEW_TRUSTED_DEVICE_REQUEST",
        title: "تمت الموافقة على جهازك",
        description: "يمكنك الآن تسجيل الدخول من هذا الجهاز بشكل طبيعي.",
        priority: "NORMAL",
      });
    }

    return device;
  },

  async reject(id: string, actorId: string) {
    const device = await deviceRepository.setStatus(id, "REJECTED");
    await activityLogService.log({
      userId: actorId,
      action: "STATUS_CHANGE",
      entityType: "Device",
      entityId: device.id,
      summary: `تم رفض جهاز: ${device.deviceName ?? "غير معروف"}`,
    });
    return device;
  },

  /** For a previously-approved device that needs to be cut off (lost phone, employee left, etc.). */
  async revoke(id: string, actorId: string) {
    const device = await deviceRepository.setStatus(id, "REVOKED");
    await activityLogService.log({
      userId: actorId,
      action: "STATUS_CHANGE",
      entityType: "Device",
      entityId: device.id,
      summary: `تم إلغاء ثقة جهاز: ${device.deviceName ?? "غير معروف"}`,
    });
    return device;
  },
};
