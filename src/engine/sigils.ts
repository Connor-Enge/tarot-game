import type { Knowledge } from './knowledge';
import type { RunState } from './run';
import { SLOT_IDS } from './scenes';

/**
 * Sigils: milestones. Conditions are rules, so they are stated. Earning one
 * changes nothing about the game except that the Codex remembers it.
 */
export interface Sigil {
  id: string;
  glyph: string;
  name: string;
  text: string;
  /** Evaluated when a run ends, with the knowledge *after* that run is folded in. */
  when: (run: RunState, k: Knowledge) => boolean;
}

const ended = (run: RunState) => run.phase.kind === 'dead' || run.phase.kind === 'ascended';
const ascended = (run: RunState) => run.phase.kind === 'ascended';

export const SIGILS: Sigil[] = [
  { id: 'first-death', glyph: '✖', name: 'First Blood', text: 'Die once.', when: (r, k) => r.phase.kind === 'dead' && k.deaths >= 1 },
  { id: 'first-return', glyph: '☉', name: 'Surfaced', text: 'Return from the Abyss.', when: (r) => ascended(r) },
  { id: 'no-redraw', glyph: '☐', name: 'First Hand', text: 'Return without ever redrawing.', when: (r) => ascended(r) && r.history.length * 4 * 3 <= countDealt(r) && !redrewOnce(r) },
  { id: 'all-reversed', glyph: '⥯', name: 'Upside Down', text: 'Survive a reading where every card lay reversed.', when: (r) => r.history.some((h, i) => SLOT_IDS.every((s) => h.reading[s].reversed) && (i < r.history.length - 1 || ascended(r))) },
  { id: 'thin-return', glyph: '♥', name: 'By a Thread', text: 'Return with 2 vitality or less.', when: (r) => ascended(r) && r.vitality <= 2 },
  { id: 'clean-return', glyph: '★', name: 'Unscathed', text: 'Return without a single harm or calamity.', when: (r) => ascended(r) && r.history.every((h) => h.resolution.tier !== 'harm' && h.resolution.tier !== 'calamity') },
  { id: 'five-triumphs', glyph: '✦', name: 'Read Aloud', text: 'Triumph five times in one descent.', when: (r) => r.history.filter((h) => h.resolution.tier === 'triumph').length >= 5 },
  { id: 'three-relics', glyph: '◎', name: 'Pockets', text: 'Hold three boons at once.', when: (r) => r.relics.filter((id) => !['fog', 'splinter', 'debt', 'weight', 'hush'].includes(id)).length >= 3 },
  { id: 'cursed-return', glyph: '⊘', name: 'Carried It Anyway', text: 'Return while cursed.', when: (r) => ascended(r) && r.relics.some((id) => ['fog', 'splinter', 'debt', 'weight', 'hush'].includes(id)) },
  { id: 'majors-glimpsed', glyph: '☾', name: 'Twenty-Two', text: 'Glimpse every Major Arcana.', when: (_r, k) => Array.from({ length: 22 }, (_, i) => `major-${i}`).every((id) => (k.cards[id]?.tier ?? 0) >= 1) },
  { id: 'ten-mastered', glyph: '◈', name: 'Fluent', text: 'Master ten cards.', when: (_r, k) => Object.values(k.cards).filter((c) => c.tier >= 3).length >= 10 },
  { id: 'named-five', glyph: '♪', name: 'Named', text: 'Produce five named readings.', when: (_r, k) => (k.combos?.length ?? 0) >= 5 },
  { id: 'ten-deaths', glyph: '⚰', name: 'Regular', text: 'Die ten times.', when: (_r, k) => k.deaths >= 10 },
  { id: 'remembered', glyph: '☷', name: 'Remembered', text: 'Answer ten Study questions correctly.', when: (_r, k) => (k.study?.correct ?? 0) >= 10 },
  { id: 'bound', glyph: '✶', name: 'Bound', text: 'Join a hundred pairs of cards in the sky.', when: (_r, k) => Object.keys(k.links ?? {}).length >= 100 },
  { id: 'all-descents', glyph: '◉', name: 'Every Way Down', text: 'Return by every descent.', when: (_r, k) => ['standard', 'arcana', 'inverted', 'fogbound', 'thin'].every((d) => (k.records?.[d]?.returns ?? 0) >= 1) },
];

function countDealt(r: RunState): number {
  return r.history.length * 12;
}
function redrewOnce(r: RunState): boolean {
  return r.redraws > 0;
}

/** Evaluate every sigil not yet held. Returns the new ids. */
export function newSigils(run: RunState, k: Knowledge): string[] {
  if (!ended(run)) return [];
  const held = new Set(k.sigils ?? []);
  return SIGILS.filter((s) => !held.has(s.id) && s.when(run, k)).map((s) => s.id);
}

/** Sigils that depend only on the Codex, checked outside a run (e.g. after Study). */
const KNOWLEDGE_ONLY = new Set(['remembered', 'bound', 'majors-glimpsed', 'ten-mastered', 'named-five', 'ten-deaths']);
export function newKnowledgeSigils(k: Knowledge): string[] {
  const held = new Set(k.sigils ?? []);
  const dummy = { phase: { kind: 'dead' } } as unknown as RunState;
  return SIGILS.filter((s) => KNOWLEDGE_ONLY.has(s.id) && !held.has(s.id) && s.when(dummy, k)).map((s) => s.id);
}
