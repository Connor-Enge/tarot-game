import { describe, expect, it } from 'vitest';
import { emptyKnowledge, setSignature } from '../knowledge';
import { chooseNode, startRun } from '../run';

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
