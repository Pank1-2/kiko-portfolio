import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { asset } from "../asset";
import type { Project } from "../data";
import { rich } from "../rich";
import { CaseImage } from "./CaseImage";
import { ImageZoom } from "./ImageZoom";
import { StudyMeta } from "./StudyMeta";

function shot(name: string) {
  return asset(`/images/expert-advice/${name}.png`);
}

type ImageSlot = {
  type: string;
  label: string;
  alt: string;
};

type Step = {
  id: string;
  chip: string;
  label: string;
  caption: string;
  image: ImageSlot;
  src?: string;
  width?: number;
  height?: number;
};

const TOC = [
  { id: "context", label: "Context" },
  { id: "original", label: "The original" },
  { id: "better-design", label: "The alternative approach" },
  { id: "final-design", label: "The refined design" },
  { id: "moments", label: "Design moments" },
  { id: "impact", label: "Impact" },
  { id: "reflection", label: "Reflection" },
];

const ORIGINAL: Step[] = [
  {
    id: "table",
    chip: "01",
    label: "KPI table",
    caption: "High and low advice sit in columns, cut off.",
    src: shot("original-table"),
    width: 1024,
    height: 567,
    image: {
      type: "Before",
      label: "KPI table",
      alt: "Original Expert Advice table, with high and low threshold columns.",
    },
  },
  {
    id: "panel",
    chip: "02",
    label: "Tooltip and panel",
    caption: "A tooltip for the advice, and a side panel for SME notes.",
    src: shot("original-panel"),
    width: 1024,
    height: 568,
    image: {
      type: "Before",
      label: "Tooltip and side panel",
      alt: "Original Expert Advice with a tooltip on the advice text and a side panel for SME notes.",
    },
  },
];

const BETTER: Step[] = [
  {
    id: "kpi-table",
    chip: "01",
    label: "KPI table",
    caption: "A full width table of every KPI.",
    src: shot("concept-table"),
    width: 1024,
    height: 632,
    image: {
      type: "Concept",
      label: "KPI table",
      alt: "Concept of KPI settings as a full width table.",
    },
  },
  {
    id: "kpi-detail",
    chip: "02",
    label: "KPI detail",
    caption: "One page for anomaly detection, Expert Advice, and whatever comes next.",
    src: shot("concept-detail"),
    width: 1024,
    height: 641,
    image: {
      type: "Concept",
      label: "KPI detail page",
      alt: "Concept of a KPI detail page open to Expert Advice for the high threshold.",
    },
  },
];

const STEPS: Step[] = [
  {
    id: "overview",
    chip: "01",
    label: "Overview",
    caption: "Active events for this KPI.",
    src: `${shot("final-overview")}?v=2`,
    width: 1024,
    height: 623,
    image: {
      type: "Hi-fi",
      label: "Overview",
      alt: "Overview tab listing open events for this KPI.",
    },
  },
  {
    id: "advice",
    chip: "02",
    label: "Expert Advice",
    caption: "High and Low threshold, with advice and notes together.",
    src: `${shot("final-advice")}?v=2`,
    width: 1024,
    height: 803,
    image: {
      type: "Hi-fi",
      label: "Expert Advice",
      alt: "Expert Advice tab with IBM advice and SME notes for the low threshold.",
    },
  },
  {
    id: "notes",
    chip: "03",
    label: "Edit SME notes",
    caption: "Editing happens in a modal, like the rest of the product.",
    src: `${shot("final-edit")}?v=2`,
    width: 1024,
    height: 624,
    image: {
      type: "Hi-fi",
      label: "Edit SME notes",
      alt: "Edit SME notes modal on the Expert Advice panel.",
    },
  },
  {
    id: "event",
    chip: "04",
    label: "Event page",
    caption: "SME notes sit beside the event.",
    src: `${shot("final-event")}?v=2`,
    width: 1024,
    height: 624,
    image: {
      type: "Hi-fi",
      label: "Event page",
      alt: "Event page with SME notes beside the event.",
    },
  },
  {
    id: "event-edit",
    chip: "05",
    label: "Event page edit",
    caption: "Edits carry a warning that they apply to every event on the KPI.",
    src: `${shot("final-event-edit")}?v=2`,
    width: 1024,
    height: 624,
    image: {
      type: "Hi-fi",
      label: "Event page edit",
      alt: "Event page edit modal warning that the change applies to every event on the KPI.",
    },
  },
];

function scrollToId(id: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };
}

