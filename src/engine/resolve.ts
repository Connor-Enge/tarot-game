import { CARDS, cardTags, getCard, type Card, type Tag } from './cards';
import type { DrawnCard } from './deck';
import { SLOT_IDS, TIERS, type OutcomeTier, type Scene, type SlotId } from './scenes';

export type Reading = Record<SlotId, DrawnCard>;

export interface SlotResolution {
  slot: SlotId;
  card: Card;
  reversed: boolean;
  score: number;
  /** Which tags actually mattered here, for the (hidden) post-mortem. */
  hits: { tag: Tag; weight: number }[];
}

export interface Resolution {
  slots: SlotResolution[];
  comboIds: string[];
  comboNotes: string[];
  total: number;
  tier: OutcomeTier;
  deltas: { vitality: number; clarity: number };
  narration: string[];
  /** Pairs on the table that know each other, and what they added. */
  kinship?: { pairs: [string, string][]; score: number };
}

/**
 * Cross-card combos. This is the extension point for "the combined meaning":
 * pairs/sets of cards that override or amplify the sum-of-tags read.
 * Keep these evocative and rare; they're the moments players tell stories about.
 */
interface Combo {
  id: string;
  when: (r: Reading) => boolean;
  score: number;
  note: string;
}

const has = (r: Reading, cardId: string, slot?: SlotId) =>
  slot ? r[slot].cardId === cardId : SLOT_IDS.some((s) => r[s].cardId === cardId);

