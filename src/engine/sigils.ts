import type { Knowledge } from './knowledge';
import { RITES, ritesWalked } from './scenes';
import type { RunState } from './run';
import { CURSE_IDS } from './relics';
import { SCENES, SLOT_IDS } from './scenes';
import { roadNotTaken } from './road';

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
  { id: 'three-relics', glyph: '◎', name: 'Pockets', text: 'Hold three boons at once.', when: (r) => r.relics.filter((id) => !CURSE_IDS.includes(id)).length >= 3 },
  { id: 'traded', glyph: '☌', name: 'Dealt With', text: 'Take the Stranger\'s trade.', when: (r) => r.history.length > 0 && !!r.traded },
  { id: 'vow-kept', glyph: '✋', name: 'Sworn', text: 'Keep a vow all the way to the Abyss.', when: (r) => !!r.vow?.kept },
  { id: 'cursed-return', glyph: '⊘', name: 'Carried It Anyway', text: 'Return while cursed.', when: (r) => ascended(r) && r.relics.some((id) => CURSE_IDS.includes(id)) },
  { id: 'majors-glimpsed', glyph: '☾', name: 'Twenty-Two', text: 'Glimpse every Major Arcana.', when: (_r, k) => Array.from({ length: 22 }, (_, i) => `major-${i}`).every((id) => (k.cards[id]?.tier ?? 0) >= 1) },
  { id: 'ten-mastered', glyph: '◈', name: 'Fluent', text: 'Master ten cards.', when: (_r, k) => Object.values(k.cards).filter((c) => c.tier >= 3).length >= 10 },
  { id: 'named-five', glyph: '♪', name: 'Named', text: 'Produce five named readings.', when: (_r, k) => (k.combos?.length ?? 0) >= 5 },
  { id: 'ten-deaths', glyph: '⚰', name: 'Regular', text: 'Die ten times.', when: (_r, k) => k.deaths >= 10 },
  { id: 'remembered', glyph: '☷', name: 'Remembered', text: 'Answer ten Study questions correctly.', when: (_r, k) => (k.study?.correct ?? 0) >= 10 },
  { id: 'bound', glyph: '✶', name: 'Bound', text: 'Join a hundred pairs of cards in the sky.', when: (_r, k) => Object.keys(k.links ?? {}).length >= 100 },
  { id: 'well-two', glyph: '⨀', name: 'Deeper Still', text: 'Pass two Abysses in the Well.', when: (r) => (r.well ?? 0) >= 2 },
  { id: 'all-descents', glyph: '◉', name: 'Every Way Down', text: 'Return by every descent.', when: (_r, k) => ['standard', 'arcana', 'inverted', 'fogbound', 'thin'].every((d) => (k.records?.[d]?.returns ?? 0) >= 1) },
  { id: 'blessed', glyph: '☼', name: 'Blessed', text: 'Take the Stranger\'s blessing.', when: (r) => r.tradeTaken === 'bless-hand' },
  { id: 'cut-return', glyph: '✂', name: 'A Clean Cut', text: 'Cut the deck and return.', when: (r) => ascended(r) && r.cut !== undefined },
  { id: 'seven-days', glyph: '▦', name: 'Seven Days', text: 'Return from seven different daily descents.', when: (_r, k) => Object.values(k.almanac ?? {}).filter((a) => a.returned).length >= 7 },
  { id: 'three-vows', glyph: '⚭', name: 'Oathbound', text: 'Keep three different vows.', when: (_r, k) => Object.values(k.vows ?? {}).filter((v) => v.kept >= 1).length >= 3 },
  { id: 'well-worn', glyph: '❂', name: 'Well Worn', text: 'Read one card twenty-five times.', when: (_r, k) => Object.values(k.cards).some((c) => c.resolved >= 25) },
  { id: 'every-rite', glyph: '⧖', name: 'Every Rite', text: 'Walk every rite a scene can keep.', when: (_r, k) => ritesWalked(k.omenLog).length === Object.keys(RITES).length },
  { id: 'sure-hand', glyph: '☞', name: 'Sure Hand', text: 'Return having played the best card the hand held, in every seat, all the way down.', when: (r) => ascended(r) && r.history.length > 0 && r.history.every((h) => { const road = roadNotTaken(SCENES[h.sceneId], h, r.marks); return !!road && road.regret === 0 && road.seats.every((s) => s.passed.length > 0); }) },
  { id: 'steady-hand', glyph: '✍', name: 'Steady Hand', text: 'Play the best card in the hand a hundred times.', when: (_r, k) => (k.hand?.best ?? 0) >= 100 },
  { id: 'answered', glyph: '◈', name: 'Answered in Clarity', text: 'Return with every seat answering in Clarity.', when: (r) => ascended(r) && !!r.mods.seatTick },
  ...(['wands', 'cups', 'swords', 'pentacles'] as const).map((suit) => {
    const NAMES: Record<string, [string, string]> = { wands: ['Fire Read Through', '⚚'], cups: ['Water Read Through', '♆'], swords: ['Air Read Through', '⚔'], pentacles: ['Earth Read Through', '⛤'] };
    return {
      id: `${suit}-read`,
      glyph: NAMES[suit][1],
      name: NAMES[suit][0],
      text: `Read every card of ${suit[0].toUpperCase()}${suit.slice(1)} at least once.`,
      when: (_r: RunState, k: Knowledge) => Array.from({ length: 14 }, (_, i) => `${suit}-${i + 1}`).every((id) => (k.cards[id]?.resolved ?? 0) >= 1),
    };
  }),
  {
    id: 'held-before',
    glyph: '↻',
    name: 'Held Before',
    text: 'Return with an Abyss reading that held a card you had already placed this descent.',
    when: (r) => {
      if (!ascended(r) || r.history.length < 2) return false;
      const last = r.history[r.history.length - 1];
      const earlier = new Set(r.history.slice(0, -1).flatMap((h) => SLOT_IDS.map((s) => h.reading[s].cardId)));
      return SLOT_IDS.some((s) => earlier.has(last.reading[s].cardId));
    },
  },
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
const KNOWLEDGE_ONLY = new Set(['steady-hand', 'every-rite', 'remembered', 'bound', 'majors-glimpsed', 'ten-mastered', 'named-five', 'ten-deaths', 'seven-days', 'three-vows', 'well-worn', 'wands-read', 'cups-read', 'swords-read', 'pentacles-read']);
export function newKnowledgeSigils(k: Knowledge): string[] {
  const held = new Set(k.sigils ?? []);
  const dummy = { phase: { kind: 'dead' } } as unknown as RunState;
  return SIGILS.filter((s) => KNOWLEDGE_ONLY.has(s.id) && !held.has(s.id) && s.when(dummy, k)).map((s) => s.id);
}
