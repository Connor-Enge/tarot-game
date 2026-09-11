import { DESCENTS, WEEKLY_CONFIG } from '../src/engine/descents';
import { carefulNode, majorsOnlyPick, oraclePick, randomPick, simulate } from '../src/engine/sim';

const N = Number(process.argv[2] ?? 800);
const ONLY = process.argv[3];
const pct = (r: ReturnType<typeof simulate>, endless?: boolean) => (endless ? `${r.meanScenes.toFixed(1)} scenes · ${r.meanWell.toFixed(2)} abysses` : `${((100 * r.survived) / r.runs).toFixed(0)}%`);
const rows: string[] = ['| Descent | random | majors-only | oracle |', '|---------|--------|-------------|--------|'];
const configs = [...DESCENTS.map((d) => ({ name: d.name, config: d.config })), { name: 'Weekly', config: WEEKLY_CONFIG }];
for (const { name, config } of configs) {
  if (ONLY && !name.toLowerCase().includes(ONLY.toLowerCase())) continue;
  const r = simulate(N, randomPick, undefined, 1, config);
  const m = simulate(N, majorsOnlyPick, carefulNode, 1, config);
  const o = simulate(N, oraclePick, carefulNode, 1, config);
  rows.push(`| ${name} | ${pct(r, config.endless)} | ${pct(m, config.endless)} | ${pct(o, config.endless)} |`);
}
console.log(rows.join('\n'));
