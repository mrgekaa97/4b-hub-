"use client";

import Link from "next/link";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Badge, statusTone } from "@/components/ui/Badge";

interface JobApplicationRow {
  id: string;
  fullName: string;
  roleApplied: string;
  status: "NEW" | "REVIEWING" | "INTERVIEW" | "REJECTED" | "HIRED";
  submittedAt: Date;
}

const STATUS_LABELS_AR: Record<JobApplicationRow["status"], string> = {
  NEW: "جديد",
  REVIEWING: "قيد المراجعة",
  INTERVIEW: "مقابلة",
  REJECTED: "مرفوض",
  HIRED: "تم التعيين",
};

export function JobApplicationsTable({ rows }: { rows: JobApplicationRow[] }) {
  const columns: TableColumn<JobApplicationRow>[] = [
    {
      header: "الاسم بالكامل",
      cell: (r) => (
        <Link href={`/dashboard/job-applications/${r.id}`} className="font-bold hover:underline">
          {r.fullName}
        </Link>
      ),
    },
    { header: "الوظيفة المتقدم لها", cell: (r) => r.roleApplied },
    {
      header: "تاريخ التقديم",
      cell: (r) => new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(r.submittedAt),
    },
    {
      header: "الحالة",
      cell: (r) => <Badge tone={statusTone(r.status)}>{STATUS_LABELS_AR[r.status]}</Badge>,
    },
  ];

  return <Table columns={columns} rows={rows} rowKey={(r) => r.id} emptyMessage="لا توجد طلبات توظيف بعد" />;
}
