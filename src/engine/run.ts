import { createDeck, discard, draw, REVERSED_CHANCE, type DeckState, type DrawnCard } from './deck';
import type { RunConfig } from './descents';
import { resolveReading, scoreSlot, type Reading, type Resolution } from './resolve';
import { createRng, type Rng } from './rng';
import { getVow } from './vows';
import { BOON_IDS, CURSE_IDS } from './relics';
import { ACT_LAYERS, actOfLayer, buildMap, SCENES, SLOT_IDS, type MapNode, type Scene, type SlotId } from './scenes';

export const CANDIDATES_PER_SLOT = 3;
export const STARTING_VITALITY = 10;
export const STARTING_CLARITY = 2;
export const REDRAW_COST = 1;
export const WHISPER_COST = 1;
export const TURN_COST = 1;
export const HOLD_COST = 1;
export const LAMP_COST = 2;

/** Per-run consequences that follow a card around. */
export type Mark = 'charged' | 'scarred';

export interface SlotState {
  slot: SlotId;
  candidates: DrawnCard[];
  chosen: number | null; // index into candidates
  /** Candidate indices whose keyword has been whispered this seat. */
  whispered: number[];
  /** The lamp has been held over this seat: every card in the hand shows what it would do here. */
  lit?: boolean;
}

export type Phase =
  | { kind: 'map' }                 // choosing the next node
  | { kind: 'reading' }             // choosing cards, seat by seat
  | { kind: 'resolved'; resolution: Resolution; offer?: string[]; cursed?: string; found?: string; trade?: Trade; traded?: boolean }
  | { kind: 'relic'; offer: string[] }
  | { kind: 'dead'; resolution: Resolution }
  | { kind: 'ascended'; resolution: Resolution };

/**
 * The Stranger's trade: offered once at a rest scene that went at least
 * neutrally. Stated plainly, like every rule. Take it or walk on.
 */
export type Trade =
  | { id: 'clarity-for-vitality'; give: number; get: number }
  | { id: 'swap-boon'; give: string; get: string }
  | { id: 'lift-curse'; give: number; curse: string }
  | { id: 'bless-hand'; give: number; cardId: string }
  | { id: 'vitality-for-clarity'; give: number; get: number }
  | { id: 'scar-for-boon'; cardId: string; get: string };

/** The peddler at the market makes the last two; the Stranger by the fire makes the rest. */
export function isPeddlerTrade(t: Trade): boolean {
  return t.id === 'vitality-for-clarity' || t.id === 'scar-for-boon';
}

export function tradeText(t: Trade): string {
  switch (t.id) {
    case 'clarity-for-vitality': return `Give ◈${t.give} for ♥${t.get}.`;
    case 'swap-boon': return `Give up what you carry for something else of theirs.`;
    case 'lift-curse': return `Give ♥${t.give} and be rid of what follows you.`;
    case 'bless-hand': return `Give ◈${t.give} and they will bless the card you acted with tonight.`;
    case 'vitality-for-clarity': return `Give ♥${t.give} for ◈${t.get}.`;
    case 'scar-for-boon': return `Let them scar the card that followed you tonight, and take something from the cloth.`;
  }
}

