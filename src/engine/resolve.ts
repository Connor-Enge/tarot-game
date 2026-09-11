import { cardTags, getCard, type Card, type Tag } from './cards';
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
    id: 'all-reversed',
    when: (r) => SLOT_IDS.every((s) => r[s].reversed),
    score: -2,
    note: 'Every card lay wrong. The reading curdled.',
  },
  {
    id: 'all-major',
    when: (r) => SLOT_IDS.every((s) => getCard(r[s].cardId).arcana === 'major'),
    score: 2,
    note: 'Four great arcana. The room went quiet.',
  },
  {
    id: 'one-suit',
    when: (r) => {
      const suits = SLOT_IDS.map((s) => getCard(r[s].cardId).suit);
      return suits.every((x) => x && x === suits[0]);
    },
    score: 2,
    note: 'One suit, four seats. The reading spoke with a single voice.',
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
];

/** Names of every combo, for the Codex once discovered. */
export const COMBO_IDS = COMBOS.map((c) => c.id);
export function comboNote(id: string): string | undefined {
  return COMBOS.find((c) => c.id === id)?.note;
}

export type Marks = Record<string, 'charged' | 'scarred'>;
export const CHARGED_BONUS = 1;

export interface ResolveOptions {
  chargedBonus?: number;
  extraNeutralCost?: number;
  mendBonus?: number;
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

export const THRESHOLDS = { triumph: 6, boon: 3, neutral: -1.5, harm: -5 };

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
      total += c.score;
      comboNotes.push(c.note);
      comboIds.push(c.id);
    }
  }
  const tier = tierFor(total);
  const base = BASE_DELTAS[tier];
  const mend = scene.mend ? scene.mend + (opts.mendBonus ?? 0) : undefined;
  let vitality: number;
  if (tier === 'neutral') vitality = mend ? 0 : base.vitality * scene.stakes - (opts.extraNeutralCost ?? 0);
  else if (base.vitality < 0) vitality = base.vitality * scene.stakes;
  else vitality = base.vitality * (mend ?? 1);
  const deltas = { vitality, clarity: base.clarity };
  const narration = [
    ...slots.map((s) => (s.reversed ? s.card.omen.reversed : s.card.omen.upright)),
    ...comboNotes,
    scene.outcomes[tier],
  ];
  return { slots, comboIds, comboNotes, total, tier, deltas, narration };
}

export function tierIndex(t: OutcomeTier): number {
  return TIERS.indexOf(t);
}
