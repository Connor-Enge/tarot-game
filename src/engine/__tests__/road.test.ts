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
