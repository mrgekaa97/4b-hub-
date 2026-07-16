"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/notifications/ToastProvider";

interface EmployeeRow {
  id: string;
  employeeCode: string;
  fullName: string;
  phone: string;
  isSupervisor: boolean;
  isActive: boolean;
  assignedSite: { id: string; name: string } | null;
  _count: { devices: number; attendanceRecords: number };
}

export function EmployeesTable({ employees, canManage }: { employees: EmployeeRow[]; canManage: boolean }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<EmployeeRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/employees/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "تعذر حذف الموظف", "error");
        return;
      }
      showToast("تم حذف الموظف");
      router.refresh();
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  const columns: TableColumn<EmployeeRow>[] = [
    { header: "الكود", cell: (e) => <span dir="ltr" className="inline-block text-[#9C978A]">{e.employeeCode}</span> },
    { header: "الاسم", cell: (e) => <span className="font-bold">{e.fullName}</span> },
    { header: "الهاتف", cell: (e) => <span dir="ltr" className="inline-block">{e.phone}</span> },
    { header: "الموقع المعيّن", cell: (e) => e.assignedSite?.name ?? "—" },
    { header: "الدور", cell: (e) => (e.isSupervisor ? <Badge tone="gold">مشرف</Badge> : "فرد أمن") },
    { header: "الحالة", cell: (e) => <Badge tone={e.isActive ? "success" : "neutral"}>{e.isActive ? "نشط" : "موقوف"}</Badge> },
    ...(canManage
      ? [
          {
            header: "إجراءات",
            cell: (e: EmployeeRow) => (
              <div className="flex gap-2">
                <Link href={`/dashboard/employees/${e.id}/edit`} className="text-xs font-bold text-[#C9A227] hover:underline">
                  تعديل
                </Link>
                <button onClick={() => setDeleteTarget(e)} className="text-xs font-bold text-[#E07856] hover:underline">
                  حذف
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <Table columns={columns} rows={employees} rowKey={(e) => e.id} emptyMessage="لا يوجد موظفون مضافون بعد" />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="حذف الموظف"
        message={`هل أنت متأكد من حذف "${deleteTarget?.fullName}"؟ إذا كان لديه سجل حضور سابق، استخدم "إيقاف النشاط" من صفحة التعديل بدلًا من الحذف.`}
        confirmLabel="حذف"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
