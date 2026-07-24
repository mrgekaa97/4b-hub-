"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Badge, statusTone } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/notifications/ToastProvider";

interface ServiceRow {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
}

const STATUS_LABELS_AR: Record<ServiceRow["status"], string> = {
  DRAFT: "مسودة",
  PUBLISHED: "منشور",
};

export function ServicesTable({ services }: { services: ServiceRow[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<ServiceRow | null>(null);
  const [isBusy, setIsBusy] = useState<string | null>(null);

  async function togglePublish(service: ServiceRow) {
    setIsBusy(service.id);
    try {
      const endpoint = service.status === "PUBLISHED" ? "unpublish" : "publish";
      const res = await fetch(`/api/services/${service.id}/${endpoint}`, { method: "POST" });
      if (!res.ok) {
        showToast("تعذر تنفيذ الإجراء", "error");
        return;
      }
      showToast(service.status === "PUBLISHED" ? "تم إلغاء النشر" : "تم النشر — سيتم تحديث الموقع خلال دقائق");
      router.refresh();
    } finally {
      setIsBusy(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsBusy(deleteTarget.id);
    try {
      const res = await fetch(`/api/services/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        showToast("تعذر حذف الخدمة", "error");
        return;
      }
      showToast("تم حذف الخدمة");
      router.refresh();
    } finally {
      setIsBusy(null);
      setDeleteTarget(null);
    }
  }

  const columns: TableColumn<ServiceRow>[] = [
    { header: "الترتيب", cell: (s) => s.sortOrder },
    { header: "العنوان", cell: (s) => <span className="font-bold">{s.title}</span> },
    { header: "الرابط", cell: (s) => <span dir="ltr" className="inline-block text-[#9C978A]">{s.slug}</span> },
    { header: "الحالة", cell: (s) => <Badge tone={statusTone(s.status)}>{STATUS_LABELS_AR[s.status]}</Badge> },
    {
      header: "إجراءات",
      cell: (s) => (
        <div className="flex gap-2">
          <button onClick={() => togglePublish(s)} disabled={isBusy === s.id} className="text-xs font-bold text-[#4C8B5B] hover:underline disabled:opacity-50">
            {s.status === "PUBLISHED" ? "إلغاء النشر" : "نشر"}
          </button>
          <Link href={`/dashboard/services/${s.id}/edit`} className="text-xs font-bold text-[#C9A227] hover:underline">
            تعديل
          </Link>
          <button onClick={() => setDeleteTarget(s)} className="text-xs font-bold text-[#E07856] hover:underline">
            حذف
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} rows={services} rowKey={(s) => s.id} emptyMessage="لا توجد خدمات مضافة بعد" />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="حذف الخدمة"
        message={`هل أنت متأكد من حذف "${deleteTarget?.title}"؟ إذا كانت منشورة، سيتم تحديث الموقع لإزالتها.`}
        confirmLabel="حذف"
        isLoading={isBusy === deleteTarget?.id}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
