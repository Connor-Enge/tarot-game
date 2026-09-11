import type { SlotId } from './scenes';

/**
 * The Codex: what the player has *earned the right to know* about each card.
 * This is the entire meta-progression. There is no power creep; only understanding.
 *
 *  0  unknown   - name and art only
 *  1  glimpsed  - keywords (upright)
 *  2  known     - upright meaning text
 *  3  mastered  - reversed meaning + keywords
 */
export type Tier = 0 | 1 | 2 | 3;

export interface CardKnowledge {
  tier: Tier;
  /** Times this card has resolved in a reading (any seat). */
  resolved: number;
  /** Seats this card has been chosen into. Used for per-seat hints later. */
  seats: Partial<Record<SlotId, number>>;
}

export interface Knowledge {
  version: 1;
  cards: Record<string, CardKnowledge>;
  /** Seat names unlock after the first death; before that only glyphs show. */
  seatsNamed: boolean;
  runs: number;
  deaths: number;
  ascensions: number;
}

export const RESOLVES_TO_GLIMPSE = 3;

export function emptyKnowledge(): Knowledge {
  return { version: 1, cards: {}, seatsNamed: false, runs: 0, deaths: 0, ascensions: 0 };
}

function entry(k: Knowledge, cardId: string): CardKnowledge {
  return k.cards[cardId] ?? { tier: 0, resolved: 0, seats: {} };
}

function raise(k: CardKnowledge, tier: Tier): CardKnowledge {
  return k.tier >= tier ? k : { ...k, tier };
}

/** A card was chosen into a seat and the reading resolved. */
export function noteResolved(k: Knowledge, cardId: string, seat: SlotId): Knowledge {
  const e = entry(k, cardId);
  const resolved = e.resolved + 1;
  let next: CardKnowledge = { ...e, resolved, seats: { ...e.seats, [seat]: (e.seats[seat] ?? 0) + 1 } };
  if (resolved >= RESOLVES_TO_GLIMPSE) next = raise(next, 1);
  return { ...k, cards: { ...k.cards, [cardId]: next } };
}

/**
 * The player died with these four cards on the table.
 * The cards that killed you are the cards you finally understand.
 */
export function noteDeath(k: Knowledge, finalSpread: { cardId: string; reversed: boolean }[]): Knowledge {
  let cards = { ...k.cards };
  for (const c of finalSpread) {
    const e = entry({ ...k, cards }, c.cardId);
    cards[c.cardId] = raise(e, c.reversed ? 3 : 2);
  }
  return { ...k, cards, seatsNamed: true, deaths: k.deaths + 1 };
}

/** Reaching the bottom and surviving masters the final spread outright. */
export function noteAscension(k: Knowledge, finalSpread: { cardId: string }[]): Knowledge {
  let cards = { ...k.cards };
  for (const c of finalSpread) {
    cards[c.cardId] = raise(entry({ ...k, cards }, c.cardId), 3);
  }
  return { ...k, cards, seatsNamed: true, ascensions: k.ascensions + 1 };
}

export function noteRunStarted(k: Knowledge): Knowledge {
  return { ...k, runs: k.runs + 1 };
}

export function tierOf(k: Knowledge, cardId: string): Tier {
  return entry(k, cardId).tier;
}

// --- persistence -----------------------------------------------------------

const KEY = 'arcana-descent.knowledge.v1';

export function loadKnowledge(storage: Pick<Storage, 'getItem'> | undefined = globalThis.localStorage): Knowledge {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return emptyKnowledge();
    const parsed = JSON.parse(raw) as Knowledge;
    if (parsed.version !== 1) return emptyKnowledge();
    return parsed;
  } catch {
    return emptyKnowledge();
  }
}

export function saveKnowledge(k: Knowledge, storage: Pick<Storage, 'setItem'> | undefined = globalThis.localStorage): void {
  try {
    storage?.setItem(KEY, JSON.stringify(k));
  } catch {
    /* private mode etc. */
  }
}
