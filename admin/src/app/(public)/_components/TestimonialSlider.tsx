"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Ports the legacy testimonial carousel (website/assets/js/main.js,
 * "Testimonial carousel" block) into (public), same scoped-client-component
 * pattern as ScrollReveal/FaqAccordion: wires behavior onto the already-verbatim
 * .testi-track/.testi-slide/.testi-dots markup via DOM queries instead of
 * rewriting it into React state.
 *
 * Faithful to legacy: dots are generated (one <button> per slide, first
 * is-active, aria-label "Testimonial N", click jumps to that slide),
 * autoplay advances every 6000ms, hovering the track pauses autoplay and
 * leaving resumes it, and all of this only runs when there's more than one
 * slide. Inert on pages with no .testi-track.
 *
 * SPA additions beyond the legacy script (legacy relied on full page reloads
 * and never had to undo its own setup): cleanup clears the interval, removes
 * the hover listeners, and empties .testi-dots so generated dots don't
 * accumulate if the effect re-runs after client-side navigation or Fast
 * Refresh. usePathname in the deps re-runs setup after navigation, since this
 * markup lives in the page's children, not the fixed layout.
 */
export function TestimonialSlider() {
  const pathname = usePathname();

  useEffect(() => {
    const track = document.querySelector<HTMLElement>(".testi-track");
    if (!track) return;

    const slides = Array.from(track.querySelectorAll<HTMLElement>(".testi-slide"));
    const dotsWrap = document.querySelector<HTMLElement>(".testi-dots");
    let active = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      if (i === 0) dot.classList.add("is-active");
      dot.setAttribute("aria-label", `Testimonial ${i + 1}`);
      dot.addEventListener("click", () => show(i));
      dotsWrap?.appendChild(dot);
    });

    function show(i: number) {
      slides[active]?.classList.remove("is-active");
      dotsWrap?.children[active]?.classList.remove("is-active");
      active = i;
      slides[active]?.classList.add("is-active");
      dotsWrap?.children[active]?.classList.add("is-active");
    }
    function next() {
      show((active + 1) % slides.length);
    }
    function startAuto() {
      timer = setInterval(next, 6000);
    }
    function stopAuto() {
      clearInterval(timer);
    }

    if (slides.length > 1) {
      startAuto();
      track.addEventListener("mouseenter", stopAuto);
      track.addEventListener("mouseleave", startAuto);
    }

    return () => {
      clearInterval(timer);
      track.removeEventListener("mouseenter", stopAuto);
      track.removeEventListener("mouseleave", startAuto);
      dotsWrap?.replaceChildren();
    };
  }, [pathname]);

  return null;
}
