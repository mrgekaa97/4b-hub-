import { ReactNode } from "react";

export interface TableColumn<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  isLoading?: boolean;
}

/**
 * One generic table for Services/Industries/Careers/Quote Requests/Contact
 * Messages/Employees/Sites/... — each module passes its own column
 * definitions instead of building its own <table> markup. Mobile responsive
 * strategy: below `md`, rows stack as labeled cards instead of a scrolling
 * table, since a wide data table is unusable on a phone.
 */
export function Table<T>({ columns, rows, rowKey, emptyMessage = "لا توجد بيانات", isLoading }: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-md bg-[#1D1B18]" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-[rgba(201,162,39,0.16)] bg-[#161514] p-8 text-center text-sm text-[#9C978A]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Desktop/tablet: real table */}
      <div className="hidden overflow-x-auto rounded-lg border border-[rgba(201,162,39,0.16)] md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(201,162,39,0.16)] bg-[#1D1B18] text-start">
              {columns.map((col) => (
                <th key={col.header} className={`px-4 py-3 text-start font-bold text-[#9C978A] ${col.className ?? ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-[rgba(201,162,39,0.08)] last:border-0 hover:bg-[#1D1B18]/60">
                {columns.map((col) => (
                  <td key={col.header} className={`px-4 py-3 ${col.className ?? ""}`}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <div key={rowKey(row)} className="rounded-lg border border-[rgba(201,162,39,0.16)] bg-[#161514] p-4">
            {columns.map((col) => (
              <div key={col.header} className="flex items-center justify-between gap-3 py-1 text-sm">
                <span className="text-xs font-bold text-[#9C978A]">{col.header}</span>
                <span>{col.cell(row)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
