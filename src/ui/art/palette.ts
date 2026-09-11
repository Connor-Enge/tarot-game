import type { Suit } from '../../engine';

/**
 * Colour is meaning, after the Waite-Smith convention: the sky over a scene
 * says what kind of moment it is before a single figure is read.
 *
 *   joy     yellow   illumination, consciousness, success
 *   spirit  blue     intuition, the inner life, calm water
 *   grey    grey     the liminal, difficulty, neutrality, wisdom won hard
 *   night   black    the unknown, fear, the unconscious
 *   dawn    red      vitality, will, appetite, action
 *   growth  green    fertility, the body, slow things ripening
 *   dusk    violet   royalty, the sacred, the veiled
 *   storm   slate    grief, rain, a trial in progress
 */
export type Mood = 'joy' | 'spirit' | 'grey' | 'night' | 'dawn' | 'growth' | 'dusk' | 'storm';

export const MOOD_SKY: Record<Mood, string> = {
  joy: 'url(#skyJoy)',
  spirit: 'url(#skySpirit)',
  grey: 'url(#skyGrey)',
  night: 'url(#skyNight)',
  dawn: 'url(#skyDawn)',
  growth: 'url(#skyGrowth)',
  dusk: 'url(#skyDusk)',
  storm: 'url(#skyStorm)',
};

/** Robe colours by suit: fire red, water blue, air grey-white, earth green. */
export const ROBE: Record<Suit, string> = { wands: '#b8462f', cups: '#3f6fa8', swords: '#8b8fa3', pentacles: '#4e7238' };
export const ROBE_PALE: Record<Suit, string> = { wands: '#e9a16e', cups: '#9fc3e0', swords: '#e6e6ec', pentacles: '#a9c98a' };

const MAJOR_MOOD: Mood[] = [
  'joy', // 0 the Fool steps out under a full sun
  'joy', // 1 the Magician, conscious will
  'spirit', // 2 the High Priestess, the veil
  'joy', // 3 the Empress in her field
  'dawn', // 4 the Emperor, red stone
  'grey', // 5 the Hierophant, the institution
  'joy', // 6 the Lovers under the angel's sun
  'joy', // 7 the Chariot, will in motion
  'joy', // 8 Strength, the tamed lion
  'night', // 9 the Hermit, one light on a dark height
  'spirit', // 10 the Wheel in the open sky
  'joy', // 11 Justice, clear sight
  'grey', // 12 the Hanged Man, suspension
  'grey', // 13 Death, the neutral ground
  'spirit', // 14 Temperance, the pour
  'night', // 15 the Devil, the black
  'night', // 16 the Tower, struck at night
  'spirit', // 17 the Star, the pool
  'dusk', // 18 the Moon, the path between
  'joy', // 19 the Sun
  'spirit', // 20 Judgement, the call from above
  'spirit', // 21 the World
];

export function majorMood(n: number): Mood {
  return MAJOR_MOOD[n] ?? 'joy';
}

const SUIT_MOOD: Record<Suit, Mood> = { wands: 'dawn', cups: 'spirit', swords: 'grey', pentacles: 'growth' };

/** Ranks whose scene turns the sky: hardship greys it, grief storms it, dread blackens it, joy gilds it. */
const MINOR_OVERRIDE: Record<Suit, Partial<Record<number, Mood>>> = {
  wands: { 4: 'joy', 5: 'grey', 6: 'joy', 9: 'grey', 10: 'grey' },
  cups: { 3: 'joy', 4: 'grey', 5: 'grey', 7: 'grey', 8: 'night', 9: 'joy', 10: 'joy' },
  swords: { 2: 'spirit', 3: 'storm', 6: 'spirit', 8: 'storm', 9: 'night', 10: 'night', 1: 'spirit' },
  pentacles: { 5: 'night', 9: 'joy', 10: 'joy' },
};

export function minorMood(suit: Suit, rank: number): Mood {
  return MINOR_OVERRIDE[suit][rank] ?? SUIT_MOOD[suit];
}
