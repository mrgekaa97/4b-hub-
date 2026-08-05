"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && revealEls.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach((el) => io.observe(el));

      return () => io.disconnect();
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }, []);

  return null;
}
