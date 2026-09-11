import { createDeck, discard, draw, type DeckState, type DrawnCard } from './deck';
import { resolveReading, type Reading, type Resolution } from './resolve';
import { createRng, type Rng } from './rng';
import { actOfLayer, buildMap, SCENES, SLOT_IDS, type MapNode, type Scene, type SlotId } from './scenes';

export const CANDIDATES_PER_SLOT = 3;
export const STARTING_VITALITY = 12;
export const STARTING_CLARITY = 2;
export const REDRAW_COST = 1;
export const WHISPER_COST = 1;

/** Per-run consequences that follow a card around. */
export type Mark = 'charged' | 'scarred';

export interface SlotState {
  slot: SlotId;
  candidates: DrawnCard[];
  chosen: number | null; // index into candidates
  /** Candidate indices whose keyword has been whispered this seat. */
  whispered: number[];
}

export type Phase =
  | { kind: 'map' }                 // choosing the next node
  | { kind: 'reading' }             // choosing cards, seat by seat
  | { kind: 'resolved'; resolution: Resolution }
  | { kind: 'dead'; resolution: Resolution }
  | { kind: 'ascended'; resolution: Resolution };

export interface HistoryEntry {
  sceneId: string;
  reading: Reading;
  resolution: Resolution;
}

export interface RunState {
  seed: number;
  rngState: number;
  deck: DeckState;
  map: MapNode[][];
  /** Index of the layer the player is choosing from (map phase) or standing in (otherwise). */
  layer: number;
  /** Chosen node within `layer`, null while choosing. */
  node: number | null;
  vitality: number;
  clarity: number;
  marks: Record<string, Mark>;
  slots: SlotState[];
  activeSlot: number;
  phase: Phase;
  history: HistoryEntry[];
}

function rngOf(run: RunState): Rng {
  return createRng(run.rngState);
}

function withRng(run: RunState, rng: Rng): RunState {
  return { ...run, rngState: rng.state() };
}

export function currentNode(run: RunState): MapNode | null {
  return run.node === null ? null : run.map[run.layer][run.node];
}

export function currentScene(run: RunState): Scene {
  const node = currentNode(run);
  if (!node) throw new Error('No scene: run is choosing a map node');
  return SCENES[node.sceneId];
}

export function currentAct(run: RunState): number {
  return actOfLayer(run.layer);
}

export function sceneNumber(run: RunState): number {
  return run.layer + 1;
}

export function totalScenes(run: RunState): number {
  return run.map.length;
}

export function startRun(seed: number): RunState {
  const rng = createRng(seed);
  const map = buildMap(rng);
  const deck = createDeck(rng);
  return {
    seed,
    rngState: rng.state(),
    deck,
    map,
    layer: 0,
    node: null,
    vitality: STARTING_VITALITY,
    clarity: STARTING_CLARITY,
    marks: {},
    slots: [],
    activeSlot: 0,
    phase: { kind: 'map' },
    history: [],
  };
}

/** Marks override orientation: charged cards land upright, scarred cards land reversed. */
function applyMarks(run: RunState, cards: DrawnCard[]): DrawnCard[] {
  return cards.map((c) => {
    const m = run.marks[c.cardId];
    if (m === 'charged') return { ...c, reversed: false };
    if (m === 'scarred') return { ...c, reversed: true };
    return c;
  });
}

function dealSeat(run: RunState, rng: Rng, deck: DeckState, slot: SlotId): { deck: DeckState; state: SlotState } {
  const dealt = draw(deck, rng, CANDIDATES_PER_SLOT);
  return { deck: dealt.deck, state: { slot, candidates: applyMarks(run, dealt.cards), chosen: null, whispered: [] } };
}

/** Pick a node in the current layer and sit down to read. */
export function chooseNode(run: RunState, index: number): RunState {
  if (run.phase.kind !== 'map') return run;
  const layer = run.map[run.layer];
  if (!layer || index < 0 || index >= layer.length) return run;
  const rng = rngOf(run);
  const first = dealSeat(run, rng, run.deck, SLOT_IDS[0]);
  return withRng(
    { ...run, node: index, deck: first.deck, slots: [first.state], activeSlot: 0, phase: { kind: 'reading' } },
    rng,
  );
}

export function activeSlotState(run: RunState): SlotState | undefined {
  return run.slots[run.activeSlot];
}

