import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { clearCursor, placeCursor } from "../placeCursor";
import { Lightbox } from "./Lightbox";

type Props = {
  src: string | (() => string);
  alt: string;
  caption?: string;
  className?: string;
  children: ReactNode;
};

/** Same hover pill and click-to-expand behavior as the other case studies. */
export function ImageZoom({ src, alt, caption, className, children }: Props) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        className={["shot-open", "alert-zoom", className].filter(Boolean).join(" ")}
        aria-label={`View image: ${alt}`}
        onMouseEnter={placeCursor}
        onMouseMove={placeCursor}
        onMouseLeave={clearCursor}
        onClick={() => {
          setShown(typeof src === "function" ? src() : src);
          setOpen(true);
        }}
      >
        {children}
        <span className="shot-cta" aria-hidden>
          View image
        </span>
      </button>
      {open && shown
        ? createPortal(
            <Lightbox src={shown} alt={alt} caption={caption} onClose={() => setOpen(false)} />,
            document.body,
          )
        : null}
    </>
  );
}
