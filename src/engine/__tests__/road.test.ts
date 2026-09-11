import { describe, expect, it } from 'vitest';
import { startRun, chooseNode, chooseCandidate, type RunState } from '../run';
import { roadNotTaken, roadText } from '../road';
import { SCENES, SLOT_IDS } from '../scenes';
import { scoreSlot } from '../resolve';

function playScene(run: RunState): RunState {
  let r = chooseNode(run, 0);
  for (let i = 0; i < SLOT_IDS.length; i++) r = chooseCandidate(r, 0);
  return r;
}

describe('the road not taken', () => {
  it('remembers the passed-over cards of every seat, as they would have been read', () => {
    const run = playScene(startRun(7, {}));
    const h = run.history[0];
    expect(h.passed).toBeDefined();
    for (const s of SLOT_IDS) {
      const p = h.passed![s]!;
      expect(p.length).toBeGreaterThanOrEqual(2);
      expect(p.every((c) => !c.hidden)).toBe(true);
      expect(p.some((c) => c.cardId === h.reading[s].cardId)).toBe(false);
    }
  });

  it('scores each passed card in its seat and sums the regret', () => {
    const run = playScene(startRun(11, {}));
    const h = run.history[0];
    const scene = SCENES[h.sceneId];
    const road = roadNotTaken(scene, h, run.marks)!;
    expect(road.seats).toHaveLength(4);
    let regret = 0;
    for (const seat of road.seats) {
      const chosen = scoreSlot(scene, seat.slot, h.reading[seat.slot], run.marks).score;
      expect(seat.chosen.score).toBe(chosen);
      for (const p of seat.passed) expect(p.delta).toBeCloseTo(p.score - chosen);
      const best = Math.max(0, ...seat.passed.map((p) => p.delta));
      expect(seat.better?.delta ?? 0).toBe(best);
      regret += best;
    }
    expect(road.regret).toBeCloseTo(regret);
    expect(roadText(road)).toMatch(/best card|better card/);
    expect(roadNotTaken(scene, { ...h, passed: undefined }, run.marks)).toBeNull();
  });
});

describe('the hand remembered', () => {
  it('counts best-played seats, regret and clean scenes, and skips seats with no choice', async () => {
    const { emptyKnowledge, noteHand } = await import('../knowledge');
    const run = playScene(startRun(11, {}));
    const h = run.history[0];
    const road = roadNotTaken(SCENES[h.sceneId], h, run.marks)!;
    let k = noteHand(emptyKnowledge(), road);
    expect(k.hand!.seats).toBe(4);
    expect(k.hand!.best).toBe(road.seats.filter((s) => !s.better).length);
    expect(k.hand!.regret).toBeCloseTo(road.regret);
    expect(k.hand!.clean).toBe(road.regret === 0 ? 1 : 0);
    const none = { ...road, seats: road.seats.map((s) => ({ ...s, passed: [], better: null })), regret: 0 };
    expect(noteHand(k, none)).toBe(k);
    k = noteHand(k, road);
    expect(k.hand!.seats).toBe(8);
  });

  it('awards Sure Hand only when every seat of every scene took its best card', async () => {
    const { newSigils } = await import('../sigils');
    const { emptyKnowledge } = await import('../knowledge');
    const { advance, chooseRelic, isOver } = await import('../run');
    let run = { ...startRun(12, {}), vitality: 999 } as RunState;
    let guard = 0;
    while (!isOver(run) && guard++ < 40) {
      if (run.phase.kind === 'map') run = chooseNode(run, 0);
      while (run.phase.kind === 'reading') run = chooseCandidate(run, 0);
      if (run.phase.kind === 'resolved') run = advance(run);
      if (run.phase.kind === 'relic') run = chooseRelic(run, 0);
    }
    expect(run.phase.kind).toBe('ascended');
    // Every seat's only alternative is a twin of the card played: nothing better was in the hand.
    const twins = { ...run, history: run.history.map((h) => ({ ...h, passed: Object.fromEntries(SLOT_IDS.map((s) => [s, [{ ...h.reading[s] }]])) })) } as RunState;
    expect(newSigils(twins, emptyKnowledge())).toContain('sure-hand');
    // With no alternatives at all, the hand held no choice, so no sigil.
    const empty = { ...run, history: run.history.map((h) => ({ ...h, passed: Object.fromEntries(SLOT_IDS.map((s) => [s, []])) })) } as RunState;
    expect(newSigils(empty, emptyKnowledge())).not.toContain('sure-hand');
    const k = { ...emptyKnowledge(), hand: { seats: 120, best: 100, regret: 9, clean: 3 } };
    expect(newSigils(run, k)).toContain('steady-hand');
  });
});
