// Run with: node --experimental-strip-types --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { OneEuro, Swipe, Dwell } from '../src/lib/gestures.ts';

test('OneEuro damps jitter when still and follows fast motion', () => {
  const f = new OneEuro(1.0, 0.02);
  let t = 0; let out = 0;
  for (let i = 0; i < 60; i++) { t += 33; out = f.filter(100 + (i % 2 ? 3 : -3), t); }   // ±3px jitter around 100
  assert.ok(Math.abs(out - 100) < 1.5, `jitter should shrink, got ${out}`);
  for (let i = 0; i < 15; i++) { t += 33; out = f.filter(400, t); }                      // jump to 400
  assert.ok(out > 380, `should catch up quickly, got ${out}`);
});

test('Swipe fires on fast horizontal travel and ignores vertical or slow movement', () => {
  const s = new Swipe({ windowMs: 450, minDx: 0.28, maxDyRatio: 0.6 });
  let dir = 0;
  for (let i = 0; i <= 8; i++) dir = s.push(0.3 + i * 0.05, 0.5 + i * 0.005, i * 40) || dir;   // 0.40 in 320 ms, flat
  assert.equal(dir, 1);
  dir = 0;
  for (let i = 0; i <= 8; i++) dir = s.push(0.5, 0.2 + i * 0.05, 1000 + i * 40) || dir;        // vertical only
  assert.equal(dir, 0);
  dir = 0;
  for (let i = 0; i <= 20; i++) dir = s.push(0.7 - i * 0.02, 0.5, 2000 + i * 100) || dir;      // 0.40 but over 2 s
  assert.equal(dir, 0);
  dir = 0;
  for (let i = 0; i <= 8; i++) dir = s.push(0.7 - i * 0.05, 0.5, 3000 + i * 40) || dir;        // leftward
  assert.equal(dir, -1);
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
