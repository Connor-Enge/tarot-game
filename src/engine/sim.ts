/**
 * Headless simulation of whole runs under simple policies. Used for balance:
 * a random policy should die most of the time; an oracle that knows every
 * affinity should usually return from the Abyss. The gap between them is the
 * space the player learns into.
 */
import type { RunConfig } from './descents';
import { createRng, type Rng } from './rng';
import { scoreSlot } from './resolve';
import { SCENES, TIERS, type OutcomeTier } from './scenes';
import { acceptTrade, advance, chooseCandidate, chooseNode, chooseRelic, currentScene, isOver, startRun, takeVow, type RunState } from './run';
import { vowOffer } from './vows';

export type Policy = (run: RunState, rng: Rng) => number;

export const randomPick: Policy = (run, rng) => rng.int(run.slots[run.activeSlot].candidates.length);

/** Perfect knowledge of the scene's affinities. Upper bound for a master reader. */
export const oraclePick: Policy = (run) => {
  const scene = currentScene(run);
  const slot = run.slots[run.activeSlot];
  let best = 0;
  let bestScore = -Infinity;
  slot.candidates.forEach((c, i) => {
    const s = scoreSlot(scene, slot.slot, c, run.marks).score;
    if (s > bestScore) {
      bestScore = s;
      best = i;
    }
  });
  return best;
};

/** Knows only the Major Arcana (as if the Codex had those 22). Random on minors. */
export const majorsOnlyPick: Policy = (run, rng) => {
  const scene = currentScene(run);
  const slot = run.slots[run.activeSlot];
  let best = -1;
  let bestScore = -Infinity;
  slot.candidates.forEach((c, i) => {
    if (!c.cardId.startsWith('major-')) return;
    const s = scoreSlot(scene, slot.slot, c, run.marks).score;
    if (s > bestScore) {
      bestScore = s;
      best = i;
    }
  });
  return best >= 0 && bestScore > 0 ? best : rng.int(slot.candidates.length);
};

export type NodePolicy = (run: RunState, rng: Rng) => number;
export const randomNode: NodePolicy = (run, rng) => rng.int(run.map[run.layer].length);
export const carefulNode: NodePolicy = (run, rng) => {
  const layer = run.map[run.layer];
  if (run.vitality <= 5) {
    const rest = layer.findIndex((n) => n.kind === 'rest');
    if (rest >= 0) return rest;
    const safe = layer.findIndex((n) => n.kind !== 'threat');
    if (safe >= 0) return safe;
  }
  return rng.int(layer.length);
};

export interface SimResult {
  runs: number;
  survived: number;
  meanScenes: number;
  meanFinalVitality: number;
  tiers: Record<OutcomeTier, number>;
  /** Longest road among the runs. */
  maxScenes: number;
  /** Mean Abysses passed (the Well only; 0 elsewhere). */
  meanWell: number;
  /** How many runs passed at least N Abysses, by N. */
  wellDepths: number[];
}

export interface SimOptions {
  /** Swear the first offered vow before the first scene. */
  vow?: boolean;
  /** Take every trade the Stranger offers. */
  trade?: boolean;
  /** Carry this card as a signature. */
  signature?: string;
}

export function simulate(n: number, pick: Policy, node: NodePolicy = randomNode, seed = 1, config: RunConfig = {}, opts: SimOptions = {}): SimResult & { vowsKept: number } {
  const rng = createRng(seed);
  let survived = 0;
  let scenes = 0;
  let vit = 0;
  const tiers = Object.fromEntries(TIERS.map((t) => [t, 0])) as Record<OutcomeTier, number>;
  let vowsKept = 0;
  let maxScenes = 0;
  let wellSum = 0;
  const wellDepths: number[] = [];
  for (let i = 0; i < n; i++) {
    let run = startRun(rng.int(0xffffffff), { ...config, signature: opts.signature ?? config.signature });
    if (opts.vow) run = takeVow(run, vowOffer(run.seed)[0]);
    let guard = 0;
    while (!isOver(run) && guard++ < (config.endless ? 400 : 60)) {
      if (run.phase.kind === 'map') run = chooseNode(run, node(run, rng));
      while (run.phase.kind === 'reading') run = chooseCandidate(run, pick(run, rng));
      if (run.phase.kind === 'resolved' && opts.trade && run.phase.trade) run = acceptTrade(run);
      if (run.phase.kind === 'resolved') run = advance(run);
      if (run.phase.kind === 'relic') run = chooseRelic(run, rng.int(run.phase.offer.length));
    }
    for (const h of run.history) tiers[h.resolution.tier]++;
    if (run.phase.kind === 'ascended') survived++;
    if (run.vow?.kept) vowsKept++;
    scenes += run.history.length;
    vit += run.vitality;
    maxScenes = Math.max(maxScenes, run.history.length);
    const w = run.well ?? 0;
    wellSum += w;
    for (let d = 0; d <= w; d++) wellDepths[d] = (wellDepths[d] ?? 0) + 1;
  }
  return { runs: n, survived, meanScenes: scenes / n, meanFinalVitality: vit / n, tiers, vowsKept, maxScenes, meanWell: wellSum / n, wellDepths };
}

export function sceneSpread(): Record<string, { min: number; max: number }> {
  // Rough per-scene score envelope: sum of the best and worst single-tag weights per seat.
  const out: Record<string, { min: number; max: number }> = {};
  for (const s of Object.values(SCENES)) {
    let min = 0;
    let max = 0;
    for (const aff of Object.values(s.affinity)) {
      const ws = Object.values(aff) as number[];
      max += Math.max(0, ...ws);
      min += Math.min(0, ...ws);
    }
    out[s.id] = { min, max };
  }
  return out;
}
