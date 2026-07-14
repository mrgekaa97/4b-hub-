"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";

type ToastTone = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Distinct from the persisted `Notification` model (lib/services/notification.service.ts):
 * a Toast is a one-time, client-only "your action just happened" confirmation
 * (e.g. "تم الحفظ") that disappears in a few seconds and is never stored.
 * The Notification Center is for durable, cross-session items (new quote
 * request, device pending, ...). Don't conflate the two — a toast for
 * "Saved" doesn't need to persist or ever be marked read.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const TONE_STYLES: Record<ToastTone, string> = {
    success: "border-[#4C8B5B]/40 bg-[#4C8B5B]/10 text-[#4C8B5B]",
    error: "border-[#E07856]/40 bg-[#E07856]/10 text-[#E07856]",
    info: "border-[rgba(201,162,39,0.35)] bg-[#161514] text-[#C9A227]",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-4 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div key={t.id} className={`rounded-md border px-4 py-3 text-sm font-medium shadow-lg ${TONE_STYLES[t.tone]}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast() must be used within <ToastProvider>");
  return ctx;
}
