// Run with: node --experimental-strip-types --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { OneEuro, Swipe, Dwell, isFist, Fist, openHand, palmCentre, Throw, Pull, handSize } from '../src/lib/gestures.ts';

test('OneEuro damps jitter when still and follows fast motion', () => {
  const f = new OneEuro(1.0, 0.02);
  let t = 0; let out = 0;
  for (let i = 0; i < 60; i++) { t += 33; out = f.filter(100 + (i % 2 ? 3 : -3), t); }   // ±3px jitter around 100
  assert.ok(Math.abs(out - 100) < 1.5, `jitter should shrink, got ${out}`);
  for (let i = 0; i < 15; i++) { t += 33; out = f.filter(400, t); }                      // jump to 400
  assert.ok(out > 380, `should catch up quickly, got ${out}`);
});

test('Swipe fires on an open-hand sweep, not on vertical, slow, or closed-hand movement', () => {
  const s = new Swipe({ windowMs: 900, minDx: 0.18, maxDyRatio: 0.9, minSpeed: 0.3 });
  let dir = 0;
  for (let i = 0; i <= 12; i++) dir = s.push(0.4 + i * 0.02, 0.5 + i * 0.002, i * 40) || dir;    // 0.24 in 480 ms, flat, open
  assert.equal(dir, 1);
  dir = 0;
  for (let i = 0; i <= 12; i++) dir = s.push(0.5, 0.2 + i * 0.03, 1000 + i * 40) || dir;          // vertical only
  assert.equal(dir, 0);
  dir = 0;
  for (let i = 0; i <= 30; i++) dir = s.push(0.7 - i * 0.008, 0.5, 2000 + i * 60) || dir;         // 0.24 but over 1.8 s: a drift, not a swipe
  assert.equal(dir, 0);
  dir = 0;
  for (let i = 0; i <= 12; i++) dir = s.push(0.7 - i * 0.02, 0.5, 4000 + i * 40, false) || dir;   // closed hand
  assert.equal(dir, 0);
  dir = 0;
  for (let i = 0; i <= 12; i++) dir = s.push(0.7 - i * 0.02, 0.5, 5000 + i * 40) || dir;          // leftward, open
  assert.equal(dir, -1);
  s.reset();
  for (let i = 0; i <= 4; i++) s.push(0.3 + i * 0.02, 0.5, 6000 + i * 40);
  assert.ok(Math.abs(s.progress(1) - 0.08 / 0.18) < 1e-9);                                        // progress toward the threshold
});

test('Swipe survives a short tracking dropout mid-sweep when the caller keeps its history', () => {
  const s = new Swipe({ windowMs: 900, minDx: 0.18, maxDyRatio: 0.9, minSpeed: 0.3 });
  let dir = 0;
  for (let i = 0; i <= 3; i++) dir = s.push(0.3 + i * 0.025, 0.5, i * 33) || dir;
  for (let i = 8; i <= 12; i++) dir = s.push(0.3 + i * 0.025, 0.52, i * 33) || dir;                // frames 4-7 missing
  assert.equal(dir, 1);
});

test('openHand and palmCentre read a synthetic hand', () => {
  const lm = hand(true); [5, 9, 13, 17].forEach((i, k) => { lm[i] = { x: 0.4 + k * 0.05, y: 0.25 }; });   // finger bases between wrist (origin) and the joints
  assert.equal(openHand(lm), true);
  assert.equal(openHand(hand(false)), false);
  const c = palmCentre(lm); assert.ok(Math.abs(c.x - 0.38) < 1e-9 && Math.abs(c.y - 0.2) < 1e-9);
});