const COMBOS: Combo[] = [
  {
    id: 'tower-then-star',
    when: (r) => has(r, 'major-16', 'threshold') && has(r, 'major-17', 'wake'),
    score: 3,
    note: 'After the fall, a light.',
  },
  {
    id: 'death-in-the-wake',
    when: (r) => has(r, 'major-13', 'wake') && !r.wake.reversed,
    score: 1,
    note: 'Something ends, and that was always the point.',
  },
  {
    id: 'devil-vessel-lovers-hand',
    when: (r) => has(r, 'major-15', 'vessel') && has(r, 'major-6', 'hand'),
    score: -3,
    note: 'You chose with the chain still on.',
  },
  {
    id: 'all-major',
    when: (r) => SLOT_IDS.every((s) => getCard(r[s].cardId).arcana === 'major'),
    score: 2,
    note: 'Four great arcana. The room went quiet.',
  },
  {
    id: 'sun-in-the-wake',
    when: (r) => has(r, 'major-19', 'wake') && !r.wake.reversed,
    score: 2,
    note: 'Whatever else, it ended in daylight.',
  },
  {
    id: 'moon-vessel',
    when: (r) => has(r, 'major-18', 'vessel') && !r.vessel.reversed,
    score: -2,
    note: 'You came to this already dreaming.',
  },
  {
    id: 'fool-and-world',
    when: (r) => has(r, 'major-0') && has(r, 'major-21'),
    score: 3,
    note: 'The first step and the last, in one hand.',
  },
  {
    id: 'hermit-hand',
    when: (r) => has(r, 'major-9', 'hand') && !r.hand.reversed,
    score: 1,
    note: 'You did the quiet thing.',
  },
  {
    id: 'wheel-anywhere-reversed',
    when: (r) => SLOT_IDS.some((s) => r[s].cardId === 'major-10' && r[s].reversed),
    score: -1,
    note: 'The wheel caught on something.',
  },
  {
    id: 'three-swords-threshold',
    when: (r) => has(r, 'swords-3', 'threshold'),
    score: -1,
    note: 'What stood before you had already been wounded, and knew it.',
  },
  {
    id: 'court-of-four',
    when: (r) => SLOT_IDS.every((s) => getCard(r[s].cardId).number >= 11 && getCard(r[s].cardId).arcana === 'minor'),
    score: 2,
    note: 'A full court. Something bowed.',
  },
  {
    id: 'aces-high',
    when: (r) => SLOT_IDS.filter((s) => getCard(r[s].cardId).number === 1 && getCard(r[s].cardId).arcana === 'minor').length >= 2,
    score: 1,
    note: 'Two beginnings at once. The air changed.',
  },
  {
    id: 'strength-vs-devil',
    when: (r) => has(r, 'major-8', 'hand') && has(r, 'major-15', 'threshold'),
    score: 3,
    note: 'You met the chain with an open hand.',
  },
  {
    id: 'temperance-storm',
    when: (r) => has(r, 'major-14') && has(r, 'major-16'),
    score: 1,
    note: 'Even the fall was measured.',
  },
  {
    id: 'judgement-wake',
    when: (r) => has(r, 'major-20', 'wake'),
    score: 1,
    note: 'What you did was called by name.',
  },
  {
    id: 'hanged-hand',
    when: (r) => has(r, 'major-12', 'hand') && !r.hand.reversed,
    score: 1,
    note: 'You did nothing, and it was the right thing.',
  },
  {
    id: 'ten-and-ace',
    when: (r) => {
      const minors = SLOT_IDS.map((s) => getCard(r[s].cardId)).filter((c) => c.arcana === 'minor');
      return minors.some((a) => a.number === 1 && minors.some((b) => b.number === 10 && b.suit === a.suit));
    },
    score: 1,
    note: 'An ending and a beginning of the same kind.',
  },
  {
    id: 'two-queens',
    when: (r) => SLOT_IDS.filter((s) => getCard(r[s].cardId).arcana === 'minor' && getCard(r[s].cardId).number === 13).length >= 2,
    score: 0.5,
    note: 'Two queens conferred over you.',
  },
  {
    id: 'chariot-slipping',
    when: (r) => has(r, 'major-7', 'vessel') && r.vessel.reversed,
    score: -2,
    note: 'You came in with the reins already slipping.',
  },
  {
    id: 'priestess-threshold',
    when: (r) => has(r, 'major-2', 'threshold'),
    score: 0.5,
    note: 'The veil was the door.',
  },
  {
    id: 'two-thrones',
    when: (r) => has(r, 'major-3') && has(r, 'major-4'),
    score: 1,
    note: 'The two thrones agreed.',
  },
  {
    id: 'magician-hand',
    when: (r) => has(r, 'major-1', 'hand') && !r.hand.reversed,
    score: 1,
    note: 'The trick was yours, and it worked.',
  },
  {
    id: 'fool-hand-reversed',
    when: (r) => has(r, 'major-0', 'hand') && r.hand.reversed,
    score: -1.5,
    note: 'You stepped without looking, and the edge was there.',
  },
  {
    id: 'hierophant-threshold',
    when: (r) => has(r, 'major-5', 'threshold'),
    score: 0.5,
    note: 'The rule was older than the door.',
  },
  {
    id: 'justice-wake',
    when: (r) => has(r, 'major-11', 'wake') && !r.wake.reversed,
    score: 1,
    note: 'What you gave came back, weighed.',
  },
  {
    id: 'star-into-fog',
    when: (r) => has(r, 'major-17', 'vessel') && has(r, 'major-18', 'threshold'),
    score: 1.5,
    note: 'You carried a light into the fog, and it held.',
  },
  {
    id: 'sun-and-moon',
    when: (r) => has(r, 'major-19') && has(r, 'major-18'),
    score: 0.5,
    note: 'Day and night sat at the same table.',
  },
  {
    id: 'world-wake',
    when: (r) => has(r, 'major-21', 'wake') && !r.wake.reversed,
    score: 1,
    note: 'It closed, whole.',
  },
  {
    id: 'ten-swords-hand',
    when: (r) => has(r, 'swords-10', 'hand') && !r.hand.reversed,
    score: -2,
    note: 'You did the last thing that could be done, and it was the worst one.',
  },
  {
    id: 'three-cups-wake',
    when: (r) => has(r, 'cups-3', 'wake') && !r.wake.reversed,
    score: 1,
    note: 'There was singing after, and you were in it.',
  },
  {
    id: 'knights-quarrel',
    when: (r) => SLOT_IDS.filter((s) => getCard(r[s].cardId).arcana === 'minor' && getCard(r[s].cardId).number === 12).length >= 2,
    score: -1,
    note: 'The knights argued over who would go first.',
  },
  {
    id: 'four-upright',
    when: (r) => SLOT_IDS.every((s) => !r[s].reversed),
    score: 0.5,
    note: 'Every card lay as it should.',
  },
  {
    id: 'four-reversed',
    when: (r) => SLOT_IDS.every((s) => r[s].reversed),
    score: 2,
    note: 'Every card lay wrong, and together they were right.',
  },
  {
    id: 'one-suit',
    when: (r) => {
      const suits = SLOT_IDS.map((s) => getCard(r[s].cardId)).map((c) => (c.arcana === 'minor' ? c.suit : null));
      return suits.every((x) => x !== null && x === suits[0]);
    },
    score: 1.5,
    note: 'The whole reading spoke in one element.',
  },
  {
    id: 'three-of-a-kind',
    when: (r) => {
      const nums = SLOT_IDS.map((s) => getCard(r[s].cardId)).filter((c) => c.arcana === 'minor').map((c) => c.number);
      return nums.some((n) => nums.filter((m) => m === n).length >= 3);
    },
    score: 0.5,
    note: 'Three of a kind, and the table noticed.',
  },
  {
    id: 'star-hand',
    when: (r) => has(r, 'major-17', 'hand') && !r.hand.reversed,
    score: 1,
    note: 'You reached for the light, and it was there.',
  },
  {
    id: 'lovers-threshold-reversed',
    when: (r) => has(r, 'major-6', 'threshold') && r.threshold.reversed,
    score: -1,
    note: 'The choice stood in the way, and it had already been made wrong.',
  },
  {
    id: 'death-and-tower',
    when: (r) => has(r, 'major-13') && has(r, 'major-16') && !has(r, 'major-17'),
    score: -1.5,
    note: 'Two endings, and nothing between them to begin.',
  },
  {
    id: 'devil-hand-reversed',
    when: (r) => has(r, 'major-15', 'hand') && r.hand.reversed,
    score: 1,
    note: 'You let go of the chain.',
  },
  {
    id: 'empress-wake',
    when: (r) => has(r, 'major-3', 'wake') && !r.wake.reversed,
    score: 0.5,
    note: 'Something grew where you had been.',
  },
  {
    id: 'ace-vessel',
    when: (r) => getCard(r.vessel.cardId).arcana === 'minor' && getCard(r.vessel.cardId).number === 1 && !r.vessel.reversed,
    score: 0.5,
    note: 'It began clean.',
  },
  {
    id: 'ten-wake',
    when: (r) => (r.wake.cardId === 'cups-10' || r.wake.cardId === 'pentacles-10') && !r.wake.reversed,
    score: 0.5,
    note: 'The count came full.',
  },
  {
    id: 'wands-ten-hand',
    when: (r) => has(r, 'wands-10', 'hand') && !r.hand.reversed,
    score: -1,
    note: 'You carried all of it, and it was too much.',
  },
  {
    id: 'seven-swords-hand',
    when: (r) => has(r, 'swords-7', 'hand') && !r.hand.reversed,
    score: -1,
    note: 'You took the quiet road, and it was watched.',
  },
  {
    id: 'two-pages',
    when: (r) => SLOT_IDS.filter((s) => getCard(r[s].cardId).arcana === 'minor' && getCard(r[s].cardId).number === 11).length >= 2,
    score: 0.5,
    note: 'Two pages, both of them carrying news.',
  },
  {
    id: 'two-kings',
    when: (r) => SLOT_IDS.filter((s) => getCard(r[s].cardId).arcana === 'minor' && getCard(r[s].cardId).number === 14).length >= 2,
    score: 0.5,
    note: 'Two crowns, and for once they agreed.',
  },
  {
    id: 'two-fives',
    when: (r) => SLOT_IDS.filter((s) => getCard(r[s].cardId).arcana === 'minor' && getCard(r[s].cardId).number === 5).length >= 2,
    score: -1,
    note: 'Two fives. Nobody left the table happy.',
  },
];

