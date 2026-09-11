import { carefulNode, majorsOnlyPick, oraclePick, randomPick, simulate } from '../src/engine/sim';

/**
 * A guard, not a tuning tool: fails when the standard descent drifts out of
 * the band the design doc promises. Random 20-38%, majors-only 72-92%,
 * oracle 95%+. Sample sizes are small so the band is wide.
 */
const N = 600;
const r = simulate(N, randomPick, undefined, 1);
const m = simulate(N, majorsOnlyPick, carefulNode, 1);
const o = simulate(N, oraclePick, carefulNode, 1);
const pct = (x: { survived: number }) => (100 * x.survived) / N;
const rows = [['random', pct(r), 20, 38], ['majors-only', pct(m), 72, 92], ['oracle', pct(o), 95, 100]] as const;
let bad = false;
for (const [name, v, lo, hi] of rows) {
  const ok = v >= lo && v <= hi;
  if (!ok) bad = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(12)} ${v.toFixed(0)}% (band ${lo}-${hi})`);
}
if (bad) process.exit(1);
