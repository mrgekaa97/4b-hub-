"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Ports the legacy active-nav-link highlighter into (public), same scoped
 * pattern as ScrollReveal/StatCounters. Each legacy page ran its own inline
 * script comparing the page's filename against each [data-nav] link's href;
 * that doesn't fit a single shared navbar in (public)/layout.tsx, so this
 * uses usePathname() instead, comparing the current route against each
 * link's href directly.
 *
 * Only the desktop .nav-links links carry [data-nav] — the mobile-menu
 * copies don't, and site.css has no .mobile-menu a.is-active rule, so
 * there's nothing to do there. Matching is EXACT (pathname === href) for
 * every link including home ("/"), not prefix — a prefix match would make
 * "/" match every route. usePathname() never includes a hash fragment, so
 * the /contact#quote CTAs elsewhere are irrelevant to this comparison.
 *
 * usePathname in the deps re-runs this after client-side navigation, since
 * the navbar lives in the shared layout but the route changes underneath
 * it. Cleanup removes is-active from all queried links so no stale
 * highlight lingers across unmount/re-run.
 */
export function ActiveNavLink() {
  const pathname = usePathname();

  useEffect(() => {
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".nav-links a[data-nav]")
    );

    links.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("is-active", pathname === href);
    });

    return () => {
      links.forEach((link) => link.classList.remove("is-active"));
    };
  }, [pathname]);

  return null;
}
