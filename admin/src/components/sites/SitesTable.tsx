"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/notifications/ToastProvider";

interface SiteRow {
  id: string;
  name: string;
  clientName: string;
  allowedRadiusMeters: number;
  isActive: boolean;
  supervisor: { id: string; fullName: string } | null;
  _count: { assignedEmployees: number };
}

export function SitesTable({ sites, canManage }: { sites: SiteRow[]; canManage: boolean }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<SiteRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/sites/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? "تعذر حذف الموقع", "error");
        return;
      }
      showToast("تم حذف الموقع");
      router.refresh();
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  const columns: TableColumn<SiteRow>[] = [
    { header: "اسم الموقع", cell: (s) => <span className="font-bold">{s.name}</span> },
    { header: "العميل", cell: (s) => s.clientName },
    { header: "النطاق المسموح", cell: (s) => `${s.allowedRadiusMeters} م` },
    { header: "المشرف", cell: (s) => s.supervisor?.fullName ?? "—" },
    { header: "عدد الموظفين", cell: (s) => s._count.assignedEmployees },
    { header: "الحالة", cell: (s) => <Badge tone={s.isActive ? "success" : "neutral"}>{s.isActive ? "نشط" : "غير نشط"}</Badge> },
    ...(canManage
      ? [
          {
            header: "إجراءات",
            cell: (s: SiteRow) => (
              <div className="flex gap-2">
                <Link href={`/dashboard/sites/${s.id}/edit`} className="text-xs font-bold text-[#C9A227] hover:underline">
                  تعديل
                </Link>
                <button onClick={() => setDeleteTarget(s)} className="text-xs font-bold text-[#E07856] hover:underline">
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
      <Table columns={columns} rows={sites} rowKey={(s) => s.id} emptyMessage="لا توجد مواقع مضافة بعد" />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="حذف الموقع"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmLabel="حذف"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