export interface HistoryEntry {
  sceneId: string;
  reading: Reading;
  resolution: Resolution;
  /** Clarity spent in this scene. */
  spent?: { redraws: number; whispers: number };
  /** The cards passed over in each seat, as they would have been read. */
  passed?: Partial<Record<SlotId, DrawnCard[]>>;
  /** Seats the lamp was lit over. */
  lit?: SlotId[];
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
  /** Node ids whose place has been foretold. */
  foretold: string[];
  /** Take-backs remaining this run. */
  takeBacks: number;
  /** Candidates put aside by a take-back, to be dealt again unchanged. */
  pendingDeal: DrawnCard[] | null;
  /** Counters for the scene in progress. */
  sceneSpent: { redraws: number; whispers: number; turns?: number };
  /** Depth modifiers carried by the run. */
  mods: { extraNeutralCost: number; noEcho: boolean; abyssStakes?: number; seatTick?: boolean; allLit?: boolean; kinBonus?: number };
  slots: SlotState[];
  activeSlot: number;
  phase: Phase;
  history: HistoryEntry[];
  /** A vow taken before the first scene, if any. `kept` is set on entering the Abyss unbroken. */
  vow?: { id: string; broken: boolean; kept?: boolean };
  /** The Well: how many Abysses have opened onto a deeper map. Absent outside the Well. */
  well?: number;
  /** True once the Stranger's trade has been taken this run. */
  traded?: boolean;
  /** Lamps lit this run. */
  lamps?: number;
  /** True once the peddler at the market has made an offer this run. */
  peddlerMet?: boolean;
  /** True while reading the Abyss after it was dealt from the run's own discard. */
  abyssRemade?: boolean;
  /** Which trade it was. */
  tradeTaken?: Trade['id'];
  /** A keepsake from Study, carried charged into this descent. */
  keepsake?: string;
  /** Pairs that know each other, fixed for the descent. */
  kin?: string[];
  /** A candidate held back for the next seat, if any. */
  held?: DrawnCard | null;
  /** Holds made this run. */
  holds?: number;
  /** Net Clarity moved by seat ticks this run, when the rule is on. */
  ticks?: number;
  /** This scene dealt every seat at once (the Long Look); seats are walked, not dealt, as you go. */
  laidBare?: boolean;
  /** Set once the keepsake has been dealt and shown as yours. */
  keepsakeShown?: boolean;
  /** True once the Stranger has appeared this run. They come once. */
  strangerMet?: boolean;
  /** The reader's signature card, if any. */
  signature?: string;
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
  return actOfLayer(run.well === undefined ? run.layer : run.layer % cycleLength(run), run.actLayers);
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
  if (config.signature && deck.draw.includes(config.signature)) {
    deck = { draw: [...deck.draw.filter((id) => id !== config.signature), config.signature], discard: [] };
  }
  return {
    seed,
    signature: config.signature && deck.draw.includes(config.signature) ? config.signature : undefined,
    reversedChance: config.reversedChance ?? REVERSED_CHANCE,
    rngState: rng.state(),
    deck,
    map,
    layer: 0,
    node: null,
    vitality: config.startingVitality ?? STARTING_VITALITY,
    clarity: config.startingClarity ?? STARTING_CLARITY,
    marks: Object.fromEntries([...(config.charged ?? []), ...(config.keepsake ? [config.keepsake] : [])].map((id) => [id, 'charged' as const])),
    keepsake: config.keepsake && deck.draw.includes(config.keepsake) ? config.keepsake : undefined,
    kin: config.kin && config.kin.length ? config.kin : undefined,
    relics: [...(config.startingRelics ?? [])],
    freeRedrawUsed: false,
    redraws: 0,
    whispers: 0,
    actLayers,
    echo: null,
    mods: { extraNeutralCost: config.extraNeutralCost ?? 0, noEcho: !!config.noEcho, abyssStakes: config.abyssStakes, seatTick: config.seatTick || undefined, allLit: config.allLit || undefined, kinBonus: config.kinBonus },
    sceneSpent: { redraws: 0, whispers: 0 },
    foretold: [],
    takeBacks: 1 + ((config.startingRelics ?? []).includes('thread') ? 1 : 0),
    pendingDeal: null,
    slots: [],
    activeSlot: 0,
    phase: { kind: 'map' },
    history: [],
    well: config.endless ? 0 : undefined,
  };
}

/** Layers in one full descent (all acts and the Abyss). In the Well the map repeats in cycles of this length. */
export function cycleLength(run: RunState): number {
  return run.actLayers.reduce((a, b) => a + b, 0) + 1;
}

