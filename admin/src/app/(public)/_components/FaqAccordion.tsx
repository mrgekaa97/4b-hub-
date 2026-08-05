"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Ports the legacy FAQ accordion (website/assets/js/main.js) into (public),
 * same scoped-client-component pattern as ScrollReveal/NavbarBehavior:
 * wires behavior onto the already-verbatim .faq-item markup via DOM queries
 * instead of rewriting it into React state, so the markup stays byte-identical.
 *
 * Faithful to legacy: single-open accordion (opening one closes siblings in
 * the same parent group), clicking an open item closes it, open sets inline
 * max-height = answer.scrollHeight (CSS can't animate to auto), aria-expanded
 * kept in sync. Inert on pages with no .faq-item; only / and /careers have it.
 * usePathname in deps re-scans after client-side navigation (legacy relied on
 * full page reloads); cleanup removes listeners on unmount/re-run.
 */
export function FaqAccordion() {
  const pathname = usePathname();

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(".faq-item"));
    const cleanups: Array<() => void> = [];

    items.forEach((item) => {
      const q = item.querySelector<HTMLElement>(".faq-q");
      const a = item.querySelector<HTMLElement>(".faq-a");
      if (!q || !a) return;

      const onClick = () => {
        const isOpen = item.classList.contains("is-open");

        item.parentElement
          ?.querySelectorAll<HTMLElement>(".faq-item")
          .forEach((other) => {
            other.classList.remove("is-open");
            const otherA = other.querySelector<HTMLElement>(".faq-a");
            if (otherA) otherA.style.maxHeight = "";
            other.querySelector<HTMLElement>(".faq-q")
              ?.setAttribute("aria-expanded", "false");
          });

        if (!isOpen) {
          item.classList.add("is-open");
          a.style.maxHeight = `${a.scrollHeight}px`;
          q.setAttribute("aria-expanded", "true");
        }
      };

      q.addEventListener("click", onClick);
      cleanups.push(() => q.removeEventListener("click", onClick));
    });

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
