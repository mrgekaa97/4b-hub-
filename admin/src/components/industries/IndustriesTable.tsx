"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Badge, statusTone } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/notifications/ToastProvider";

interface IndustryRow {
  id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
}

const STATUS_LABELS_AR: Record<IndustryRow["status"], string> = {
  DRAFT: "مسودة",
  PUBLISHED: "منشور",
};

export function IndustriesTable({ industries }: { industries: IndustryRow[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<IndustryRow | null>(null);
  const [isBusy, setIsBusy] = useState<string | null>(null);

  async function togglePublish(industry: IndustryRow) {
    setIsBusy(industry.id);
    try {
      const endpoint = industry.status === "PUBLISHED" ? "unpublish" : "publish";
      const res = await fetch(`/api/industries/${industry.id}/${endpoint}`, { method: "POST" });
      if (!res.ok) {
        showToast("تعذر تنفيذ الإجراء", "error");
        return;
      }
      showToast(industry.status === "PUBLISHED" ? "تم إلغاء النشر" : "تم النشر");
      router.refresh();
    } finally {
      setIsBusy(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsBusy(deleteTarget.id);
    try {
      const res = await fetch(`/api/industries/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        showToast("تعذر حذف القطاع", "error");
        return;
      }
      showToast("تم حذف القطاع");
      router.refresh();
    } finally {
      setIsBusy(null);
      setDeleteTarget(null);
    }
  }

  const columns: TableColumn<IndustryRow>[] = [
    { header: "الترتيب", cell: (i) => i.sortOrder },
    { header: "العنوان", cell: (i) => <span className="font-bold">{i.title}</span> },
    { header: "الحالة", cell: (i) => <Badge tone={statusTone(i.status)}>{STATUS_LABELS_AR[i.status]}</Badge> },
    {
      header: "إجراءات",
      cell: (i) => (
        <div className="flex gap-2">
          <button onClick={() => togglePublish(i)} disabled={isBusy === i.id} className="text-xs font-bold text-[#4C8B5B] hover:underline disabled:opacity-50">
            {i.status === "PUBLISHED" ? "إلغاء النشر" : "نشر"}
          </button>
          <Link href={`/dashboard/industries/${i.id}/edit`} className="text-xs font-bold text-[#C9A227] hover:underline">
            تعديل
          </Link>
          <button onClick={() => setDeleteTarget(i)} className="text-xs font-bold text-[#E07856] hover:underline">
            حذف
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} rows={industries} rowKey={(i) => i.id} emptyMessage="لا توجد قطاعات مضافة بعد" />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="حذف القطاع"
        message={`هل أنت متأكد من حذف "${deleteTarget?.title}"؟`}
        confirmLabel="حذف"
        isLoading={isBusy === deleteTarget?.id}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
