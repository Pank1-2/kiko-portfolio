import { Fragment, useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { isCaseUnlocked, isLockedCase } from "../gate";
import { PasswordGate } from "../components/PasswordGate";
import { AlertStudy } from "../components/AlertStudy";
import { ExpertAdviceStudy } from "../components/ExpertAdviceStudy";
import { CardStage } from "../components/CardStage";
import { StudyMeta } from "../components/StudyMeta";
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
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(isCaseUnlocked);
  const published = projects.filter((item) => !item.comingSoon);
  const index = published.findIndex((item) => item.slug === slug);
  const project = published[index];
  const toc = project
    ? [
        ...(project.overview.length ? [{ id: "overview", label: "Overview" }] : []),
        ...(project.thoughts ? [{ id: "thinking", label: "Decisions" }] : []),
        ...(project.journey ? [{ id: "journey", label: "Before / after" }] : []),
        ...project.sections
          .filter((section) => section.id !== "thinking")
          .map((section) => ({ id: section.id, label: section.heading })),
      ]
    : [];
  const sectionKey = toc.map((item) => item.id).join("|");
  const [activeId, setActiveId] = useState(toc[0]?.id ?? "overview");

  useEffect(() => {
    const ids = sectionKey.split("|").filter(Boolean);
    if (!ids.length) return;

    const update = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8;
      const marker = Math.max(140, Math.min(window.innerHeight * 0.28, 240));
      let current = ids[0];

      if (!nearBottom) {
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          if (el.getBoundingClientRect().top <= marker) current = id;
        }
      } else {
        current = ids[ids.length - 1];
      }

      setActiveId((prevId) => (prevId === current ? prevId : current));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionKey]);

  if (!project) {
    return <Navigate to={{ pathname: "/", hash: "case-studies" }} replace />;
  }

  const prev = published[(index - 1 + published.length) % published.length];
  const next = published[(index + 1) % published.length];

  if (isLockedCase(project.slug) && !unlocked) {
    return (
      <PasswordGate
        onClose={() => navigate({ pathname: "/", hash: "case-studies" })}
        onUnlock={() => setUnlocked(true)}
      />
    );
  }

  if (project.slug === "expert-advice") {
    return <ExpertAdviceStudy project={project} prev={prev} next={next} />;
  }

  if (project.slug === "alert-monitor") {
    return <AlertStudy project={project} prev={prev} next={next} />;
  }
  const thinking = project.sections.find((section) => section.id === "thinking");

  return (
    <main className="study">
      <header className="study-intro shell">
        <Link className="back mono" to={{ pathname: "/", hash: "case-studies" }}>
          <span aria-hidden="true">←</span>
          Case studies
        </Link>
        <p className="mono study-kicker">
          <span className="study-kicker-frame">{project.frame}</span>
          {" · "}
          {project.category}
        </p>
        <h1>{project.title}</h1>
        <p className="study-outcome">{project.outcome}</p>
        <StudyMeta project={project} />
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
              <a
                key={item.id}
                href={`#${item.id}`}
                className={item.id === activeId ? "is-current" : undefined}
                aria-current={item.id === activeId ? "true" : undefined}
                onClick={scrollToId(item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
        <article className="study-body">
          {project.overview.length ? (
            <section id="overview" className="study-block" data-reveal>
              <h2>Overview</h2>
              {project.overview.map((paragraph) => (
                <p key={paragraph}>{rich(paragraph)}</p>
              ))}
            </section>
          ) : null}

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
