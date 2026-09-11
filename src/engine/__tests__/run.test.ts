import { describe, expect, it } from 'vitest';
import { CANDIDATES_PER_SLOT, advance, chooseCandidate, finalSpread, isOver, readingOf, redrawActive, startRun } from '../run';
import { SLOT_IDS } from '../scenes';

function playScene(run: ReturnType<typeof startRun>, pick = 0) {
  for (let i = 0; i < SLOT_IDS.length; i++) run = chooseCandidate(run, pick);
  return run;
}

describe('run', () => {
  it('deals three candidates for the first seat', () => {
    const run = startRun(123);
    expect(run.slots.length).toBe(1);
    expect(run.slots[0].candidates.length).toBe(CANDIDATES_PER_SLOT);
    expect(run.path.length).toBe(7);
    expect(run.path[6]).toBe('abyss');
  });

  it('walks seat by seat and resolves after the fourth choice', () => {
    let run = startRun(123);
    run = chooseCandidate(run, 1);
    expect(run.activeSlot).toBe(1);
    expect(run.slots.length).toBe(2);
    expect(run.deck.discard.length).toBe(2); // two rejected
    run = chooseCandidate(run, 0);
    run = chooseCandidate(run, 2);
    expect(run.phase.kind).toBe('reading');
    run = chooseCandidate(run, 0);
    expect(['resolved', 'dead']).toContain(run.phase.kind);
    expect(readingOf(run)).not.toBeNull();
    expect(run.history.length).toBe(1);
    // 12 dealt: 8 rejected + 4 played all end in discard
    expect(run.deck.discard.length).toBe(12);
  });

  it('is deterministic per seed', () => {
    const a = playScene(startRun(99), 2);
    const b = playScene(startRun(99), 2);
    expect(a).toEqual(b);
  });

  it('redraw costs clarity and re-deals the active seat', () => {
    let run = startRun(5);
    const before = run.slots[0].candidates;
    run = redrawActive(run);
    expect(run.clarity).toBe(1);
    expect(run.slots[0].candidates).not.toEqual(before);
    run = redrawActive(run);
    const after = run.slots[0].candidates;
    expect(run.clarity).toBe(0);
    expect(redrawActive(run).slots[0].candidates).toEqual(after); // can't afford
  });

  it('ends in death or ascension within the path', () => {
    let run = startRun(2024);
    let guard = 0;
    while (!isOver(run) && guard++ < 20) {
      run = playScene(run, 0);
      if (run.phase.kind === 'resolved') run = advance(run);
    }
    expect(isOver(run)).toBe(true);
    expect(finalSpread(run).length).toBe(4);
    if (run.phase.kind === 'dead') expect(run.vitality).toBe(0);
    else expect(run.sceneIndex).toBe(6);
  });
});
