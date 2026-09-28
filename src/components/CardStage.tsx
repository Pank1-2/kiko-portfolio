import { useEffect, useRef, useState, type CSSProperties } from "react";
import { asset } from "../asset";
import type { Project } from "../data";

type Treatment = "float" | "fan" | "pedestal" | "flow" | "model" | "solo";

type Staging = {
  treatment: Treatment;
  shots: string[];
};

/**
 * Presentation-only art direction per card.
 * Not project content — only how existing assets are staged in FrameCard.
 */
const CARD_STAGING: Record<string, Staging> = {
  // Editorial scope board — IBM Alert Monitor
  "alert-monitor": {
    treatment: "model",
    shots: [],
  },
  // Single product still — readable on card + case study
  "memory-box": {
    treatment: "solo",
    shots: [asset("/work/memory-box.png")],
  },
  "bloom-studio": {
    treatment: "solo",
    shots: [asset("/work/bloom.png")],
  },
  // Leave untouched
  "art-of-learning": {
    treatment: "flow",
    shots: [asset("/work/paol/before-site.jpg"), asset("/work/paol/after-home-hifi.jpg")],
  },
};

const STAGE_FALLBACK: Record<Project["stage"], string> = {
  navy: "#0d3a5c",
  sage: "#5f7d68",
  purple: "#5a538c",
  violet: "#6a78c4",
};

