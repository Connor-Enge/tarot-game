import { describe, expect, it } from 'vitest';
import { RESOLVES_TO_GLIMPSE, emptyKnowledge, loadKnowledge, noteAscension, noteDeath, noteResolved, saveKnowledge, tierOf } from '../knowledge';

describe('knowledge', () => {
  it('glimpses a card after enough resolves', () => {
    let k = emptyKnowledge();
    for (let i = 0; i < RESOLVES_TO_GLIMPSE; i++) k = noteResolved(k, 'major-0', 'hand');
    expect(tierOf(k, 'major-0')).toBe(1);
    expect(k.cards['major-0'].seats.hand).toBe(RESOLVES_TO_GLIMPSE);
  });

  it('death reveals the final spread and names the seats', () => {
    let k = emptyKnowledge();
    k = noteDeath(k, [
      { cardId: 'major-16', reversed: false },
      { cardId: 'major-13', reversed: true },
    ]);
    expect(tierOf(k, 'major-16')).toBe(2);
    expect(tierOf(k, 'major-13')).toBe(3);
    expect(k.seatsNamed).toBe(true);
    expect(k.deaths).toBe(1);
  });

  it('never lowers a tier', () => {
    let k = emptyKnowledge();
    k = noteAscension(k, [{ cardId: 'cups-1' }]);
    k = noteDeath(k, [{ cardId: 'cups-1', reversed: false }]);
    expect(tierOf(k, 'cups-1')).toBe(3);
  });

  it('round-trips through storage', () => {
    const mem = new Map<string, string>();
    const storage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
    const k = noteDeath(emptyKnowledge(), [{ cardId: 'major-1', reversed: false }]);
    saveKnowledge(k, storage);
    expect(loadKnowledge(storage)).toEqual(k);
    expect(loadKnowledge({ getItem: () => 'garbage' })).toEqual(emptyKnowledge());
  });
});

describe('whisper', () => {
  it('counts toward glimpsing', async () => {
    const { noteWhisper } = await import('../knowledge');
    let k = emptyKnowledge();
    for (let i = 0; i < RESOLVES_TO_GLIMPSE; i++) k = noteWhisper(k, 'swords-3');
    expect(tierOf(k, 'swords-3')).toBe(1);
  });
});

describe('witness + combos + reset', () => {
  it('records witnessed orientations and discovered combos', async () => {
    const { noteCombos, witnessed, resetKnowledge } = await import('../knowledge');
    let k = emptyKnowledge();
    k = noteResolved(k, 'major-16', 'threshold', true);
    expect(witnessed(k, 'major-16', true)).toBe(true);
    expect(witnessed(k, 'major-16', false)).toBe(false);
    k = noteCombos(k, ['tower-then-star', 'tower-then-star']);
    expect(k.combos).toEqual(['tower-then-star']);
    const removed: string[] = [];
    expect(resetKnowledge({ removeItem: (key) => void removed.push(key) })).toEqual(emptyKnowledge());
    expect(removed.length).toBe(1);
  });
});
