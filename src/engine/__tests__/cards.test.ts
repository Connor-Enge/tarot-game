import { describe, expect, it } from 'vitest';
import { CARDS, getCard } from '../cards';

describe('deck data', () => {
  it('has exactly 78 cards with unique ids', () => {
    expect(CARDS.length).toBe(78);
    expect(new Set(CARDS.map((c) => c.id)).size).toBe(78);
  });
  it('has 22 majors and 14 of each suit', () => {
    expect(CARDS.filter((c) => c.arcana === 'major').length).toBe(22);
    for (const suit of ['wands', 'cups', 'swords', 'pentacles']) {
      expect(CARDS.filter((c) => c.suit === suit).length).toBe(14);
    }
  });
  it('every card has hidden meaning content in both orientations', () => {
    for (const c of CARDS) {
      expect(c.tags.upright.length).toBeGreaterThan(0);
      expect(c.tags.reversed.length).toBeGreaterThan(0);
      expect(c.meaning.upright).toBeTruthy();
      expect(c.meaning.reversed).toBeTruthy();
      expect(c.omen.upright).toBeTruthy();
      expect(c.omen.reversed).toBeTruthy();
    }
  });
  it('throws on unknown id', () => {
    expect(() => getCard('nope')).toThrow();
  });
});
