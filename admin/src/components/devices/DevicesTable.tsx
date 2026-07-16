"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Badge, statusTone } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/notifications/ToastProvider";

interface DeviceRow {
  id: string;
  deviceName: string | null;
  browser: string | null;
  operatingSystem: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "REVOKED";
  firstSeenAt: string;
  lastSeenAt: string;
  employee: { id: string; fullName: string; employeeCode: string };
  approvedBy: { id: string; displayName: string } | null;
}

const STATUS_LABELS_AR: Record<DeviceRow["status"], string> = {
  PENDING: "بانتظار الموافقة",
  APPROVED: "موثوق",
  REJECTED: "مرفوض",
  REVOKED: "ملغى",
};

export function DevicesTable({ devices }: { devices: DeviceRow[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pendingAction, setPendingAction] = useState<{ device: DeviceRow; action: "approve" | "reject" | "revoke" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function confirmAction() {
    if (!pendingAction) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/devices/${pendingAction.device.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: pendingAction.action }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "حدث خطأ", "error");
        return;
      }
      const messages = { approve: "تمت الموافقة على الجهاز", reject: "تم رفض الجهاز", revoke: "تم إلغاء ثقة الجهاز" };
      showToast(messages[pendingAction.action]);
      router.refresh();
    } finally {
      setIsSubmitting(false);
      setPendingAction(null);
    }
  }

  const columns: TableColumn<DeviceRow>[] = [
    { header: "الموظف", cell: (d) => <span className="font-bold">{d.employee.fullName}</span> },
    { header: "الجهاز", cell: (d) => d.deviceName ?? "غير معروف" },
    { header: "المتصفح / النظام", cell: (d) => `${d.browser ?? "—"} / ${d.operatingSystem ?? "—"}` },
    { header: "أول ظهور", cell: (d) => new Date(d.firstSeenAt).toLocaleString("ar-EG") },
    { header: "الحالة", cell: (d) => <Badge tone={statusTone(d.status)}>{STATUS_LABELS_AR[d.status]}</Badge> },
    {
      header: "إجراءات",
      cell: (d) => (
        <div className="flex gap-2">
          {d.status === "PENDING" && (
            <>
              <button onClick={() => setPendingAction({ device: d, action: "approve" })} className="text-xs font-bold text-[#4C8B5B] hover:underline">
                موافقة
              </button>
              <button onClick={() => setPendingAction({ device: d, action: "reject" })} className="text-xs font-bold text-[#E07856] hover:underline">
                رفض
              </button>
            </>
          )}
          {d.status === "APPROVED" && (
            <button onClick={() => setPendingAction({ device: d, action: "revoke" })} className="text-xs font-bold text-[#E07856] hover:underline">
              إلغاء الثقة
            </button>
          )}
          {(d.status === "REJECTED" || d.status === "REVOKED") && (
            <button onClick={() => setPendingAction({ device: d, action: "approve" })} className="text-xs font-bold text-[#C9A227] hover:underline">
              موافقة مجددًا
            </button>
          )}
        </div>
      ),
    },
  ];

  const confirmCopy = {
    approve: { title: "الموافقة على الجهاز", message: `هل تثق بهذا الجهاز للموظف "${pendingAction?.device.employee.fullName}"؟ سيتمكن من تسجيل الدخول منه فورًا.`, dangerous: false, label: "موافقة" },
    reject: { title: "رفض الجهاز", message: `هل تريد رفض هذا الجهاز؟ لن يتمكن الموظف من الدخول منه.`, dangerous: true, label: "رفض" },
    revoke: { title: "إلغاء ثقة الجهاز", message: `سيتم قطع دخول الموظف من هذا الجهاز فورًا (مفيد في حال فقدان الهاتف). متأكد؟`, dangerous: true, label: "إلغاء الثقة" },
  };
  const copy = pendingAction ? confirmCopy[pendingAction.action] : null;

  return (
    <>
      <Table columns={columns} rows={devices} rowKey={(d) => d.id} emptyMessage="لا توجد أجهزة مسجّلة بعد — ستظهر هنا تلقائيًا عند أول محاولة دخول لأي موظف" />
      <ConfirmDialog
        isOpen={!!pendingAction}
        title={copy?.title ?? ""}
        message={copy?.message ?? ""}
        confirmLabel={copy?.label ?? "تأكيد"}
        isDangerous={copy?.dangerous ?? true}
        isLoading={isSubmitting}
        onConfirm={confirmAction}
        onCancel={() => setPendingAction(null)}
      />
    </>
  );
}
