import { create } from 'zustand';
import { sfx, startDrone, stopDrone } from './audio';
import { hapticsEnabled } from './settings';
import {
  advance as advanceRun,
  chooseCandidate,
  chooseNode as chooseNodeRun,
  chooseRelic as chooseRelicRun,
  cutDeck as cutDeckRun,
  dailySeed,
  WEEKLY_CONFIG,
  weeklySeed,
  depthConfig,
  getDescent,
  finalSpread,
  getCard,
  loadKnowledge,
  noteAscension,
  noteCombos,
  noteDeath,
  noteLinks,
  noteLast,
  newSigils,
  noteRecord,
  noteSigils,
  noteResolved,
  noteRunStarted,
  noteWhisper,
  randomSeed,
  redrawActive,
  resetKnowledge,
  saveKnowledge,
  SLOT_IDS,
  startRun,
  whisper as whisperRun,
  type Knowledge,
  type RunState,
} from './engine';

export type Screen = 'title' | 'run' | 'codex' | 'settings';
export type RunMode = { kind: 'free'; descent: string; depth?: number } | { kind: 'daily'; label: string } | { kind: 'weekly'; label: string };

interface GameStore {
  screen: Screen;
  run: RunState | null;
  mode: RunMode;
  knowledge: Knowledge;
  /** UI-only: index of the candidate currently "lifted" before confirming. */
  lifted: number | null;
  /** Card opened in the Codex detail view. */
  codexOpen: string | null;
  /** Chosen descent variant for free runs. */
  descent: string;
  /** Depth (difficulty tier) for the standard descent. */
  depth: number;
  setDepth: (n: number) => void;
  /** Sigils earned by the run that just ended. */
  earned: string[];
  /** The player's very first run: show the three wordless nudges. */
  firstDescent: boolean;
  /** Discard viewer open. */
  deckOpen: boolean;
  openDeck: (open: boolean) => void;

  goto: (screen: Screen) => void;
  setDescent: (id: string) => void;
  newRun: (seed?: number) => void;
  newDaily: () => void;
  newWeekly: () => void;
  chooseNode: (index: number) => void;
  chooseRelic: (index: number) => void;
  cutDeck: (at: number) => void;
  lift: (index: number | null) => void;
  confirm: () => void;
  redraw: () => void;
  whisperLifted: () => void;
  advance: () => void;
  endRun: () => void;
  openCodex: (cardId: string | null) => void;
  resetCodex: () => void;
}

function buzz(ms: number | number[]) {
  if (!hapticsEnabled()) return;
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* unsupported */
  }
}

function learn(k: Knowledge, run: RunState, mode: RunMode): { knowledge: Knowledge; earned: string[] } {
  const last = run.history[run.history.length - 1];
  if (!last) return { knowledge: k, earned: [] };
  let next = k;
  const tier = last.resolution.tier;
  const outcome = tier === 'boon' || tier === 'triumph' ? 'good' : tier === 'harm' || tier === 'calamity' ? 'bad' : 'even';
  for (const s of run.slots) {
    if (s.chosen !== null) {
      const c = s.candidates[s.chosen];
      next = noteResolved(next, c.cardId, s.slot, c.reversed, outcome);
    }
  }
  next = noteCombos(next, last.resolution.comboIds);
  next = noteLinks(next, SLOT_IDS.map((s) => last.reading[s].cardId));
  let earned: string[] = [];
  if (run.phase.kind === 'dead' || run.phase.kind === 'ascended') {
    const returned = run.phase.kind === 'ascended';
    if (returned) next = noteAscension(next, finalSpread(run));
    else next = noteDeath(next, finalSpread(run));
    next = noteRecord(next, mode.kind === 'free' ? mode.descent : mode.kind, run.history.length, returned, mode.kind === 'free' ? (mode.depth ?? 0) : 0);
    next = noteLast(next, finalSpread(run), last.resolution.narration.at(-1) ?? '', returned);
    earned = newSigils(run, next);
    next = noteSigils(next, earned);
  }
  return { knowledge: next, earned };
}

