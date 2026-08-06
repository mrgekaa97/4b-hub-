import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { applicationService } from "@/lib/services/application.service";
import { Badge, statusTone } from "@/components/ui/Badge";

export const metadata = { title: "تفاصيل طلب التوظيف" };

const STATUS_LABELS_AR: Record<string, string> = {
  NEW: "جديد",
  REVIEWING: "قيد المراجعة",
  INTERVIEW: "مقابلة",
  REJECTED: "مرفوض",
  HIRED: "تم التعيين",
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold text-[#9C978A]">{label}</div>
      <div className="mt-1 text-sm">{value || <span className="text-[#9C978A]">—</span>}</div>
    </div>
  );
}

export default async function JobApplicationDetailPage({ params }: { params: { id: string } }) {
  await requirePermission(PERMISSIONS.JOB_APPLICATIONS_VIEW);
  const jobApplication = await applicationService.getById(params.id);
  if (!jobApplication) notFound();

  return (
    <div>
      <Link href="/dashboard/job-applications" className="text-xs font-bold text-[#C9A227] hover:underline">
        ← العودة إلى القائمة
      </Link>

      <div className="mt-3 mb-5 flex items-center justify-between">
        <h1 className="text-xl font-black">{jobApplication.fullName}</h1>
        <Badge tone={statusTone(jobApplication.status)}>
          {STATUS_LABELS_AR[jobApplication.status] ?? jobApplication.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-5 rounded-lg border border-[rgba(201,162,39,0.16)] bg-[#161514] p-5 sm:grid-cols-2">
        <Field label="الاسم بالكامل" value={jobApplication.fullName} />
        <Field label="الوظيفة المتقدم لها" value={jobApplication.roleApplied} />
        <Field
          label="رقم الهاتف"
          value={
            <a href={`tel:${jobApplication.phone}`} dir="ltr" className="inline-block text-[#C9A227] hover:underline">
              {jobApplication.phone}
            </a>
          }
        />
        <Field
          label="البريد الإلكتروني"
          value={
            jobApplication.email ? (
              <a href={`mailto:${jobApplication.email}`} dir="ltr" className="inline-block text-[#C9A227] hover:underline">
                {jobApplication.email}
              </a>
            ) : undefined
          }
        />
        <Field label="سنوات الخبرة" value={jobApplication.experience} />
        <Field
          label="تاريخ التقديم"
          value={new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(
            jobApplication.submittedAt
          )}
        />
        <div className="sm:col-span-2">
          <Field label="نبذة مختصرة" value={jobApplication.message} />
        </div>
      </div>
    </div>
  );
}
