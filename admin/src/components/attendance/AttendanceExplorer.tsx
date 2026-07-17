"use client";

import { useState, useEffect, useCallback } from "react";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/notifications/ToastProvider";

interface AttendanceRow {
  id: string;
  date: string;
  status: "PRESENT" | "LATE" | "ABSENT" | "EARLY_LEAVE";
  checkInAt: string | null;
  checkOutAt: string | null;
  checkInLocationStatus: string | null;
  checkOutLocationStatus: string | null;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  overtimeMinutes: number;
  workDurationMinutes: number | null;
  notes: string | null;
  employee: { id: string; fullName: string; employeeCode: string };
  site: { id: string; name: string };
  checkInAccuracyMeters?: number | null;
  checkInMapsLink?: string | null;
  checkInDeviceName?: string | null;
  checkInBrowser?: string | null;
  checkInOs?: string | null;
  checkOutMapsLink?: string | null;
}

interface SiteOption {
  id: string;
  name: string;
}

const STATUS_LABELS_AR: Record<AttendanceRow["status"], string> = {
  PRESENT: "حاضر",
  LATE: "متأخر",
  ABSENT: "غائب",
  EARLY_LEAVE: "انصراف مبكر",
};

const LOCATION_LABELS_AR: Record<string, string> = {
  INSIDE_SITE: "داخل الموقع",
  NEAR_SITE: "قريب من الموقع",
  OUTSIDE_SITE: "خارج الموقع",
};

function fmtTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

