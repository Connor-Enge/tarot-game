import { carefulNode, majorsOnlyPick, oraclePick, randomPick, simulate } from '../src/engine/sim';

const N = Number(process.argv[2] ?? 800);
const pct = (a: number, b: number) => `${((100 * a) / b).toFixed(0)}%`;
const rows = ['| Policy | plain | with vow | vows kept | with trades | both |', '|---|---|---|---|---|---|'];
for (const [name, pick, node] of [['random', randomPick, undefined], ['majors-only', majorsOnlyPick, carefulNode], ['oracle', oraclePick, carefulNode]] as const) {
  const plain = simulate(N, pick, node, 1);
  const vow = simulate(N, pick, node, 1, {}, { vow: true });
  const trade = simulate(N, pick, node, 1, {}, { trade: true });
  const both = simulate(N, pick, node, 1, {}, { vow: true, trade: true });
  rows.push(`| ${name} | ${pct(plain.survived, N)} | ${pct(vow.survived, N)} | ${pct(vow.vowsKept, N)} | ${pct(trade.survived, N)} | ${pct(both.survived, N)} |`);
}
console.log(rows.join('\n'));
