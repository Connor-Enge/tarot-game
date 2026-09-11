import { createDeck, discard, draw, REVERSED_CHANCE, type DeckState, type DrawnCard } from './deck';
import type { RunConfig } from './descents';
import { resolveReading, type Reading, type Resolution } from './resolve';
import { createRng, type Rng } from './rng';
import { BOON_IDS, CURSE_IDS } from './relics';
import { ACT_LAYERS, actOfLayer, buildMap, SCENES, SLOT_IDS, type MapNode, type Scene, type SlotId } from './scenes';

export const CANDIDATES_PER_SLOT = 3;
export const STARTING_VITALITY = 10;
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
  | { kind: 'resolved'; resolution: Resolution; offer?: string[]; cursed?: string; found?: string }
  | { kind: 'relic'; offer: string[] }
  | { kind: 'dead'; resolution: Resolution }
  | { kind: 'ascended'; resolution: Resolution };

export interface HistoryEntry {
  sceneId: string;
  reading: Reading;
  resolution: Resolution;
}

export interface RunState {
  seed: number;
  /** Chance a dealt card lands reversed, fixed for the run. */
  reversedChance: number;
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
  /** Relic ids held this run (boons and curses). */
  relics: string[];
  freeRedrawUsed: boolean;
  redraws: number;
  whispers: number;
  /** Where the deck was cut before the first scene, if it was. */
  cut?: number;
  /** Layers per act for this run. */
  actLayers: readonly number[];
  /** The last scene's Wake card, waiting to be dealt into the next Vessel. */
  echo: DrawnCard | null;
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

export function hasRelic(run: RunState, id: string): boolean {
  return run.relics.includes(id);
}

export function whisperCost(run: RunState): number {
  return hasRelic(run, 'hush') ? WHISPER_COST * 2 : WHISPER_COST;
}

export function redrawCost(run: RunState): number {
  return hasRelic(run, 'coin') && !run.freeRedrawUsed ? 0 : REDRAW_COST;
}

function clampClarity(run: RunState, clarity: number): number {
  return hasRelic(run, 'debt') ? Math.min(clarity, 2) : clarity;
}

export function currentAct(run: RunState): number {
  return actOfLayer(run.layer, run.actLayers);
}

export function sceneNumber(run: RunState): number {
  return run.layer + 1;
}

export function totalScenes(run: RunState): number {
  return run.map.length;
}

export function startRun(seed: number, config: RunConfig = {}): RunState {
  const rng = createRng(seed);
  const actLayers = config.actLayers ?? ACT_LAYERS;
  const map = buildMap(rng, actLayers);
  let deck = createDeck(rng, config.deck);
  if (config.majorsFirst) {
    const majors = rng.shuffle(deck.draw.filter((id) => id.startsWith('major-'))).slice(0, 12);
    const rest = deck.draw.filter((id) => !majors.includes(id));
    deck = { draw: [...rest, ...majors], discard: [] }; // top of deck = end of array
  }
  return {
    seed,
    reversedChance: config.reversedChance ?? REVERSED_CHANCE,
    rngState: rng.state(),
    deck,
    map,
    layer: 0,
    node: null,
    vitality: config.startingVitality ?? STARTING_VITALITY,
    clarity: config.startingClarity ?? STARTING_CLARITY,
    marks: {},
    relics: [...(config.startingRelics ?? [])],
    freeRedrawUsed: false,
    redraws: 0,
    whispers: 0,
    actLayers,
    echo: null,
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
  let count = CANDIDATES_PER_SLOT;
  if (slot === 'threshold' && hasRelic(run, 'lens')) count++;
  if (slot === 'wake' && hasRelic(run, 'shard')) count++;
  const dealt = draw(deck, rng, count, run.reversedChance);
  let cards = applyMarks(run, dealt.cards);
  let outDeck = dealt.deck;
  if (slot === 'vessel' && run.echo) {
    // Pull the echoed card back out of the discard so it is not duplicated.
    const i = outDeck.discard.lastIndexOf(run.echo.cardId);
    if (i >= 0) {
      outDeck = { ...outDeck, discard: [...outDeck.discard.slice(0, i), ...outDeck.discard.slice(i + 1)] };
      cards = [...cards, { ...run.echo, hidden: false, echo: true }];
    }
  }
  if (slot === 'hand' && hasRelic(run, 'salt')) cards = cards.map((c) => (run.marks[c.cardId] === 'scarred' ? c : { ...c, reversed: false }));
  if (slot === 'vessel' && hasRelic(run, 'splinter') && cards.length && !cards.some((c) => c.reversed)) {
    const i = cards.findIndex((c) => run.marks[c.cardId] !== 'charged');
    if (i >= 0) cards = cards.map((c, j) => (j === i ? { ...c, reversed: true } : c));
  }
  if (hasRelic(run, 'fog') && cards.length) {
    const i = rng.int(cards.length);
    cards = cards.map((c, j) => (j === i ? { ...c, hidden: true } : c));
  }
  return { deck: outDeck, state: { slot, candidates: cards, chosen: null, whispered: [] } };
}

/**
 * Cut the deck before the first scene: the top `at` cards go to the bottom.
 * A ritual with real consequence; the only hand the player gets on the shuffle.
 */
export function canCut(run: RunState): boolean {
  return run.phase.kind === 'map' && run.layer === 0 && run.history.length === 0 && !run.cut;
}

export function cutDeck(run: RunState, at: number): RunState {
  if (!canCut(run)) return run;
  const n = Math.max(1, Math.min(run.deck.draw.length - 1, Math.floor(at)));
  const top = run.deck.draw.slice(-n); // top of deck = end of array
  const rest = run.deck.draw.slice(0, -n);
  return { ...run, deck: { ...run.deck, draw: [...top, ...rest] }, cut: n };
}

/** Pick a node in the current layer and sit down to read. */
export function chooseNode(run: RunState, index: number): RunState {
  if (run.phase.kind !== 'map') return run;
  const layer = run.map[run.layer];
  if (!layer || index < 0 || index >= layer.length) return run;
  const rng = rngOf(run);
  const first = dealSeat(run, rng, run.deck, SLOT_IDS[0]);
  return withRng(
    { ...run, node: index, deck: first.deck, slots: [first.state], activeSlot: 0, freeRedrawUsed: false, echo: null, phase: { kind: 'reading' } },
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
  const cost = redrawCost(run);
  if (run.clarity < cost) return run;
  const slot = run.slots[run.activeSlot];
  if (!slot || slot.chosen !== null) return run;
  const rng = rngOf(run);
  const deck = discard(run.deck, slot.candidates);
  const next = dealSeat(run, rng, deck, slot.slot);
  const slots = run.slots.map((s, i) => (i === run.activeSlot ? next.state : s));
  return withRng({ ...run, deck: next.deck, slots, clarity: run.clarity - cost, freeRedrawUsed: run.freeRedrawUsed || cost === 0, redraws: run.redraws + 1 }, rng);
}

/** Spend Clarity to hear one keyword of a candidate. The UI shows it; the Codex remembers it. */
export function whisper(run: RunState, index: number): RunState {
  if (run.phase.kind !== 'reading') return run;
  const cost = whisperCost(run);
  if (run.clarity < cost) return run;
  const slot = run.slots[run.activeSlot];
  if (!slot || slot.chosen !== null) return run;
  if (index < 0 || index >= slot.candidates.length || slot.whispered.includes(index)) return run;
  if (slot.candidates[index].hidden) return run;
  const slots = run.slots.map((s, i) => (i === run.activeSlot ? { ...s, whispered: [...s.whispered, index] } : s));
  return { ...run, slots, clarity: run.clarity - cost, whispers: run.whispers + 1 };
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
  const resolution = resolveReading(scene, reading, run.marks, {
    chargedBonus: hasRelic(run, 'ring') ? 2 : undefined,
    extraNeutralCost: hasRelic(run, 'weight') ? 1 : undefined,
    mendBonus: hasRelic(run, 'bread') ? 2 : undefined,
  });
  const vitality = run.vitality + resolution.deltas.vitality;
  const clarity = clampClarity(run, run.clarity + resolution.deltas.clarity);
  // Reveal anything chosen blind.
  const revealed = {} as Reading;
  for (const s of SLOT_IDS) revealed[s] = { ...reading[s], hidden: false };
  const played = SLOT_IDS.map((s) => revealed[s]);
  const deck = discard(run.deck, played);
  const history = [...run.history, { sceneId: scene.id, reading: revealed, resolution }];

  const marks = { ...run.marks };
  if (resolution.tier === 'triumph') for (const c of played) marks[c.cardId] = 'charged';
  if (resolution.tier === 'calamity') for (const c of played) marks[c.cardId] = 'scarred';

  const rng = rngOf(run);
  let relics = run.relics;
  let offer: string[] | undefined;
  let cursed: string | undefined;
  if (resolution.tier === 'triumph' && !scene.terminal) {
    const pool = rng.shuffle(BOON_IDS.filter((id) => !relics.includes(id)));
    if (pool.length) offer = pool.slice(0, 2);
  }
  let found: string | undefined;
  if (resolution.tier === 'boon' && scene.relic && !relics.includes(scene.relic)) {
    found = scene.relic;
    relics = [...relics, found];
  }
  if (resolution.tier === 'calamity' && !scene.terminal) {
    const pool = CURSE_IDS.filter((id) => !relics.includes(id));
    if (pool.length) {
      cursed = rng.pick(pool);
      relics = [...relics, cursed];
    }
  }

  const echo: DrawnCard = { cardId: revealed.wake.cardId, reversed: revealed.wake.reversed };
  const base = withRng({ ...run, deck, history, vitality, clarity, marks, relics, echo }, rng);
  if (vitality <= 0) return { ...base, vitality: 0, phase: { kind: 'dead', resolution } };
  if (scene.terminal) return { ...base, phase: { kind: 'ascended', resolution } };
  return { ...base, phase: { kind: 'resolved', resolution, offer, cursed, found } };
}

/** After reading the resolution, take the offered relic (if any) or walk on to the map. */
export function advance(run: RunState): RunState {
  if (run.phase.kind !== 'resolved') return run;
  const clarity = clampClarity(run, run.clarity + (hasRelic(run, 'candle') ? 1 : 0));
  if (run.phase.offer && run.phase.offer.length) return { ...run, clarity, phase: { kind: 'relic', offer: run.phase.offer } };
  return { ...run, clarity, layer: run.layer + 1, node: null, slots: [], activeSlot: 0, phase: { kind: 'map' } };
}

/** Take one of the offered boons, then walk on. */
export function chooseRelic(run: RunState, index: number): RunState {
  if (run.phase.kind !== 'relic') return run;
  const id = run.phase.offer[index];
  if (!id) return run;
  return { ...run, relics: [...run.relics, id], layer: run.layer + 1, node: null, slots: [], activeSlot: 0, phase: { kind: 'map' } };
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
