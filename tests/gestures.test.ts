// Run with: node --experimental-strip-types --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { OneEuro, Swipe, Dwell, isFist, Fist, openHand, palmCentre } from '../src/lib/gestures.ts';

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
  const f = new Fist({ holdMs: 350, openMs: 250 });
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
