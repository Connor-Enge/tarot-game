import { describe, expect, it } from 'vitest';
import { createDeck, discard, draw } from '../deck';
import { createRng } from '../rng';

describe('deck', () => {
  it('draws without replacement and reshuffles discard when empty', () => {
    const rng = createRng(1);
    let deck = createDeck(rng, ['a', 'b', 'c']);
    const first = draw(deck, rng, 3);
    expect(first.cards.map((c) => c.cardId).sort()).toEqual(['a', 'b', 'c']);
    deck = discard(first.deck, first.cards);
    expect(deck.draw.length).toBe(0);
    expect(deck.discard.length).toBe(3);
    const second = draw(deck, rng, 2);
    expect(second.cards.length).toBe(2);
    expect(second.deck.discard.length).toBe(0);
    expect(second.deck.draw.length).toBe(1);
  });
  it('is deterministic for a seed', () => {
    const a = draw(createDeck(createRng(42)), createRng(7), 12);
    const b = draw(createDeck(createRng(42)), createRng(7), 12);
    expect(a.cards).toEqual(b.cards);
  });
});