test('Dwell fires once after resting on a target, never on empty space, and re-arms after moving away', () => {
  const d = new Dwell({ ms: 1500, radius: 26, rearm: 70 });
  let fired = 0, last = { progress: 0, fire: false };
  for (let t = 0; t <= 1600; t += 33) { last = d.update(200 + (t % 66 ? 4 : -4), 300, t, 'node:ai40'); if (last.fire) fired++; }
  assert.equal(fired, 1);
  for (let t = 1633; t <= 4000; t += 33) { last = d.update(200, 300, t, 'node:ai40'); if (last.fire) fired++; }   // still resting: no repeat
  assert.equal(fired, 1);
  for (let t = 4033; t <= 6000; t += 33) { last = d.update(600, 300, t, null); if (last.fire) fired++; }          // empty space: nothing
  assert.equal(fired, 1); assert.equal(last.progress, 0);
  for (let t = 6033; t <= 7700; t += 33) { last = d.update(600, 300, t, 'el:3'); if (last.fire) fired++; }        // new target after moving away
  assert.equal(fired, 2);
});

test('Dwell restarts when the cursor drifts past the radius', () => {
  const d = new Dwell({ ms: 1000, radius: 20, rearm: 50 });
  let p = 0;
  for (let t = 0; t <= 700; t += 50) p = d.update(100, 100, t, 'k').progress;
  assert.ok(p > 0.6);
  p = d.update(140, 100, 750, 'k').progress;    // 40px away: anchor resets
  assert.equal(p, 0);
});

// synthetic hands: wrist at the origin, fingers along +y; tips beyond the middle joints when open, inside them when curled
function hand(open: boolean) {
  const lm = Array.from({ length: 21 }, () => ({ x: 0, y: 0 }));
  const pips = [6, 10, 14, 18], tips = [8, 12, 16, 20];
  pips.forEach((p, i) => { lm[p] = { x: i * 0.05, y: 0.5 }; });
  tips.forEach((t, i) => { lm[t] = { x: i * 0.05, y: open ? 0.8 : 0.35 }; });
  return lm;
}

test('isFist tells a curled hand from an open one', () => {
  assert.equal(isFist(hand(false)), true);
  assert.equal(isFist(hand(true)), false);
});

test('Fist fires once after being held, not while held, and re-arms only after the hand opens', () => {
  const f = new Fist({ holdMs: 350, openMs: 250, stillRadius: 0.06 });
  let fired = 0;
  for (let t = 0; t <= 200; t += 33) if (f.update(true, t).fire) fired++;           // too short
  assert.equal(fired, 0);
  for (let t = 233; t <= 1500; t += 33) if (f.update(true, t).fire) fired++;        // held on: fires exactly once
  assert.equal(fired, 1);
  for (let t = 1533; t <= 1600; t += 33) f.update(false, t);                        // opened briefly (< openMs)
  for (let t = 1633; t <= 2200; t += 33) if (f.update(true, t).fire) fired++;       // closed again too soon: nothing
  assert.equal(fired, 1);
  for (let t = 2233; t <= 2600; t += 33) f.update(false, t);                        // open long enough
  for (let t = 2633; t <= 3100; t += 33) if (f.update(true, t).fire) fired++;       // fires again
  assert.equal(fired, 2);
});

test('Swipe keeps its run through a brief not-open flicker but drops it after a longer one', () => {
  const s = new Swipe({ windowMs: 900, minDx: 0.18, maxDyRatio: 0.9, minSpeed: 0.3, openGraceMs: 200 });
  let dir = 0;
  for (let i = 0; i <= 12; i++) dir = s.push(0.4 + i * 0.02, 0.5, i * 40, i !== 2 && i !== 3) || dir;   // two flickering frames
  assert.equal(dir, 1);
  dir = 0;
  for (let i = 0; i <= 5; i++) s.push(0.4 + i * 0.02, 0.5, 2000 + i * 40, true);
  for (let i = 6; i <= 13; i++) s.push(0.4 + i * 0.02, 0.5, 2000 + i * 40, false);                    // 320 ms not open: run cleared
  dir = s.push(0.4 + 14 * 0.02, 0.5, 2000 + 14 * 40, true);
  assert.equal(dir, 0);
});

