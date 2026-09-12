/**
 * The learning reader across a career: knows every seat's ask, remembers
 * only tags a seat has taken a card for, carries that memory from run to
 * run. Prints survival and the tier mix by block of runs, at three levels
 * of art intuition, then a veteran at each Depth.
 * Run with `npx vite-node scripts/sim-learner.ts`.
 */
import { depthConfig } from '../src/engine/descents';
import { TIERS, type OutcomeTier } from '../src/engine/scenes';
import { carefulNode, learnerPick, oraclePick, randomPick, simulate } from '../src/engine/sim';

const pct = (n: number, d: number) => `${Math.round((100 * n) / d)}%`;
const mix = (t: Record<OutcomeTier, number>) => {
  const n = TIERS.reduce((s, k) => s + t[k], 0);
  return `harm ${pct(t.harm + t.calamity, n)} neut ${pct(t.neutral, n)} boon ${pct(t.boon, n)} tri ${pct(t.triumph, n)}`;
};
for (const artSense of [0, 0.35, 0.7]) {
  const pick = learnerPick(artSense, 3);
  for (const [a, b] of [[1, 10], [11, 20], [31, 40]]) {
    const r = simulate(b - a + 1, pick, carefulNode, 10 + a);
    console.log(`artSense ${artSense} runs ${a}-${b}: survive ${pct(r.survived, r.runs)} | ${mix(r.tiers)}`);
  }
}
for (const depth of [1, 2, 3, 4, 5]) {
  const pick = learnerPick(0.35, 11);
  simulate(30, pick, carefulNode, 11);
  const r = simulate(30, pick, carefulNode, 12, depthConfig(depth));
  console.log(`depth ${depth} veteran: survive ${pct(r.survived, r.runs)} | ${mix(r.tiers)}`);
}
const r = simulate(300, randomPick, carefulNode, 7);
console.log(`ignores the ask: survive ${pct(r.survived, r.runs)} | ${mix(r.tiers)}`);
const o = simulate(300, oraclePick, carefulNode, 7);
console.log(`oracle: survive ${pct(o.survived, o.runs)}`);
