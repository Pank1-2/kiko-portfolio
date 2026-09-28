import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { consumeCover, coverHasPlayed, shouldPlayCover, takeCoverBoot } from "../cover";

export function ScrollFX() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const dest = hash || window.location.hash;

    if (pathname === "/" && takeCoverBoot()) {
      window.scrollTo(0, 0);
      return;
    }

    if (pathname === "/" && dest === "#case-studies") {
      consumeCover();
      const timer = window.setTimeout(() => {
        document.getElementById("case-studies")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 80);
      return () => window.clearTimeout(timer);
    }

    if (pathname === "/" && dest === "#portfolio-start") {
      consumeCover();
      const timer = window.setTimeout(() => {
        document.getElementById("portfolio-start")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 80);
      return () => window.clearTimeout(timer);
    }

    if (pathname.startsWith("/work/")) {
      consumeCover();
      const id = dest.replace("#", "");
      if (id) {
        const timer = window.setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 40);
        return () => window.clearTimeout(timer);
      }
      window.scrollTo(0, 0);
      return;
    }

    if (pathname !== "/") {
      consumeCover();
    }

    window.scrollTo(0, 0);
    const retry = window.setTimeout(() => window.scrollTo(0, 0), 40);
    return () => window.clearTimeout(retry);
  }, [pathname, hash]);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scrollRaf = 0;

    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const max = root.scrollHeight - root.clientHeight;
        root.style.setProperty(
          "--scroll",
          max > 0 ? String(root.scrollTop / max) : "0",
        );

        if (coverHasPlayed()) {
          root.style.setProperty("--intro", "1");
          root.classList.add("intro-done");
          root.classList.remove("peeling");
          return;
        }

        if (shouldPlayCover() || document.getElementById("photo-intro")) {
          return;
        }

        root.style.setProperty("--intro", "1");
        root.classList.add("intro-done");
        root.classList.remove("peeling");
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduce) {
      document.querySelectorAll("[data-reveal]").forEach((node) => {
        node.classList.add("is-in");
      });
      return () => {
        window.removeEventListener("scroll", onScroll);
        if (scrollRaf) cancelAnimationFrame(scrollRaf);
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((node) => io.observe(node));

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
    };
  }, [pathname]);

  return <div className="scroll-progress" aria-hidden />;
}
