import { getDescent } from '../src/engine/descents';
import { carefulNode, majorsOnlyPick, oraclePick, randomPick, simulate } from '../src/engine/sim';

/** How deep the Well goes under each policy: runs passing at least N Abysses. */
const N = Number(process.argv[2] ?? 400);
const config = getDescent('well').config;
const policies = [
  { name: 'random', r: simulate(N, randomPick, undefined, 1, config) },
  { name: 'majors-only', r: simulate(N, majorsOnlyPick, carefulNode, 1, config) },
  { name: 'oracle', r: simulate(N, oraclePick, carefulNode, 1, config) },
];
const deepest = Math.max(...policies.map((p) => p.r.wellDepths.length));
const rows = ['| Abysses passed | ' + policies.map((p) => p.name).join(' | ') + ' |', '|---|' + policies.map(() => '---').join('|') + '|'];
for (let d = 1; d < deepest; d++) rows.push(`| ≥${d} | ${policies.map((p) => `${((100 * (p.r.wellDepths[d] ?? 0)) / N).toFixed(0)}%`).join(' | ')} |`);
rows.push(`| mean scenes | ${policies.map((p) => p.r.meanScenes.toFixed(1)).join(' | ')} |`);
rows.push(`| longest road | ${policies.map((p) => p.r.maxScenes).join(' | ')} |`);
console.log(rows.join('\n'));
