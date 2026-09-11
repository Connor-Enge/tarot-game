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
  /** Orientations the player has watched resolve. Unlocks the omen line in the Codex. */
  witnessed?: { upright?: boolean; reversed?: boolean };
  /** How readings went when this card sat in each seat. Consequence, not meaning. */
  seatOutcomes?: Partial<Record<SlotId, { good: number; bad: number }>>;
  /** Times this card was on the table when the player died. */
  deathsWith?: number;
}

export interface Knowledge {
  version: 1;
  cards: Record<string, CardKnowledge>;
  /** Seat names unlock after the first death; before that only glyphs show. */
  seatsNamed: boolean;
  /** Named readings the player has produced at least once. */
  combos?: string[];
  /** Milestones earned. */
  sigils?: string[];
  /** Cards that have sat in the same reading: "a|b" (sorted) -> count. */
  links?: Record<string, number>;
  /** Cards that have been dealt into your hand at least once (face seen). */
  dealt?: Record<string, true>;
  /** Daily descents: last day played, current streak, best streak. */
  daily?: { last: string; streak: number; best: number };
  /** Study: correct answers and best streak. */
  study?: { correct: number; asked: number; bestStreak: number };
  /** Omens witnessed, in order. Capped. */
  omenLog?: { run: number; scene: string; seat: SlotId; cardId: string; reversed: boolean; tier: string }[];
  /** The final spread of the most recent run, for the title screen. */
  last?: { cards: { cardId: string; reversed: boolean }[]; outcome: string; returned: boolean; when: number };
  /** Per-descent records. */
  records?: Record<
    string,
    {
      runs: number;
      returns: number;
      bestDepth: number;
      deepestReturn?: number;
      /** The finest run so far: returned beats died, then deeper, then more good readings. */
      best?: { cards: { cardId: string; reversed: boolean }[]; depth: number; returned: boolean; good: number; road?: string };
    }
  >;
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
export function noteResolved(k: Knowledge, cardId: string, seat: SlotId, reversed = false, outcome: 'good' | 'bad' | 'even' = 'even'): Knowledge {
  const e = entry(k, cardId);
  const resolved = e.resolved + 1;
  const witnessed = { ...e.witnessed, [reversed ? 'reversed' : 'upright']: true };
  const so = e.seatOutcomes?.[seat] ?? { good: 0, bad: 0 };
  const seatOutcomes = {
    ...e.seatOutcomes,
    [seat]: { good: so.good + (outcome === 'good' ? 1 : 0), bad: so.bad + (outcome === 'bad' ? 1 : 0) },
  };
  let next: CardKnowledge = { ...e, resolved, witnessed, seatOutcomes, seats: { ...e.seats, [seat]: (e.seats[seat] ?? 0) + 1 } };
  if (resolved >= RESOLVES_TO_GLIMPSE) next = raise(next, 1);
  return { ...k, cards: { ...k.cards, [cardId]: next } };
}

/** A correct recall in Study counts toward glimpsing the card, like a whisper. */
export function noteStudy(k: Knowledge, cardId: string): Knowledge {
  return noteWhisper(k, cardId);
}

/** A whispered keyword counts toward glimpsing the card. */
export function noteWhisper(k: Knowledge, cardId: string): Knowledge {
  const e = entry(k, cardId);
  const resolved = e.resolved + 1;
  let next: CardKnowledge = { ...e, resolved };
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
    cards[c.cardId] = { ...raise(e, c.reversed ? 3 : 2), deathsWith: (e.deathsWith ?? 0) + 1 };
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

/** Four cards were read together. Remember each pair. */
export function noteLinks(k: Knowledge, cardIds: string[]): Knowledge {
  const links = { ...k.links };
  const ids = Array.from(new Set(cardIds)).sort();
  for (let i = 0; i < ids.length; i++)
    for (let j = i + 1; j < ids.length; j++) {
      const key = `${ids[i]}|${ids[j]}`;
      links[key] = (links[key] ?? 0) + 1;
    }
  return { ...k, links };
}

export function noteDealt(k: Knowledge, cardIds: string[]): Knowledge {
  const fresh = cardIds.filter((id) => !k.dealt?.[id]);
  if (fresh.length === 0) return k;
  const dealt = { ...k.dealt };
  for (const id of fresh) dealt[id] = true;
  return { ...k, dealt };
}

/** A daily descent began on `label` (YYYY-MM-DD, UTC). Consecutive days build a streak. */
export function noteDaily(k: Knowledge, label: string): Knowledge {
  const prev = k.daily;
  if (prev?.last === label) return k;
  const yesterday = (() => {
    const d = new Date(`${label}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  })();
  const streak = prev?.last === yesterday ? prev.streak + 1 : 1;
  return { ...k, daily: { last: label, streak, best: Math.max(prev?.best ?? 0, streak) } };
}

/** The streak still stands if the last daily was today or yesterday. */
export function dailyStreakAlive(k: Knowledge, today: string): number {
  const d = k.daily;
  if (!d) return 0;
  if (d.last === today) return d.streak;
  const y = new Date(`${today}T00:00:00Z`);
  y.setUTCDate(y.getUTCDate() - 1);
  return d.last === y.toISOString().slice(0, 10) ? d.streak : 0;
}

export function noteStudyResult(k: Knowledge, correct: boolean, streak: number): Knowledge {
  const prev = k.study ?? { correct: 0, asked: 0, bestStreak: 0 };
  return { ...k, study: { correct: prev.correct + (correct ? 1 : 0), asked: prev.asked + 1, bestStreak: Math.max(prev.bestStreak, streak) } };
}

/**
 * Build a study question from witnessed omens: one omen line and three
 * witnessed cards, one of which it belongs to. Pure; the caller supplies
 * randomness. Returns null when fewer than three cards have been witnessed.
 */
export function studyQuestion(
  k: Knowledge,
  rng: { int(max: number): number; shuffle<T>(arr: readonly T[]): T[] },
  cardOmen: (cardId: string, reversed: boolean) => string,
  filter: (cardId: string) => boolean = () => true,
): { omen: string; answer: string; reversed: boolean; choices: string[] } | null {
  const pool: { cardId: string; reversed: boolean }[] = [];
  for (const [id, e] of Object.entries(k.cards)) {
    if (!filter(id)) continue;
    if (e.witnessed?.upright) pool.push({ cardId: id, reversed: false });
    if (e.witnessed?.reversed) pool.push({ cardId: id, reversed: true });
  }
  const ids = Array.from(new Set(pool.map((p) => p.cardId)));
  if (ids.length < 3) return null;
  const pick = pool[rng.int(pool.length)];
  const others = rng.shuffle(ids.filter((id) => id !== pick.cardId)).slice(0, 2);
  const choices = rng.shuffle([pick.cardId, ...others]);
  return { omen: cardOmen(pick.cardId, pick.reversed), answer: pick.cardId, reversed: pick.reversed, choices };
}

export const OMEN_LOG_CAP = 240;

export function noteOmens(k: Knowledge, entries: { scene: string; seat: SlotId; cardId: string; reversed: boolean; tier: string }[]): Knowledge {
  const run = k.runs;
  const log = [...(k.omenLog ?? []), ...entries.map((e) => ({ run, ...e }))];
  return { ...k, omenLog: log.slice(-OMEN_LOG_CAP) };
}

export function noteLast(k: Knowledge, cards: { cardId: string; reversed: boolean }[], outcome: string, returned: boolean, when = Date.now()): Knowledge {
  return { ...k, last: { cards: cards.map((c) => ({ cardId: c.cardId, reversed: c.reversed })), outcome, returned, when } };
}

export function noteCombos(k: Knowledge, ids: string[]): Knowledge {
  if (ids.length === 0) return k;
  return { ...k, combos: Array.from(new Set([...(k.combos ?? []), ...ids])) };
}

export function noteSigils(k: Knowledge, ids: string[]): Knowledge {
  if (ids.length === 0) return k;
  return { ...k, sigils: Array.from(new Set([...(k.sigils ?? []), ...ids])) };
}

/** A run ended on `descent`, reaching `depth` scenes; `returned` if it ascended. */
export function noteRecord(
  k: Knowledge,
  descent: string,
  depth: number,
  returned: boolean,
  difficulty = 0,
  spread?: { cards: { cardId: string; reversed: boolean }[]; good: number; road?: string },
): Knowledge {
  const prev = k.records?.[descent] ?? { runs: 0, returns: 0, bestDepth: 0, deepestReturn: 0 };
  let best = prev.best;
  if (spread) {
    const candidate = { cards: spread.cards.map((c) => ({ cardId: c.cardId, reversed: c.reversed })), depth, returned, good: spread.good, road: spread.road };
    const beats = !best || (candidate.returned && !best.returned) || (candidate.returned === best.returned && (candidate.depth > best.depth || (candidate.depth === best.depth && candidate.good > best.good)));
    if (beats) best = candidate;
  }
  return {
    ...k,
    records: {
      ...k.records,
      [descent]: {
        runs: prev.runs + 1,
        returns: prev.returns + (returned ? 1 : 0),
        bestDepth: Math.max(prev.bestDepth, depth),
        deepestReturn: returned ? Math.max(prev.deepestReturn ?? 0, difficulty) : (prev.deepestReturn ?? 0),
        best,
      },
    },
  };
}

export function noteRunStarted(k: Knowledge): Knowledge {
  return { ...k, runs: k.runs + 1 };
}

export function tierOf(k: Knowledge, cardId: string): Tier {
  return entry(k, cardId).tier;
}

export function witnessed(k: Knowledge, cardId: string, reversed: boolean): boolean {
  const w = entry(k, cardId).witnessed;
  return !!(reversed ? w?.reversed : w?.upright);
}

/** Wipe everything. The Codex is the only progression, so this is a true reset. */
export function resetKnowledge(storage: Pick<Storage, 'removeItem'> | undefined = globalThis.localStorage): Knowledge {
  try {
    storage?.removeItem(KEY);
  } catch {
    /* ignore */
  }
  return emptyKnowledge();
}

// --- persistence -----------------------------------------------------------

const KEY = 'arcana-descent.knowledge.v1';

/** Drop references to cards that no longer exist (a deck change between builds). */
export function pruneUnknown(k: Knowledge, known: Set<string> | null): Knowledge {
  if (!known) return k;
  const cards = Object.fromEntries(Object.entries(k.cards).filter(([id]) => known.has(id)));
  const dealt = k.dealt ? Object.fromEntries(Object.entries(k.dealt).filter(([id]) => known.has(id))) : undefined;
  const links = k.links ? Object.fromEntries(Object.entries(k.links).filter(([key]) => key.split('|').every((id) => known.has(id)))) : undefined;
  const omenLog = k.omenLog?.filter((e) => known.has(e.cardId));
  const last = k.last && k.last.cards.every((c) => known.has(c.cardId)) ? k.last : undefined;
  return { ...k, cards, dealt, links, omenLog, last };
}

let knownIds: Set<string> | null = null;
/** Called once by the app with the live deck so loads can prune. Tests may skip it. */
export function setKnownCards(ids: Iterable<string>): void {
  knownIds = new Set(ids);
}

export function loadKnowledge(storage: Pick<Storage, 'getItem'> | undefined = globalThis.localStorage): Knowledge {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return emptyKnowledge();
    const parsed = JSON.parse(raw) as Knowledge;
    if (parsed.version !== 1 || typeof parsed.cards !== 'object') return emptyKnowledge();
    return pruneUnknown(parsed, knownIds);
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

/**
 * The word a card whispers depends on the seat it is being considered for.
 * The same card says something different in the Hand than in the Wake.
 */
export function whisperWords(keywords: string[], seat: SlotId, count = 1): string[] {
  const order: SlotId[] = ['vessel', 'threshold', 'hand', 'wake'];
  const start = order.indexOf(seat);
  const out: string[] = [];
  for (let i = 0; i < Math.min(count, keywords.length); i++) out.push(keywords[(start + i) % keywords.length]);
  return out;
}

// --- transfer --------------------------------------------------------------

/** A compact, copyable form of the Codex: base64 of JSON with a prefix. */
export function exportKnowledge(k: Knowledge): string {
  const json = JSON.stringify(k);
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return `ARCANA1.${btoa(bin)}`;
}

export function importKnowledge(text: string): Knowledge | null {
  try {
    const trimmed = text.trim();
    if (!trimmed.startsWith('ARCANA1.')) return null;
    const bin = atob(trimmed.slice('ARCANA1.'.length));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as Knowledge;
    if (parsed.version !== 1 || typeof parsed.cards !== 'object' || typeof parsed.runs !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Read a seed (and descent, depth) out of a share text or a bare base36 seed. */
export function parseShare(text: string, descentNames: { id: string; name: string }[]): { seed: number; descent?: string; depth?: number } | null {
  const t = text.trim();
  if (!t) return null;
  const m = t.match(/seed\s+([0-9a-z]+)/i);
  const raw = m ? m[1] : /^[0-9a-z]+$/i.test(t) ? t : null;
  if (!raw) return null;
  const seed = parseInt(raw, 36);
  if (Number.isNaN(seed)) return null;
  const out: { seed: number; descent?: string; depth?: number } = { seed: seed >>> 0 };
  for (const d of descentNames) if (t.includes(d.name)) out.descent = d.id;
  const dm = t.match(/Depth\s+(\d)/);
  if (dm) out.depth = Number(dm[1]);
  return out;
}

/** Forget the road, keep the cards: counters, records, sigils and study go; card knowledge, links and the book stay. */
export function resetRecords(k: Knowledge): Knowledge {
  const { records: _r, last: _l, sigils: _s, study: _st, ...rest } = k;
  void _r; void _l; void _s; void _st;
  return { ...rest, runs: 0, deaths: 0, ascensions: 0 };
}

export const READER_TITLES = ['Unread', 'Novice', 'Reader', 'Adept', 'Seer', 'Oracle'] as const;

/** A title by share of the deck known: Novice at the first card, Oracle at the last fifth. */
export function readerTitle(k: Knowledge, deckSize = 78): string {
  const known = Object.values(k.cards).filter((c) => c.tier > 0).length;
  if (known === 0) return READER_TITLES[0];
  return READER_TITLES[Math.min(READER_TITLES.length - 1, Math.floor((known / deckSize) * 5) + 1)];
}