/** In the Well, which descent this is (1 for the first). Elsewhere 1. */
export function wellTurn(run: RunState): number {
  return (run.well ?? 0) + 1;
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

/** True once a deal has shown the keepsake as yours; it announces itself only once. */
function keepsakeShown(run: RunState, state: SlotState): boolean | undefined {
  return run.keepsakeShown || state.candidates.some((c) => c.yours) || undefined;
}

function dealSeat(run: RunState, rng: Rng, deck: DeckState, slot: SlotId): { deck: DeckState; state: SlotState } {
  const rite = currentScene(run).rite;
  const lit = rite === 'lit' || run.mods.allLit ? true : undefined;
  if (run.pendingDeal) {
    return { deck, state: { slot, candidates: run.pendingDeal, chosen: null, whispered: [], lit } };
  }
  let count = rite === 'bare' ? CANDIDATES_PER_SLOT - 1 : CANDIDATES_PER_SLOT;
  if (slot === 'wake' && rite === 'moonlit') count++;
  if (rite === 'look') count++;
  if (slot === 'threshold' && hasRelic(run, 'lens')) count++;
  if (slot === 'wake' && hasRelic(run, 'shard')) count++;
  if (slot === 'vessel' && hasRelic(run, 'lodestone')) count++;
  const dealt = draw(deck, rng, count, hasRelic(run, 'feather') ? run.reversedChance / 2 : run.reversedChance);
  let cards = applyMarks(run, dealt.cards);
  // The signature lands upright the first time it is dealt, in the first Vessel.
  if (run.signature && slot === 'vessel' && run.history.length === 0) cards = cards.map((c) => (c.cardId === run.signature ? { ...c, reversed: false } : c));
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
  if (hasRelic(run, 'fog') && cards.length && rite !== 'look') {
    const i = rng.int(cards.length);
    cards = cards.map((c, j) => (j === i ? { ...c, hidden: true } : c));
  }
  // The keepsake announces itself the first time it is dealt.
  if (run.keepsake && !run.keepsakeShown) cards = cards.map((c) => (c.cardId === run.keepsake && !c.hidden ? { ...c, yours: true } : c));
  // A card held back from the seat before joins this deal.
  if (run.held && run.pendingDeal === null) cards = [...cards, { ...run.held, hidden: false, held: true }];
  return { deck: outDeck, state: { slot, candidates: cards, chosen: null, whispered: [], lit } };
}

/**
 * Cut the deck before the first scene: the top `at` cards go to the bottom.
 * A ritual with real consequence; the only hand the player gets on the shuffle.
 */
/** A vow may be taken only before the first scene. */
export function canTakeVow(run: RunState): boolean {
  return run.phase.kind === 'map' && run.history.length === 0 && run.node === null && !run.vow;
}

export function takeVow(run: RunState, id: string): RunState {
  if (!canTakeVow(run)) return run;
  getVow(id);
  return { ...run, vow: { id, broken: false } };
}

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

export const FORETELL_COST = 1;

/**
 * Take back the last placement, once per run. The card returns to its
 * candidates, the two it beat come back out of the discard, and the seat
 * that was just dealt is put aside to be dealt again exactly as it was.
 */
export function canTakeBack(run: RunState): boolean {
  if (run.phase.kind !== 'reading' || run.takeBacks <= 0) return false;
  if (run.activeSlot === 0) return false;
  const active = run.slots[run.activeSlot];
  return !!active && active.chosen === null && active.whispered.length === 0;
}

export function takeBack(run: RunState): RunState {
  if (!canTakeBack(run)) return run;
  const prevIndex = run.activeSlot - 1;
  const prev = run.slots[prevIndex];
  const active = run.slots[run.activeSlot];
  // Pull the rejected candidates back out of the discard (last occurrences).
  let discard = run.deck.discard.slice();
  prev.candidates.forEach((c, i) => {
    if (i === prev.chosen) return;
    const at = discard.lastIndexOf(c.cardId);
    if (at >= 0) discard.splice(at, 1);
  });
  const slots = (run.laidBare ? run.slots : run.slots.slice(0, prevIndex + 1)).map((s, i) => (i === prevIndex ? { ...s, chosen: null } : s));
  return {
    ...run,
    deck: { ...run.deck, discard },
    slots,
    activeSlot: prevIndex,
    takeBacks: run.takeBacks - 1,
    pendingDeal: active.candidates,
  };
}

/** Spend Clarity to learn a node's place line before choosing it. */
export function foretellCost(run: RunState): number {
  return hasRelic(run, 'compass') ? 0 : FORETELL_COST;
}

export function foretell(run: RunState, index: number): RunState {
  if (run.phase.kind !== 'map') return run;
  const node = run.map[run.layer]?.[index];
  if (!node || run.foretold.includes(node.id)) return run;
  const cost = foretellCost(run);
  if (run.clarity < cost) return run;
  return { ...run, clarity: run.clarity - cost, foretold: [...run.foretold, node.id] };
}

/** Some relics act the moment they are picked up. */
function onGain(run: RunState, id: string): RunState {
  if (id === 'thread') return { ...run, takeBacks: run.takeBacks + 1 };
  return run;
}

/** Pick a node in the current layer and sit down to read. */
export function chooseNode(run: RunState, index: number): RunState {
  if (run.phase.kind !== 'map') return run;
  const layer = run.map[run.layer];
  if (!layer || index < 0 || index >= layer.length) return run;
  const rng = rngOf(run);
  // The Abyss deals from what you have read: the discard is shuffled onto the top of the deck as you step in.
  const terminal = SCENES[layer[index].sceneId].terminal;
  const remade = terminal && run.deck.discard.length >= 12;
  const deckIn: DeckState = remade ? { draw: [...run.deck.draw, ...rng.shuffle(run.deck.discard)], discard: [] } : run.deck;
  const first = dealSeat({ ...run, node: index, deck: deckIn }, rng, deckIn, SLOT_IDS[0]);
  // The Long Look lays the whole hand bare: every seat dealt now, walked in order.
  const bare = SCENES[layer[index].sceneId].rite === 'look';
  const laid = (() => {
    if (!bare) return { deck: first.deck, states: [first.state] };
    let deck = first.deck;
    const states = [first.state];
    for (let i = 1; i < SLOT_IDS.length; i++) {
      const d = dealSeat({ ...run, node: index, deck, held: null, keepsakeShown: run.keepsakeShown || states.some((st) => st.candidates.some((c) => c.yours)) }, rng, deck, SLOT_IDS[i]);
      deck = d.deck;
      states.push(d.state);
    }
    return { deck, states };
  })();
  // The Tithe: a drop of vitality at the door, and a light for it. It never kills; the reading may.
  const tithed = SCENES[layer[index].sceneId].rite === 'tithe';
  const tithe = tithed ? Math.min(1, Math.max(0, run.vitality - 1)) : 0;
  let next: RunState = { ...run, node: index, vitality: run.vitality - tithe, clarity: tithed ? clampClarity(run, run.clarity + 1) : run.clarity, deck: laid.deck, slots: laid.states, activeSlot: 0, freeRedrawUsed: false, echo: null, sceneSpent: { redraws: 0, whispers: 0 }, phase: { kind: 'reading' }, abyssRemade: remade || undefined, laidBare: bare || undefined, held: bare ? null : run.held, keepsakeShown: run.keepsakeShown || laid.states.some((st) => st.candidates.some((c) => c.yours)) || undefined };
  // A vow kept all the way down pays out as you step into the Abyss.
  if (SCENES[layer[index].sceneId].terminal && run.vow && !run.vow.broken && !run.vow.kept) {
    const reward = getVow(run.vow.id).reward;
    next = { ...next, vow: { ...run.vow, kept: true }, vitality: next.vitality + (reward.vitality ?? 0), clarity: clampClarity(next, next.clarity + (reward.clarity ?? 0)) };
  }
  return withRng(next, rng);
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
  // The seat answers in Clarity, if the rule is on: one taken when the card costs, one given when it serves.
  const tick = seatTick(run, slot.slot, slot.candidates[index]);
  run = tick ? { ...run, clarity: clampClarity(run, Math.max(0, run.clarity + tick)), ticks: (run.ticks ?? 0) + tick } : run;

  const nextIndex = run.activeSlot + 1;
  if (nextIndex < SLOT_IDS.length && run.laidBare && run.slots[nextIndex]) {
    // Laid bare: the next seat is already on the table. A held card joins it.
    const seat = run.slots[nextIndex];
    const joined = run.held ? { ...seat, candidates: [...seat.candidates, { ...run.held, hidden: false, held: true }] } : seat;
    const walked = slots.map((s, i) => (i === nextIndex ? joined : s));
    return withRng({ ...run, deck, slots: walked, activeSlot: nextIndex, pendingDeal: null, held: null }, rng);
  }
  if (nextIndex < SLOT_IDS.length) {
    const next = dealSeat(run, rng, deck, SLOT_IDS[nextIndex]);
    deck = next.deck;
    slots.push(next.state);
    return withRng({ ...run, deck, slots, activeSlot: nextIndex, pendingDeal: null, held: null, keepsakeShown: keepsakeShown(run, next.state) }, rng);
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
  return withRng({ ...run, deck: next.deck, slots, clarity: run.clarity - cost, freeRedrawUsed: run.freeRedrawUsed || cost === 0, redraws: run.redraws + 1, sceneSpent: { ...run.sceneSpent, redraws: run.sceneSpent.redraws + 1 }, keepsakeShown: keepsakeShown(run, next.state) }, rng);
}

/** A turn is allowed once per scene, on an unmarked, face-up candidate, with clarity to spend. */
export function canTurn(run: RunState, index: number): boolean {
  if (run.phase.kind !== 'reading') return false;
  if ((run.sceneSpent.turns ?? 0) >= 1 || run.clarity < TURN_COST) return false;
  const slot = run.slots[run.activeSlot];
  const c = slot?.candidates[index];
  if (!slot || slot.chosen !== null || !c || c.hidden) return false;
  return !run.marks[c.cardId];
}

/** Spend Clarity to turn a candidate over: upright becomes reversed, reversed becomes upright. Once per scene. */
export function turnCandidate(run: RunState, index: number): RunState {
  if (!canTurn(run, index)) return run;
  const slots = run.slots.map((s, i) =>
    i === run.activeSlot ? { ...s, candidates: s.candidates.map((c, j) => (j === index ? { ...c, reversed: !c.reversed } : c)) } : s,
  );
  return { ...run, slots, clarity: run.clarity - TURN_COST, sceneSpent: { ...run.sceneSpent, turns: (run.sceneSpent.turns ?? 0) + 1 } };
}

/** What a placed card does to Clarity at once under the seat-tick rule: +1 if it served the seat, −1 if it cost, 0 otherwise or when the rule is off. */
export function seatTick(run: RunState, slot: SlotId, drawn: DrawnCard): number {
  if (!run.mods.seatTick) return 0;
  const score = scoreSlot(currentScene(run), slot, drawn, run.marks, hasRelic(run, 'ring') ? 2 : undefined).score;
  return score >= 1 ? 1 : score <= -1 ? -1 : 0;
}

/** A hold keeps a face-up candidate back for the next seat: allowed once at a time, never at the Wake, and never the last card of a deal. */
export function canHold(run: RunState, index: number): boolean {
  if (run.phase.kind !== 'reading' || run.held || run.clarity < HOLD_COST) return false;
  if (run.activeSlot >= SLOT_IDS.length - 1) return false;
  const slot = run.slots[run.activeSlot];
  const c = slot?.candidates[index];
  if (!slot || slot.chosen !== null || !c || c.hidden || slot.candidates.length < 2) return false;
  return true;
}

/** Spend Clarity to hold a candidate back: it leaves this seat and joins the next seat's deal. */
export function holdCandidate(run: RunState, index: number): RunState {
  if (!canHold(run, index)) return run;
  const slot = run.slots[run.activeSlot];
  const held = slot.candidates[index];
  const candidates = slot.candidates.filter((_, j) => j !== index);
  const whispered = slot.whispered.filter((w) => w !== index).map((w) => (w > index ? w - 1 : w));
  const slots = run.slots.map((s, i) => (i === run.activeSlot ? { ...s, candidates, whispered } : s));
  return { ...run, slots, held: { ...held, yours: undefined, echo: undefined }, clarity: run.clarity - HOLD_COST, holds: (run.holds ?? 0) + 1 };
}

/** Spend Clarity to hear one keyword of a candidate. The UI shows it; the Codex remembers it. */
/** The Lamp: once per seat, for Clarity, see what each card in the hand would do in this seat. */
export function lampCost(run: RunState): number {
  return hasRelic(run, 'oil') ? 1 : LAMP_COST;
}

export function canLamp(run: RunState): boolean {
  if (run.phase.kind !== 'reading' || run.clarity < lampCost(run)) return false;
  if (currentScene(run).rite === 'dark') return false;
  const slot = run.slots[run.activeSlot];
  return !!slot && slot.chosen === null && !slot.lit && slot.candidates.some((c) => !c.hidden);
}

export function lightLamp(run: RunState): RunState {
  if (!canLamp(run)) return run;
  const slots = run.slots.map((s, i) => (i === run.activeSlot ? { ...s, lit: true } : s));
  return { ...run, slots, clarity: run.clarity - lampCost(run), lamps: (run.lamps ?? 0) + 1 };
}

export type LampVerdict = 'helped' | 'hurt' | 'neither';

/** What the lamp shows for each card in the active hand: consequence, never meaning. Hidden cards stay dark. */
export function lampVerdicts(run: RunState): (LampVerdict | null)[] {
  const slot = run.slots[run.activeSlot];
  if (!slot || !slot.lit || run.phase.kind !== 'reading') return [];
  const scene = currentScene(run);
  const bonus = hasRelic(run, 'ring') ? 2 : undefined;
  const soot = hasRelic(run, 'soot');
  return slot.candidates.map((c) => {
    if (c.hidden || (soot && c.reversed)) return null;
    const score = scoreSlot(scene, slot.slot, c, run.marks, bonus).score;
    return score >= 1 ? 'helped' : score <= -1 ? 'hurt' : 'neither';
  });
}

/** The Hush forbids whispers in its scene. */
export function canWhisperHere(run: RunState): boolean {
  return run.phase.kind === 'reading' && currentScene(run).rite !== 'hush';
}

export function whisper(run: RunState, index: number): RunState {
  if (run.phase.kind !== 'reading' || !canWhisperHere(run)) return run;
  const cost = whisperCost(run);
  if (run.clarity < cost) return run;
  const slot = run.slots[run.activeSlot];
  if (!slot || slot.chosen !== null) return run;
  if (index < 0 || index >= slot.candidates.length || slot.whispered.includes(index)) return run;
  if (slot.candidates[index].hidden) return run;
  const slots = run.slots.map((s, i) => (i === run.activeSlot ? { ...s, whispered: [...s.whispered, index] } : s));
  return { ...run, slots, clarity: run.clarity - cost, whispers: run.whispers + 1, sceneSpent: { ...run.sceneSpent, whispers: run.sceneSpent.whispers + 1 } };
}

export function readingOf(run: RunState): Reading | null {
  if (run.slots.length !== SLOT_IDS.length || run.slots.some((s) => s.chosen === null)) return null;
  const out = {} as Reading;
  for (const s of run.slots) out[s.slot] = s.candidates[s.chosen!];
  return out;
}

function resolve(run: RunState): RunState {
  const dealt = readingOf(run);
  if (!dealt) return run;
  const baseScene = currentScene(run);
  // The Mirror: every card reads the other way up. What is recorded is what was read.
  const reading = baseScene.rite === 'mirror' ? (Object.fromEntries(SLOT_IDS.map((s) => [s, { ...dealt[s], reversed: !dealt[s].reversed }])) as Reading) : dealt;
  const baseStakes = baseScene.terminal && run.mods.abyssStakes ? run.mods.abyssStakes : baseScene.stakes;
  const scene = { ...baseScene, stakes: baseStakes + (run.well ?? 0) };
  const read = resolveReading(scene, reading, run.marks, {
    chargedBonus: hasRelic(run, 'ring') ? 2 : undefined,
    extraNeutralCost: (hasRelic(run, 'weight') ? 1 : 0) + run.mods.extraNeutralCost || undefined,
    mendBonus: (hasRelic(run, 'bread') ? 2 : 0) - (hasRelic(run, 'ash') ? 1 : 0) || undefined,
    namedBonus: hasRelic(run, 'wax') ? 0.5 : undefined,
    kin: run.kin,
    kinBonus: run.mods.kinBonus,
  });
  // The Well's toll: every reading below the first Abyss costs one vitality per Abyss passed, however it went.
  const toll = run.well ?? 0;
  const resolution = toll ? { ...read, deltas: { ...read.deltas, vitality: read.deltas.vitality - toll } } : read;
  const vitality = run.vitality + resolution.deltas.vitality;
  const clarity = clampClarity(run, run.clarity + resolution.deltas.clarity);
  // Reveal anything chosen blind.
  const revealed = {} as Reading;
  for (const s of SLOT_IDS) revealed[s] = { ...reading[s], hidden: false };
  const played = SLOT_IDS.map((s) => revealed[s]);
  const deck = discard(run.deck, played);
  const passed = {} as Partial<Record<SlotId, DrawnCard[]>>;
  for (const s of run.slots) {
    passed[s.slot] = s.candidates
      .filter((_, j) => j !== s.chosen)
      .map((c) => ({ ...c, hidden: false, reversed: baseScene.rite === 'mirror' ? !c.reversed : c.reversed }));
  }
  const lit = run.slots.filter((s) => s.lit).map((s) => s.slot);
  const entry: HistoryEntry = { sceneId: scene.id, reading: revealed, resolution, spent: { ...run.sceneSpent }, passed, lit: lit.length ? lit : undefined };
  const history = [...run.history, entry];
  const vow = run.vow && !run.vow.broken && !getVow(run.vow.id).keeps(entry, baseScene) ? { ...run.vow, broken: true } : run.vow;

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
  let gained: RunState = run;
  if (resolution.tier === 'boon' && scene.relic && !relics.includes(scene.relic)) {
    found = scene.relic;
    relics = [...relics, found];
    gained = onGain(run, found);
  }
  if (resolution.tier === 'calamity' && !scene.terminal) {
    const pool = CURSE_IDS.filter((id) => !relics.includes(id));
    if (pool.length) {
      cursed = rng.pick(pool);
      relics = [...relics, cursed];
    }
  }

  const echo: DrawnCard | null = run.mods.noEcho || hasRelic(run, 'stillwater') ? null : { cardId: revealed.wake.cardId, reversed: revealed.wake.reversed };
  // At a rest that went well enough, someone is already sitting by the fire.
  let trade: Trade | undefined;
  if (scene.kind === 'rest' && !run.strangerMet && resolution.tier !== 'calamity' && resolution.tier !== 'harm') {
    const options: Trade[] = [];
    if (clarity >= 4) options.push({ id: 'clarity-for-vitality', give: 4, get: 2 });
    const boons = relics.filter((id) => BOON_IDS.includes(id));
    const unheld = BOON_IDS.filter((id) => !relics.includes(id));
    if (boons.length && unheld.length) options.push({ id: 'swap-boon', give: rng.pick(boons), get: rng.pick(unheld) });
    const curses = relics.filter((id) => CURSE_IDS.includes(id));
    if (curses.length && vitality > 4) options.push({ id: 'lift-curse', give: 3, curse: curses[0] });
    if (clarity >= 2 && marks[revealed.hand.cardId] !== 'charged') options.push({ id: 'bless-hand', give: 2, cardId: revealed.hand.cardId });
    if (options.length) trade = rng.pick(options);
  }
  // At the market, once, a peddler sets out a cloth. Their prices are stranger.
  let peddler = false;
  if (scene.id === 'market' && !run.peddlerMet && resolution.tier !== 'calamity' && resolution.tier !== 'harm') {
    const options: Trade[] = [];
    if (vitality > 3) options.push({ id: 'vitality-for-clarity', give: 2, get: 3 });
    const unheld = BOON_IDS.filter((id) => !relics.includes(id));
    if (unheld.length && marks[revealed.wake.cardId] !== 'scarred') options.push({ id: 'scar-for-boon', cardId: revealed.wake.cardId, get: rng.pick(unheld) });
    if (options.length) {
      trade = rng.pick(options);
      peddler = true;
    }
  }
  const base = withRng({ ...gained, deck, history, vitality, clarity, marks, relics, echo, vow, strangerMet: run.strangerMet || (!!trade && !peddler), peddlerMet: run.peddlerMet || peddler }, rng);
  if (vitality <= 0) return { ...base, vitality: 0, phase: { kind: 'dead', resolution } };
  if (scene.terminal && run.well !== undefined) {
    // The Well: no surface. A deeper map opens under the Abyss, and a breath comes with it.
    const offset = run.map.length;
    const deeper = buildMap(rng, run.actLayers).map((layer) => layer.map((n) => ({ ...n, id: `${n.layer + offset}-${n.id.split('-')[1]}`, layer: n.layer + offset })));
    return withRng({ ...base, map: [...run.map, ...deeper], well: run.well + 1, vitality: vitality + 2, phase: { kind: 'resolved', resolution } }, rng);
  }
  if (scene.terminal) return { ...base, phase: { kind: 'ascended', resolution } };
  return { ...base, phase: { kind: 'resolved', resolution, offer, cursed, found, trade } };
}

/** Take the Stranger's trade. Once; the offer is gone after. */
export function acceptTrade(run: RunState): RunState {
  if (run.phase.kind !== 'resolved' || !run.phase.trade) return run;
  const t = run.phase.trade;
  const phase = { ...run.phase, trade: undefined, traded: true };
  switch (t.id) {
    case 'clarity-for-vitality':
      if (run.clarity < t.give) return run;
      return { ...run, clarity: run.clarity - t.give, vitality: run.vitality + t.get, phase, traded: true, tradeTaken: t.id };
    case 'swap-boon':
      if (!run.relics.includes(t.give)) return run;
      return { ...onGain(run, t.get), relics: run.relics.map((id) => (id === t.give ? t.get : id)), phase, traded: true, tradeTaken: t.id };
    case 'lift-curse':
      if (run.vitality <= t.give) return run;
      return { ...run, vitality: run.vitality - t.give, relics: run.relics.filter((id) => id !== t.curse), phase, traded: true, tradeTaken: t.id };
    case 'bless-hand':
      if (run.clarity < t.give) return run;
      return { ...run, clarity: run.clarity - t.give, marks: { ...run.marks, [t.cardId]: 'charged' }, phase, traded: true, tradeTaken: t.id };
    case 'vitality-for-clarity':
      if (run.vitality <= t.give) return run;
      return { ...run, vitality: run.vitality - t.give, clarity: clampClarity(run, run.clarity + t.get), phase, traded: true, tradeTaken: t.id };
    case 'scar-for-boon':
      if (run.relics.includes(t.get)) return run;
      return { ...onGain(run, t.get), relics: [...run.relics, t.get], marks: { ...run.marks, [t.cardId]: 'scarred' }, phase, traded: true, tradeTaken: t.id };
  }
}

/** After reading the resolution, take the offered relic (if any) or walk on to the map. */
export function advance(run: RunState): RunState {
  if (run.phase.kind !== 'resolved') return run;
  const clarity = clampClarity(run, Math.max(0, run.clarity + (hasRelic(run, 'candle') ? 1 : 0) - (hasRelic(run, 'tallow') ? 1 : 0)));
  if (run.phase.offer && run.phase.offer.length) return { ...run, clarity, phase: { kind: 'relic', offer: run.phase.offer } };
  return { ...run, clarity, layer: run.layer + 1, node: null, slots: [], activeSlot: 0, phase: { kind: 'map' } };
}

/** Take one of the offered boons, then walk on. */
export function chooseRelic(run: RunState, index: number): RunState {
  if (run.phase.kind !== 'relic') return run;
  const id = run.phase.offer[index];
  if (!id) return run;
  return { ...onGain(run, id), relics: [...run.relics, id], layer: run.layer + 1, node: null, slots: [], activeSlot: 0, phase: { kind: 'map' } };
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
