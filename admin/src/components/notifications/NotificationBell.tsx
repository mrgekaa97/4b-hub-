"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/Badge";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  isRead: boolean;
  actionUrl: string | null;
  createdAt: string;
}

/**
 * Polling-based for V1 (fetches every 30s while open/mounted). The
 * notification.service.ts comment on `notify()` is where a future
 * WebSocket/SSE push would plug in without changing this component's
 * props or the API route's shape — just swap the polling effect below
 * for a subscription.
 */
export function NotificationBell() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.notifications ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const unreadCount = items.filter((i) => !i.isRead).length;

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setItems((prev) => prev.map((i) => ({ ...i, isRead: true })));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={`الإشعارات${unreadCount ? ` (${unreadCount} غير مقروءة)` : ""}`}
        aria-expanded={isOpen}
        className="relative rounded-md p-2 text-[#F5F0E6] hover:text-[#C9A227] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A227]"
      >
        <span aria-hidden="true">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C9A227] px-1 text-[10px] font-bold text-[#0A0A0A]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute end-0 z-40 mt-2 w-80 rounded-lg border border-[rgba(201,162,39,0.16)] bg-[#161514] shadow-xl">
          <div className="flex items-center justify-between border-b border-[rgba(201,162,39,0.16)] px-4 py-3">
            <span className="text-sm font-bold">الإشعارات</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs font-bold text-[#C9A227] hover:underline">
                تعليم الكل كمقروء
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <p className="p-4 text-center text-xs text-[#9C978A]">جارِ التحميل...</p>
            ) : items.length === 0 ? (
              <p className="p-4 text-center text-xs text-[#9C978A]">لا توجد إشعارات</p>
            ) : (
              items.map((item) => (
                <a
                  key={item.id}
                  href={item.actionUrl ?? "#"}
                  className={`block border-b border-[rgba(201,162,39,0.08)] px-4 py-3 text-sm last:border-0 hover:bg-[#1D1B18] ${
                    item.isRead ? "opacity-60" : ""
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="font-bold">{item.title}</span>
                    {item.priority === "URGENT" || item.priority === "HIGH" ? (
                      <Badge tone="danger">{item.priority === "URGENT" ? "عاجل" : "مهم"}</Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-[#9C978A]">{item.description}</p>
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
