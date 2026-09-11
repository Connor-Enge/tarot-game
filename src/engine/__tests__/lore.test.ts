import { describe, expect, it } from 'vitest';
import { CARDS } from '../cards';
import { getLore, LORE, MINOR_KEYWORDS } from '../lore';

describe('lore', () => {
  it('every one of the 78 cards has a full guide page', () => {
    expect(CARDS.length).toBe(78);
    for (const c of CARDS) {
      const l = getLore(c.id);
      for (const key of ['description', 'upright', 'relationships', 'career', 'reversed'] as const) {
        expect(l[key].length, `${c.id} ${key}`).toBeGreaterThan(60);
        expect(l[key].trim().endsWith('.'), `${c.id} ${key} ends with a full stop`).toBe(true);
      }
      // The page names the card, so it cannot be mistaken for another's.
      expect(l.description.includes(c.name), `${c.id} description names the card`).toBe(true);
    }
    expect(Object.keys(LORE).length).toBe(78);
  });
  it('every Minor has its own keywords, upright and reversed, and the cards carry them', () => {
    const minors = CARDS.filter((c) => c.arcana === 'minor');
    expect(minors.length).toBe(56);
    for (const c of minors) {
      const kw = MINOR_KEYWORDS[c.id];
      expect(kw, c.id).toBeDefined();
      expect(kw.upright.length).toBeGreaterThanOrEqual(2);
      expect(kw.reversed.length).toBeGreaterThanOrEqual(2);
      expect(c.keywords).toEqual(kw);
    }
    // No two cards of a suit share the same upright keywords.
    for (const suit of ['wands', 'cups', 'swords', 'pentacles']) {
      const seen = new Set(minors.filter((c) => c.suit === suit).map((c) => c.keywords.upright.join('|')));
      expect(seen.size).toBe(14);
    }
  });
});
