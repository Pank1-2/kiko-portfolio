import { Viewfinder } from "../components/Viewfinder";

export function About() {
  return (
    <main className="shell about-page">
      <div className="about-media">
        <Viewfinder
          src="/work/hero.jpg"
          alt="Hanok street overlooking the city"
          ratio="tall"
          focus="50% 42%"
        />
      </div>
      <div className="about-copy">
        <div className="about-top">
          <p className="mono about-kicker">About</p>
          <h1>
            I’m curious about <em>people, places,</em> and the things that bring
            them together.
          </h1>
          <p className="sub">
            Product + UX designer in the SF Bay Area. Currently a{" "}
            <em>UX Designer at IBM.</em> I care about understanding the{" "}
            <em>people behind a problem</em>, their context, habits, frustrations,
            and the little things that shape how they experience a product.
          </p>
          <p className="sub">
            When I’m not designing, you’ll probably find me taking photos,
            listening to music, watching a show, trying a new restaurant, or
            planning my next trip. Traveling and experiencing different cultures
            has taught me that people can see and experience the same things in
            completely different ways. It’s made me more <em>curious</em>,{" "}
            <em>open-minded</em>, and <em>intentional</em> about understanding
            perspectives beyond my own.
          </p>
          <div className="tags about-tags">
            <span className="tag mono">Music</span>
            <span className="tag mono">Photography</span>
            <span className="tag mono">Travel</span>
            <span className="tag mono">Food</span>
            <span className="tag mono">Streetwear</span>
            <span className="tag mono">TV</span>
          </div>
        </div>
        <div className="about-actions">
          <a className="btn solid" href="mailto:kiko321pan@gmail.com">
            Email
          </a>
          <a
            className="btn ghost"
            href="https://www.linkedin.com/in/kiko-pan"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </main>
  );
}
