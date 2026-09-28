const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

const landedOnHome =
  typeof window !== "undefined" &&
  (() => {
    const path = window.location.pathname.replace(/\/$/, "") || "/";
    const home = basePath || "/";
    return path === home || path.endsWith("/index.html");
  })();

const bootNav =
  typeof performance !== "undefined"
    ? (performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined)
    : undefined;

let consumed = false;
let animating = false;
let intro = 0;
let touchY = 0;
let touchAccum = 0;
let attached = false;
let absorbUntil = 0;
let holdTimer = 0;
let introRaf = 0;
let pendingIntro: number | null = null;
let skipHashOnBoot =
  Boolean(landedOnHome) && bootNav?.type === "reload";

const isCoarsePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse), (hover: none)").matches;

export function shouldPlayCover() {
  return landedOnHome && !consumed;
}

export function coverHasPlayed() {
  return consumed;
}

export function isCoverAnimating() {
  return animating;
}

/** On a full refresh of `/`, keep the cover and drop leftover hashes. */
export function takeCoverBoot() {
  if (!skipHashOnBoot) return false;
  skipHashOnBoot = false;
  if (window.location.hash) {
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  }
  window.scrollTo(0, 0);
  return true;
}

function flushIntro() {
  introRaf = 0;
  if (pendingIntro === null) return;
  const value = pendingIntro;
  pendingIntro = null;
  intro = value;
  const root = document.documentElement;
  root.style.setProperty("--intro", intro.toFixed(4));
  root.classList.toggle("peeling", !consumed && intro < 1);
  root.classList.toggle("intro-done", consumed || intro >= 0.98);
}

function applyIntro(value: number) {
  pendingIntro = Math.min(1, Math.max(0, value));
  if (!introRaf) introRaf = requestAnimationFrame(flushIntro);
}

function holdPage(ms = 800) {
  absorbUntil = performance.now() + ms;
  const root = document.documentElement;
  root.classList.add("cover-hold");
  window.scrollTo(0, 0);
  window.clearTimeout(holdTimer);
  holdTimer = window.setTimeout(() => {
    root.classList.remove("cover-hold");
    window.scrollTo(0, 0);
  }, ms);
}

function bump(delta: number) {
  if (consumed || animating) return;
  if (delta <= 0 && intro <= 0) return;
  const next = Math.min(1, Math.max(0, intro + delta));
  applyIntro(next);
  if (next >= 1) consumeCover();
}

function onWheel(event: WheelEvent) {
  if (performance.now() < absorbUntil) {
    event.preventDefault();
    window.scrollTo(0, 0);
    return;
  }
  if (consumed) return;
  event.preventDefault();
  if (animating) return;

  // Phones/tablets: one decisive gesture opens the cover (avoids per-frame CSS thrash)
  if (isCoarsePointer()) {
    if (event.deltaY > 0) playCoverOpen();
    return;
  }

  const step =
    Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY) / 1200, 0.1);
  bump(step);
}

function onTouchStart(event: TouchEvent) {
  touchY = event.touches[0]?.clientY ?? 0;
  touchAccum = 0;
}

function onTouchMove(event: TouchEvent) {
  if (performance.now() < absorbUntil) {
    event.preventDefault();
    window.scrollTo(0, 0);
    return;
  }
  if (consumed || animating) return;
  event.preventDefault();

  const y = event.touches[0]?.clientY ?? touchY;
  const dy = touchY - y;
  touchY = y;

  // Swipe up to open — don't scrub --intro on every touch move (lags on phones)
  if (isCoarsePointer()) {
    if (dy > 0) touchAccum += dy;
    if (touchAccum > 48) playCoverOpen();
    return;
  }

  const step = Math.min(Math.max(dy / 700, -0.1), 0.1);
  bump(step);
}

function onKeyDown(event: KeyboardEvent) {
  if (performance.now() < absorbUntil) {
    if (["ArrowDown", "PageDown", " ", "Spacebar", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
    }
    return;
  }
  if (consumed || animating) return;
  if (["ArrowDown", "PageDown", " ", "Spacebar"].includes(event.key)) {
    event.preventDefault();
    if (event.key === "PageDown" || event.key === " ") playCoverOpen();
    else bump(0.08);
  }
}

export function playCoverOpen() {
  if (consumed || animating) return;

  animating = true;
  // Sync any pending scrub before the open animation
  if (introRaf) {
    cancelAnimationFrame(introRaf);
    flushIntro();
  }
  const from = intro;
  const start = performance.now();
  // Slightly snappier on touch so it doesn't feel sticky
  const duration = isCoarsePointer() ? 720 : 1200;

  const tick = (now: number) => {
    if (consumed) {
      animating = false;
      return;
    }
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - t) ** 3;
    // Write directly during the open animation (already rAF-paced)
    intro = from + (1 - from) * eased;
    const root = document.documentElement;
    root.style.setProperty("--intro", intro.toFixed(4));
    root.classList.toggle("peeling", intro < 1);
    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }
    animating = false;
    consumeCover();
  };

  requestAnimationFrame(tick);
}

export function startCover() {
  consumed = false;
  animating = false;
  intro = 0;
  touchAccum = 0;
  absorbUntil = 0;
  pendingIntro = null;
  if (introRaf) {
    cancelAnimationFrame(introRaf);
    introRaf = 0;
  }
  const root = document.documentElement;
  root.classList.remove("intro-done");
  root.classList.remove("cover-hold");
  root.style.setProperty("--intro", "0");
  root.classList.add("peeling");
  root.classList.remove("intro-done");
  bindCoverGestures();
}

export function bindCoverGestures() {
  if (!attached) {
    attached = true;
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("keydown", onKeyDown, { capture: true });
  }
}

function unbindCoverGestures() {
  if (!attached) return;
  attached = false;
  window.removeEventListener("wheel", onWheel, true);
  window.removeEventListener("touchstart", onTouchStart, true);
  window.removeEventListener("touchmove", onTouchMove, true);
  window.removeEventListener("keydown", onKeyDown, true);
}

export function consumeCover() {
  const hold = Boolean(document.getElementById("photo-intro")) || animating;

  if (consumed) {
    window.dispatchEvent(new Event("cover-consumed"));
    return;
  }

  consumed = true;
  animating = false;
  intro = 1;
  pendingIntro = null;
  if (introRaf) {
    cancelAnimationFrame(introRaf);
    introRaf = 0;
  }
  unbindCoverGestures();
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  root.style.setProperty("--intro", "1");
  root.classList.add("intro-done");
  root.classList.remove("peeling");
  if (hold) holdPage(850);
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
    window.dispatchEvent(new Event("cover-consumed"));
  });
}