/**
 * Named readings within reach: with every seat but one placed, which of the
 * readings the player has already found could still be completed by some
 * card in the last seat. Only found readings are named, and the card that
 * would complete one is never said. A tease, not a hint.
 */
export function namedWithinReach(placed: Partial<Reading>, known: readonly string[]): { id: string; note: string; score: number }[] {
  const empty = SLOT_IDS.filter((s) => !placed[s]);
  if (empty.length !== 1 || known.length === 0) return [];
  const last = empty[0];
  const candidates = COMBOS.filter((c) => known.includes(c.id));
  const out: { id: string; note: string; score: number }[] = [];
  for (const c of candidates) {
    let reach = false;
    for (const card of CARDS) {
      for (const reversed of [false, true]) {
        const r = { ...placed, [last]: { cardId: card.id, reversed } } as Reading;
        if (c.when(r)) { reach = true; break; }
      }
      if (reach) break;
    }
    if (reach) out.push({ id: c.id, note: c.note, score: c.score });
  }
  return out;
}

/** Names of every combo, for the Codex once discovered. */
export const COMBO_IDS = COMBOS.map((c) => c.id);
export function comboNote(id: string): string | undefined {
  return COMBOS.find((c) => c.id === id)?.note;
}
/** What a named reading is worth: positive lifts the reading, negative drags it. */
export function comboScore(id: string): number {
  return COMBOS.find((c) => c.id === id)?.score ?? 0;
}

