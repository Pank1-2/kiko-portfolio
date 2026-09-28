import { useLayoutEffect, useRef, useState } from "react";
import { asset } from "../asset";
import { IbmMark } from "./IbmMark";

type Props = {
  onSkip: () => void;
};

const frames = [
  { src: asset("/photos/print-1.png"), className: "print-left" },
  { src: asset("/photos/print-2.png"), className: "print-up" },
  { src: asset("/photos/print-3.png"), className: "print-right" },
];

const coverTags = ["Product", "UX", "UI", "IBM", "SF Bay"];

function CoverHello() {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const mRef = useRef<HTMLSpanElement>(null);
  const oRef = useRef<HTMLSpanElement>(null);
  const kikoRef = useRef<HTMLSpanElement>(null);
  const panRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const m = mRef.current;
    const o = oRef.current;
    const kiko = kikoRef.current;
    const pan = panRef.current;
    if (!root || !m || !o || !kiko || !pan) return;

    const align = () => {
      const origin = root.getBoundingClientRect().left;
      kiko.style.marginLeft = `${Math.max(0, m.getBoundingClientRect().left - origin)}px`;
      // Slight extra so PAN bleeds past the print; centering keeps HELLO hanging left
      pan.style.marginLeft = `${Math.max(0, o.getBoundingClientRect().left - origin) + 14}px`;
    };

    align();
    void document.fonts?.ready.then(align);
    const board = root.parentElement;
    const observer = new ResizeObserver(align);
    if (board) observer.observe(board);
    window.addEventListener("resize", align);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", align);
    };
  }, []);

  return (
    <p className="cover-hello" ref={rootRef} aria-hidden="true">
      <span className="cover-lead">
        Hello, I’<span ref={mRef}>M</span>
      </span>
      <span className="cover-kiko" ref={kikoRef}>
        Kik<span ref={oRef}>o</span>
      </span>
      <span className="cover-pan" ref={panRef}>
        Pan
      </span>
    </p>
  );
}

function DraggableTag({ label }: { label: string }) {
  const pos = useRef({ x: 0, y: 0 });
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(
    null,
  );
  const [dragging, setDragging] = useState(false);

  return (
    <li
      className={`tag mono cover-tag${dragging ? " is-dragging" : ""}`}
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = {
          px: event.clientX,
          py: event.clientY,
          x: pos.current.x,
          y: pos.current.y,
        };
        setDragging(true);
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        pos.current = {
          x: drag.current.x + event.clientX - drag.current.px,
          y: drag.current.y + event.clientY - drag.current.py,
        };
        event.currentTarget.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }}
      onPointerUp={() => {
        drag.current = null;
        setDragging(false);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setDragging(false);
      }}
    >
      {label}
    </li>
  );
}

export function PhotoIntro({ onSkip }: Props) {
  return (
    <div className="cover">
      <div className="cover-bg" />
      <div className="cover-board">
        {frames.map((frame) => (
          <figure key={frame.src} className={`photo-print ${frame.className}`}>
            <img src={frame.src} alt="" />
          </figure>
        ))}
        <CoverHello />
      </div>
      <h1 className="sr-only">Hello, I’m Kiko Pan</h1>
      <div className="cover-meta">
        <p className="cover-ibm mono">
          Design @ <IbmMark />
        </p>
        <ul className="cover-tags">
          {coverTags.map((tag) => (
            <DraggableTag key={tag} label={tag} />
          ))}
        </ul>
        <button type="button" className="btn ghost cover-enter" onClick={onSkip}>
          View work
        </button>
      </div>
    </div>
  );
}
