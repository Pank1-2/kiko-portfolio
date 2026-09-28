import { Fragment, type MouseEvent, type ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CardStage } from "../components/CardStage";
import { DeviceStage } from "../components/DeviceStage";
import { Shots } from "../components/Shots";
import { projects, type BlockKey, type Project, type StudySection } from "../data";
import { rich } from "../rich";

const DEFAULT_FLOW: BlockKey[] = [
  "quote",
  "body",
  "list",
  "findings",
  "steps",
  "competitors",
  "shots",
  "image",
];

function scrollToId(id: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${id}`);
  };
}

function block(
  key: BlockKey,
  section: StudySection,
  project: Project,
): ReactNode {
  switch (key) {
    case "quote":
      return section.quote ? <blockquote>{rich(section.quote)}</blockquote> : null;

    case "body":
      return section.body?.map((paragraph) => (
        <p key={paragraph}>{rich(paragraph)}</p>
      ));

    case "bodyAfter":
      return section.bodyAfter?.map((paragraph) => (
        <p key={paragraph}>{rich(paragraph)}</p>
      ));

    case "list":
      return section.list ? (
        <>
          {section.listTitle ? (
            <p className="list-title mono">{section.listTitle}</p>
          ) : null}
          <ul className="solution-list">
            {section.list.map((item) => (
              <li key={item}>{rich(item)}</li>
            ))}
          </ul>
        </>
      ) : null;

    case "findings":
      return section.findings ? (
        <>
          {section.findingsTitle ? (
            <p>{rich(section.findingsTitle)}</p>
          ) : null}
          <div className="findings">
            {section.findings.map((finding, i) => (
              <article key={finding.title}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <h3>{finding.title}</h3>
                <p>{rich(finding.text)}</p>
              </article>
            ))}
          </div>
        </>
      ) : null;

    case "steps":
      return section.steps ? (
        <ol className="steps">
          {section.steps.map((step) => (
            <li key={step.n}>
              <span className="mono">{step.n}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{rich(step.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : null;

    case "competitors":
      return section.competitors ? (
        <div className="competitors">
          {section.competitors.map((item) => (
            <article key={item.name}>
              <h3>{item.name}</h3>
              <p className="pro">
                <span className="mono">Pros</span>
                {item.pros}
              </p>
              <p className="con">
                <span className="mono">Cons</span>
                {item.cons}
              </p>
            </article>
          ))}
        </div>
      ) : null;

    case "shots":
      return section.shots ? (
        <Shots shots={section.shots} project={project} />
      ) : null;

    case "shotsAfter":
      return section.shotsAfter ? (
        <Shots shots={section.shotsAfter} project={project} />
      ) : null;

    case "image":
      return section.image ? (
        <DeviceStage
          src={section.image}
          alt={section.caption || section.heading}
          device={project.device}
          stage={project.stage}
          caption={section.caption}
          expand
        />
      ) : null;

    default:
      return null;
  }
}

export function CaseStudy() {
  const { slug } = useParams();
  const published = projects.filter((item) => !item.comingSoon);
  const index = published.findIndex((item) => item.slug === slug);
  const project = published[index];

  if (!project) {
    return <Navigate to={{ pathname: "/", hash: "case-studies" }} replace />;
  }

  const prev = published[(index - 1 + published.length) % published.length];
  const next = published[(index + 1) % published.length];
  const thinking = project.sections.find((section) => section.id === "thinking");
  const toc = [
    { id: "overview", label: "Overview" },
    ...(project.thoughts ? [{ id: "thinking", label: "Decisions" }] : []),
    ...(project.journey ? [{ id: "journey", label: "Before / after" }] : []),
    ...project.sections
      .filter((section) => section.id !== "thinking")
      .map((section) => ({ id: section.id, label: section.heading })),
  ];

  return (
    <main className="study">
      <header className="study-intro shell">
        <Link className="back mono" to={{ pathname: "/", hash: "case-studies" }}>
          ← Case studies
        </Link>
        <p className="mono study-kicker">
          {project.frame} · {project.category}
        </p>
        <h1>{project.title}</h1>
        <p className="study-outcome">{project.outcome}</p>
        <dl className="study-facts">
          <div>
            <dt>
              <span className="fact-emoji" aria-hidden>
                👤
              </span>
              Role
            </dt>
            <dd>
              <strong>{project.roleHeadline}</strong>
              {project.roleDetail ? <p>{project.roleDetail}</p> : null}
            </dd>
          </div>
          <div>
            <dt>
              <span className="fact-emoji" aria-hidden>
                ⏱️
              </span>
              Duration
            </dt>
            <dd>
              <strong>{project.timeline}</strong>
              {project.timelineDetail ? <p>{project.timelineDetail}</p> : null}
            </dd>
          </div>
          <div>
            <dt>
              <span className="fact-emoji" aria-hidden>
                👥
              </span>
              Team size
            </dt>
            <dd>
              <strong>{project.teamHeadline}</strong>
              {project.teamDetail ? <p>{project.teamDetail}</p> : null}
            </dd>
          </div>
          <div>
            <dt>
              <span className="fact-emoji" aria-hidden>
                🛠️
              </span>
              Tools
            </dt>
            <dd>
              <strong>{project.tools}</strong>
            </dd>
          </div>
        </dl>
      </header>

      <div className="shell annotated-still" data-reveal>
        <CardStage
          slug={project.slug}
          src={project.image}
          stage={project.stage}
          alt={`${project.title} product still`}
        />
      </div>

      <div className="study-split shell">
        <aside className="study-rail">
          <p className="mono rail-label">Sections</p>
          <nav className="study-toc">
            {toc.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={scrollToId(item.id)}>
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
        <article className="study-body">
          <section id="overview" className="study-block" data-reveal>
            <h2>Overview</h2>
            {project.overview.map((paragraph) => (
              <p key={paragraph}>{rich(paragraph)}</p>
            ))}
          </section>

          {project.thoughts ? (
            <section id="thinking" className="study-block" data-reveal>
              <h2>Decisions</h2>
              {thinking?.body?.map((paragraph) => (
                <p key={paragraph}>{rich(paragraph)}</p>
              ))}
              <ol className="decisions">
                {project.thoughts.map((thought, i) => (
                  <li key={thought.question}>
                    <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="decision-q">{thought.question}</p>
                      <h3>{thought.decision}</h3>
                      <p>{rich(thought.why)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {project.journey ? (
            <section id="journey" className="study-block" data-reveal>
              <h2>Before / after</h2>
              <div className="swap">
                <div className="swap-head">
                  <span className="mono">{project.journey.beforeTitle}</span>
                  <span aria-hidden />
                  <span className="mono">{project.journey.afterTitle}</span>
                </div>
                {project.journey.before.map((step, i) => (
                  <div className="swap-row" key={step.label}>
                    <div>
                      <strong>{step.label}</strong>
                      {step.note ? <span>{step.note}</span> : null}
                    </div>
                    <span className="swap-arrow" aria-hidden>
                      →
                    </span>
                    <div>
                      <strong>{project.journey?.after[i]?.label}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {project.sections
            .filter((section) => section.id !== "thinking")
            .map((section) => (
              <section
                id={section.id}
                className={`study-block study-block-${section.id}`}
                key={section.id}
                data-reveal
              >
                <h2>{section.heading}</h2>
                {(section.flow ?? DEFAULT_FLOW).map((key) => (
                  <Fragment key={key}>{block(key, section, project)}</Fragment>
                ))}
              </section>
            ))}
        </article>
      </div>

      <nav className="study-pager" aria-label="Case study navigation">
        <Link className="study-pager-link study-pager-prev" to={`/work/${prev.slug}`}>
          <span className="mono study-pager-dir">← Previous</span>
          <span className="study-pager-title">
            <span className="mono">{prev.frame}</span> {prev.title}
          </span>
        </Link>
        <Link className="study-pager-link study-pager-next" to={`/work/${next.slug}`}>
          <span className="mono study-pager-dir">Next →</span>
          <span className="study-pager-title">
            <span className="mono">{next.frame}</span> {next.title}
          </span>
        </Link>
      </nav>
    </main>
  );
}
