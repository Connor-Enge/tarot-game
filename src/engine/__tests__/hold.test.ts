import { describe, expect, it } from 'vitest';
import { canHold, chooseCandidate, chooseNode, holdCandidate, startRun, whisper } from '../run';

const start = (seed = 1) => chooseNode(startRun(seed, { startingClarity: 6 }), 0);

describe('hold', () => {
  it('keeps a candidate back and deals it into the next seat, marked held', () => {
    let run = start();
    const held = run.slots[0].candidates[1];
    expect(canHold(run, 1)).toBe(true);
    run = holdCandidate(run, 1);
    expect(run.clarity).toBe(5);
    expect(run.slots[0].candidates.length).toBe(2);
    expect(run.held?.cardId).toBe(held.cardId);
    expect(canHold(run, 0)).toBe(false); // one at a time
    run = chooseCandidate(run, 0);
    const next = run.slots[1].candidates;
    expect(next.length).toBe(4);
    const it = next.find((c) => c.cardId === held.cardId)!;
    expect(it.held).toBe(true);
    expect(it.reversed).toBe(held.reversed);
    expect(run.held).toBeNull();
  });
  it('is never allowed at the Wake, nor on the last card, nor without Clarity', () => {
    let run = start(2);
    for (let i = 0; i < 3; i++) run = chooseCandidate(run, 0);
    expect(run.activeSlot).toBe(3);
    expect(canHold(run, 0)).toBe(false);
    let thin = chooseNode(startRun(3, { startingClarity: 0 }), 0);
    expect(canHold(thin, 0)).toBe(false);
    thin = { ...thin, clarity: 6 };
    thin = holdCandidate(thin, 0);
    expect(thin.slots[0].candidates.length).toBe(2);
    expect(holdCandidate({ ...thin, held: null }, 0).slots[0].candidates.length).toBe(1);
    const one = holdCandidate({ ...thin, held: null }, 0);
    expect(canHold({ ...one, held: null }, 0)).toBe(false);
  });
  it('keeps whispered marks pointing at the same cards', () => {
    let run = start(4);
    run = whisper(run, 2);
    const whisperedCard = run.slots[0].candidates[2].cardId;
    run = holdCandidate(run, 0);
    expect(run.slots[0].whispered).toEqual([1]);
    expect(run.slots[0].candidates[1].cardId).toBe(whisperedCard);
  });
});
