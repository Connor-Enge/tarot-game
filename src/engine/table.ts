import { bondedPairs, type Knowledge } from './knowledge';
import { readingSoFar, resolveReading, tierFor, comboNote, comboScore, type Reading, type ReadingSoFar } from './resolve';
import { SCENES, SLOT_IDS, type OutcomeTier, type Scene, type SlotId } from './scenes';

/**
 * The Table: a practice spread in the Codex. The player lays cards they
 * have glimpsed into a scene they have read at and sees the reckoning at
 * once, with nothing at stake. Only what the player has already earned
 * reaches the table: scenes they have visited, cards they have read, named
 * readings they have found. A named reading they have not yet found still
 * counts, but stays unnamed.
 */
export type TableLay = Partial<Record<SlotId, { cardId: string; reversed: boolean }>>;

export interface TableReading extends ReadingSoFar {
  /** Only once all four are laid: named readings and the true total. */
  full?: {
    total: number;
    tier: OutcomeTier;
    named: { id: string; note: string; score: number }[];
    /** Readings the player has not found yet: counted, not named. */
    unnamed: { count: number; score: number };
  };
}

/** Scenes the player has read at, in the order they first met them. */
export function tableScenes(k: Knowledge): Scene[] {
  const seen: string[] = [];
  for (const o of k.omenLog ?? []) {
    if (SCENES[o.scene] && !seen.includes(o.scene)) seen.push(o.scene);
  }
  return seen.map((id) => SCENES[id]);
}

/** Cards the player may lay: anything glimpsed or better. */
export function tableCards(k: Knowledge): string[] {
  return Object.entries(k.cards)
    .filter(([, e]) => e.tier >= 1)
    .map(([id]) => id);
}

export function canLay(k: Knowledge, cardId: string): boolean {
  return (k.cards[cardId]?.tier ?? 0) >= 1;
}

export function layTable(scene: Scene, lay: TableLay, k: Knowledge): TableReading {
  const placed = SLOT_IDS.filter((s) => lay[s]).map((slot) => ({ slot, drawn: { cardId: lay[slot]!.cardId, reversed: lay[slot]!.reversed } }));
  const so = readingSoFar(scene, placed, {});
  if (placed.length < SLOT_IDS.length) return so;
  const reading = Object.fromEntries(placed.map((p) => [p.slot, p.drawn])) as Reading;
  const res = resolveReading(scene, reading, {}, { kin: bondedPairs(k) });
  const found = new Set(k.combos ?? []);
  const named = res.comboIds.filter((id) => found.has(id)).map((id) => ({ id, note: comboNote(id) ?? '', score: comboScore(id) }));
  const hidden = res.comboIds.filter((id) => !found.has(id));
  const unnamed = { count: hidden.length, score: hidden.reduce((a, id) => a + comboScore(id), 0) };
  return { ...so, full: { total: res.total, tier: tierFor(res.total), named, unnamed } };
}

/** The next empty seat in position order, or null when the table is full. */
export function nextEmptySeat(lay: TableLay): SlotId | null {
  return SLOT_IDS.find((s) => !lay[s]) ?? null;
}
