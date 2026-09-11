import { carefulNode, majorsOnlyPick, oraclePick, randomPick, simulate } from '../src/engine/sim';

const N = Number(process.argv[2] ?? 2000);
const fmt = (r: ReturnType<typeof simulate>) => {
  const t = r.tiers;
  const total = Object.values(t).reduce((a, b) => a + b, 0);
  const pct = (x: number) => `${((100 * x) / total).toFixed(0)}%`;
  return `survive ${((100 * r.survived) / r.runs).toFixed(1)}%  scenes ${r.meanScenes.toFixed(1)}  vit ${r.meanFinalVitality.toFixed(1)}  | cal ${pct(t.calamity)} harm ${pct(t.harm)} neu ${pct(t.neutral)} boon ${pct(t.boon)} tri ${pct(t.triumph)}`;
};
console.log('random      ', fmt(simulate(N, randomPick)));
console.log('majors-only ', fmt(simulate(N, majorsOnlyPick, carefulNode)));
console.log('oracle      ', fmt(simulate(N, oraclePick, carefulNode)));
