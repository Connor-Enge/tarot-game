import { describe, expect, it } from 'vitest';
import { reckon, reckoningText, resolveReading, tallyText } from '../resolve';
import { SCENES, SLOT_POSITION } from '../scenes';

describe('the reckoning', () => {
  const scene = SCENES.crossing;
  const reading = { vessel: { cardId: 'major-0', reversed: false }, threshold: { cardId: 'major-16', reversed: true }, hand: { cardId: 'wands-1', reversed: false }, wake: { cardId: 'cups-10', reversed: false } };
  it('names what each seat wanted and what the card brought, with the seat score', () => {
    const res = resolveReading(scene, reading);
    const r = reckon(scene, res);
    expect(r).toHaveLength(4);
    for (let i = 0; i < 4; i++) {
      expect(r[i].score).toBe(res.slots[i].score);
      for (const t of r[i].met) expect(scene.affinity[r[i].slot][t]).toBeGreaterThan(0);
      for (const t of r[i].against) expect(scene.affinity[r[i].slot][t]).toBeLessThan(0);
      const text = reckoningText(r[i], res.slots[i].card.name);
      expect(text).toContain(res.slots[i].card.name);
      expect(text.startsWith('This seat wanted')).toBe(true);
    }
    expect(r[1].reversed).toBe(true);
    expect(reckoningText(r[1], 'The Tower')).toContain('lay reversed');
  });
  it('tallies seats and named readings to the total and tier', () => {
    const res = resolveReading(scene, reading);
    const t = tallyText(res);
    expect(t).toContain('in all');
    expect(t).toContain(res.tier);
  });
  it('numbers the seats as a mini cross', () => {
    expect(SLOT_POSITION.vessel.n).toBe(1);
    expect(SLOT_POSITION.threshold.n).toBe(2);
    expect(SLOT_POSITION.hand.n).toBe(3);
    expect(SLOT_POSITION.wake.n).toBe(4);
  });
});