test('Fist only counts as a hold while it stays put; a fist that leaves its circle never fires back until the hand reopens', () => {
  const f = new Fist({ holdMs: 700, openMs: 250, stillRadius: 0.06 });
  let fired = 0;
  for (let t = 0; t <= 300; t += 33) if (f.update(true, t, 0.5 + t / 3000, 0.5).fire) fired++;      // closes and drifts 0.1 to the left: leaves the circle
  for (let t = 333; t <= 1500; t += 33) if (f.update(true, t, 0.6, 0.5).fire) fired++;               // now still, but it already left: no back
  assert.equal(fired, 0);
  for (let t = 1533; t <= 1900; t += 33) f.update(false, t, 0.6, 0.5);                                // opens
  for (let t = 1933; t <= 2900; t += 33) if (f.update(true, t, 0.6 + (t % 2) * 0.01, 0.5).fire) fired++; // closes and jitters within the circle: fires once at 700 ms
  assert.equal(fired, 1);
});

test('A quick grab-and-toss never registers as back, and a held fist never registers as a throw', () => {
  const f = new Fist({ holdMs: 700, openMs: 250, stillRadius: 0.06 });
  const th = new Throw({ windowMs: 600, minDx: 0.12, maxDyRatio: 0.9, minSpeed: 0.25, openWithinMs: 450 });
  let back = 0, reset = 0;
  const step = (t: number, x: number, open: boolean, fist: boolean) => { if (th.push(x, 0.5, t, open, fist) > 0) reset++; if (f.update(fist, t, x, 0.5).fire) back++; };
  for (let t = 0; t <= 200; t += 33) step(t, 0.4, true, false);                    // open hand
  for (let t = 233; t <= 366; t += 33) step(t, 0.4, false, true);                  // grab, brief pause
  for (let t = 400; t <= 600; t += 33) step(t, 0.4 + (t - 366) / 1000, false, true); // toss left, ~0.23 over 200 ms
  step(633, 0.64, true, false);                                                     // release
  assert.deepEqual([back, reset], [0, 1]);
  f.reset(); th.reset();
  for (let t = 1000; t <= 1200; t += 33) step(t, 0.5, true, false);                // open hand
  for (let t = 1233; t <= 2200; t += 33) step(t, 0.5 + (t % 3) * 0.005, false, true); // fist held in place with jitter for ~1 s
  step(2233, 0.52, true, false);                                                    // opens afterwards
  assert.deepEqual([back, reset], [1, 1]);
});

test('Throw fires on grab, toss, release; not for a fist that was never open, never moved, or was held too long', () => {
  const th = new Throw({ windowMs: 600, minDx: 0.12, maxDyRatio: 0.9, minSpeed: 0.25, openWithinMs: 450 });
  let dir = 0;
  for (let i = 0; i <= 5; i++) dir = th.push(0.4, 0.5, i * 40, true, false) || dir;                   // open, still
  for (let i = 6; i <= 12; i++) dir = th.push(0.4 + (i - 6) * 0.025, 0.5, i * 40, false, true) || dir; // closes, sweeps left (raw +x) 0.15 in 240 ms
  assert.equal(dir, 0);                                                                                // nothing until the release
  assert.ok(th.progress(1) > 0.9);
  dir = th.push(0.56, 0.5, 13 * 40, true, false);                                                      // opens: release
  assert.equal(dir, 1);
  dir = 0;
  for (let i = 0; i <= 10; i++) dir = th.push(0.4 + i * 0.02, 0.5, 2000 + i * 40, false, true) || dir; // fist from the start
  dir = th.push(0.62, 0.5, 2500, true, false) || dir;
  assert.equal(dir, 0);
  th.reset(); dir = 0;
  for (let i = 0; i <= 5; i++) th.push(0.5, 0.5, 4000 + i * 40, true, false);
  for (let i = 6; i <= 12; i++) th.push(0.5, 0.5, 4000 + i * 40, false, true);                          // closes without moving
  dir = th.push(0.5, 0.5, 4000 + 13 * 40, true, false);
  assert.equal(dir, 0);
  th.reset(); dir = 0;
  th.push(0.4, 0.5, 6000, true, false);
  for (let i = 1; i <= 30; i++) th.push(0.4 + i * 0.006, 0.5, 6000 + i * 40, false, true);              // 1.2 s closed: a hold, not a toss
  dir = th.push(0.6, 0.5, 6000 + 31 * 40, true, false);
  assert.equal(dir, 0);
});


