import { describe, expect, it } from 'vitest';
import { canTurn, chooseNode, startRun, turnCandidate, TURN_COST } from '../run';

describe('turn', () => {
  it('flips a candidate once per scene for clarity', () => {
    let run = chooseNode(startRun(3), 0);
    const before = run.slots[0].candidates[0].reversed;
    expect(canTurn(run, 0)).toBe(true);
    run = turnCandidate(run, 0);
    expect(run.slots[0].candidates[0].reversed).toBe(!before);
    expect(run.clarity).toBe(2 - TURN_COST);
    expect(canTurn(run, 1)).toBe(false);
    expect(turnCandidate(run, 1)).toBe(run);
  });
  it('refuses marked cards, hidden cards, and empty pockets', () => {
    let run = chooseNode(startRun(3), 0);
    const id = run.slots[0].candidates[0].cardId;
    expect(canTurn({ ...run, marks: { [id]: 'charged' } }, 0)).toBe(false);
    expect(canTurn({ ...run, clarity: 0 }, 0)).toBe(false);
    run = { ...run, slots: [{ ...run.slots[0], candidates: run.slots[0].candidates.map((c, i) => (i === 0 ? { ...c, hidden: true } : c)) }] };
    expect(canTurn(run, 0)).toBe(false);
  });
});