function parseHex(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function useStageColor(src: string, fallback: string) {
  const [base, setBase] = useState(fallback);
  const [glow, setGlow] = useState(fallback);

  useEffect(() => {
    if (!src) {
      setBase(fallback);
      setGlow(fallback);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.decoding = "async";

    img.onload = () => {
      try {
        const size = 32;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let bestScore = -1;
        let br = 0;
        let bg = 0;
        let bb = 0;
        let ar = 0;
        let ag = 0;
        let ab = 0;
        let n = 0;

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const sat = max === 0 ? 0 : (max - min) / max;
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          if (lum < 0.08 || lum > 0.92) continue;

          ar += r;
          ag += g;
          ab += b;
          n += 1;

          const score = sat * 1.4 + (1 - Math.abs(lum - 0.42));
          if (score > bestScore) {
            bestScore = score;
            br = r;
            bg = g;
            bb = b;
          }
        }

        const fb = parseHex(fallback);
        const sampleR = bestScore > 0 ? br : n ? ar / n : fb.r;
        const sampleG = bestScore > 0 ? bg : n ? ag / n : fb.g;
        const sampleB = bestScore > 0 ? bb : n ? ab / n : fb.b;

        const r = sampleR * 0.38 + fb.r * 0.62;
        const g = sampleG * 0.38 + fb.g * 0.62;
        const b = sampleB * 0.38 + fb.b * 0.62;
        if (cancelled) return;

        setBase(
          `rgb(${Math.round(r + (14 - r) * 0.28)}, ${Math.round(g + (18 - g) * 0.28)}, ${Math.round(b + (24 - b) * 0.28)})`,
        );
        setGlow(
          `rgb(${Math.round(r + (255 - r) * 0.35)}, ${Math.round(g + (255 - g) * 0.35)}, ${Math.round(b + (255 - b) * 0.35)})`,
        );
      } catch {
        /* keep fallback */
      }
    };

    img.onerror = () => {
      if (!cancelled) {
        setBase(fallback);
        setGlow(fallback);
      }
    };

    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, fallback]);

  return { base, glow };
}

function DeviceFrame({
  src,
  alt = "",
  plain,
}: {
  src: string;
  alt?: string;
  plain?: boolean;
}) {
  if (plain) {
    return (
      <div className="card-stage-plain">
        <img src={src} alt={alt} />
      </div>
    );
  }

  return (
    <div className="card-stage-device">
      <div className="card-stage-bezel">
        <img src={src} alt={alt} />
      </div>
    </div>
  );
}

function IbmModel() {
  return (
    <div className="ibm-cover" aria-hidden>
      <div className="ibm-dash">
        <div className="ibm-dash-top">
          <span className="ibm-dash-dot" />
          <span className="ibm-dash-dot" />
          <span className="ibm-dash-dot" />
          <span className="ibm-dash-search" />
        </div>
        <div className="ibm-dash-shell">
          <div className="ibm-dash-rail">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="ibm-dash-body">
            <div className="ibm-dash-kpis">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="ibm-dash-panels">
              <div className="ibm-dash-chart">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="ibm-dash-stack">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="ibm-dash-rows">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>

      <div className="ibm-logo-hero">
        <img className="ibm-cover-mark" src={asset("/ibm.svg")} alt="" />
      </div>
    </div>
  );
}

type Props = {
  slug: string;
  src: string;
  stage?: Project["stage"];
  alt?: string;
};

export function CardStage({
  slug,
  src,
  stage = "navy",
  alt = "",
}: Props) {
  const staging = CARD_STAGING[slug] ?? {
    treatment: "float" as Treatment,
    shots: [src],
  };
  const { treatment, shots } = staging;
  const fallback = STAGE_FALLBACK[stage];
  const sampled = useStageColor(shots[0] ?? src, fallback);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (treatment !== "model" && treatment !== "solo") return;
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.style.setProperty("--model-scroll", "0");

    // Come alive when scrolled into view (no hover required)
    let enterTimer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        const live = entry.isIntersecting && entry.intersectionRatio >= 0.2;
        root.classList.toggle("is-live", live);

        if (!live) {
          window.clearTimeout(enterTimer);
          root.classList.remove("is-playing", "is-settled");
          return;
        }

        if (reduce) {
          root.classList.add("is-playing", "is-settled");
          return;
        }

        root.classList.remove("is-playing", "is-settled");
        void root.offsetWidth;
        root.classList.add("is-playing");
        window.clearTimeout(enterTimer);
        enterTimer = window.setTimeout(() => {
          root.classList.remove("is-playing");
          root.classList.add("is-settled");
        }, 1100);
      },
      { threshold: [0, 0.2, 0.45, 0.7], rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(root);

    const syncScroll = () => {
      if (!root.classList.contains("is-live")) return;
      const box = root.getBoundingClientRect();
      const mid = box.top + box.height / 2;
      const t = (mid - window.innerHeight / 2) / window.innerHeight;
      root.style.setProperty("--model-scroll", t.toFixed(3));
    };

    window.addEventListener("scroll", syncScroll, { passive: true });
    syncScroll();

    const onMove = (event: PointerEvent) => {
      const box = root.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width) * 2 - 1;
      const y = ((event.clientY - box.top) / box.height) * 2 - 1;
      root.style.setProperty("--model-x", x.toFixed(3));
      root.style.setProperty("--model-y", y.toFixed(3));
    };

    const onLeave = () => {
      root.style.setProperty("--model-x", "0");
      root.style.setProperty("--model-y", "0");
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      window.clearTimeout(enterTimer);
      window.removeEventListener("scroll", syncScroll);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [treatment]);

  const base =
    treatment === "flow"
      ? "#5a4f7a"
      : slug === "memory-box"
        ? "#14182e"
        : slug === "bloom-studio"
          ? "#2f4538"
          : slug === "alert-monitor"
            ? "#001d6c"
            : treatment === "model"
              ? "#1c2740"
              : sampled.base;
  const glow =
    treatment === "flow"
      ? "#b5a8d4"
      : slug === "memory-box"
        ? "#7b8ff5"
        : slug === "bloom-studio"
          ? "#b7d4a8"
          : slug === "alert-monitor"
            ? "#4589ff"
            : treatment === "model"
              ? "#7eb6ff"
              : sampled.glow;

  const style = {
    "--card-stage": base,
    "--card-stage-glow": glow,
    "--model-x": "0",
    "--model-y": "0",
    "--model-scroll": "0",
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={`card-stage card-stage--${stage} card-stage--${treatment}${
        slug === "alert-monitor" ? " card-stage--ibm" : ""
      }${slug === "memory-box" ? " card-stage--memory" : ""}${
        slug === "bloom-studio" ? " card-stage--bloom" : ""
      }${slug === "art-of-learning" ? " card-stage--learning" : ""}`}
      style={style}
      data-treatment={treatment}
    >
      {treatment === "model" ? <IbmModel /> : null}

      {treatment === "solo" ? (
        <div className="card-stage-scene card-stage-scene--solo">
          <span className="solo-glow" aria-hidden />
          <div className="card-stage-shot card-stage-shot--solo">
            <DeviceFrame src={shots[0]} alt={alt} plain />
          </div>
        </div>
      ) : null}

      {treatment === "float" ? (
        <div className="card-stage-scene">
          <span className="card-stage-glow" aria-hidden />
          <span className="card-stage-orb" aria-hidden />
          <div className="card-stage-shot card-stage-shot--hero">
            <DeviceFrame src={shots[0]} alt={alt} />
          </div>
        </div>
      ) : null}

      {treatment === "fan" ? (
        <div className="card-stage-scene">
          {shots.slice(0, 3).map((shot, index) => (
            <div
              key={shot}
              className={`card-stage-shot card-stage-shot--fan-${index}`}
            >
              <DeviceFrame src={shot} alt={index === 0 ? alt : ""} />
            </div>
          ))}
        </div>
      ) : null}

      {treatment === "pedestal" ? (
        <div className="card-stage-scene">
          <span className="card-stage-plinth" aria-hidden />
          <span className="card-stage-plinth-face" aria-hidden />
          <div className="card-stage-shot card-stage-shot--pedestal">
            <DeviceFrame src={shots[0]} alt={alt} plain />
          </div>
          <span className="card-stage-mark" aria-hidden />
        </div>
      ) : null}

      {treatment === "flow" ? (
        <div className="card-stage-scene card-stage-scene--flow">
          <div className="card-stage-shot card-stage-shot--flow-before">
            <p className="card-stage-flow-label mono">Before</p>
            <DeviceFrame src={shots[0]} alt="" plain />
          </div>
          <span className="card-stage-flow-link" aria-hidden>
            <svg viewBox="0 0 64 24" fill="none" aria-hidden>
              <path
                d="M2 12h48"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="3 5"
              />
              <path
                d="M44 5l12 7-12 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="card-stage-shot card-stage-shot--flow-after">
            <p className="card-stage-flow-label mono">After</p>
            <DeviceFrame src={shots[1] ?? shots[0]} alt={alt} plain />
          </div>
        </div>
      ) : null}
    </div>
  );
}
