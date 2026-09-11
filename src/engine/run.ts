import { createDeck, discard, draw, type DeckState, type DrawnCard } from './deck';
import { resolveReading, type Reading, type Resolution } from './resolve';
import { createRng, type Rng } from './rng';
import { buildRunPath, SCENES, SLOT_IDS, type Scene, type SlotId } from './scenes';

export const CANDIDATES_PER_SLOT = 3;
export const STARTING_VITALITY = 10;
export const STARTING_CLARITY = 2;
export const REDRAW_COST = 1;

export interface SlotState {
  slot: SlotId;
  candidates: DrawnCard[];
  chosen: number | null; // index into candidates
}

export type Phase =
  | { kind: 'reading' }            // choosing cards, slot by slot
  | { kind: 'resolved'; resolution: Resolution }
  | { kind: 'dead'; resolution: Resolution }
  | { kind: 'ascended'; resolution: Resolution };

export interface RunState {
  seed: number;
  rngState: number;
  deck: DeckState;
  path: string[];
  sceneIndex: number;
  vitality: number;
  clarity: number;
  slots: SlotState[];
  activeSlot: number;
  phase: Phase;
  history: { sceneId: string; reading: Reading; resolution: Resolution }[];
}

/** Rehydrate an Rng from stored state so the run is a pure value. */
function rngOf(run: RunState): Rng {
  return createRng(run.rngState);
}

function withRng(run: RunState, rng: Rng): RunState {
  return { ...run, rngState: rng.state() };
}

export function currentScene(run: RunState): Scene {
  return SCENES[run.path[run.sceneIndex]];
}

export function startRun(seed: number): RunState {
  const rng = createRng(seed);
  const path = buildRunPath((arr) => rng.pick(arr));
  const deck = createDeck(rng);
  const run: RunState = {
    seed,
    rngState: rng.state(),
    deck,
    path,
    sceneIndex: 0,
    vitality: STARTING_VITALITY,
    clarity: STARTING_CLARITY,
    slots: [],
    activeSlot: 0,
    phase: { kind: 'reading' },
    history: [],
  };
  return beginReading(run);
}

/** Lay out the first seat's candidates for the current scene. */
function beginReading(run: RunState): RunState {
  const rng = rngOf(run);
  const { deck, cards } = draw(run.deck, rng, CANDIDATES_PER_SLOT);
  return withRng(
    {
      ...run,
      deck,
      slots: [{ slot: SLOT_IDS[0], candidates: cards, chosen: null }],
      activeSlot: 0,
      phase: { kind: 'reading' },
    },
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
    const dealt = draw(deck, rng, CANDIDATES_PER_SLOT);
    deck = dealt.deck;
    slots.push({ slot: SLOT_IDS[nextIndex], candidates: dealt.cards, chosen: null });
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
  let deck = discard(run.deck, slot.candidates);
  const dealt = draw(deck, rng, CANDIDATES_PER_SLOT);
  deck = dealt.deck;
  const slots = run.slots.map((s, i) => (i === run.activeSlot ? { ...s, candidates: dealt.cards } : s));
  return withRng({ ...run, deck, slots, clarity: run.clarity - REDRAW_COST }, rng);
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
  const resolution = resolveReading(scene, reading);
  const vitality = run.vitality + resolution.deltas.vitality;
  const clarity = run.clarity + resolution.deltas.clarity;
  const deck = discard(run.deck, SLOT_IDS.map((s) => reading[s]));
  const history = [...run.history, { sceneId: scene.id, reading, resolution }];
  const base = { ...run, deck, history, vitality, clarity };
  if (vitality <= 0) return { ...base, vitality: 0, phase: { kind: 'dead', resolution } };
  if (scene.terminal) return { ...base, phase: { kind: 'ascended', resolution } };
  return { ...base, phase: { kind: 'resolved', resolution } };
}

/** After reading the resolution, walk on to the next scene. */
export function advance(run: RunState): RunState {
  if (run.phase.kind !== 'resolved') return run;
  return beginReading({ ...run, sceneIndex: run.sceneIndex + 1 });
}

export function isOver(run: RunState): boolean {
  return run.phase.kind === 'dead' || run.phase.kind === 'ascended';
}

/** The four cards on the table when the run ended. */
export function finalSpread(run: RunState): DrawnCard[] {
  const last = run.history[run.history.length - 1];
  return last ? SLOT_IDS.map((s) => last.reading[s]) : [];
}
