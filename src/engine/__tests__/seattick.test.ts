import { describe, expect, it } from 'vitest';
import { chooseCandidate, chooseNode, seatTick, startRun } from '../run';
import { scoreSlot } from '../resolve';
import { SCENES } from '../scenes';

describe('seat tick', () => {
  it('is off by default', () => {
    const run = chooseNode(startRun(5, { startingClarity: 4 }), 0);
    expect(seatTick(run, run.slots[0].slot, run.slots[0].candidates[0])).toBe(0);
    expect(chooseCandidate(run, 0).clarity).toBe(4);
  });
  it('moves Clarity by one the moment a card lands, in the direction of its score', () => {
    let hit = 0;
    for (let seed = 1; seed < 80 && hit < 2; seed++) {
      const run = chooseNode(startRun(seed, { startingClarity: 4, seatTick: true }), 0);
      const c = run.slots[0].candidates[0];
      const score = scoreSlot(SCENES[run.map[0][0].sceneId], run.slots[0].slot, c, run.marks).score;
      const expected = score >= 1 ? 1 : score <= -1 ? -1 : 0;
      expect(seatTick(run, run.slots[0].slot, c)).toBe(expected);
      const next = chooseCandidate(run, 0);
      expect(next.clarity).toBe(4 + expected);
      if (expected !== 0) { hit++; expect(next.ticks).toBe(expected); }
    }
    expect(hit).toBe(2);
  });
  it('never takes Clarity below zero', () => {
    for (let seed = 1; seed < 80; seed++) {
      const run = chooseNode(startRun(seed, { startingClarity: 0, seatTick: true }), 0);
      expect(chooseCandidate(run, 0).clarity).toBeGreaterThanOrEqual(0);
    }
  });
});
