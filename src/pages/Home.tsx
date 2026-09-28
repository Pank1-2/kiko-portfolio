import { useEffect, useLayoutEffect, useState } from "react";
import { playCoverOpen, shouldPlayCover, startCover } from "../cover";
import { FrameCard } from "../components/FrameCard";
import { IbmMark } from "../components/IbmMark";
import { PhotoIntro } from "../components/PhotoIntro";
import { Viewfinder } from "../components/Viewfinder";
import { experience, projects } from "../data";

function Hero() {
  return (
    <section className="hero hero-recruiter shell" id="portfolio-start">
      <div className="hero-split">
        <div>
          <p className="hero-chip mono">
            <span className="hero-chip-dot" aria-hidden="true" />
            Hi, I’m Kiko
          </p>
          <h1 className="lede">
            I turn messy problems into <em>clear products</em>.
          </h1>
          <p className="sub hero-sub">
            Research, interaction, and prototyping are the tools I use to make
            sense of complex workflows. I’m especially interested in emerging
            technology and finding the small moments where better design can
            make something feel dramatically simpler.
          </p>
          <p className="now-line">
            Currently designing enterprise products at <IbmMark />, simplifying
            complex workflows and exploring how AI can change the way we design.
          </p>
        </div>
        <div className="hero-portrait">
          <Viewfinder
            src="/work/hero.jpg"
            alt="Hanok street overlooking the city"
            ratio="tall"
            focus="50% 42%"
          />
        </div>
      </div>
    </section>
  );
}

export function Home() {
  const [showCover, setShowCover] = useState(() => shouldPlayCover());

  useEffect(() => {
    const hide = () => setShowCover(false);
    window.addEventListener("cover-consumed", hide);
    return () => window.removeEventListener("cover-consumed", hide);
  }, []);

  useLayoutEffect(() => {
    if (!showCover) {
      document.documentElement.classList.remove("peeling");
      return;
    }
    startCover();
  }, [showCover]);

  return (
    <main>
      {showCover ? (
        <section className="peel-scene" id="photo-intro">
          <PhotoIntro onSkip={() => playCoverOpen()} />
        </section>
      ) : null}
      <Hero />

      <section className="band band-work" id="case-studies">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="mono section-index">01</p>
              <h2>Case studies</h2>
            </div>
          </div>
          <div className="sheet">
            {projects.map((project) => (
              <FrameCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="band band-exp">
        <div className="shell">
          <div className="section-head band-exp-head">
            <p className="mono section-index">02</p>
            <div className="band-exp-title">
              <h2>Experience</h2>
            </div>
          </div>
          <div className="experience experience-timeline">
            {experience.map((job) => (
              <article className="job job-timeline" key={job.org} data-reveal>
                <div className="job-logo">
                  <img src={job.logo} alt="" />
                </div>
                <div className="job-body">
                  <div className="job-head">
                    <h3 className="job-role">{job.title}</h3>
                    <p className="mono job-meta">{job.dates}</p>
                  </div>
                  <p className="job-company">
                    {job.org} · {job.place}
                  </p>
                  <p className="job-note">{job.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
