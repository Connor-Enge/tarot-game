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
  startingVitality?: number;
  startingClarity?: number;
  /** Put twelve shuffled Major Arcana on top of the deck. Used for a player's first descent. */
  majorsFirst?: boolean;
}

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
    id: 'arcana',
    name: 'Arcana Only',
    glyph: '✦',
    text: 'Twenty-two cards. Every one of them matters.',
    config: { deck: CARDS.filter((c) => c.arcana === 'major').map((c) => c.id) },
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