test('Pull fires when an open palm shrinks into a fist, not for a same-size fist, a shrinking open hand, or a fist that was never open', () => {
  const pl = new Pull({ shrink: 0.3, windowMs: 1500, minOpenSize: 0.1 });
  let fired = 0;
  for (let t = 0; t <= 300; t += 33) fired += pl.push(0.24, t, true, false);                 // open palm, close to the camera
  for (let t = 333; t <= 500; t += 33) fired += pl.push(0.22 - (t - 333) / 4000, t, false, false); // closing, drawing back
  for (let t = 533; t <= 900; t += 33) fired += pl.push(0.22 - (t - 333) / 4000, t, false, true);  // fist, still shrinking: fires at 70%
  assert.equal(fired, 1);
  for (let t = 933; t <= 1400; t += 33) fired += pl.push(0.1, t, false, true);               // held smaller: nothing more
  assert.equal(fired, 1);
  pl.reset();
  for (let t = 2000; t <= 2300; t += 33) fired += pl.push(0.24, t, true, false);
  for (let t = 2333; t <= 3300; t += 33) fired += pl.push(0.235, t, false, true);            // fist at the same size (a back): nothing
  assert.equal(fired, 1);
  pl.reset();
  for (let t = 4000; t <= 5000; t += 33) fired += pl.push(0.24 - (t - 4000) / 8000, t, true, false); // backing away with the hand open: nothing
  assert.equal(fired, 1);
  pl.reset();
  for (let t = 6000; t <= 6500; t += 33) fired += pl.push(0.24 - (t - 6000) / 3000, t, false, true); // fist from the start: nothing
  assert.equal(fired, 1);
  pl.reset();
  for (let t = 7000; t <= 7300; t += 33) fired += pl.push(0.08, t, true, false);             // open hand too small (too far away) to count
  for (let t = 7333; t <= 7800; t += 33) fired += pl.push(0.05, t, false, true);
  assert.equal(fired, 1);
});

test('A pull-back never registers as back: the fist shrinks past the size tolerance', () => {
  const f = new Fist({ holdMs: 700, openMs: 250, stillRadius: 0.06, sizeTolerance: 0.18 });
  const pl = new Pull({ shrink: 0.3, windowMs: 1500, minOpenSize: 0.1 });
  let back = 0, reset = 0;
  const step = (t: number, size: number, open: boolean, fist: boolean) => { reset += pl.push(size, t, open, fist); if (f.update(fist, t, 0.5, 0.5, size).fire) back++; };
  for (let t = 0; t <= 300; t += 33) step(t, 0.24, true, false);
  for (let t = 333; t <= 1500; t += 33) step(t, Math.max(0.12, 0.24 - (t - 333) / 5000), false, true); // slow pull over a second
  assert.deepEqual([back, reset], [0, 1]);
  f.reset(); pl.reset();
  for (let t = 2000; t <= 2300; t += 33) step(t, 0.2, true, false);
  for (let t = 2333; t <= 3300; t += 33) step(t, 0.2 + (t % 2) * 0.01, false, true);       // fist held at one depth: back only
  assert.deepEqual([back, reset], [1, 1]);
});

test('handSize is the wrist-to-middle-base distance and ignores finger curl', () => {
  const a = hand(true), b = hand(false);
  for (const lm of [a, b]) { lm[0] = { x: 0.5, y: 0.9 }; lm[9] = { x: 0.5, y: 0.7 }; }
  assert.ok(Math.abs(handSize(a) - 0.2) < 1e-9);
  assert.ok(Math.abs(handSize(a) - handSize(b)) < 1e-9);
});
