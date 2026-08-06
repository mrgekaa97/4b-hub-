"use client";

import Link from "next/link";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Badge, statusTone } from "@/components/ui/Badge";

interface QuoteRequestRow {
  id: string;
  company: string;
  contactName: string;
  industry: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
  submittedAt: Date;
}

const STATUS_LABELS_AR: Record<QuoteRequestRow["status"], string> = {
  NEW: "جديد",
  CONTACTED: "تم التواصل",
  CLOSED: "مغلق",
};

export function QuoteRequestsTable({ rows }: { rows: QuoteRequestRow[] }) {
  const columns: TableColumn<QuoteRequestRow>[] = [
    {
      header: "الشركة",
      cell: (r) => (
        <Link href={`/dashboard/quote-requests/${r.id}`} className="font-bold hover:underline">
          {r.company}
        </Link>
      ),
    },
    { header: "اسم المسؤول", cell: (r) => r.contactName },
    { header: "نوع المنشأة", cell: (r) => r.industry },
    {
      header: "تاريخ الطلب",
      cell: (r) => new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(r.submittedAt),
    },
    {
      header: "الحالة",
      cell: (r) => <Badge tone={statusTone(r.status)}>{STATUS_LABELS_AR[r.status]}</Badge>,
    },
  ];

  return <Table columns={columns} rows={rows} rowKey={(r) => r.id} emptyMessage="لا توجد طلبات عروض أسعار بعد" />;
}
