import { getCard } from './cards';
import type { HistoryEntry } from './run';
import type { Scene } from './scenes';

/**
 * Vows: a constraint taken before the first scene and kept for the whole
 * descent. Break it once and it is gone. Keep it to the Abyss and it pays
 * out as you step in. Like sigils, vows are rules, so they are stated.
 */
export interface Vow {
  id: string;
  glyph: string;
  name: string;
  text: string;
  reward: { vitality?: number; clarity?: number };
  /** True if this scene kept the vow. Called once per resolved scene. */
  keeps: (entry: HistoryEntry, scene: Scene) => boolean;
}

const isMajor = (id: string) => getCard(id).arcana === 'major';

export const VOWS: Vow[] = [
  { id: 'steady-hand', glyph: '☐', name: 'Steady Hand', text: 'Never place a reversed card in the Hand.', reward: { vitality: 3 }, keeps: (e) => !e.reading.hand.reversed },
  { id: 'silence', glyph: '⊘', name: 'Silence', text: 'Never whisper.', reward: { vitality: 2, clarity: 2 }, keeps: (e) => (e.spent?.whispers ?? 0) === 0 },
  { id: 'first-instinct', glyph: '☝', name: 'First Instinct', text: 'Never redraw.', reward: { vitality: 3 }, keeps: (e) => (e.spent?.redraws ?? 0) === 0 },
  { id: 'small-wake', glyph: '☾', name: 'Small Wake', text: 'Never leave a Major Arcana in the Wake.', reward: { vitality: 2, clarity: 1 }, keeps: (e) => !isMajor(e.reading.wake.cardId) },
  { id: 'long-way', glyph: '⛩', name: 'The Long Way', text: 'Never rest.', reward: { vitality: 4 }, keeps: (_e, scene) => scene.kind !== 'rest' },
  { id: 'high-threshold', glyph: '△', name: 'High Threshold', text: 'Every Threshold holds a Major Arcana.', reward: { vitality: 4 }, keeps: (e) => isMajor(e.reading.threshold.cardId) },
  { id: 'thrift', glyph: '◈', name: 'Thrift', text: 'Never spend Clarity. No redraws, no whispers.', reward: { vitality: 3, clarity: 3 }, keeps: (e) => (e.spent?.redraws ?? 0) + (e.spent?.whispers ?? 0) === 0 },
  { id: 'unlit', glyph: '●', name: 'Unlit', text: 'Never light the lamp. A street already lit does not count against you.', reward: { vitality: 2, clarity: 2 }, keeps: (e, scene) => scene.rite === 'lit' || (e.lit?.length ?? 0) === 0 },
  { id: 'lamplit', glyph: '☼', name: 'Lamplit', text: 'Light the lamp in every scene. The Dark, where none burns, is forgiven.', reward: { vitality: 3, clarity: 1 }, keeps: (e, scene) => scene.rite === 'dark' || scene.rite === 'lit' || (e.lit?.length ?? 0) >= 1 },
];

export const VOW_IDS = VOWS.map((v) => v.id);

export function getVow(id: string): Vow {
  const v = VOWS.find((x) => x.id === id);
  if (!v) throw new Error(`unknown vow ${id}`);
  return v;
}

/** Two vows offered for a seed, chosen without touching the run's rng stream. */
export function vowOffer(seed: number): string[] {
  const n = VOW_IDS.length;
  const a = (seed >>> 0) % n;
  const b = (a + 1 + ((seed >>> 5) % (n - 1))) % n;
  return [VOW_IDS[a], VOW_IDS[b]];
}
