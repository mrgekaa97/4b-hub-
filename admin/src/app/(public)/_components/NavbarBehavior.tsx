"use client";

import { useEffect } from "react";

export function NavbarBehavior() {
  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    const backToTop = document.querySelector(".back-to-top");
    const onScroll = () => {
      if (navbar) navbar.classList.toggle("is-scrolled", window.scrollY > 24);
      if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 480);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onBackToTopClick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    if (backToTop) {
      backToTop.addEventListener("click", onBackToTopClick);
    }

    const toggle = document.querySelector(".nav-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const linkCloseHandlers: Array<{ el: Element; handler: () => void }> = [];

    const onToggleClick = () => {
      const open = toggle!.classList.toggle("is-open");
      mobileMenu!.classList.toggle("is-open", open);
      toggle!.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    };

    if (toggle && mobileMenu) {
      toggle.addEventListener("click", onToggleClick);
      mobileMenu.querySelectorAll("a").forEach((a) => {
        const handler = () => {
          toggle.classList.remove("is-open");
          mobileMenu.classList.remove("is-open");
          document.body.style.overflow = "";
        };
        a.addEventListener("click", handler);
        linkCloseHandlers.push({ el: a, handler });
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (backToTop) {
        backToTop.removeEventListener("click", onBackToTopClick);
      }
      if (toggle && mobileMenu) {
        toggle.removeEventListener("click", onToggleClick);
      }
      linkCloseHandlers.forEach(({ el, handler }) => el.removeEventListener("click", handler));
    };
  }, []);

  return null;
}