export type Marks = Record<string, 'charged' | 'scarred'>;
export const CHARGED_BONUS = 1;

export interface ResolveOptions {
  chargedBonus?: number;
  extraNeutralCost?: number;
  mendBonus?: number;
  /** Added to every named reading that lifts the total (Wax Seal). */
  namedBonus?: number;
  /** Pairs that know each other, as sorted 'a|b' keys. Each pair on the table lifts the reading. */
  kin?: readonly string[];
  /** What each kin pair lifts by; KIN_BONUS unless the weather says otherwise. */
  kinBonus?: number;
}

export const KIN_BONUS = 0.5;

/** Which of the given pairs are both on the table. */
export function kinshipAmong(cardIds: readonly string[], kin: readonly string[] | undefined, bonus = KIN_BONUS): { pairs: [string, string][]; score: number } {
  if (!kin || kin.length === 0) return { pairs: [], score: 0 };
  const ids = Array.from(new Set(cardIds)).sort();
  const pairs: [string, string][] = [];
  for (let i = 0; i < ids.length; i++)
    for (let j = i + 1; j < ids.length; j++) if (kin.includes(`${ids[i]}|${ids[j]}`)) pairs.push([ids[i], ids[j]]);
  return { pairs, score: pairs.length * bonus };
}

export function scoreSlot(scene: Scene, slot: SlotId, drawn: DrawnCard, marks: Marks = {}, chargedBonus = CHARGED_BONUS): SlotResolution {
  const card = getCard(drawn.cardId);
  const tags = cardTags(card, drawn.reversed);
  const affinity = scene.affinity[slot];
  const hits: { tag: Tag; weight: number }[] = [];
  let score = 0;
  for (const tag of tags) {
    const w = affinity[tag];
    if (w) {
      hits.push({ tag, weight: w });
      score += w;
    }
  }
  // Reversed cards are slightly unstable regardless of fit.
  if (drawn.reversed) score -= 0.5;
  // A card that carried you to triumph remembers it.
  if (marks[drawn.cardId] === 'charged') score += chargedBonus;
  return { slot, card, reversed: drawn.reversed, score, hits };
}

export const THRESHOLDS = { triumph: 7, boon: 4, neutral: 1.5, harm: -3 };

export function tierFor(total: number): OutcomeTier {
  if (total >= THRESHOLDS.triumph) return 'triumph';
  if (total >= THRESHOLDS.boon) return 'boon';
  if (total > THRESHOLDS.neutral) return 'neutral';
  if (total > THRESHOLDS.harm) return 'harm';
  return 'calamity';
}

/**
 * The descent wears on you: a neutral reading still costs a point, except
 * where the scene mends. Harm scales with stakes; healing scales with mend.
 */
const BASE_DELTAS: Record<OutcomeTier, { vitality: number; clarity: number }> = {
  calamity: { vitality: -4, clarity: 0 },
  harm: { vitality: -2, clarity: 0 },
  neutral: { vitality: -1, clarity: 1 },
  boon: { vitality: 1, clarity: 1 },
  triumph: { vitality: 2, clarity: 2 },
};

