import { useState } from "react";
import type { Project } from "../data";
import { placeCursor, clearCursor } from "../placeCursor";
import { rich } from "../rich";
import { Lightbox } from "./Lightbox";

type Props = {
  src: string;
  alt: string;
  device?: Project["device"];
  stage?: Project["stage"];
  compact?: boolean;
  caption?: string;
  expand?: boolean;
};

export function DeviceStage({
  src,
  alt,
  device = "laptop",
  stage = "navy",
  compact,
  caption,
  expand,
}: Props) {
  const [open, setOpen] = useState(false);
  const visual =
    device === "laptop" ? (
      <div className="macbook">
        <div className="macbook-lid">
          <div className="macbook-bezel">
            <span className="macbook-cam" aria-hidden />
            <div className="macbook-screen">
              <img src={src} alt={expand ? "" : alt} />
              <span className="macbook-glare" aria-hidden />
            </div>
          </div>
        </div>
        <div className="macbook-deck" aria-hidden>
          <span className="macbook-hinge" />
          <span className="macbook-groove" />
        </div>
      </div>
    ) : (
      <div className="device-plain">
        <img src={src} alt={expand ? "" : alt} />
      </div>
    );

  return (
    <figure
      className={`device-stage device-stage-${stage}${
        compact ? " device-stage-compact" : ""
      }`}
    >
      {expand ? (
        <button
          type="button"
          className="shot-open device-open"
          aria-label={`View image: ${alt}`}
          onMouseEnter={placeCursor}
          onMouseMove={placeCursor}
          onMouseLeave={clearCursor}
          onClick={() => setOpen(true)}
        >
          {visual}
          <span className="shot-cta" aria-hidden>
            View image
          </span>
        </button>
      ) : (
        visual
      )}
      {caption ? <figcaption className="mono">{rich(caption)}</figcaption> : null}
      {open ? (
        <Lightbox
          src={src}
          alt={alt}
          caption={caption ? rich(caption) : null}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </figure>
  );
}
