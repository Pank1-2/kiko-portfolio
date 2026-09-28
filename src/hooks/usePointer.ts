import { useEffect } from "react";

export function usePointer() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const hover = window.matchMedia("(hover: hover)").matches;
    if (!fine || !hover) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = reduce ? 1 : 0.28;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let frame = 0;

    const tick = () => {
      cx += (mx - cx) * ease;
      cy += (my - cy) * ease;
      root.style.setProperty("--mx", `${mx}px`);
      root.style.setProperty("--my", `${my}px`);
      root.style.setProperty("--cx", `${cx}px`);
      root.style.setProperty("--cy", `${cy}px`);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const move = (event: PointerEvent) => {
      let x = event.clientX;
      let y = event.clientY;
      const target = event.target as HTMLElement | null;
      const overCta = Boolean(target?.closest(".shot-open, .frame"));
      const magnet = overCta
        ? null
        : (target?.closest("a, button") as HTMLElement | null);

      if (magnet) {
        const box = magnet.getBoundingClientRect();
        const midX = box.left + box.width / 2;
        const midY = box.top + box.height / 2;
        x += (midX - x) * 0.18;
        y += (midY - y) * 0.18;
        root.classList.add("cursor-over");
      } else {
        root.classList.remove("cursor-over");
      }

      if (overCta) {
        root.classList.add("cursor-cta");
      } else {
        root.classList.remove("cursor-cta");
      }

      mx = x;
      my = y;
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("has-cursor", "cursor-over", "cursor-cta");
      window.removeEventListener("pointermove", move);
    };
  }, []);
}