/** Choose one of the three candidates for the active seat, then deal the next seat. */
export function chooseCandidate(run: RunState, index: number): RunState {
  if (run.phase.kind !== 'reading') return run;
  const slot = run.slots[run.activeSlot];
  if (!slot || slot.chosen !== null) return run;
  if (index < 0 || index >= slot.candidates.length) return run;

  const rng = rngOf(run);
  const rejected = slot.candidates.filter((_, i) => i !== index);
  let deck = discard(run.deck, rejected);
  const slots = run.slots.map((s, i) => (i === run.activeSlot ? { ...s, chosen: index } : s));

  const nextIndex = run.activeSlot + 1;
  if (nextIndex < SLOT_IDS.length) {
    const next = dealSeat(run, rng, deck, SLOT_IDS[nextIndex]);
    deck = next.deck;
    slots.push(next.state);
    return withRng({ ...run, deck, slots, activeSlot: nextIndex }, rng);
  }
  return resolve(withRng({ ...run, deck, slots, activeSlot: nextIndex }, rng));
}

/** Spend Clarity to re-deal the active seat's three candidates. */
export function redrawActive(run: RunState): RunState {
  if (run.phase.kind !== 'reading') return run;
  if (run.clarity < REDRAW_COST) return run;
  const slot = run.slots[run.activeSlot];
  if (!slot || slot.chosen !== null) return run;
  const rng = rngOf(run);
  const deck = discard(run.deck, slot.candidates);
  const next = dealSeat(run, rng, deck, slot.slot);
  const slots = run.slots.map((s, i) => (i === run.activeSlot ? next.state : s));
  return withRng({ ...run, deck: next.deck, slots, clarity: run.clarity - REDRAW_COST }, rng);
}

/** Spend Clarity to hear one keyword of a candidate. The UI shows it; the Codex remembers it. */
export function whisper(run: RunState, index: number): RunState {
  if (run.phase.kind !== 'reading') return run;
  if (run.clarity < WHISPER_COST) return run;
  const slot = run.slots[run.activeSlot];
  if (!slot || slot.chosen !== null) return run;
  if (index < 0 || index >= slot.candidates.length || slot.whispered.includes(index)) return run;
  const slots = run.slots.map((s, i) => (i === run.activeSlot ? { ...s, whispered: [...s.whispered, index] } : s));
  return { ...run, slots, clarity: run.clarity - WHISPER_COST };
}

export function readingOf(run: RunState): Reading | null {
  if (run.slots.length !== SLOT_IDS.length || run.slots.some((s) => s.chosen === null)) return null;
  const out = {} as Reading;
  for (const s of run.slots) out[s.slot] = s.candidates[s.chosen!];
  return out;
}

function resolve(run: RunState): RunState {
  const reading = readingOf(run);
  if (!reading) return run;
  const scene = currentScene(run);
  const resolution = resolveReading(scene, reading, run.marks);
  const vitality = run.vitality + resolution.deltas.vitality;
  const clarity = run.clarity + resolution.deltas.clarity;
  const played = SLOT_IDS.map((s) => reading[s]);
  const deck = discard(run.deck, played);
  const history = [...run.history, { sceneId: scene.id, reading, resolution }];

  const marks = { ...run.marks };
  if (resolution.tier === 'triumph') for (const c of played) marks[c.cardId] = 'charged';
  if (resolution.tier === 'calamity') for (const c of played) marks[c.cardId] = 'scarred';

  const base = { ...run, deck, history, vitality, clarity, marks };
  if (vitality <= 0) return { ...base, vitality: 0, phase: { kind: 'dead', resolution } };
  if (scene.terminal) return { ...base, phase: { kind: 'ascended', resolution } };
  return { ...base, phase: { kind: 'resolved', resolution } };
}

/** After reading the resolution, walk on to the map. */
export function advance(run: RunState): RunState {
  if (run.phase.kind !== 'resolved') return run;
  return { ...run, layer: run.layer + 1, node: null, slots: [], activeSlot: 0, phase: { kind: 'map' } };
}

export function isOver(run: RunState): boolean {
  return run.phase.kind === 'dead' || run.phase.kind === 'ascended';
}

/** The four cards on the table when the run ended. */
export function finalSpread(run: RunState): DrawnCard[] {
  const last = run.history[run.history.length - 1];
  return last ? SLOT_IDS.map((s) => last.reading[s]) : [];
}

/** Scenes visited so far, in order (for the map and the journal). */
export function visitedNodes(run: RunState): MapNode[] {
  const out: MapNode[] = [];
  run.history.forEach((h, i) => {
    const node = run.map[i]?.find((n) => n.sceneId === h.sceneId);
    if (node) out.push(node);
  });
  return out;
}
