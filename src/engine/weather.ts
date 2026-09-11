import type { RunConfig } from './descents';

/**
 * Daily weather: one named condition per day, drawn from the daily seed.
 * Everyone who descends today walks in the same weather. Conditions are
 * rules, so they are stated.
 */
export interface Weather {
  id: string;
  glyph: string;
  name: string;
  text: string;
  config: RunConfig;
}

export const WEATHERS: Weather[] = [
  { id: 'clear', glyph: '◯', name: 'Clear', text: 'The usual dark.', config: {} },
  { id: 'reversed-winds', glyph: '⥯', name: 'Reversed Winds', text: 'More cards land reversed.', config: { reversedChance: 0.4 } },
  { id: 'thin-air', glyph: '♥', name: 'Thin Air', text: 'Eight vitality to begin.', config: { startingVitality: 8 } },
  { id: 'lantern', glyph: '◈', name: 'Lantern Light', text: 'Four clarity to begin.', config: { startingClarity: 4 } },
  { id: 'salted', glyph: '∴', name: 'Salted Road', text: 'You carry A Pinch of Salt.', config: { startingRelics: ['salt'] } },
  { id: 'fog', glyph: '≋', name: 'Fog', text: 'One card in every seat is dealt face down.', config: { startingRelics: ['fog'], startingClarity: 3 } },
  { id: 'heavy', glyph: '⏚', name: 'Heavy Air', text: 'Neutral readings cost one more.', config: { extraNeutralCost: 1 } },
  { id: 'still', glyph: '☾', name: 'Still Water', text: 'The Wake does not follow you.', config: { noEcho: true } },
  { id: 'long', glyph: '⛩', name: 'The Long Road', text: 'Five layers to each act.', config: { actLayers: [5, 5] } },
  { id: 'short', glyph: '⛩', name: 'The Short Road', text: 'Three layers to each act.', config: { actLayers: [3, 3] } },
  { id: 'feathered', glyph: '❦', name: 'Light Winds', text: 'You carry a Grey Feather.', config: { startingRelics: ['feather'] } },
  { id: 'candlelit', glyph: '✶', name: 'Candlelit', text: 'You carry a Candle Stub.', config: { startingRelics: ['candle'] } },
  { id: 'guttering', glyph: '⌇', name: 'Guttering', text: 'Tallow follows you. Five clarity to begin.', config: { startingRelics: ['tallow'], startingClarity: 5 } },
  { id: 'black-tide', glyph: '◉', name: 'Black Tide', text: 'The Abyss holds higher stakes.', config: { abyssStakes: 4 } },
];

export function getWeather(id: string): Weather {
  const w = WEATHERS.find((x) => x.id === id);
  if (!w) throw new Error(`unknown weather ${id}`);
  return w;
}

/** The weather for a daily seed. Stable for the day, spread across the list. */
export function dailyWeather(seed: number): Weather {
  return WEATHERS[((seed >>> 0) % 7919) % WEATHERS.length];
}

/** The weather for a weekly seed. The Weekly is already the long road, so the road lengths are skipped. */
export function weeklyWeather(seed: number): Weather {
  const pool = WEATHERS.filter((w) => w.id !== 'long' && w.id !== 'short');
  return pool[((seed >>> 0) % 7919) % pool.length];
}
