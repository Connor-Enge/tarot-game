import { CARDS } from './cards';
import type { Rng } from './rng';

/** A card as drawn: identity + orientation. */
export interface DrawnCard {
  cardId: string;
  reversed: boolean;
  /** Dealt face down (Fog curse). The player chooses blind; the seat reveals it. */
  hidden?: boolean;
  /** The previous scene's Wake, following you into this Vessel. */
  echo?: boolean;
  /** The reader's keepsake, on the deal that first shows it. */
  yours?: boolean;
}

export interface DeckState {
  draw: string[];    // card ids, top of deck = end of array
  discard: string[];
}

export const REVERSED_CHANCE = 0.25;

export function createDeck(rng: Rng, cardIds: readonly string[] = CARDS.map((c) => c.id)): DeckState {
  return { draw: rng.shuffle(cardIds), discard: [] };
}

/** Draw `n` cards. Reshuffles the discard pile into the draw pile when empty. */
export function draw(deck: DeckState, rng: Rng, n: number, reversedChance = REVERSED_CHANCE): { deck: DeckState; cards: DrawnCard[] } {
  let drawPile = deck.draw.slice();
  let discard = deck.discard.slice();
  const cards: DrawnCard[] = [];
  for (let i = 0; i < n; i++) {
    if (drawPile.length === 0) {
      if (discard.length === 0) break;
      drawPile = rng.shuffle(discard);
      discard = [];
    }
    const cardId = drawPile.pop()!;
    cards.push({ cardId, reversed: rng.next() < reversedChance });
  }
  return { deck: { draw: drawPile, discard }, cards };
}

export function discard(deck: DeckState, cards: readonly DrawnCard[]): DeckState {
  return { draw: deck.draw, discard: [...deck.discard, ...cards.map((c) => c.cardId)] };
}
