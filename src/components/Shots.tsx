import { useState } from "react";
import type { Project, Shot } from "../data";
import { placeCursor, clearCursor } from "../placeCursor";
import { rich } from "../rich";
import { Lightbox } from "./Lightbox";

export function Shots({ shots, project }: { shots: Shot[]; project: Project }) {
  const [active, setActive] = useState<Shot | null>(null);

  return (
    <div className={`shots device-stage-${project.stage}`}>
      {shots.map((shot) => {
        const classes = [
          "shot",
          shot.wide ? "shot-wide" : "",
          shot.compact ? "shot-compact" : "",
          shot.narrow ? "shot-narrow" : "",
          shot.ratio ? `shot-${shot.ratio}` : "",
        ]
          .filter(Boolean)
          .join(" ");
        const label = shot.alt ?? shot.caption ?? project.title;

        return (
          <figure className={classes} key={shot.src}>
            <button
              type="button"
              className="shot-open"
              onMouseEnter={placeCursor}
              onMouseMove={placeCursor}
              onMouseLeave={clearCursor}
              onClick={() => setActive(shot)}
            >
              <span className="shot-media">
                <img src={shot.src} alt={label} loading="lazy" />
              </span>
              <span className="shot-cta" aria-hidden>
                View image
              </span>
            </button>
            {shot.caption ? (
              <figcaption className="mono">{rich(shot.caption)}</figcaption>
            ) : null}
          </figure>
        );
      })}

      {active ? (
        <Lightbox
          src={active.src}
          alt={active.alt ?? active.caption ?? project.title}
          caption={active.caption ? rich(active.caption) : null}
          onClose={() => setActive(null)}
        />
      ) : null}
    </div>
  );
}
