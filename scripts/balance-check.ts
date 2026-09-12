import { depthConfig } from '../src/engine/descents';
import { carefulNode, learnerPick, oraclePick, randomPick, simulate } from '../src/engine/sim';

/**
 * A guard, not a tuning tool: fails when the standard descent drifts out of
 * the band the design doc promises. Since the ask, the reader to balance for
 * is the learner (knows every ask, remembers what seats took cards for):
 * fresh over its first twelve descents 62-92%, a veteran at Depth 5 45-85%,
 * oracle 95%+, and a reader who ignores the ask under 20%. Sample sizes are
 * small so the bands are wide.
 */
const pct = (survived: number, runs: number) => (100 * survived) / runs;
let fresh = 0;
const FRESH = 25;
for (let i = 0; i < FRESH; i++) fresh += simulate(12, learnerPick(0.35, 100 + i), carefulNode, 200 + i).survived;
let vet = 0;
const VETS = 10;
for (let i = 0; i < VETS; i++) {
  const pick = learnerPick(0.35, 300 + i);
  simulate(30, pick, carefulNode, 400 + i);
  vet += simulate(30, pick, carefulNode, 500 + i, depthConfig(5)).survived;
}
const r = simulate(400, randomPick, undefined, 1);
const o = simulate(400, oraclePick, carefulNode, 1);
const rows = [
  ['learner, fresh', pct(fresh, FRESH * 12), 62, 92],
  ['veteran, depth 5', pct(vet, VETS * 30), 45, 85],
  ['oracle', pct(o.survived, o.runs), 95, 100],
  ['ignores the ask', pct(r.survived, r.runs), 0, 20],
] as const;
let bad = false;
for (const [name, v, lo, hi] of rows) {
  const ok = v >= lo && v <= hi;
  if (!ok) bad = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(18)} ${v.toFixed(0)}% (band ${lo}-${hi})`);
}
if (bad) process.exit(1);
