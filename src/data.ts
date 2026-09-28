import { asset } from "./asset";
export type Finding = { title: string; text: string };
export type Step = { n: string; title: string; text: string };
export type Thought = { question: string; decision: string; why: string };
export type JourneyStep = { label: string; note?: string };
export type Competitor = { name: string; pros: string; cons: string };

export type Shot = {
  src: string;
  caption?: string;
  alt?: string;
  /** flat = paper mat for artifacts, photo = bare photo, laptop/screen = on the project stage */
  frame?: "flat" | "photo" | "laptop" | "screen";
  wide?: boolean;
  crop?: boolean;
  compact?: boolean;
  /** Centered and narrower than the text column. */
  narrow?: boolean;
  /** Media-box shape for shots that share a row. Defaults to landscape. */
  ratio?: "square" | "tall";
};

export type StudySection = {
  id: string;
  heading: string;
  body?: string[];
  /** Body paragraphs rendered after an earlier shots block */
  bodyAfter?: string[];
  list?: string[];
  listTitle?: string;
  quote?: string;
  findings?: Finding[];
  /** Optional lead-in above findings cards */
  findingsTitle?: string;
  steps?: Step[];
  competitors?: Competitor[];
  shots?: Shot[];
  /** Second shots group, for text → images → text → images flows */
  shotsAfter?: Shot[];
  image?: string;
  caption?: string;
  /** Overrides the default order that blocks render in. */
  flow?: BlockKey[];
};

export type BlockKey =
  | "quote"
  | "body"
  | "bodyAfter"
  | "list"
  | "findings"
  | "steps"
  | "competitors"
  | "shots"
  | "shotsAfter"
  | "image";

export type Project = {
  slug: string;
  frame: string;
  title: string;
  category: string;
  outcome: string;
  summary: string;
  image: string;
  tags: string[];
  roleHeadline: string;
  roleDetail?: string;
  teamHeadline: string;
  teamDetail?: string;
  timeline: string;
  timelineDetail?: string;
  tools: string;
  device: "laptop" | "plain";
  stage: "navy" | "sage" | "purple" | "violet";
  overview: string[];
  thoughts?: Thought[];
  journey?: { beforeTitle: string; afterTitle: string; before: JourneyStep[]; after: JourneyStep[] };
  sections: StudySection[];
  /** Listed in case studies but not linkable yet */
  comingSoon?: boolean;
};

export const skills = [
  {
    title: "Research that changes the brief",
    text: "Fieldwork, interviews, and audits — then I cut the product to what people actually needed.",
  },
  {
    title: "Interaction in context",
    text: "Extensions, kiosks, and sites that belong on the surface they live on — not a mock pasted in.",
  },
  {
    title: "Inclusive, readable UX",
    text: "Clear hierarchy, contrast, and CTAs so more people can finish the task.",
  },
  {
    title: "Design next to engineering",
    text: "I lead with feasibility. Ambition stays, but the weekly cut is honest.",
  },
];

