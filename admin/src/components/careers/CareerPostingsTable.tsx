"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Badge, statusTone } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/notifications/ToastProvider";

interface CareerRow {
  id: string;
  title: string;
  type: string;
  status: "DRAFT" | "PUBLISHED";
  isOpen: boolean;
}

const STATUS_LABELS_AR: Record<CareerRow["status"], string> = {
  DRAFT: "مسودة",
  PUBLISHED: "منشور",
};

export function CareerPostingsTable({ careers }: { careers: CareerRow[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<CareerRow | null>(null);
  const [isBusy, setIsBusy] = useState<string | null>(null);

  async function togglePublish(career: CareerRow) {
    setIsBusy(career.id);
    try {
      const endpoint = career.status === "PUBLISHED" ? "unpublish" : "publish";
      const res = await fetch(`/api/careers/${career.id}/${endpoint}`, { method: "POST" });
      if (!res.ok) {
        showToast("تعذر تنفيذ الإجراء", "error");
        return;
      }
      showToast(career.status === "PUBLISHED" ? "تم إلغاء النشر" : "تم النشر");
      router.refresh();
    } finally {
      setIsBusy(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsBusy(deleteTarget.id);
    try {
      const res = await fetch(`/api/careers/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        showToast("تعذر حذف الوظيفة", "error");
        return;
      }
      showToast("تم حذف الوظيفة");
      router.refresh();
    } finally {
      setIsBusy(null);
      setDeleteTarget(null);
    }
  }

  const columns: TableColumn<CareerRow>[] = [
    { header: "المسمى الوظيفي", cell: (c) => <span className="font-bold">{c.title}</span> },
    { header: "نوع الدوام", cell: (c) => c.type },
    { header: "الحالة", cell: (c) => <Badge tone={statusTone(c.status)}>{STATUS_LABELS_AR[c.status]}</Badge> },
    { header: "القبول", cell: (c) => <Badge tone={c.isOpen ? "success" : "neutral"}>{c.isOpen ? "مفتوحة" : "مغلقة"}</Badge> },
    {
      header: "إجراءات",
      cell: (c) => (
        <div className="flex gap-2">
          <button onClick={() => togglePublish(c)} disabled={isBusy === c.id} className="text-xs font-bold text-[#4C8B5B] hover:underline disabled:opacity-50">
            {c.status === "PUBLISHED" ? "إلغاء النشر" : "نشر"}
          </button>
          <Link href={`/dashboard/careers/${c.id}/edit`} className="text-xs font-bold text-[#C9A227] hover:underline">
            تعديل
          </Link>
          <button onClick={() => setDeleteTarget(c)} className="text-xs font-bold text-[#E07856] hover:underline">
            حذف
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} rows={careers} rowKey={(c) => c.id} emptyMessage="لا توجد وظائف مضافة بعد" />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="حذف الوظيفة"
        message={`هل أنت متأكد من حذف "${deleteTarget?.title}"؟`}
        confirmLabel="حذف"
        isLoading={isBusy === deleteTarget?.id}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