function Placeholder({ image, className }: { image: ImageSlot; className?: string }) {
  return <CaseImage alt={image.alt} type={image.type} label={image.label} className={className} />;
}

function Cards({ items, className }: { items: { label?: string; body: string }[]; className?: string }) {
  return (
    <div className={["alert-impacts", className].filter(Boolean).join(" ")}>
      {items.map((item) => (
        <article key={item.label ?? item.body}>
          {item.label ? <small>{item.label}</small> : null}
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function OptionCards({
  options,
  columns,
}: {
  options: { status: string; selected?: boolean; title: string; body: string }[];
  columns?: 3;
}) {
  return (
    <div className={columns === 3 ? "alert-opts alert-opts-three" : "alert-opts"}>
      {options.map((option) => (
        <article className="alert-opt" key={option.title}>
          <span className={option.selected ? "alert-tag alert-tag-yes" : "alert-tag alert-tag-no"}>
            {option.status}
          </span>
          <h4>{option.title}</h4>
          <p>{option.body}</p>
        </article>
      ))}
    </div>
  );
}

function StepViewer({ steps, label }: { steps: Step[]; label: string }) {
  const [index, setIndex] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const count = steps.length;
  const step = steps[index];
  const shortest = steps.reduce<Step | undefined>((best, item) => {
    if (!item.width || !item.height) return best;
    if (!best?.width || !best.height) return item;
    return item.width / item.height > best.width / best.height ? item : best;
  }, undefined);
  const frameRatio = shortest ? `${shortest.width} / ${shortest.height}` : undefined;

  const show = (next: number) => {
    const i = (next + count) % count;
    if (i === index) return;
    setIndex(i);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tab = tabsRef.current[i];
    tab?.focus({ preventScroll: true });
    tab?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const onTabsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(index - 1);
    }
  };

  return (
    <div className="alert-stepper">
      <div className="alert-tabs" role="tablist" aria-label={label} onKeyDown={onTabsKeyDown}>
        {steps.map((item, i) => (
          <button
            key={item.id}
            ref={(node) => {
              tabsRef.current[i] = node;
            }}
            type="button"
            role="tab"
            id={`advice-tab-${item.id}`}
            className="alert-tab"
            aria-selected={i === index}
            aria-controls={`advice-panel-${item.id}`}
            tabIndex={i === index ? 0 : -1}
            onClick={() => show(i)}
          >
            <i>{item.chip}</i>
            {item.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`advice-panel-${step.id}`}
        aria-labelledby={`advice-tab-${step.id}`}
        className="alert-panel"
      >
        <div className="step-stage">
          {step.src ? (
            <ImageZoom src={step.src} alt={step.image.alt} caption={step.caption}>
              <div className="step-frame" style={frameRatio ? { aspectRatio: frameRatio } : undefined}>
                <img
                  src={step.src}
                  alt={step.image.alt}
                  width={step.width}
                  height={step.height}
                  className="is-on"
                />
              </div>
            </ImageZoom>
          ) : (
            <div className="step-frame">
              <Placeholder image={step.image} />
            </div>
          )}
          <div className="step-captions">
            <p className="step-caption is-on">{step.caption}</p>
          </div>
        </div>
      </div>
      <div className="alert-snav">
        <button type="button" onClick={() => show(index - 1)}>
          ← Prev
        </button>
        <span>
          {index + 1} / {count}
        </span>
        <button type="button" onClick={() => show(index + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
}

export function ExpertAdviceStudy({
  project,
  prev,
  next,
}: {
  project: Project;
  prev: Project;
  next: Project;
}) {
  const sectionKey = TOC.map((item) => item.id).join("|");
  const [activeId, setActiveId] = useState(TOC[0].id);

  useEffect(() => {
    const ids = sectionKey.split("|").filter(Boolean);
    const update = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      const marker = Math.max(140, Math.min(window.innerHeight * 0.28, 240));
      let current = ids[0];

      if (!nearBottom) {
        for (const id of ids) {
          const node = document.getElementById(id);
          if (!node) continue;
          if (node.getBoundingClientRect().top <= marker) current = id;
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

  return (
    <main className="study alert-study advice-study">
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
        <h1>
          Expert Advice <em>Redesign</em>
        </h1>
        <p className="study-outcome">{project.outcome}</p>
        <StudyMeta project={project} />
      </header>

      <div className="shell">
        <figure className="alert-cover">
          <img
            className="alert-cover-light"
            src={`${shot("cover-light")}?v=4`}
            alt="Overview of a KPI in KPI Settings, listing its open events."
            width={2346}
            height={868}
            decoding="async"
          />
          <img
            className="alert-cover-dark"
            src={`${shot("cover-dark")}?v=4`}
            alt=""
            width={2346}
            height={868}
            decoding="async"
          />
        </figure>
      </div>

      <div className="study-split shell">
        <aside className="study-rail">
          <p className="mono rail-label">Sections</p>
          <nav className="study-toc" aria-label="Sections">
            {TOC.map((item) => (
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
          <section id="context" className="study-block">
            <h2>Context</h2>
            <p className="alert-lede">
              This project focused on bringing the existing Expert Advice experience into KPI Management, creating a
              more centralized place for users to manage KPI-related settings. However, KPI Management had been designed
              the previous quarter by another team member, and development was already underway. This meant I had to
              work within an established structure while looking for opportunities to improve the overall user
              experience.
            </p>
            <p>
              Expert Advice consists of IBM-generated guidance for each KPI, along with notes that SMEs can add for
              their teams. The challenge was to integrate these capabilities into the existing experience without
              compromising usability.
            </p>
            <Cards
              items={[
                { label: "The brief", body: "Move the existing Expert Advice experience into KPI Management." },
                {
                  label: "The constraint",
                  body: "KPI Management was already designed around anomaly detection, another KPI feature, with development underway.",
                },
                {
                  label: "The outcome",
                  body: "Improved the existing experience while exploring a better structure for the future.",
                },
              ]}
            />
          </section>

          <section id="original" className="study-block">
            <h2>The original</h2>
            <p className="alert-lede">Useful guidance that people could not find, read, or act on.</p>
            <StepViewer steps={ORIGINAL} label="Original Expert Advice" />
            <Cards
              items={[
                { label: "Hidden", body: "Adding a note meant clicking a table row. Nothing said so." },
                { label: "Hard to read", body: "Long advice in short tooltips, with no visible scroll bar." },
                { label: "Disconnected", body: "One KPI feeds many events, with no path between them." },
              ]}
            />
          </section>

          <section id="better-design" className="study-block">
            <h2>The alternative approach</h2>
            <p className="alert-lede">
              {rich(
                "*A table, then a dedicated detail page.* I believed this would create a clearer, more scalable experience, but it wasn't built.",
              )}
            </p>
            <p>
              Users would first select a KPI from a full-width table, then manage its settings on a dedicated page.
              This separates navigation from configuration, letting users focus on one task at a time.
            </p>
            <StepViewer steps={BETTER} label="The alternative approach" />
            <p className="advice-note">
              Built in Figma Make from existing KPI Management components, so reviews stayed on the workflow.
            </p>
            <h3>Why it wasn't pursued</h3>
            <Cards
              items={[
                { body: "The existing two-column experience was already in development." },
                { body: "A larger redesign would add significant development cost." },
                { body: "There wasn't enough time to validate the alternative with users." },
              ]}
            />
            <div className="alert-takeaway">
              <p className="alert-kicker">What I did</p>
              <p>
                Development was receptive to the direction, but a full rebuild wasn't feasible. I documented the concept
                for future consideration and brought the improvements that fit into the existing design.
              </p>
            </div>
          </section>

          <section id="final-design" className="study-block">
            <h2>The refined design</h2>
            <p className="alert-lede">
              {rich(
                "*Improving the existing two-column experience.* I focused on reducing clutter, improving focus, and making Expert Advice easier to manage without changing the underlying structure.",
              )}
            </p>
            <StepViewer steps={STEPS} label="The refined design" />
            <Cards
              items={[
                {
                  label: "Simpler metadata",
                  body: "Removed redundant and less relevant details, creating a cleaner hierarchy and more room for KPI descriptions.",
                },
                {
                  label: "Room to focus",
                  body: "Added a collapse option to hide the KPI list and give users more space to work with the selected KPI.",
                },
                {
                  label: "Clearer editing",
                  body: "Separated editable SME Notes from read-only IBM Expert Advice, making it clearer what users can actually change.",
                },
              ]}
            />
          </section>

          <section id="moments" className="study-block">
            <h2>Design moments</h2>
            <p className="alert-lede">Two key decisions that shaped the refined design.</p>

            <article className="alert-moment">
              <div className="alert-mhead">
                <span className="alert-mnum">01</span>
                <span className="alert-mtag">Product sense</span>
              </div>
              <h3>How do you present IBM advice and SME Notes in a limited space?</h3>
              <div className="alert-mrow">
                <small>The challenge</small>
                <p>
                  IBM advice is read-only, while SME Notes are editable. Users need to reference one while working with
                  the other, but screen space is limited.
                </p>
              </div>
              <div className="alert-mrow">
                <small>Explored</small>
                <div>
                  <OptionCards
                    options={[
                      {
                        status: "Rejected",
                        title: "Separate tabs",
                        body: "One tab for IBM advice and another for SME Notes. Users would have to switch back and forth, losing sight of the guidance they were referencing.",
                      },
                      {
                        status: "Selected",
                        selected: true,
                        title: "High/Low content switcher",
                        body: "Keep advice and notes together in one view, allowing users to switch between High and Low thresholds without separating related information.",
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="alert-mrow">
                <small>The decision</small>
                <p>
                  Keep both types of guidance accessible in one view, with edits handled in a modal consistent with the
                  rest of the product. The tradeoff is that Low Threshold requires an extra switch, making it slightly
                  less discoverable.
                </p>
              </div>
            </article>

            <article className="alert-moment">
              <div className="alert-mhead">
                <span className="alert-mnum">02</span>
                <span className="alert-mtag">Systems thinking</span>
              </div>
              <h3>How do users manage KPI guidance from an event?</h3>
              <div className="alert-mrow">
                <small>The challenge</small>
                <p>
                  One KPI can be linked to multiple events, so editing its SME notes affects all of them. Yet users
                  often need to update guidance while investigating an event.
                </p>
              </div>
              <div className="alert-mrow">
                <small>Explored</small>
                <div>
                  <OptionCards
                    options={[
                      {
                        status: "Rejected",
                        title: "Navigate to KPI Settings",
                        body: "This was the initial stakeholder direction. While straightforward, it forces users to leave their current investigation to make an update.",
                      },
                      {
                        status: "Selected",
                        selected: true,
                        title: "Edit in place with a clear warning",
                        body: "Allow users to edit SME notes directly from the event page, while making it clear that changes apply to every event associated with that KPI.",
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="alert-mrow">
                <small>The decision</small>
                <p>Keep users in the context of their investigation while making the scope of each change clear.</p>
              </div>
            </article>
          </section>

          <section id="impact" className="study-block">
            <h2>Impact</h2>
            <p className="alert-lede">Making guidance easier to find, manage, and act on.</p>
            <p className="alert-expected">Expected impact, not yet measured</p>
            <Cards
              items={[
                {
                  label: "For SME teams",
                  body: "SME Notes are easier to find and edit, with clearer distinctions between editable notes and read-only advice.",
                },
                {
                  label: "For KPI Settings",
                  body: "Expert Advice and Anomaly Detection now live in one place, creating a more centralized experience and a foundation for future capabilities.",
                },
                {
                  label: "Project status",
                  body: "The redesign is complete, but hasn't been validated with users. Usage data will be needed to measure its impact.",
                },
              ]}
            />
          </section>

          <section id="reflection" className="study-block">
            <h2>Reflection</h2>
            <p className="alert-lede">
              What started as adding a tab became an opportunity to rethink the broader experience.
            </p>
            <p>
              Without access to usage data, I relied on stakeholder conversations, product exploration, and
              collaboration with development to guide my decisions.
            </p>
            <Cards
              items={[
                {
                  label: "Features expose bigger problems",
                  body: "Introducing a new capability can reveal deeper information architecture issues that extend beyond the original scope.",
                },
                {
                  label: "Better UX requires tradeoffs",
                  body: "A better experience isn't always feasible within existing development timelines. Knowing when to adapt is just as important as knowing what to advocate for.",
                },
                {
                  label: "Involve development early",
                  body: "Early collaboration helped me understand technical constraints and explore alternatives before designs were finalized.",
                },
              ]}
            />
            <p className="alert-kicker">Looking ahead</p>
            <p>
              I'd like to validate whether SME Notes are easy to discover and use, and revisit the table-to-detail
              approach with actual user feedback.
            </p>
            <div className="alert-takeaway">
              <p className="alert-kicker">Takeaway</p>
              <p>
                A strong design isn't just about advocating for the best experience. It's about understanding
                constraints, making thoughtful tradeoffs, and finding ways to deliver meaningful improvements.
              </p>
            </div>
          </section>
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
