import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type Props = {
  src: string;
  alt: string;
  caption?: ReactNode;
  onClose: () => void;
};

export function Lightbox({ src, alt, caption, onClose }: Props) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };

    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Expanded image"
      onClick={onClose}
    >
      <button type="button" className="lightbox-close mono" onClick={onClose}>
        Close
      </button>
      <figure className="lightbox-frame" onClick={(event) => event.stopPropagation()}>
        <img src={src} alt={alt} />
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </div>
  );
}
