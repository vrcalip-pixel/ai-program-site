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

/** Horizontal swipe: the tracked point travels at least `minDx` within `windowMs`, mostly sideways. Returns -1, 0 or 1 (sign of the travel). */
export class Swipe {
  private hist: { x: number; y: number; t: number }[] = [];
  opts: { windowMs: number; minDx: number; maxDyRatio: number };
  constructor(opts = { windowMs: 450, minDx: 0.28, maxDyRatio: 0.6 }) { this.opts = opts; }
  push(x: number, y: number, t: number): number {
    this.hist.push({ x, y, t });
    this.hist = this.hist.filter(h => t - h.t <= this.opts.windowMs);
    if (this.hist.length < 3) return 0;
    const first = this.hist[0];
    const dx = x - first.x, dy = y - first.y;
    if (Math.abs(dx) >= this.opts.minDx && Math.abs(dy) <= this.opts.maxDyRatio * Math.abs(dx)) { this.hist = []; return Math.sign(dx); }
    return 0;
  }
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
