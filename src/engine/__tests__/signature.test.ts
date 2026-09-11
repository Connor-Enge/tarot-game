import { describe, expect, it } from 'vitest';
import { emptyKnowledge, setSignature } from '../knowledge';
import { advance, chooseCandidate, chooseNode, chooseRelic, startRun } from '../run';

describe('signature', () => {
  it('only a mastered card may be chosen', () => {
    let k = emptyKnowledge();
    expect(setSignature(k, 'major-0').signature).toBeUndefined();
    k = { ...k, cards: { 'major-0': { tier: 3, resolved: 9, seats: {} } } };
    k = setSignature(k, 'major-0');
    expect(k.signature).toBe('major-0');
    expect(setSignature(k, null).signature).toBeUndefined();
  });
  it('is dealt upright into the first Vessel of a run', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const run = chooseNode(startRun(seed, { signature: 'major-13', reversedChance: 1 }), 0);
      const c = run.slots[0].candidates.find((x) => x.cardId === 'major-13');
      expect(c, `seed ${seed}`).toBeDefined();
      expect(c!.reversed).toBe(false);
    }
  });
  it('is ignored when the deck lacks the card', () => {
    const run = startRun(1, { signature: 'major-0', deck: ['cups-1', 'cups-2', 'cups-3', 'cups-4', 'cups-5', 'cups-6', 'cups-7', 'cups-8', 'cups-9', 'cups-10', 'cups-11', 'cups-12'] });
    expect(run.signature).toBeUndefined();
  });
});

describe('keepsake', () => {
  it('is charged, and marked yours on the deal that first shows it', () => {
    let run = startRun(3, { keepsake: 'major-17', reversedChance: 1 });
    expect(run.keepsake).toBe('major-17');
    expect(run.marks['major-17']).toBe('charged');
    let shown = 0;
    // Walk readings until the keepsake turns up; it should be flagged once and never again.
    for (let guard = 0; guard < 400; guard++) {
      if (run.phase.kind === 'map') { run = chooseNode(run, 0); continue; }
      if (run.phase.kind === 'resolved') { run = advance(run); continue; }
      if (run.phase.kind === 'relic') { run = chooseRelic(run, 0); continue; }
      if (run.phase.kind !== 'reading') break;
      const seat = run.slots[run.activeSlot];
      const hit = seat.candidates.find((c) => c.cardId === 'major-17');
      if (hit?.yours) shown++;
      if (hit) expect(hit.reversed).toBe(false);
      run = chooseCandidate(run, 0);
    }
    expect(shown).toBeLessThanOrEqual(1);
    expect(run.keepsakeShown === true).toBe(shown === 1);
  });
  it('is ignored when the deck lacks the card', () => {
    const run = startRun(1, { keepsake: 'major-0', deck: ['cups-1', 'cups-2', 'cups-3', 'cups-4', 'cups-5', 'cups-6', 'cups-7', 'cups-8', 'cups-9', 'cups-10', 'cups-11', 'cups-12'] });
    expect(run.keepsake).toBeUndefined();
  });
});
