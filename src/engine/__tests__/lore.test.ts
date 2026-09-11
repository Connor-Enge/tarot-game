import { describe, expect, it } from 'vitest';
import { CARDS } from '../cards';
import { getLore, LORE } from '../lore';

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
});