export function resolveReading(scene: Scene, reading: Reading, marks: Marks = {}, opts: ResolveOptions = {}): Resolution {
  const slots = SLOT_IDS.map((s) => scoreSlot(scene, s, reading[s], marks, opts.chargedBonus ?? CHARGED_BONUS));
  const comboNotes: string[] = [];
  const comboIds: string[] = [];
  let total = slots.reduce((a, s) => a + s.score, 0);
  for (const c of COMBOS) {
    if (c.when(reading)) {
      total += c.score + (c.score > 0 ? opts.namedBonus ?? 0 : 0);
      comboNotes.push(c.note);
      comboIds.push(c.id);
    }
  }
  const kinship = kinshipAmong(SLOT_IDS.map((s) => reading[s].cardId), opts.kin, opts.kinBonus ?? KIN_BONUS);
  if (kinship.pairs.length) total += kinship.score;
  const tier = tierFor(total);
  const base = BASE_DELTAS[tier];
  const mend = scene.mend ? scene.mend + (opts.mendBonus ?? 0) : undefined;
  let vitality: number;
  if (tier === 'neutral') vitality = scene.rite === 'ember' ? 1 : mend ? 0 : base.vitality * scene.stakes - (opts.extraNeutralCost ?? 0);
  else if (base.vitality < 0) vitality = base.vitality * scene.stakes;
  else vitality = base.vitality * (mend ?? 1);
  const deltas = { vitality, clarity: base.clarity };
  const narration = [
    ...slots.map((s) => (s.reversed ? s.card.omen.reversed : s.card.omen.upright)),
    ...comboNotes,
    scene.outcomes[tier],
  ];
  return { slots, comboIds, comboNotes, total, tier, deltas, narration, kinship: kinship.pairs.length ? kinship : undefined };
}

export function tierIndex(t: OutcomeTier): number {
  return TIERS.indexOf(t);
}

/**
 * The reckoning: what each seat wanted, what the card brought, and what
 * that came to. This is the plain-words post-mortem of a reading, so the
 * story of a scene can be followed card by card. Only tags that mattered
 * in this scene are named; the rest of a card stays its own.
 */
export interface SlotReckoning {
  slot: SlotId;
  score: number;
  verdict: 'helped' | 'hurt' | 'neither';
  /** What the seat rewarded here, strongest first. */
  wanted: Tag[];
  /** What the seat punished here. */
  feared: Tag[];
  /** Tags the card brought that the seat rewarded. */
  met: Tag[];
  /** Tags the card brought that the seat punished. */
  against: Tag[];
  reversed: boolean;
  charged: boolean;
}

/** The reckoning of one scored seat. */
export function reckonSlot(scene: Scene, s: SlotResolution, marks: Marks = {}): SlotReckoning {
  const aff = scene.affinity[s.slot];
  const entries = Object.entries(aff) as [Tag, number][];
  const wanted = entries.filter(([, w]) => w > 0).sort((a, b) => b[1] - a[1]).map(([t]) => t);
  const feared = entries.filter(([, w]) => w < 0).sort((a, b) => a[1] - b[1]).map(([t]) => t);
  const met = s.hits.filter((h) => h.weight > 0).map((h) => h.tag);
  const against = s.hits.filter((h) => h.weight < 0).map((h) => h.tag);
  const verdict = s.score >= 1 ? 'helped' : s.score <= -1 ? 'hurt' : 'neither';
  return { slot: s.slot, score: s.score, verdict, wanted, feared, met, against, reversed: s.reversed, charged: marks[s.card.id] === 'charged' };
}

export function reckon(scene: Scene, resolution: Resolution, marks: Marks = {}): SlotReckoning[] {
  return resolution.slots.map((s) => reckonSlot(scene, s, marks));
}

/**
 * The reading so far: the seats placed up to now, each scored and reckoned
 * the moment it lands, with the running total and the tier it would read
 * as if the rest changed nothing. Named readings settle only at the end,
 * so the final tally can still move.
 */
export interface ReadingSoFar {
  seats: { slot: SlotId; card: Card; score: number; reckoning: SlotReckoning; omen: string }[];
  total: number;
  tier: OutcomeTier;
  /** How many of the four are placed. */
  placed: number;
}

export function readingSoFar(scene: Scene, placed: { slot: SlotId; drawn: DrawnCard }[], marks: Marks = {}, chargedBonus = CHARGED_BONUS): ReadingSoFar {
  const seats = placed.map(({ slot, drawn }) => {
    const s = scoreSlot(scene, slot, drawn, marks, chargedBonus);
    return { slot, card: s.card, score: s.score, reckoning: reckonSlot(scene, s, marks), omen: drawn.reversed ? s.card.omen.reversed : s.card.omen.upright };
  });
  const total = seats.reduce((a, x) => a + x.score, 0);
  return { seats, total, tier: tierFor(total), placed: seats.length };
}

const list = (tags: readonly string[]) => (tags.length === 0 ? '' : tags.length === 1 ? tags[0] : `${tags.slice(0, -1).join(', ')} and ${tags[tags.length - 1]}`);

