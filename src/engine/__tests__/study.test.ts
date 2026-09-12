import { describe, expect, it } from 'vitest';
import { emptyKnowledge, seatQuestion } from '../knowledge';
import { createRng } from '../rng';

describe('seat questions', () => {
  it('asks where a witnessed card did its omen, accepting every seat it was seen in', () => {
    const k = { ...emptyKnowledge(), omenLog: [
      { run: 1, scene: 'crossing', seat: 'hand' as const, cardId: 'major-0', reversed: false, tier: 'boon' },
      { run: 1, scene: 'well', seat: 'wake' as const, cardId: 'major-0', reversed: false, tier: 'neutral' },
      { run: 1, scene: 'well', seat: 'vessel' as const, cardId: 'major-0', reversed: true, tier: 'harm' },
    ] };
    const q = seatQuestion(k, createRng(1), () => 'omen');
    expect(q).not.toBeNull();
    expect(q!.cardId).toBe('major-0');
    if (!q!.reversed) expect(q!.seats.sort()).toEqual(['hand', 'wake']);
    else expect(q!.seats).toEqual(['vessel']);
    expect(seatQuestion(emptyKnowledge(), createRng(1), () => 'omen')).toBeNull();
  });
});

describe('the kin question', () => {
  it('asks which card a bonded card knows, with two strangers for company', async () => {
    const { emptyKnowledge, noteLinks, kinQuestion, BOND_MIN } = await import('../knowledge');
    const { createRng } = await import('../rng');
    let k = emptyKnowledge();
    for (let i = 0; i < BOND_MIN; i++) k = noteLinks(k, ['major-0', 'major-19']);
    for (const id of ['major-0', 'major-19', 'cups-2', 'wands-5', 'swords-3']) k.cards[id] = { tier: 1, resolved: 1, seats: {} } as never;
    const q = kinQuestion(k, createRng(3))!;
    expect(q).not.toBeNull();
    expect(['major-0', 'major-19']).toContain(q.cardId);
    expect(q.kin).toEqual([q.cardId === 'major-0' ? 'major-19' : 'major-0']);
    expect(q.choices).toHaveLength(3);
    expect(q.choices.filter((c) => q.kin.includes(c))).toHaveLength(1);
    expect(q.choices.every((c) => c !== q.cardId)).toBe(true);
    expect(kinQuestion(emptyKnowledge(), createRng(3))).toBeNull();
  });
});
