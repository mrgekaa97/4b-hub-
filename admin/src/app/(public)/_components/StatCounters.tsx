"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Ports the legacy stat count-up (website/assets/js/main.js, "Stat count-up"
 * block) into (public), same scoped-client-component pattern as
 * ScrollReveal/TestimonialSlider/FaqAccordion: wires behavior onto the
 * already-verbatim [data-count-to] markup via DOM queries instead of
 * rewriting it into React state.
 *
 * Faithful to legacy: IntersectionObserver at threshold 0.4, ease-out cubic
 * count-up over 1400ms via requestAnimationFrame, integer targets round to a
 * whole number, non-integer targets to 1 decimal, data-suffix appended,
 * unobserved after animating once. Inert on pages with no [data-count-to]
 * (currently only / and /about have it).
 *
 * SPA addition beyond the legacy script (legacy relied on full page reloads
 * and never had to undo its own setup): cleanup disconnects the observer.
 * usePathname in the deps re-runs setup after client-side navigation, since
 * the targets live in page children, not the fixed layout.
 */
export function StatCounters() {
  const pathname = usePathname();

  useEffect(() => {
    const statNums = document.querySelectorAll<HTMLElement>("[data-count-to]");
    if (!statNums.length) return;

    if (!("IntersectionObserver" in window)) return;

    const countIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseFloat(el.dataset.countTo ?? "");
          const suffix = el.dataset.suffix || "";
          const duration = 1400;
          const start = performance.now();
          const startVal = 0;
          function tick(now: number) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = startVal + (target - startVal) * eased;
            el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          countIo.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    statNums.forEach((el) => countIo.observe(el));

    return () => countIo.disconnect();
  }, [pathname]);

  return null;
}