export const useGame = create<GameStore>((set, get) => ({
  screen: 'title',
  run: null,
  mode: { kind: 'free', descent: 'standard' },
  knowledge: loadKnowledge(),
  lifted: null,
  codexOpen: null,
  descent: 'standard',
  depth: 0,
  setDepth: (n) => set({ depth: n }),
  earned: [],
  firstDescent: false,
  deckOpen: false,
  openDeck: (open) => set({ deckOpen: open }),

  goto: (screen) => set({ screen, codexOpen: null }),
  setDescent: (id) => set({ descent: id }),

  newRun: (seed = randomSeed()) => {
    const { descent } = get();
    const d = getDescent(descent);
    const first = get().knowledge.runs === 0;
    const knowledge = noteRunStarted(get().knowledge);
    saveKnowledge(knowledge);
    startDrone();
    const depth = d.id === 'standard' ? get().depth : 0;
    const config = { ...d.config, ...(depth ? depthConfig(depth) : {}), ...(first ? { majorsFirst: true } : {}) };
    set({ run: startRun(seed, config), mode: { kind: 'free', descent: d.id, depth }, knowledge, screen: 'run', lifted: null, earned: [], firstDescent: first });
  },

  newDaily: () => {
    const { seed, label } = dailySeed();
    const knowledge = noteRunStarted(get().knowledge);
    saveKnowledge(knowledge);
    startDrone();
    set({ run: startRun(seed), mode: { kind: 'daily', label }, knowledge, screen: 'run', lifted: null, earned: [], firstDescent: false });
  },

  newWeekly: () => {
    const { seed, label } = weeklySeed();
    const knowledge = noteRunStarted(get().knowledge);
    saveKnowledge(knowledge);
    startDrone();
    set({ run: startRun(seed, WEEKLY_CONFIG), mode: { kind: 'weekly', label }, knowledge, screen: 'run', lifted: null, earned: [], firstDescent: false });
  },

  chooseNode: (index) => {
    const { run } = get();
    if (!run) return;
    const next = chooseNodeRun(run, index);
    const abyss = next.map[next.layer]?.[index]?.kind === 'abyss';
    buzz(abyss ? [20, 60, 40] : 6);
    if (abyss) sfx.abyss();
    else sfx.node();
    set({ run: next, lifted: null });
  },

  lift: (index) => {
    if (index !== null) {
      buzz(4);
      sfx.lift();
    }
    set({ lifted: index });
  },

  confirm: () => {
    const { run, lifted, knowledge } = get();
    if (!run || lifted === null) return;
    const placed = run.slots[run.activeSlot]?.candidates[lifted];
    const placedCard = placed ? getCard(placed.cardId) : null;
    const suit = placedCard ? (placedCard.arcana === 'major' ? 'major' : placedCard.suit) : undefined;
    const next = chooseCandidate(run, lifted);
    if (next.phase.kind === 'reading') {
      buzz(10);
      sfx.place(suit);
      set({ run: next, lifted: null });
      return;
    }
    const tier = 'resolution' in next.phase ? next.phase.resolution.tier : null;
    buzz(tier === 'calamity' ? [40, 30, 80] : tier === 'triumph' ? [15, 20, 15, 20, 30] : 20);
    sfx.place(suit);
    if (tier) sfx.resolve(tier);
    if (next.phase.kind === 'dead') {
      stopDrone();
      sfx.death();
    }
    if (next.phase.kind === 'ascended') {
      stopDrone();
      sfx.ascend();
    }
    const { knowledge: learned, earned } = learn(knowledge, next, get().mode);
    saveKnowledge(learned);
    set({ run: next, knowledge: learned, lifted: null, earned });
  },

  redraw: () => {
    const { run } = get();
    if (!run) return;
    const next = redrawActive(run);
    if (next !== run) sfx.redraw();
    set({ run: next, lifted: null });
  },

  whisperLifted: () => {
    const { run, lifted, knowledge } = get();
    if (!run || lifted === null) return;
    const next = whisperRun(run, lifted);
    if (next === run) return;
    const slot = next.slots[next.activeSlot];
    const cardId = slot.candidates[lifted].cardId;
    getCard(cardId);
    const learned = noteWhisper(knowledge, cardId);
    saveKnowledge(learned);
    buzz([5, 40, 5]);
    sfx.whisper();
    set({ run: next, knowledge: learned });
  },

  advance: () => {
    const { run } = get();
    if (!run) return;
    sfx.flip();
    set({ run: advanceRun(run), lifted: null });
  },

  cutDeck: (at) => {
    const { run } = get();
    if (!run) return;
    const next = cutDeckRun(run, at);
    if (next === run) return;
    buzz([6, 30, 10]);
    sfx.redraw();
    set({ run: next });
  },

  chooseRelic: (index) => {
    const { run } = get();
    if (!run) return;
    buzz([8, 30, 8]);
    sfx.whisper();
    set({ run: chooseRelicRun(run, index), lifted: null });
  },

  endRun: () => {
    stopDrone();
    set({ run: null, screen: 'title', lifted: null, codexOpen: null });
  },

  openCodex: (cardId) => set({ codexOpen: cardId }),

  resetCodex: () => set({ knowledge: resetKnowledge() }),
}));

/** A shareable line for a finished run. Names the final spread; never the meanings. */
export function shareText(run: RunState, mode: RunMode): string {
  const end = run.phase.kind === 'ascended' ? 'Returned from the Abyss' : run.phase.kind === 'dead' ? `Died at scene ${run.layer + 1}` : 'Still descending';
  const spread = finalSpread(run)
    .map((c) => `${getCard(c.cardId).name}${c.reversed ? ' (rev)' : ''}`)
    .join(' · ');
  const tiers = run.history.map((h) => ({ calamity: '✖', harm: '▽', neutral: '◇', boon: '△', triumph: '★' })[h.resolution.tier]).join('');
  const head =
    mode.kind === 'daily'
      ? `Arcana Descent · Daily ${mode.label}`
      : mode.kind === 'weekly'
        ? `Arcana Descent · Weekly ${mode.label}`
        : `Arcana Descent · ${getDescent(mode.descent).name}${mode.depth ? ` · Depth ${mode.depth}` : ''} · seed ${run.seed.toString(36)}`;
  return `${head}\n${end}\n${tiers}\n${spread}`;
}
