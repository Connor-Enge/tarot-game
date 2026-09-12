import { CARDS } from './cards';
import type { Knowledge } from './knowledge';

/**
 * Descents: ways down. Each is a run configuration. Unlocks are earned by
 * play, and the unlock condition is stated (it is not a card meaning).
 */
export interface RunConfig {
  /** Card ids in the deck. Default: all 78. */
  deck?: readonly string[];
  /** Chance a dealt card lands reversed. Default 0.25. */
  reversedChance?: number;
  /** Relics held from the start. */
  startingRelics?: string[];
  /** Cards charged from the start: upright when dealt, and a little stronger. The Daily charges the card of the day. */
  charged?: readonly string[];
  /** A keepsake earned in Study: charged like the rest, and marked "yours" the first time it is dealt. */
  keepsake?: string;
  /** A mastered card the reader has made their own: dealt, upright, into the first Vessel. */
  signature?: string;
  startingVitality?: number;
  startingClarity?: number;
  /** Put twelve shuffled Major Arcana on top of the deck. Used for a player's first descent. */
  majorsFirst?: boolean;
  /** Layers per act. Default [4, 4]. */
  actLayers?: readonly number[];
  /** Extra vitality cost on neutral readings. */
  extraNeutralCost?: number;
  /** The Wake does not follow you. */
  noEcho?: boolean;
  /** Stakes override for the terminal scene. */
  abyssStakes?: number;
  /** No surface: each Abyss opens onto a deeper map, and stakes climb by one each time. */
  endless?: boolean;
  /** Every seat answers in Clarity: a seat that costs you takes one at once, one that serves you gives one back. */
  seatTick?: boolean;
  /** Pairs the reader's Codex knows to have been read together often: kin, as sorted 'a|b' keys. */
  kin?: string[];
}

/**
 * Depths: stacked difficulty for the standard descent, unlocked one per
 * return. Depth N applies every modifier up to N. All stated.
 */
export interface Depth {
  n: number;
  name: string;
  text: string;
  config: RunConfig;
}

export const DEPTHS: Depth[] = [
  { n: 1, name: 'Thinner Blood', text: 'Begin with 8 vitality.', config: { startingVitality: 8 } },
  { n: 2, name: 'Wrong More Often', text: 'Cards land reversed more often.', config: { reversedChance: 0.35 } },
  { n: 3, name: 'The Dark Presses', text: 'Neutral readings cost one more.', config: { extraNeutralCost: 1 } },
  { n: 4, name: 'Short Memory', text: 'The Wake does not follow you.', config: { noEcho: true } },
  { n: 5, name: 'The Last Word', text: 'The Abyss reads at stakes 4.', config: { abyssStakes: 4 } },
];

export function depthConfig(depth: number): RunConfig {
  let out: RunConfig = {};
  for (const d of DEPTHS) if (d.n <= depth) out = { ...out, ...d.config };
  return out;
}

export function maxDepthUnlocked(returns: number): number {
  return Math.min(DEPTHS.length, Math.max(0, returns));
}

/** The weekly descent: a longer road, a little more blood. */
export const WEEKLY_CONFIG: RunConfig = { actLayers: [5, 5], startingVitality: 12 };

export interface Descent {
  id: string;
  name: string;
  glyph: string;
  text: string;
  config: RunConfig;
  unlocked: (k: Knowledge) => boolean;
  unlockText: string;
}

export const DESCENTS: Descent[] = [
  {
    id: 'standard',
    name: 'The Descent',
    glyph: '◉',
    text: 'The whole deck. The usual dark.',
    config: {},
    unlocked: () => true,
    unlockText: '',
  },
  {
    id: 'short',
    name: 'The Short Road',
    glyph: '⌇',
    text: 'Three layers an act. A descent for one cup of tea.',
    config: { actLayers: [3, 3] },
    unlocked: () => true,
    unlockText: '',
  },
  {
    id: 'arcana',
    name: 'Arcana Only',
    glyph: '✦',
    text: 'Twenty-two cards, and they land wrong more often. Every one of them matters.',
    config: { deck: CARDS.filter((c) => c.arcana === 'major').map((c) => c.id), reversedChance: 0.45, startingVitality: 8, extraNeutralCost: 1 },
    unlocked: (k) => k.ascensions >= 1,
    unlockText: 'Return from the Abyss once.',
  },
  {
    id: 'inverted',
    name: 'The Inverted',
    glyph: '⥯',
    text: 'Most cards land wrong. Read them anyway.',
    config: { reversedChance: 0.6 },
    unlocked: (k) => k.deaths >= 3,
    unlockText: 'Die three times.',
  },
  {
    id: 'fogbound',
    name: 'Fogbound',
    glyph: '≋',
    text: 'You begin in the Fog, with a lantern of Clarity.',
    config: { startingRelics: ['fog'], startingClarity: 4 },
    unlocked: (k) => k.runs >= 5,
    unlockText: 'Descend five times.',
  },
  {
    id: 'well',
    name: 'The Well',
    glyph: '⨀',
    text: 'No way back up. Each Abyss opens onto a deeper one, and every reading costs more. How far?',
    config: { endless: true },
    unlocked: (k) => k.ascensions >= 3,
    unlockText: 'Return from the Abyss three times.',
  },
  {
    id: 'night',
    name: 'The Long Night',
    glyph: '☾',
    text: 'Every scene under the Moon. The Wake deals four, more cards land wrong, and you carry four Clarity to see by.',
    config: { startingRelics: ['shard'], reversedChance: 0.35, startingClarity: 4 },
    unlocked: (k) => k.deaths >= 5 && k.ascensions >= 1,
    unlockText: 'Die five times, and return once.',
  },
  {
    id: 'chosen',
    name: 'The Chosen',
    glyph: '✎',
    text: 'Your own deck: at least thirty cards you know, picked in the Codex. They land wrong more often.',
    config: { reversedChance: 0.35 },
    unlocked: (k) => k.ascensions >= 1 && Object.values(k.cards).filter((c) => c.tier >= 1).length >= 40,
    unlockText: 'Return once, and know forty cards.',
  },
  {
    id: 'thin',
    name: 'Thin Blood',
    glyph: '♥',
    text: 'Six vitality. No margin.',
    config: { startingVitality: 6 },
    unlocked: (k) => k.ascensions >= 2,
    unlockText: 'Return from the Abyss twice.',
  },
];

export function getDescent(id: string): Descent {
  return DESCENTS.find((d) => d.id === id) ?? DESCENTS[0];
}
