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
