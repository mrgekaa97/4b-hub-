import { requirePermission } from "@/lib/auth/guard";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { applicationService } from "@/lib/services/application.service";
import { JobApplicationsTable } from "@/components/jobApplications/JobApplicationsTable";

export const metadata = { title: "طلبات التوظيف" };

export default async function JobApplicationsPage() {
  await requirePermission(PERMISSIONS.JOB_APPLICATIONS_VIEW);
  const jobApplications = await applicationService.list();

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-black">طلبات التوظيف</h1>
        <p className="text-sm text-[#9C978A]">طلبات التوظيف الواردة من نموذج الموقع العام.</p>
      </div>

      <JobApplicationsTable
        rows={jobApplications.map((a) => ({
          id: a.id,
          fullName: a.fullName,
          roleApplied: a.roleApplied,
          status: a.status,
          submittedAt: a.submittedAt,
        }))}
      />
    </div>
  );
}