/** How each position opens its sentence: the same facts, told in the position's own terms. */
const OPENER: Record<SlotId, (want: string, fear: string) => string> = {
  vessel: (want, fear) => `The situation called for ${want}${fear ? `, and could not bear ${fear}` : ''}.`,
  threshold: (want, fear) => `What stood in the way answered to ${want}${fear ? `, and turned worse with ${fear}` : ''}.`,
  wake: (want, fear) => `What you might have missed here was ${want}${fear ? `; ${fear} would have blinded you` : ''}.`,
  hand: (want, fear) => `The best course was ${want}${fear ? `, and the worst ${fear}` : ''}.`,
};

/**
 * The ask: what a seat wants and fears in this scene, before any card is
 * placed. Rules are stated plainly; the mystery is the deck, not the room.
 * The player reads what the seat calls for and reasons from the card's face
 * and memory whether it brings that. Strongest first.
 */
export interface SeatAsk {
  slot: SlotId;
  wanted: Tag[];
  feared: Tag[];
}

export function seatAsk(scene: Scene, slot: SlotId): SeatAsk {
  const entries = Object.entries(scene.affinity[slot]) as [Tag, number][];
  const wanted = entries.filter(([, w]) => w > 0).sort((a, b) => b[1] - a[1]).map(([t]) => t);
  const feared = entries.filter(([, w]) => w < 0).sort((a, b) => a[1] - b[1]).map(([t]) => t);
  return { slot, wanted, feared };
}

/** The ask in the position's own terms, present tense: the reckoning's opener before the card lands. */
const ASK_OPENER: Record<SlotId, (want: string, fear: string) => string> = {
  vessel: (want, fear) => `The situation calls for ${want}${fear ? `, and cannot bear ${fear}` : ''}.`,
  threshold: (want, fear) => `What stands in the way answers to ${want}${fear ? `, and turns worse with ${fear}` : ''}.`,
  wake: (want, fear) => `What you might miss here is ${want}${fear ? `; ${fear} would blind you` : ''}.`,
  hand: (want, fear) => `The best course is ${want}${fear ? `, and the worst ${fear}` : ''}.`,
};

export function askText(ask: SeatAsk): string {
  const want = ask.wanted.length ? list(ask.wanted) : 'nothing in particular';
  const fear = ask.feared.length ? list(ask.feared) : '';
  return ASK_OPENER[ask.slot](want, fear);
}

/** How a tag sits with a seat's ask: it serves, it costs, or it is nothing to this seat. */
export function tagFit(ask: SeatAsk, tag: Tag): 'want' | 'fear' | 'none' {
  return ask.wanted.includes(tag) ? 'want' : ask.feared.includes(tag) ? 'fear' : 'none';
}

/** Two plain sentences per seat, in the position's own terms: what it asked for, and what the card brought. */
export function reckoningText(r: SlotReckoning, cardName: string): string {
  const want = r.wanted.length ? list(r.wanted) : 'nothing in particular';
  const fear = r.feared.length ? list(r.feared) : '';
  const brought = r.met.length && r.against.length ? `brought ${list(r.met)}, but also ${list(r.against)}` : r.met.length ? `brought ${list(r.met)}` : r.against.length ? `brought ${list(r.against)}` : 'brought none of it';
  const extra = [r.reversed ? 'lay reversed' : '', r.charged ? 'was charged' : ''].filter(Boolean).join(' and ');
  const verdict = r.verdict === 'helped' ? 'It served you.' : r.verdict === 'hurt' ? 'It cost you.' : 'It changed little.';
  return `${OPENER[r.slot](want, fear)} ${cardName} ${brought}${extra ? `, and ${extra}` : ''}. ${verdict}`;
}

/** The tally: fit, named readings, the total, and the tier it made. */
export function tallyText(resolution: Resolution): string {
  const fit = resolution.slots.reduce((a, s) => a + s.score, 0);
  const kin = resolution.kinship?.score ?? 0;
  const named = resolution.total - fit - kin;
  const fmt = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(n) % 1 === 0 ? Math.abs(n) : Math.abs(n).toFixed(1)}`;
  const parts = [`The four seats ${fmt(fit)}`];
  if (named !== 0) parts.push(`named readings ${fmt(named)}`);
  if (kin !== 0) parts.push(`kinship ${fmt(kin)}`);
  return `${parts.join(', ')}: ${fmt(resolution.total)} in all, which reads as ${resolution.tier}.`;
}