export const projects: Project[] = [
  {
    slug: "alert-monitor",
    frame: "01",
    title: "Alert Monitor Creation",
    category: "IBM Concert for Z · Enterprise software",
    outcome:
      "Bringing an existing alerting experience into Concert for Z, navigating complex mainframe architecture to determine what belonged in the new product.",
    summary:
      "Bringing an existing alerting experience into Concert for Z.",
    image: asset("/work/ibm-concert.svg"),
    tags: ["Product design", "Complex systems", "Design system"],
    roleHeadline: "UX Designer",
    teamHeadline: "IBM",
    timeline: "Ongoing",
    tools: "Figma",
    device: "laptop",
    stage: "navy",
    comingSoon: true,
    overview: [],
    sections: [],
  },
  {
    slug: "memory-box",
    frame: "02",
    title: "Memory Box",
    category: "Chrome extension",
    outcome:
      "Bringing AI memory into the workflow with an in-context experience that surfaces relevant past conversations without leaving the LLM.",
    summary:
      "Chrome extension that automatically captures and organizes your conversations across all AI platforms.",
    image: asset("/work/memory-box.png"),
    tags: ["Product design", "AI", "LLM", "0 → 1"],
    roleHeadline: "UI/UX Team Lead",
    teamHeadline: "3 members",
    timeline: "3 weeks",
    tools: "Figma / FigJam, HTML, React",
    device: "laptop",
    stage: "violet",
    overview: [
      "Memory Box is a Chrome extension that captures and organizes conversations across AI platforms. *Retrieval* was the unsolved half — users could store memories, but not get them back into a *live chat* without breaking flow.",
      "**My contribution:** Owned the *Context Sync Toggle* end to end — problem framing, competitive research, and the *placement decision* that shipped. Ran weekly critique and translated engineering constraints into design decisions the team could act on.",
    ],
    sections: [
      {
        id: "problem",
        heading: "Problem",
        body: [
          "Memory Box solved capture. It didn't solve *retrieval*.",
        ],
        list: [
          "Getting a saved conversation into an active chat meant leaving the chat, opening the extension, *manually syncing* it in",
          "Cost scaled with usage — the more someone used Memory Box, the *slower retrieval* got",
          "Root cause wasn't a missing feature. It was *location*: relevant memory existed, just never where people needed it",
        ],
      },
      {
        id: "objective",
        heading: "Objective",
        body: [
          "Surface memory inside the LLM — without trading manual friction for a different kind of friction. Memory Box had to feel *seamlessly embedded* within any LLM interface.",
        ],
        list: [
          "*Full auto-sync* → fast, but removes control. Risks user distrust of what's being pulled in",
          "*Fully manual selection* → keeps control, but just relocates the same click-to-retrieve problem",
          "**My call:** ship both modes behind *one toggle*, rather than pick a side. Let the person decide which trade-off they want, and make switching cheap",
        ],
      },
      {
        id: "research",
        heading: "Research",
        body: [
          "**Research topic:** *Investigate how existing Chrome extensions integrate their features directly within LLM interfaces, focusing on UI placement, interaction patterns, and how these tools maintain a seamless, unobtrusive workflow.*",
          "Every failure traced back to the same thing: *state legibility*, not visual polish. That became the one non-negotiable constraint I carried into design — whatever we shipped had to make its own state obvious without a second look.",
        ],
        competitors: [
          {
            name: "Grammarly",
            pros: "Fluid, unobtrusive in-chat integration with clear contrast and helpful hover interactions.",
            cons: "Small size, tight spacing, and persistent popups make it easy to overlook and occasionally disrupt the workflow.",
          },
          {
            name: "iForgot",
            pros: "Simple, easy-to-spot toggle that sits directly in LLM chat interfaces and uses strong color contrast to make its presence clear.",
            cons: "Inconsistent UI across LLMs, unclear off-state behavior, and a low-contrast off appearance that hides whether the feature is active.",
          },
          {
            name: "Wordtune",
            pros: "Non-intrusive side panel that appears only when needed, with clear onboarding, strong contrast, and control over visibility.",
            cons: "Subtle presence makes the feature easy to forget, especially for infrequent users.",
          },
          {
            name: "AskWeave",
            pros: "Intuitive and purposeful — appears when triggered by typing, with a pop-up that blends naturally into the LLM's dark interface.",
            cons: "Small, low-contrast placement, misaligned with other UI elements, and easy to overlook despite useful functionality.",
          },
        ],
      },
      {
        id: "process",
        heading: "Process",
        flow: ["body", "shots", "list"],
        body: [
          "**First pass** — anchored inside the chat box, tied to the model switcher. My initial call. It failed for a reason I hadn't accounted for: it *inherited each platform's own layout*, so every new LLM meant re-solving placement from scratch. Not a design failure — a *dependency* I'd missed.",
          "**Second pass** — fixed position, independent of host layout, draggable. I reversed the decision once engineering flagged the maintenance cost. Decoupling the toggle from any host layout also fixed the trust problem from research — it kept its own *consistent state* regardless of what platform it sat on.",
        ],
        listTitle: "Essential elements of our design",
        list: [
          "**On/off toggle**",
          "Option to **manually sync** identified top-k memories",
          "*Auto* top-k selection with adjustable controls",
          "Lightweight **pop-up panel** showing memory previews",
        ],
        shots: [
          {
            src: asset("/work/memory-box/lofi-inline.png"),
            frame: "flat",
            caption: "**First pass** — panel anchored *inside* the chat box, tied to the model switcher",
          },
          {
            src: asset("/work/memory-box/lofi-corner.png"),
            frame: "flat",
            caption: "**Second pass** — fixed position, independent of host layout, *draggable*",
          },
        ],
      },
      {
        id: "solution",
        heading: "Solution",
        body: [
          "After feedback from engineers and the PM we refined the dashboard and **moved the toggle** to make the experience more seamless and less intrusive. It started inside the LLM chat box; we moved it to the *bottom-right corner* so it stays consistent across platforms. We also made it **draggable**, so people control where it lives on their screen.",
        ],
        image: asset("/work/memory-box.png"),
        caption: "Context Sync on ChatGPT — draggable control in the bottom-right",
      },
      {
        id: "reflection",
        heading: "Reflection",
        body: [
          "This was my **first experience truly managing a design team** and seeing the product come to life. Early on it was hard to identify each person's strengths and decide which tasks to assign. Over time I learned to use everyone's skills, set deadlines, and *communicate clearly* across teams.",
          "I also learned more about assessing **technical feasibility** — balancing ambitious design ideas against what could realistically be implemented, considering both user needs and engineering constraints.",
          "Leading a team gave me insights on *sequencing*. I had to figure out which decisions had to be locked before engineering could move, and which could stay open. The *placement pivot* was the clearest lesson: what looked like a visual tweak was actually a *platform-independence* requirement we'd missed at the start.",
          "As I keep working with this startup, I look forward to sharpening these skills on new design challenges.",
        ],
      },
    ],
  },
  {
    slug: "bloom-studio",
    frame: "03",
    title: "Bloom Studio Kiosk",
    category: "Physical kiosk · Interaction design",
    outcome:
      "Reimagining the grocery-store flower shopping experience with a kiosk that helps customers build, visualize, and personalize bouquets.",
    summary:
      "Grocery store kiosk for easy flower bouquet customization and visualization.",
    image: asset("/work/bloom.png"),
    tags: ["Interaction design", "Research", "Physical + digital", "Prototyping"],
    roleHeadline: "UI/UX Designer + Researcher",
    teamHeadline: "4 members",
    timeline: "8 weeks",
    tools: "Figma / FigJam, Laser Cutter, InkScape",
    device: "laptop",
    stage: "sage",
    overview: [
      "Bloom Studio is a **self-service kiosk** that lets grocery shoppers *build and preview custom bouquets* against the store's live inventory — closing the gap between deciding what to buy and being able to see it before committing.",
    ],
    sections: [
      {
        id: "problem",
        heading: "Problem",
        body: [
          "Grocery flowers win on **price and convenience**. They lose the moment a customer has to *guess*.",
        ],
        list: [
          "Customers spent **30 seconds to 10 minutes** deciding, with no way to preview how flowers would look together",
          "Many didn't know how to *combine flowers* or care for them once home",
          "**Younger shoppers** took the longest — and were least likely to ask staff for help",
          "No **self-service** option existed to close that gap at the point of decision",
        ],
        shots: [
          {
            src: asset("/work/bloom/fieldwork.jpg"),
            frame: "photo",
            compact: true,
            caption:
              "Field observation: Valentine's rush — shoppers walking past the floral case with no way to preview a mix",
          },
        ],
      },
      {
        id: "objective",
        heading: "Objective",
        body: [
          "Reduce **decision fatigue** without stripping out choice — the two work against each other.",
        ],
        list: [
          "**Fewer options** → faster, but doesn't solve the actual problem: not knowing what pairs with what",
          "**More options** → solves that, but risks recreating the same overwhelm we set out to fix",
          "**Our answer:** *real-time visual previews* plus smart filtering — confidence through seeing, not guessing",
        ],
      },
      {
        id: "research",
        heading: "Research",
        flow: ["body", "shots", "findings"],
        body: [
          "I led the fieldwork: **guerrilla interviews** at Whole Foods, Ralphs, and Trader Joe's, **five structured interviews** on shopping habits, and a competitive scan against Tesla's configurator, 24-hour florists, and existing floral e-kiosks.",
          "The competitive scan surfaced the real gap: every option on the market was either *fully custom* or *fully fixed*. Nothing sat in between.",
          "To see who actually lived in that gap, I built **two personas** from our interviews and drew up a *storyboard*.",
        ],
        shots: [
          {
            src: asset("/work/bloom/persona-sophia.jpg"),
            frame: "flat",
            caption: "Persona — *Sophia,* weekly self-buyer matching her aesthetic",
          },
          {
            src: asset("/work/bloom/persona-alex.jpg"),
            frame: "flat",
            caption: "Persona — *Alex,* budget gifting with no floral knowledge",
          },
          {
            src: asset("/work/bloom/storyboard.jpg"),
            frame: "flat",
            narrow: true,
            caption:
              "Storyboard — building a Mother's Day bouquet at the kiosk with no staff available",
          },
        ],
        findingsTitle:
          "Across the interviews and this fieldwork, **four patterns** stood out:",
        findings: [
          {
            title: "3 of 5 wanted to build",
            text: "**3 of 5** interviewees wanted to build their own bouquet — and *visual tools* made them noticeably more confident in their picks.",
          },
          {
            title: "Freshness drove the buy",
            text: "*Freshness and appearance* drove the purchase decision more than anything else.",
          },
          {
            title: "Filters save time",
            text: "Filtering for **pet-friendly** or **in-stock** flowers was called out unprompted as a major time-saver.",
          },
          {
            title: "Protect grocery's edge",
            text: "Grocery's advantage was **convenience and price** — any solution had to protect both, not trade them away for customization.",
          },
        ],
      },
      {
        id: "process",
        heading: "Process",
        body: [
          "To transform our insights into a functional and aesthetically pleasing kiosk we followed a **user-centered design process**: defining the visual direction, establishing a consistent style, and creating wireframes that mapped out key user flows. Each step kept the kiosk *beautiful* and *intuitive* at the same time.",
        ],
        shots: [
          {
            src: asset("/work/bloom/user-flow.png"),
            frame: "flat",
            caption: "User flow — onboarding into **shop** and **visualization**, with search, filter, and pet-friendly branches",
          },
          {
            src: asset("/work/bloom/moodboard.jpg"),
            frame: "flat",
            caption: "Mood board — florist carts, editorial florals, and soft botanical texture",
          },
          {
            src: asset("/work/bloom/style-guide.jpg"),
            frame: "flat",
            caption: "Style guide — *Lato* for headings, *Open Sans* for text, and a botanical palette",
          },
          {
            src: asset("/work/bloom/lofi-empty.png"),
            frame: "flat",
            narrow: true,
            caption: "Lo-fi — inventory grid with the preview area still empty",
          },
          {
            src: asset("/work/bloom/lofi-selected.png"),
            frame: "flat",
            narrow: true,
            caption: "Lo-fi — a stem added to the tray, preview filling the right side",
          },
        ],
      },
      {
        id: "solution",
        heading: "Solution",
        flow: ["body", "list", "image", "shots"],
        body: [
          "We designed a **high-fidelity prototype** of Bloom Studio — a self-service flower kiosk that makes bouquet customization easy, visual, and enjoyable.",
          "The kiosk displays the store's **full flower inventory**, letting users *mix and match* to visualize their custom bouquet. Each flower carries fun facts and pairing recommendations, prices are shown per stem, and once users finish they can **print a receipt** of their selection and use it to locate the flowers in the store's floral section.",
        ],
        listTitle: "Key features",
        list: [
          "**Real-time** bouquet previews against live inventory",
          "Filters for *color, occasion,* and *price*",
          "Pairing suggestions and **per-stem pricing** surfaced at the point of choice, not after",
          "Printed receipt doubling as a **pick list** for the floral section",
        ],
        image: asset("/work/bloom.png"),
        caption: "Inventory grid, live preview, and a tray of chosen stems",
        shots: [
          {
            src: asset("/work/bloom/hifi-welcome.png"),
            frame: "flat",
            caption: "Welcome — one question, one **Start**",
          },
          {
            src: asset("/work/bloom/hifi-shop.jpg"),
            frame: "flat",
            caption: "Shop — live inventory with occasion, sale, and new-arrival filters",
          },
          {
            src: asset("/work/bloom/hifi-detail.jpg"),
            frame: "flat",
            narrow: true,
            caption: "Flower detail — price, *pet-friendly* tag, care notes, and pairing suggestions beside the live preview",
          },
        ],
      },
      {
        id: "kiosk",
        heading: "Physical kiosk",
        body: [
          "Using **InkScape** we laser-cut wood to construct a physical prototype of the kiosk. After several iterations and refinements, here's the final result.",
          "If you're curious about the process behind building the physical kiosk, *feel free to reach out* — I'd be happy to chat.",
        ],
        shots: [
          {
            src: asset("/work/bloom/kiosk-front.jpg"),
            frame: "photo",
            caption: "The built kiosk running the welcome screen",
          },
          {
            src: asset("/work/bloom/kiosk-angle.jpg"),
            frame: "photo",
            caption: "Three-quarter view — signage, floral crown, and the receipt slot",
          },
        ],
      },
      {
        id: "reflection",
        heading: "Reflection",
        body: [
          "On this project I ran both in-person and **guerrilla interviews**, which gave me hands-on experience with field research and direct user engagement. It helped me understand real customer pain points and shaped our design decisions in a very *grounded* way.",
          "The work taught me to balance **aesthetics with usability** — especially for self-service tools, where design has to guide users clearly. Small details like *button size* and *interactive feedback* significantly changed the experience.",
          "The hardest constraint was balancing **customization and simplicity**: enough options to empower users without causing information overload. It reinforced a core UX lesson — *sometimes less is more*.",
          "This project showcased the power of **multidisciplinary teamwork**, blending digital design with real-world fabrication. It became my favorite project because I got to watch an idea evolve from nothing into a fully interactive experience.",
        ],
      },
    ],
  },
  {
    slug: "art-of-learning",
    frame: "04",
    title: "Project Art of Learning",
    category: "Nonprofit · Web experience",
    outcome:
      "Redesigning a nonprofit website to make resources easier to find, navigate, and access for underserved students and volunteers.",
    summary:
      "Website redesign to enhance access and reach for underserved students.",
    image: asset("/work/paol-cover.jpg"),
    tags: ["User research", "Web design", "Stakeholder collaboration"],
    roleHeadline: "UI/UX Design Lead + Researcher",
    teamHeadline: "5 members",
    timeline: "5 months",
    tools: "Figma / FigJam",
    device: "laptop",
    stage: "purple",
    overview: [
      "I led a **5-person team**, through *Design for America at UC San Diego*, redesigning the website for **Project Art of Learning** — a student-run nonprofit providing *free online tutoring* to K–12 students from low-income, immigrant, and refugee communities.",
      "Going in, the ask sounded like a visual refresh. It wasn't. The site's real problem was **structural**: it asked visitors to piece together the organization's mission from *six competing nav items* and no clear next step. Fixing that required rebuilding the **information architecture** before anything got redesigned visually — which became the throughline for how I ran the project.",
    ],
    sections: [
      {
        id: "problem",
        heading: "Problem",
        flow: ["body", "list", "shots", "bodyAfter"],
        body: [
          "The site lacked clarity, intuitive navigation, and key content — but naming that wasn't enough to act on. What made it concrete:",
        ],
        list: [
          "**Six top-level nav labels**, three competing homepage buttons, and no single path to apply, tutor, or donate",
          "The **mission statement** itself sat below the fold, behind unstructured copy",
          "Both apply paths — for students and for tutors — were buried under generic labels like *Puerto Rican Branch* and *Additional Resources*",
        ],
        shots: [
          {
            src: asset("/work/paol/before-site.jpg"),
            frame: "flat",
            crop: true,
            caption:
              "Original homepage — six top-level labels, three competing buttons, and the mission pushed below the fold",
          },
        ],
        bodyAfter: [
          "The pattern across all three: nothing on the site was wrong in isolation, but nothing was prioritized either. Every piece of content competed for the same amount of attention, which meant none of it won.",
        ],
      },
      {
        id: "objective",
        heading: "Objective",
        body: [
          "I set the redesign against two goals that could easily undercut each other: make the site look **credible enough to trust**, without losing the *grassroots identity* that made it feel like it was actually run by the students and tutors behind it. Over-polish and it reads corporate; under-design it and it reads unfinished — either way, trust erodes.",
        ],
        listTitle: "Concretely, that meant",
        list: [
          "Redesigning existing pages for clearer navigation and stronger visual hierarchy",
          "Adding a *Roles & Responsibilities* page and an interactive global impact map — features the nonprofit had never had a way to show before",
          "Rebuilding the **information architecture** so content discoverability didn't depend on already knowing what you were looking for",
        ],
      },
      {
        id: "research",
        heading: "Research",
        flow: ["body", "shots", "bodyAfter", "shotsAfter"],
        body: [
          "**Research question:** *How might we make the site more engaging and accessible while communicating the mission clearly?*",
          "A website audit turned up six recurring issues. Affinity mapping with interview notes collapsed them into two root causes — **confusing navigation** and **information overload** — one structural problem, not six separate fixes.",
        ],
        shots: [
          {
            src: asset("/work/paol/affinity-map.jpg"),
            frame: "flat",
            caption:
              "Affinity map — clustered into **complex navigation** and **insufficient content**",
          },
        ],
        bodyAfter: [
          "A competitive scan of four comparable nonprofits showed the gap wasn't visual polish — most already had that — it was *tutor visibility*. Personas for *Emma* (16) and *Rachel* (18) kept both major journeys in view so the homepage wouldn't get optimized for students alone.",
        ],
        shotsAfter: [
          {
            src: asset("/work/paol/competitors.jpg"),
            frame: "flat",
            caption:
              "Competitive analysis — UX, responsiveness, identity, and tutor profiles across four nonprofits",
          },
          {
            src: asset("/work/paol/swot.jpg"),
            frame: "flat",
            caption:
              "SWOT — visual appeal a strength; *mobile compatibility* and sparse tutor info the risks",
          },
          {
            src: asset("/work/paol/persona-emma.jpg"),
            frame: "flat",
            caption: "Persona — *Emma, 16*",
          },
          {
            src: asset("/work/paol/persona-rachel.jpg"),
            frame: "flat",
            caption: "Persona — *Rachel, 18*",
          },
        ],
      },
      {
        id: "process",
        heading: "Process",
        flow: ["body", "shots", "bodyAfter", "shotsAfter"],
        body: [
          "The **IA was the actual redesign**; the visual system that followed was secondary.",
          "**Before:** six top-level labels, with the two highest-value actions on the entire site — *apply as a student, apply as a tutor* — buried under regional and miscellaneous labels no first-time visitor would think to check.",
          "**My call:** collapse six sections to five, and pull both apply actions into one new top-level section, *Get Involved*. That single change did more for the site's usability than any visual decision that came after it.",
        ],
        shots: [
          {
            src: asset("/work/paol/ia-before.png"),
            frame: "flat",
            caption:
              "**Before** — six top-level labels, key actions buried under *Puerto Rican Branch* and *Additional Resources*",
          },
          {
            src: asset("/work/paol/ia-after.png"),
            frame: "flat",
            caption:
              "**After** — five sections, *Apply as a Student* and *Apply as a Tutor* promoted into **Get Involved**",
          },
        ],
        bodyAfter: [
          "I deliberately sequenced **lo-fi before any visual work**, and brought wireframes back to stakeholders before locking structure — not as a courtesy step, but because the org knew things about their own users and mission that our research couldn't fully capture. Only once that structural foundation held did the team move into Figma for typography, color, and imagery.",
        ],
        shotsAfter: [
          {
            src: asset("/work/paol/lofi-home.png"),
            narrow: true,
            frame: "flat",
            crop: true,
            caption: "Lo-fi wireframe of the main landing page",
          },
        ],
      },
      {
        id: "solution",
        heading: "Solution",
        flow: ["body", "shots"],
        body: [
          "The homepage went from **three competing CTAs to one**, with the mission stated immediately instead of buried — a direct fix for the specific failure identified in Problem, not a general visual refresh.",
          "Navigation now reflects the five-section IA from Process rather than the original six. The two new pages — *Roles & Responsibilities* and an interactive global impact map — exist because research showed the org had no way to make its impact or its tutor relationships visible; they weren't a \"nice to have\" layered on top.",
          "**Accessibility** (contrast, font sizing, inclusive imagery) was treated as part of the credibility fix, not a QA pass at the end — a site serving families who may already be wary of institutions can't afford to also be hard to read.",
        ],
        shots: [
          {
            src: asset("/work/paol/before-site.jpg"),
            frame: "flat",
            crop: true,
            caption: "**Before** — mission buried, three competing buttons",
          },
          {
            src: asset("/work/paol/after-home.jpg"),
            frame: "flat",
            crop: true,
            caption: "**After** — mission stated first, one primary action, real students",
          },
        ],
      },
      {
        id: "reflection",
        heading: "Reflection",
        body: [
          "The harder skill on this project wasn't research or design — it was **sequencing** five students' conflicting schedules so structural decisions locked before visual work started, and not the other way around. Once IA was settled, everything downstream moved faster; the one time we let stakeholder feedback come in after visual design had started, we ended up redoing work.",
          "The project's real limitation: it stops at high-fidelity Figma files. I have no data on whether the redesign actually closed the credibility gap it was built to solve. If I continued, I'd prioritize *shipping the redesign and instrumenting analytics* over any further design iteration — right now the project proves the design decisions were reasoned, but not that they worked.",
        ],
      },
    ],
  },
];

export const experience = [
  {
    dates: "Feb 2026 — Present",
    title: "UX Designer",
    org: "IBM",
    place: "San Jose, CA",
    note: "End-to-end product design for IBM Concert for Z, using AI to prototype, explore, and iterate faster.",
    logo: asset("/logos/ibm.png"),
  },
  {
    dates: "Oct 2025 — Jan 2026",
    title: "UI/UX Team Lead",
    org: "Memory Box",
    place: "Remote",
    note: "Led a 3-person design team building an AI browser extension for managing conversations across chat platforms.",
    logo: asset("/logos/hawl.png"),
  },
  {
    dates: "Sep 2025 — Nov 2025",
    title: "UX Designer",
    org: "Lillup",
    place: "Remote",
    note: "Product design across research, flows, and interfaces in a fast-moving startup.",
    logo: asset("/logos/lillup.png"),
  },
];
