import { useState, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Project } from "../data";
import { isCaseUnlocked, isLockedCase } from "../gate";
import { placeCursor, clearCursor } from "../placeCursor";
import { CardStage } from "./CardStage";
import { PasswordGate } from "./PasswordGate";

export function FrameCard({ project }: { project: Project }) {
  const navigate = useNavigate();
  const [ask, setAsk] = useState(false);
  const locked = isLockedCase(project.slug);
  const sealed = locked && !isCaseUnlocked();

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (sealed) {
      event.preventDefault();
      setAsk(true);
    }
  }
  const body = (
    <>
      <div className="frame-media">
        <span className="frame-no mono">{project.frame}</span>
        {locked ? (
          <span className="frame-lock" aria-label={sealed ? "Password protected" : "Unlocked"}>
            {sealed ? (
              <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <rect x="3" y="11" width="13" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16 11V7.2a3.5 3.5 0 0 1 7 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </span>
        ) : null}
        <CardStage
          slug={project.slug}
          src={project.image}
          stage={project.stage}
          alt=""
        />
      </div>
      <div className="frame-body">
        <p className="mono">{project.category}</p>
        <h3>{project.title}</h3>
        <p className="outcome">{project.outcome}</p>
        <div className="tags">
          {project.tags.map((tag) => (
            <span className="tag mono" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <span className="shot-cta frame-cta" aria-hidden>
        {project.comingSoon ? "Coming soon" : "View project"}
      </span>
    </>
  );

  if (project.comingSoon) {
    return (
      <div
        className="frame frame--soon"
        aria-disabled="true"
        aria-label={`${project.title} — coming soon`}
        onMouseEnter={placeCursor}
        onMouseMove={placeCursor}
        onMouseLeave={clearCursor}
      >
        {body}
      </div>
    );
  }

  return (
    <>
      <Link
        className={sealed ? "frame is-sealed" : "frame"}
        to={`/work/${project.slug}`}
        onClick={onClick}
        onMouseEnter={placeCursor}
        onMouseMove={placeCursor}
        onMouseLeave={clearCursor}
      >
        {body}
      </Link>
      {ask ? (
        <PasswordGate
          onClose={() => setAsk(false)}
          onUnlock={() => {
            setAsk(false);
            navigate(`/work/${project.slug}`);
          }}
        />
      ) : null}
    </>
  );
}
