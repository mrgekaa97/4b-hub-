import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { quoteService } from "@/lib/services/quote.service";
import { QuoteRequestsTable } from "@/components/quoteRequests/QuoteRequestsTable";

export const metadata = { title: "طلبات عروض الأسعار" };

export default async function QuoteRequestsPage() {
  await requirePermission(PERMISSIONS.QUOTE_REQUESTS_VIEW);
  const quoteRequests = await quoteService.list();

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-black">طلبات عروض الأسعار</h1>
        <p className="text-sm text-[#9C978A]">طلبات عروض الأسعار الواردة من نموذج الموقع العام.</p>
      </div>

      <QuoteRequestsTable
        rows={quoteRequests.map((q) => ({
          id: q.id,
          company: q.company,
          contactName: q.contactName,
          industry: q.industry,
          status: q.status,
          submittedAt: q.submittedAt,
        }))}
      />
    </div>
  );
}
