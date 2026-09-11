import { carefulNode, majorsOnlyPick, oraclePick, randomPick, simulate } from '../src/engine/sim';

const N = Number(process.argv[2] ?? 800);
const sig = process.argv[3] ?? 'major-19';
const pct = (a: number, b: number) => `${((100 * a) / b).toFixed(0)}%`;
console.log(`| Policy | plain | signature ${sig} |\n|---|---|---|`);
for (const [name, pick, node] of [['random', randomPick, undefined], ['majors-only', majorsOnlyPick, carefulNode], ['oracle', oraclePick, carefulNode]] as const) {
  const plain = simulate(N, pick, node, 1);
  const s = simulate(N, pick, node, 1, {}, { signature: sig });
  console.log(`| ${name} | ${pct(plain.survived, N)} | ${pct(s.survived, N)} |`);
}
