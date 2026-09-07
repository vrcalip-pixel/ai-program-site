// Gesture interpretation for hands-free control (src/components/HandsFree.astro): pure, testable pieces.
// All positions are whatever units the caller uses (screen px for the cursor, normalised frame coordinates for swipes);
// time is in milliseconds.

/** One Euro filter (Casiez, Roustan & Vercher 2012): heavy smoothing when the hand is still, little lag when it moves. */
export class OneEuro {
  private x: number | null = null; private dx = 0; private t: number | null = null;
  minCutoff: number; beta: number; dCutoff: number;
  constructor(minCutoff = 1.0, beta = 0.02, dCutoff = 1.0) { this.minCutoff = minCutoff; this.beta = beta; this.dCutoff = dCutoff; }
  private alpha(cutoff: number, dt: number) { const tau = 1 / (2 * Math.PI * cutoff); return 1 / (1 + tau / dt); }
  filter(v: number, t: number): number {
    if (this.x === null || this.t === null) { this.x = v; this.t = t; return v; }
    const dt = Math.max(1e-3, (t - this.t) / 1000); this.t = t;
    const dxRaw = (v - this.x) / dt;
    const aD = this.alpha(this.dCutoff, dt); this.dx = aD * dxRaw + (1 - aD) * this.dx;
    const cutoff = this.minCutoff + this.beta * Math.abs(this.dx);
    const a = this.alpha(cutoff, dt); this.x = a * v + (1 - a) * this.x;
    return this.x;
  }
  reset() { this.x = null; this.t = null; this.dx = 0; }
}

/**
 * Open-hand swipe: the palm centre travels at least `minDx` sideways within `windowMs`, at an average speed of at least
 * `minSpeed` (frame widths per second), mostly horizontally, with the hand open for the whole run. Returns -1, 0 or 1
 * (sign of the travel). `progress()` reports how far the current run has got, for feedback.
 */
export class Swipe {
  private hist: { x: number; y: number; t: number }[] = [];
  opts: { windowMs: number; minDx: number; maxDyRatio: number; minSpeed: number };
  constructor(opts = { windowMs: 900, minDx: 0.18, maxDyRatio: 0.9, minSpeed: 0.3 }) { this.opts = opts; }
  push(x: number, y: number, t: number, open = true): number {
    if (!open) { this.hist = []; return 0; }                       // a closed or half-closed hand is not swiping
    this.hist.push({ x, y, t });
    this.hist = this.hist.filter(h => t - h.t <= this.opts.windowMs);
    if (this.hist.length < 3) return 0;
    const first = this.hist[0];
    const dx = x - first.x, dy = y - first.y, dt = Math.max(1, t - first.t) / 1000;
    if (Math.abs(dx) >= this.opts.minDx && Math.abs(dx) / dt >= this.opts.minSpeed && Math.abs(dy) <= this.opts.maxDyRatio * Math.abs(dx)) { this.hist = []; return Math.sign(dx); }
    return 0;
  }
  /** Signed sideways travel currently in the window. */
  peek(): number { if (this.hist.length < 2) return 0; const f = this.hist[0], l = this.hist[this.hist.length - 1]; return l.x - f.x; }
  /** 0..1 progress of the current run toward `minDx`, in the given direction (1 = raw x increasing). */
  progress(dir = 1): number { return Math.max(0, Math.min(1, (this.peek() * dir) / this.opts.minDx)); }
  reset() { this.hist = []; }
}

/**
 * Dwell to activate: while the cursor rests within `radius` of where it settled, over the same target, progress runs 0..1
 * over `ms`; at 1 it fires once. It will not fire again until the cursor has moved `rearm` away from the firing point.
 */
export class Dwell {
  private anchor: { x: number; y: number; t: number; key: string } | null = null;
  private firedAt: { x: number; y: number } | null = null;
  opts: { ms: number; radius: number; rearm: number };
  constructor(opts = { ms: 1500, radius: 26, rearm: 70 }) { this.opts = opts; }
  update(x: number, y: number, t: number, key: string | null): { progress: number; fire: boolean } {
    if (this.firedAt && Math.hypot(x - this.firedAt.x, y - this.firedAt.y) < this.opts.rearm) return { progress: 0, fire: false };
    this.firedAt = null;
    if (!key) { this.anchor = null; return { progress: 0, fire: false }; }
    if (!this.anchor || this.anchor.key !== key || Math.hypot(x - this.anchor.x, y - this.anchor.y) > this.opts.radius) {
      this.anchor = { x, y, t, key }; return { progress: 0, fire: false };
    }
    const progress = Math.min(1, (t - this.anchor.t) / this.opts.ms);
    if (progress >= 1) { this.firedAt = { x, y }; this.anchor = null; return { progress: 1, fire: true }; }
    return { progress, fire: false };
  }
  reset() { this.anchor = null; this.firedAt = null; }
}

/** A hand is a fist when the four fingertips sit closer to the wrist than their middle joints do (MediaPipe landmark indices). */
export function isFist(lm: { x: number; y: number }[], curlRatio = 1.05, minCurled = 4): boolean {
  const d = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);
  const wrist = lm[0]; const tips = [8, 12, 16, 20], pips = [6, 10, 14, 18];
  let curled = 0;
  for (let i = 0; i < 4; i++) if (d(lm[tips[i]], wrist) < d(lm[pips[i]], wrist) * curlRatio) curled++;
  return curled >= minCurled;
}

/** Held fist: fires once after the fist has been held `holdMs`; will not fire again until the hand has been open for `openMs`. */
export class Fist {
  private since: number | null = null; private openSince: number | null = null; private armed = true;
  opts: { holdMs: number; openMs: number };
  constructor(opts = { holdMs: 350, openMs: 250 }) { this.opts = opts; }
  update(fist: boolean, t: number): { progress: number; fire: boolean } {
    if (!fist) {
      this.since = null;
      if (this.openSince === null) this.openSince = t;
      if (!this.armed && t - this.openSince >= this.opts.openMs) this.armed = true;
      return { progress: 0, fire: false };
    }
    this.openSince = null;
    if (!this.armed) return { progress: 0, fire: false };
    if (this.since === null) this.since = t;
    const progress = Math.min(1, (t - this.since) / this.opts.holdMs);
    if (progress >= 1) { this.armed = false; this.since = null; return { progress: 1, fire: true }; }
    return { progress, fire: false };
  }
  reset() { this.since = null; this.openSince = null; this.armed = true; }
}

/** An open hand: at least `minExtended` of the four fingers point away from the wrist (tip farther than the middle joint). */
export function openHand(lm: { x: number; y: number }[], extRatio = 1.05, minExtended = 3): boolean {
  const d = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);
  const wrist = lm[0]; const tips = [8, 12, 16, 20], pips = [6, 10, 14, 18];
  let ext = 0;
  for (let i = 0; i < 4; i++) if (d(lm[tips[i]], wrist) > d(lm[pips[i]], wrist) * extRatio) ext++;
  return ext >= minExtended;
}

/** Centre of the palm: the mean of the wrist and the four finger bases. Steadier than any fingertip during a sweep. */
export function palmCentre(lm: { x: number; y: number }[]): { x: number; y: number } {
  const ids = [0, 5, 9, 13, 17]; let x = 0, y = 0;
  for (const i of ids) { x += lm[i].x; y += lm[i].y; }
  return { x: x / ids.length, y: y / ids.length };
}
