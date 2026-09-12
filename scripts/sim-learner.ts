/**
 * A learning reader: knows every seat's ask (as the table now states it),
 * and a card's tags only once a seat has taken the card for them, kept
 * across runs as the Codex keeps them. `artSense` is the share of a card's
 * true tags the reader can guess from its face before ever reading it.
 * Run with `npx vite-node scripts/sim-learner.ts`.
 */
import { createRng } from '../src/engine/rng';
import { cardTags, getCard, type Tag } from '../src/engine/cards';
import { scoreSlot } from '../src/engine/resolve';
import { TIERS, type OutcomeTier } from '../src/engine/scenes';
import { advance, chooseCandidate, chooseNode, chooseRelic, currentScene, isOver, startRun, type RunState } from '../src/engine/run';
import { carefulNode } from '../src/engine/sim';

// A learner: knows the ask (the seat's affinity), and the tags of a card only once a seat has taken it for them.
// `artSense` = fraction of a card's true tags the reader can guess from its face before ever reading it.
function learnerRuns(runs: number, artSense: number, seed = 3, config: Parameters<typeof startRun>[1] = {}, warm = 0) {
  const rng = createRng(seed);
  const memory = new Map<string, Set<Tag>>();
  const guessed = new Map<string, Set<Tag>>();
  const known = (id: string, rev: boolean) => {
    const key = `${id}|${rev}`;
    if (!guessed.has(key)) {
      const tags = cardTags(getCard(id), rev);
      const g = new Set<Tag>();
      for (const t of tags) if (rng.next() < artSense) g.add(t);
      guessed.set(key, g);
    }
    return new Set([...(memory.get(key) ?? []), ...guessed.get(key)!]);
  };
  const out: { survived: boolean; tiers: Record<OutcomeTier, number>; scenes: number }[] = [];
  for (let i = 0; i < runs; i++) {
    let run: RunState = startRun(rng.int(0xffffffff), i < warm ? {} : config);
    let guard = 0;
    const tiers = Object.fromEntries(TIERS.map((t) => [t, 0])) as Record<OutcomeTier, number>;
    while (!isOver(run) && guard++ < 60) {
      if (run.phase.kind === 'map') run = chooseNode(run, carefulNode(run, rng));
      while (run.phase.kind === 'reading') {
        const scene = currentScene(run);
        const slot = run.slots[run.activeSlot];
        const aff = scene.affinity[slot.slot];
        let best = -1, bestScore = -Infinity;
        slot.candidates.forEach((c, j) => {
          if (c.hidden) return;
          let s = 0;
          for (const t of known(c.cardId, c.reversed)) s += aff[t] ?? 0;
          if (c.reversed) s -= 0.5;
          s += rng.next() * 0.01;
          if (s > bestScore) { bestScore = s; best = j; }
        });
        if (best < 0) best = rng.int(slot.candidates.length);
        const c = slot.candidates[best];
        const hits = scoreSlot(scene, slot.slot, c, run.marks).hits.map((h) => h.tag);
        const key = `${c.cardId}|${c.reversed}`;
        if (!memory.has(key)) memory.set(key, new Set());
        for (const t of hits) memory.get(key)!.add(t);
        run = chooseCandidate(run, best);
      }
      if (run.phase.kind === 'resolved') run = advance(run);
      if (run.phase.kind === 'relic') run = chooseRelic(run, rng.int(run.phase.offer.length));
    }
    for (const h of run.history) tiers[h.resolution.tier]++;
    out.push({ survived: run.phase.kind === 'ascended', tiers, scenes: run.history.length });
  }
  return out;
}
const pct = (n: number, d: number) => `${Math.round((100 * n) / d)}%`;
for (const artSense of [0, 0.35, 0.7]) {
  const rs = learnerRuns(40, artSense);
  const block = (a: number, b: number) => {
    const sl = rs.slice(a, b);
    const t = sl.reduce((acc, r) => { for (const k of TIERS) acc[k] += r.tiers[k]; return acc; }, Object.fromEntries(TIERS.map((t) => [t, 0])) as Record<OutcomeTier, number>);
    const n = TIERS.reduce((s, k) => s + t[k], 0);
    return `survive ${pct(sl.filter((r) => r.survived).length, sl.length)} | cal ${pct(t.calamity, n)} harm ${pct(t.harm, n)} neut ${pct(t.neutral, n)} boon ${pct(t.boon, n)} tri ${pct(t.triumph, n)}`;
  };
  console.log(`artSense ${artSense}: runs 1-10  ${block(0, 10)}`);
  console.log(`artSense ${artSense}: runs 11-20 ${block(10, 20)}`);
  console.log(`artSense ${artSense}: runs 31-40 ${block(30, 40)}`);
}

import { simulate, randomPick, oraclePick } from '../src/engine/sim';
{
  const r = simulate(300, randomPick, carefulNode, 7);
  const n = TIERS.reduce((s, k) => s + r.tiers[k], 0);
  console.log(`random: survive ${pct(r.survived, r.runs)} | neut ${pct(r.tiers.neutral, n)} harm ${pct(r.tiers.harm, n)} boon ${pct(r.tiers.boon, n)} | scenes ${r.meanScenes.toFixed(1)} vit ${r.meanFinalVitality.toFixed(1)}`);
  const o = simulate(300, oraclePick, carefulNode, 7);
  console.log(`oracle: survive ${pct(o.survived, o.runs)} | vit ${o.meanFinalVitality.toFixed(1)}`);
}

import { depthConfig } from '../src/engine/descents';
for (const depth of [1, 2, 3, 4, 5]) {
  const rs = learnerRuns(60, 0.35, 11, depthConfig(depth), 30).slice(30);
  const t = rs.reduce((acc, r) => { for (const k of TIERS) acc[k] += r.tiers[k]; return acc; }, Object.fromEntries(TIERS.map((t) => [t, 0])) as Record<OutcomeTier, number>);
  const n = TIERS.reduce((s, k) => s + t[k], 0);
  console.log(`depth ${depth} veteran: survive ${pct(rs.filter((r) => r.survived).length, rs.length)} | harm ${pct(t.harm, n)} neut ${pct(t.neutral, n)} boon ${pct(t.boon, n)} tri ${pct(t.triumph, n)}`);
}
