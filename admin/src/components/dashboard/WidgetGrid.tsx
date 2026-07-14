"use client";

import { ReactNode, useEffect, useState } from "react";

export interface WidgetDef {
  key: string;
  label: string;
  element: ReactNode;
}

const STORAGE_KEY = "4b_dashboard_hidden_widgets";

/**
 * Scope note: the product doc asks for widgets that support "Drag & Drop,
 * Show/Hide, Save Personal Layout". Show/Hide is implemented here for real,
 * persisted in the browser (localStorage) per-admin. Drag-and-drop
 * reordering + a server-persisted layout (so it follows the admin across
 * devices) needs a small new place to store it — there's no per-user
 * preferences table yet, and piggy-backing it onto the site-wide Setting
 * KV store would blur that store's purpose (see settings.service.ts). It's
 * a legitimate, small, additive schema addition (a UserPreference model),
 * deliberately deferred rather than rushed under this pass — flagged for
 * the next architecture checkpoint rather than silently skipped.
 */
export function WidgetGrid({ widgets }: { widgets: WidgetDef[] }) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setHidden(new Set(JSON.parse(raw)));
    } finally {
      setLoaded(true);
    }
  }, []);

  function toggle(key: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  }

  if (!loaded) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-[#161514]" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          onClick={() => setIsEditing((v) => !v)}
          className="text-xs font-bold text-[#C9A227] hover:underline"
        >
          {isEditing ? "تم" : "تخصيص العرض"}
        </button>
      </div>

      {isEditing && (
        <div className="mb-4 flex flex-wrap gap-2 rounded-lg border border-[rgba(201,162,39,0.16)] bg-[#161514] p-3">
          {widgets.map((w) => (
            <label key={w.key} className="flex items-center gap-1.5 text-xs text-[#F5F0E6]">
              <input type="checkbox" checked={!hidden.has(w.key)} onChange={() => toggle(w.key)} />
              {w.label}
            </label>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {widgets
          .filter((w) => !hidden.has(w.key))
          .map((w) => (
            <div key={w.key}>{w.element}</div>
          ))}
      </div>
    </div>
  );
}
