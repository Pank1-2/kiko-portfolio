import { useEffect, useState, type CSSProperties } from "react";
import { usePointer } from "../hooks/usePointer";

type Droplet = { dx: number; dy: number };
type Pop = { id: number; x: number; y: number; droplets: Droplet[] };

export function SiteCursor() {
  usePointer();
  const [pops, setPops] = useState<Pop[]>([]);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const hover = window.matchMedia("(hover: hover)").matches;
    if (!fine || !hover) return;

    let nextId = 0;

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;

      const id = nextId++;
      // Match Radhika: 10 droplets in a ring with a little randomness
      const droplets = Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 28 + Math.random() * 22;
        return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist };
      });

      setPops((prev) => [
        ...prev,
        { id, x: event.clientX, y: event.clientY, droplets },
      ]);
      window.setTimeout(() => {
        setPops((prev) => prev.filter((pop) => pop.id !== id));
      }, 650);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    // Drive splash with WAAPI so it still runs when CSS animations are reduced
    document.querySelectorAll<HTMLElement>(".click-pop").forEach((pop) => {
      if (pop.dataset.animated === "1") return;
      pop.dataset.animated = "1";

      const bubble = pop.querySelector<HTMLElement>(".click-pop__bubble");
      bubble?.animate(
        [
          { opacity: 1, transform: "scale(0)" },
          { opacity: 0, transform: "scale(2.3)" },
        ],
        {
          duration: 320,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );

      pop.querySelectorAll<HTMLElement>(".click-pop__droplet").forEach((drop) => {
        const dx = drop.style.getPropertyValue("--dx") || "0px";
        const dy = drop.style.getPropertyValue("--dy") || "0px";
        drop.animate(
          [
            { opacity: 1, transform: "translate(0px, 0px) scale(1)" },
            { opacity: 0, transform: `translate(${dx}, ${dy}) scale(0.2)` },
          ],
          {
            duration: 550,
            delay: 30,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "forwards",
          },
        );
      });
    });
  }, [pops]);

  return (
    <>
      <div className="cursor-ball" aria-hidden />
      {pops.map((pop) => (
        <span
          key={pop.id}
          className="click-pop"
          style={{ left: pop.x, top: pop.y }}
          aria-hidden
        >
          <span className="click-pop__bubble" />
          {pop.droplets.map((drop, i) => (
            <span
              key={i}
              className="click-pop__droplet"
              style={
                {
                  "--dx": `${drop.dx}px`,
                  "--dy": `${drop.dy}px`,
                } as CSSProperties
              }
            />
          ))}
        </span>
      ))}
    </>
  );
}
