import type { MouseEvent as ReactMouseEvent } from "react";

export function placeCursor(event: ReactMouseEvent<HTMLElement>) {
  const target = event.currentTarget;
  const box = target.getBoundingClientRect();
  // Allow the pill to hang past the sides when the cursor is near an edge
  const x = Math.min(Math.max(event.clientX - box.left, 0), Math.max(0, box.width));
  const y = Math.min(Math.max(event.clientY - box.top, 0), Math.max(0, box.height));
  target.style.setProperty("--cta-x", `${x}px`);
  target.style.setProperty("--cta-y", `${y}px`);
  target.dataset.ctaReady = "true";
}

export function clearCursor(event: ReactMouseEvent<HTMLElement>) {
  delete event.currentTarget.dataset.ctaReady;
}