export function AttendanceExplorer({ initialRecords, sites, canManage }: { initialRecords: AttendanceRow[]; sites: SiteOption[]; canManage: boolean }) {
  const { showToast } = useToast();
  const [records, setRecords] = useState(initialRecords);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ siteId: "", status: "", outsideOnly: false });
  const [detailRecord, setDetailRecord] = useState<AttendanceRow | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.siteId) params.set("siteId", filters.siteId);
      if (filters.status) params.set("status", filters.status);
      if (filters.outsideOnly) params.set("outsideOnly", "true");
      const res = await fetch(`/api/attendance?${params.toString()}`);
      const data = await res.json();
      if (res.ok) setRecords(data.records);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Skip the redundant fetch on first mount — the server already provided initialRecords.
    if (!hasLoadedOnce) {
      setHasLoadedOnce(true);
      return;
    }
    loadRecords();
  }, [filters, hasLoadedOnce, loadRecords]);

  function openDetail(record: AttendanceRow) {
    setDetailRecord(record);
    setNotesDraft(record.notes ?? "");
  }

  async function saveNotes() {
    if (!detailRecord) return;
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/attendance/${detailRecord.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notesDraft }),
      });
      if (!res.ok) {
        showToast("تعذر حفظ الملاحظات", "error");
        return;
      }
      showToast("تم حفظ الملاحظات");
      setRecords((prev) => prev.map((r) => (r.id === detailRecord.id ? { ...r, notes: notesDraft } : r)));
      setDetailRecord(null);
    } finally {
      setIsSavingNotes(false);
    }
  }

  const columns: TableColumn<AttendanceRow>[] = [
    { header: "التاريخ", cell: (r) => new Date(r.date).toLocaleDateString("ar-EG") },
    { header: "الموظف", cell: (r) => <span className="font-bold">{r.employee.fullName}</span> },
    { header: "الموقع", cell: (r) => r.site.name },
    { header: "الحضور", cell: (r) => fmtTime(r.checkInAt) },
    { header: "الانصراف", cell: (r) => fmtTime(r.checkOutAt) },
    { header: "الحالة", cell: (r) => <Badge tone={statusTone(r.status)}>{STATUS_LABELS_AR[r.status]}</Badge> },
    {
      header: "الموقع الجغرافي",
      cell: (r) => {
        const flag = r.checkInLocationStatus === "OUTSIDE_SITE" || r.checkOutLocationStatus === "OUTSIDE_SITE";
        return flag ? <Badge tone="danger">خارج النطاق</Badge> : <Badge tone="success">داخل النطاق</Badge>;
      },
    },
    { header: "تفاصيل", cell: (r) => <button onClick={() => openDetail(r)} className="text-xs font-bold text-[#C9A227] hover:underline">عرض</button> },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-48">
          <Select value={filters.siteId} onChange={(e) => setFilters((f) => ({ ...f, siteId: e.target.value }))}>
            <option value="">كل المواقع</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
        </div>
        <div className="w-40">
          <Select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
            <option value="">كل الحالات</option>
            <option value="PRESENT">حاضر</option>
            <option value="LATE">متأخر</option>
            <option value="ABSENT">غائب</option>
            <option value="EARLY_LEAVE">انصراف مبكر</option>
          </Select>
        </div>
        <Checkbox
          id="outsideOnly"
          label="خارج النطاق فقط"
          checked={filters.outsideOnly}
          onChange={(e) => setFilters((f) => ({ ...f, outsideOnly: e.target.checked }))}
        />
      </div>

      <Table columns={columns} rows={records} rowKey={(r) => r.id} isLoading={isLoading} emptyMessage="لا توجد سجلات حضور مطابقة" />

      <Modal isOpen={!!detailRecord} onClose={() => setDetailRecord(null)} title="تفاصيل سجل الحضور">
        {detailRecord && (
          <div className="flex flex-col gap-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-[#9C978A]">الموظف: </span>{detailRecord.employee.fullName} ({detailRecord.employee.employeeCode})</div>
              <div><span className="text-[#9C978A]">الموقع: </span>{detailRecord.site.name}</div>
            </div>

            <div className="rounded-md border border-[rgba(201,162,39,0.16)] p-3">
              <p className="mb-2 font-bold text-[#C9A227]">الحضور</p>
              <p>الوقت: {fmtTime(detailRecord.checkInAt)}</p>
              <p>الحالة الجغرافية: {detailRecord.checkInLocationStatus ? LOCATION_LABELS_AR[detailRecord.checkInLocationStatus] : "—"}</p>
              <p>دقة الموقع: {detailRecord.checkInAccuracyMeters ? `${Math.round(detailRecord.checkInAccuracyMeters)} م` : "—"}</p>
              <p>الجهاز: {detailRecord.checkInDeviceName ?? "—"} ({detailRecord.checkInBrowser ?? "—"} / {detailRecord.checkInOs ?? "—"})</p>
              {detailRecord.checkInMapsLink && (
                <a href={detailRecord.checkInMapsLink} target="_blank" rel="noopener noreferrer" className="text-[#C9A227] hover:underline">
                  عرض الموقع على الخريطة
                </a>
              )}
            </div>

            <div className="rounded-md border border-[rgba(201,162,39,0.16)] p-3">
              <p className="mb-2 font-bold text-[#C9A227]">الانصراف</p>
              <p>الوقت: {fmtTime(detailRecord.checkOutAt)}</p>
              <p>الحالة الجغرافية: {detailRecord.checkOutLocationStatus ? LOCATION_LABELS_AR[detailRecord.checkOutLocationStatus] : "—"}</p>
              <p>مدة العمل: {detailRecord.workDurationMinutes ? `${detailRecord.workDurationMinutes} دقيقة` : "—"}</p>
              {detailRecord.checkOutMapsLink && (
                <a href={detailRecord.checkOutMapsLink} target="_blank" rel="noopener noreferrer" className="text-[#C9A227] hover:underline">
                  عرض الموقع على الخريطة
                </a>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-md bg-[#1D1B18] p-2"><p className="text-[#9C978A]">تأخير</p><p className="font-bold text-[#C9A227]">{detailRecord.lateMinutes} د</p></div>
              <div className="rounded-md bg-[#1D1B18] p-2"><p className="text-[#9C978A]">انصراف مبكر</p><p className="font-bold text-[#C9A227]">{detailRecord.earlyLeaveMinutes} د</p></div>
              <div className="rounded-md bg-[#1D1B18] p-2"><p className="text-[#9C978A]">وقت إضافي</p><p className="font-bold text-[#C9A227]">{detailRecord.overtimeMinutes} د</p></div>
            </div>

            <div>
              <p className="mb-1 text-xs font-bold text-[#9C978A]">ملاحظات</p>
              {canManage ? (
                <>
                  <Textarea value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} rows={3} />
                  <Button className="mt-2" onClick={saveNotes} isLoading={isSavingNotes}>حفظ الملاحظات</Button>
                </>
              ) : (
                <p className="text-[#F5F0E6]">{detailRecord.notes || "لا توجد ملاحظات"}</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
