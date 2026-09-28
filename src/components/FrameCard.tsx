import { Link } from "react-router-dom";
import type { Project } from "../data";
import { placeCursor, clearCursor } from "../placeCursor";
import { CardStage } from "./CardStage";

export function FrameCard({ project }: { project: Project }) {
  const body = (
    <>
      <div className="frame-media">
        <span className="frame-no mono">{project.frame}</span>
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
        {project.comingSoon ? (
          <p className="mono frame-soon-label">Coming soon</p>
        ) : (
          <div className="tags">
            {project.tags.map((tag) => (
              <span className="tag mono" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
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
    <Link
      className="frame"
      to={`/work/${project.slug}`}
      onMouseEnter={placeCursor}
      onMouseMove={placeCursor}
      onMouseLeave={clearCursor}
    >
      {body}
    </Link>
  );
}
