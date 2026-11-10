import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { asset } from "../asset";
import type { Project } from "../data";
import { rich } from "../rich";
import { CaseImage } from "./CaseImage";
import { ImageZoom } from "./ImageZoom";
import { StudyMeta } from "./StudyMeta";

function alertImage(name: string) {
  return asset(`/images/alerting/${name}.png`);
}

type ImageSlot = {
  /** Filename stem in public/images/alerting/. Set `src` when the file is in. */
  key: string;
  src?: string;
  type: string;
  label: string;
  hint?: string;
  alt: string;
};

type Option = {
  status: "Rejected" | "Selected";
  title: string;
  body: string;
  image?: ImageSlot;
};

const TOC = [
  { id: "context", label: "Context" },
  { id: "final-design", label: "Final design" },
  { id: "moments", label: "Design moments" },
  { id: "impact", label: "Impact" },
  { id: "reflection", label: "Reflection" },
];

const STEPS: {
  id: string;
  chip: string;
  label: string;
  caption: string;
  dashed?: boolean;
  image: ImageSlot;
}[] = [
  {
    id: "monitors",
    chip: "00",
    label: "Monitors",
    caption: "Alert management",
    image: {
      key: "config-table",
      src: alertImage("config-table"),
      type: "Hi-fi",
      label: "Alert monitors",
      hint: "The configuration table before creation starts",
      alt: "Alert management table in Concert for Z, listing monitors before a new one is created.",
    },
  },
  {
    id: "details",
    chip: "01",
    label: "Details",
    caption: "Step 1 · Alert info",
    image: {
      key: "step-1-details",
      src: alertImage("step-1-details"),
      type: "Hi-fi · screen 1",
      label: "Details",
      hint: "Alert info",
      alt: "Alert creation, step 1. Details screen for alert info.",
    },
  },
  {
    id: "scope",
    chip: "02",
    label: "Scope",
    caption: "Step 2 · Where it applies",
    image: {
      key: "step-2-scope",
      src: alertImage("step-2-scope"),
      type: "Hi-fi · screen 2",
      label: "Scope",
      hint: "Where it applies",
      alt: "Alert creation, step 2. Scope screen for where the alert applies.",
    },
  },
  {
    id: "kpi",
    chip: "+",
    label: "Select KPI",
    caption: "Only for KPI metric alerts",
    dashed: true,
    image: {
      key: "step-kpi",
      src: alertImage("step-kpi"),
      type: "Hi-fi · KPI only",
      label: "Select KPI",
      hint: "Added step for KPI metric alerts",
      alt: "Select KPI step, shown only for KPI metric alerts.",
    },
  },
  {
    id: "trigger",
    chip: "03",
    label: "Triggers",
    caption: "Step 3 · What triggers the alert",
    image: {
      key: "step-3",
      src: alertImage("step-3"),
      type: "Hi-fi · screen 3",
      label: "Triggers",
      hint: "What triggers the alert",
      alt: "Alert creation, step 3. Triggers: what sets the alert off.",
    },
  },
  {
    id: "destinations",
    chip: "04",
    label: "Destinations",
    caption: "Step 4 · Who gets notified",
    image: {
      key: "step-4-destinations",
      src: alertImage("step-4-destinations"),
      type: "Hi-fi · screen 4",
      label: "Destinations",
      hint: "Recipients at scale",
      alt: "Alert creation, step 4. Destinations and recipients at scale.",
    },
  },
  {
    id: "suppression",
    chip: "05",
    label: "Suppression",
    caption: "Step 5 · Cutting down on noise",
    image: {
      key: "step-5-suppression",
      src: alertImage("step-5-suppression"),
      type: "Hi-fi · screen 5",
      label: "Suppression",
      hint: "Managing noise",
      alt: "Alert creation, step 5. Suppression for managing noise.",
    },
  },
  {
    id: "preview",
    chip: "06",
    label: "Preview",
    caption: "Step 6 · A plain English summary",
    image: {
      key: "step-6-preview",
      src: alertImage("step-6-preview"),
      type: "Hi-fi · screen 6",
      label: "Preview",
      hint: "A plain English summary",
      alt: "Alert creation, step 6. A plain English summary of the alert.",
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

const IMAGE_SIZE: Record<string, [number, number]> = {
  "config-table": [1311, 798],
  "m2-lowfi": [1024, 710],
  "lowfi-fail": [1012, 612],
};

function imageSize(key: string): [number, number] {
  return IMAGE_SIZE[key] ?? [1182, 859];
}

function Shot({ image, size }: { image: ImageSlot; size?: "tall" | "sm" }) {
  const [width, height] = imageSize(image.key);
  return (
    <CaseImage
      src={image.src}
      assetKey={image.key}
      alt={image.alt}
      type={image.type}
      label={image.label}
      hint={image.hint}
      width={width}
      height={height}
      className={size === "tall" ? "case-image-tall" : size === "sm" ? "case-image-sm" : undefined}
    />
  );
}

function OptionCards({ options, single }: { options: Option[]; single?: boolean }) {
  return (
    <div className={single ? "alert-opts alert-opts-one" : "alert-opts"}>
      {options.map((option) => (
        <article className="alert-opt" key={option.title}>
          <span className={option.status === "Selected" ? "alert-tag alert-tag-yes" : "alert-tag alert-tag-no"}>
            {option.status}
          </span>
          <h4>{option.title}</h4>
          <p>{option.body}</p>
          {option.image ? <Shot image={option.image} size="sm" /> : null}
        </article>
      ))}
    </div>
  );
}

function StepViewer() {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const count = STEPS.length;
  const step = STEPS[index];

  const show = (next: number) => {
    const i = (next + count) % count;
    if (i === index) return;
    setPrev(index);
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
      <div className="alert-tabs" role="tablist" aria-label="Creation flow steps" onKeyDown={onTabsKeyDown}>
        {STEPS.map((item, i) => (
          <button
            key={item.id}
            ref={(node) => {
              tabsRef.current[i] = node;
            }}
            type="button"
            role="tab"
            id={`alert-tab-${item.id}`}
            className={item.dashed ? "alert-tab alert-tab-kpi" : "alert-tab"}
            aria-selected={i === index}
            aria-controls={`alert-panel-${item.id}`}
            tabIndex={i === index ? 0 : -1}
            onClick={() => show(i)}
          >
            {item.chip ? <i>{item.chip}</i> : null}
            {item.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`alert-panel-${step.id}`}
        aria-labelledby={`alert-tab-${step.id}`}
        className="alert-panel"
      >
        <div className={step.id === "monitors" ? "step-stage is-plain" : "step-stage"}>
          <ImageZoom src={step.image.src ?? ""} alt={step.image.alt} caption={step.caption}>
            <div className="step-frame">
              {STEPS.map((item, i) => {
                const [width, height] = imageSize(item.image.key);
                return (
                  <img
                    key={item.id}
                    src={item.image.src}
                    alt={i === index ? item.image.alt : ""}
                    width={width}
                    height={height}
                    loading="lazy"
                    decoding="async"
                    className={i === index ? "is-on" : i === prev ? "is-prev" : undefined}
                    aria-hidden={i === index ? undefined : true}
                  />
                );
              })}
            </div>
          </ImageZoom>
          <div className="step-captions">
            {STEPS.map((item, i) => (
              <p
                key={item.id}
                className={i === index ? "step-caption is-on" : "step-caption"}
                aria-hidden={i === index ? undefined : true}
              >
                {item.caption}
              </p>
            ))}
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

export function AlertStudy({
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
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
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

  return (
    <main className="study alert-study">
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

      <div className="shell">
        <figure className="alert-cover">
          <img
            className="alert-cover-light"
            src={alertImage("cover-light")}
            alt="Alert monitors in IBM Concert for Z, with the creation flow open behind the configuration table."
            width={2346}
            height={868}
            decoding="async"
          />
          <img
            className="alert-cover-dark"
            src={alertImage("cover-dark")}
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
              {rich(
                "Concert for Z could detect problems, but users had no way to define *their own rules* for catching them.",
              )}
            </p>
            <p>
              {rich(
                "Without configurable triggers, teams could get flooded with alerts that didn't need any action, which made it hard to tell *real signals from noise*.",
              )}
            </p>
            <p>
              {rich(
                "Alerting was the biggest gap in our effort to bring selected capabilities from IBM Z Operational Log and Data Analytics (zLDA), an older IBM product we are trying to phase out, into Concert for Z (C4Z). The challenge was to bring it over *without carrying the complexity* of the old experience with it.",
              )}
            </p>
            <div className="alert-stats">
              <div className="alert-stat">
                <b>1,000+</b>
                <span>KPIs</span>
              </div>
              <div className="alert-stat">
                <b>100s</b>
                <span>Recipient groups</span>
              </div>
              <div className="alert-stat">
                <b>1,000s</b>
                <span>Resources</span>
              </div>
            </div>
            <p className="alert-cap">The scale every decision had to survive</p>
          </section>

          <section id="final-design" className="study-block">
            <h2>The final design</h2>
            <p className="alert-lede">
              {rich(
                "One guided flow for creating any alert monitor, built on *Carbon* and C4Z's existing patterns so it feels like part of the product.",
              )}
            </p>
            <p>
              {rich(
                "**Only admins** can create and manage monitors. Everyone else gets a separate view of their active alerts.",
              )}
            </p>
            <StepViewer />
          </section>

          <section id="moments" className="study-block">
            <h2>Design moments</h2>
            <p className="alert-lede">
              {rich("Three decisions that show how I work, both *in systems* and in *what's worth building*.")}
            </p>

            <article className="alert-moment">
              <div className="alert-mhead">
                <span className="alert-mnum">01</span>
                <span className="alert-mtag">Product sense</span>
              </div>
              <h3>What deserves to come over from zLDA?</h3>
              <div className="alert-mrow">
                <small>The challenge</small>
                <p>
                  zLDA had years of capability, and I had no direct access to users to tell me which parts mattered
                  most.
                </p>
              </div>
              <div className="alert-mrow">
                <small>How I got there</small>
                <p>
                  I worked with product and engineering stakeholders, read through zLDA's docs with AI, and
                  explored the dev environment myself. Then I mapped zLDA against C4Z to decide what to carry
                  forward and what to simplify.
                </p>
              </div>
              <div className="alert-mrow">
                <small>The decision</small>
                <p>Bring over what operations teams relied on most instead of rebuilding every feature.</p>
              </div>
              <div className="alert-mrow">
                <small>Why</small>
                <p>The point wasn't a copy. It was something teams would actually want to move to.</p>
              </div>
            </article>

            <article className="alert-moment">
              <div className="alert-mhead">
                <span className="alert-mnum">02</span>
                <span className="alert-mtag">Systems thinking</span>
              </div>
              <h3>Five alert types, one flow. What do you do when one doesn't fit?</h3>
              <div className="alert-mrow">
                <small>The challenge</small>
                <p>
                  All five alert types follow the same steps. What really sets them apart is how they're scoped. Log
                  message alerts only reach Sysplex and LPAR because of SYSLOG ingestion limits, and KPI metric
                  alerts didn't scope the way the other four did, which I found just before delivery.
                </p>
              </div>
              <div className="alert-mrow">
                <small>Explored</small>
                <OptionCards
                  options={[
                    {
                      status: "Rejected",
                      title: "Combine KPI selection and conditions in one step",
                      body: "No new step needed, so it was the fastest route. KPI selection and the condition builder shared the Triggers step as two accordions, but the long KPI list pushed the builder out of view.",
                      image: {
                        key: "m2-lowfi",
                        src: alertImage("m2-lowfi"),
                        type: "Low-fi",
                        label: "KPI selection and conditions",
                        alt: "Low fi of KPI selection and the condition builder sharing the Triggers step.",
                      },
                    },
                    {
                      status: "Selected",
                      title: "Give KPI selection its own step",
                      body: "One extra step between Scope and Triggers, for KPI metric alerts only. Triggers stays focused on building the condition.",
                      image: {
                        key: "step-kpi",
                        src: alertImage("step-kpi"),
                        type: "Hi-fi crop",
                        label: "Select KPI",
                        alt: "Select KPI step, shown only for KPI metric alerts.",
                      },
                    },
                  ]}
                />
              </div>
              <div className="alert-mrow">
                <small>The decision</small>
                <p>
                  Keep one flow and one Scope layout for all five categories, and let only the content change. KPI
                  metric alerts get the extra Select KPI step.
                </p>
              </div>
              <div className="alert-mrow">
                <small>Why</small>
                <p>
                  Admins learn a single flow, and the one category that scopes differently gets a step built for it,
                  with nothing changed for the other four.
                </p>
              </div>
            </article>

            <article className="alert-moment">
              <div className="alert-mhead">
                <span className="alert-mnum">03</span>
                <span className="alert-mtag">Product sense</span>
              </div>
              <h3>How do you pick from thousands of resources and hundreds of groups?</h3>
              <div className="alert-mrow">
                <small>The challenge</small>
                <p>Patterns that work for twenty items fall apart at this scale, and I wanted to stay inside Carbon.</p>
              </div>
              <div className="alert-mrow">
                <small>Choosing the scope</small>
                <OptionCards
                  options={[
                    {
                      status: "Rejected",
                      title: "ComboBox",
                      body: "Three stacked dropdowns for domain, resource type, and source data, with every pick collapsed into a tag. It got hard to see or browse what was in scope once the lists reached the thousands.",
                      image: {
                        key: "lowfi-fail",
                        src: alertImage("lowfi-fail"),
                        type: "Low-fi",
                        label: "Define scope",
                        alt: "Earlier define scope screen, with dropdowns for domain, resource type, and source data.",
                      },
                    },
                    {
                      status: "Selected",
                      title: "Side by side drill down",
                      body: "Domain, resource type, and resources sit in three columns, each with its own search, counts, and paging, so admins can browse down to what they need and see what's in scope.",
                      image: {
                        key: "step-2-scope",
                        src: alertImage("step-2-scope"),
                        type: "Hi-fi",
                        label: "Scope",
                        alt: "Alert creation, step 2. Scope screen for where the alert applies.",
                      },
                    },
                  ]}
                />
              </div>
              <div className="alert-mrow">
                <small>Recipients</small>
                <OptionCards
                  single
                  options={[
                    {
                      status: "Selected",
                      title: "Side by side lists with a summary",
                      body: "Destination types, recipient groups, and individual recipients sit next to each other, with checkboxes, partial selection states, search, and a summary panel that always shows what's been picked.",
                      image: {
                        key: "m4-recipients",
                        src: alertImage("step-4-destinations"),
                        type: "Hi-fi crop",
                        label: "Recipient selection",
                        alt: "Destination step with recipient groups, individuals, search, and a running summary.",
                      },
                    },
                  ]}
                />
              </div>
              <div className="alert-mrow">
                <small>Why</small>
                <p>
                  Search, grouping, and a running summary keep admins oriented as lists grow. Scope and destinations
                  use the same layout, so admins only have to learn it once.
                </p>
              </div>
            </article>
          </section>

          <section id="impact" className="study-block">
            <h2>Impact</h2>
            <p className="alert-lede">
              {rich(
                "Detecting problems is only half of monitoring. This work is about the other half: *deciding which ones deserve attention*.",
              )}
            </p>
            <p className="alert-expected">Expected impact, not yet measured</p>
            <div className="alert-impacts">
              <article>
                <small>For admins</small>
                <p>
                  Admins decide which signals matter and where notifications go, which should mean fewer alerts that
                  need no action.
                </p>
              </article>
              <article>
                <small>For the zLDA migration</small>
                <p>
                  Teams will be able to set up the alerts they relied on in zLDA directly in C4Z, which is a step
                  toward phasing zLDA out.
                </p>
              </article>
              <article className="alert-impact-stand">
                <small>Where it stands</small>
                <p>
                  Still in development. I'm lining up users for testing and validation, so I don't have results to
                  share yet.
                </p>
              </article>
            </div>
          </section>

          <section id="reflection" className="study-block">
            <h2>Reflection</h2>
            <p>
              I didn't have a direct line to users, so engineers, stakeholders, and the dev environment became my
              research. It pushed me to design around what the system could really support, not just what looked
              clean.
            </p>
            <p>
              {rich(
                "The KPI surprise is what I'd do differently. A shared flow is only as strong as the model underneath it, and I found the exception right before delivery. Now I map how every category is scoped with engineering *before* I draw any screens.",
              )}
            </p>
            <p>
              It was also the first complex problem I fully owned at a company this size, and it taught me to build
              momentum without waiting for it.
            </p>
            <div className="alert-takeaway">
              <p className="alert-kicker">Takeaway</p>
              <p>
                Systems first, screens second. The most useful work here wasn't any one screen. It was deciding what
                the system should be, and what it shouldn't carry over.
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
