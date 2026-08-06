import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { quoteService } from "@/lib/services/quote.service";
import { Badge, statusTone } from "@/components/ui/Badge";

export const metadata = { title: "تفاصيل طلب عرض السعر" };

const STATUS_LABELS_AR: Record<string, string> = {
  NEW: "جديد",
  CONTACTED: "تم التواصل",
  CLOSED: "مغلق",
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold text-[#9C978A]">{label}</div>
      <div className="mt-1 text-sm">{value || <span className="text-[#9C978A]">—</span>}</div>
    </div>
  );
}

export default async function QuoteRequestDetailPage({ params }: { params: { id: string } }) {
  await requirePermission(PERMISSIONS.QUOTE_REQUESTS_VIEW);
  const quoteRequest = await quoteService.getById(params.id);
  if (!quoteRequest) notFound();

  return (
    <div>
      <Link href="/dashboard/quote-requests" className="text-xs font-bold text-[#C9A227] hover:underline">
        ← العودة إلى القائمة
      </Link>

      <div className="mt-3 mb-5 flex items-center justify-between">
        <h1 className="text-xl font-black">{quoteRequest.company}</h1>
        <Badge tone={statusTone(quoteRequest.status)}>
          {STATUS_LABELS_AR[quoteRequest.status] ?? quoteRequest.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-5 rounded-lg border border-[rgba(201,162,39,0.16)] bg-[#161514] p-5 sm:grid-cols-2">
        <Field label="اسم الشركة" value={quoteRequest.company} />
        <Field label="اسم المسؤول" value={quoteRequest.contactName} />
        <Field
          label="رقم الهاتف"
          value={
            <a href={`tel:${quoteRequest.phone}`} dir="ltr" className="inline-block text-[#C9A227] hover:underline">
              {quoteRequest.phone}
            </a>
          }
        />
        <Field
          label="البريد الإلكتروني"
          value={
            <a href={`mailto:${quoteRequest.email}`} dir="ltr" className="inline-block text-[#C9A227] hover:underline">
              {quoteRequest.email}
            </a>
          }
        />
        <Field label="نوع المنشأة" value={quoteRequest.industry} />
        <Field label="عدد أفراد الأمن المطلوب" value={quoteRequest.guardsRange} />
        <Field label="موقع المنشأة" value={quoteRequest.location} />
        <Field label="طريقة التواصل المفضلة" value={quoteRequest.preferredContact} />
        <Field
          label="تاريخ الطلب"
          value={new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(
            quoteRequest.submittedAt
          )}
        />
        <div className="sm:col-span-2">
          <Field label="تفاصيل إضافية" value={quoteRequest.message} />
        </div>
      </div>
    </div>
  );
}
