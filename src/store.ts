import { create } from 'zustand';
import {
  advance as advanceRun,
  chooseCandidate,
  chooseNode as chooseNodeRun,
  finalSpread,
  getCard,
  loadKnowledge,
  noteAscension,
  noteDeath,
  noteResolved,
  noteRunStarted,
  noteWhisper,
  randomSeed,
  redrawActive,
  saveKnowledge,
  startRun,
  whisper as whisperRun,
  type Knowledge,
  type RunState,
} from './engine';

export type Screen = 'title' | 'run' | 'codex';

interface GameStore {
  screen: Screen;
  run: RunState | null;
  knowledge: Knowledge;
  /** UI-only: index of the candidate currently "lifted" before confirming. */
  lifted: number | null;

  goto: (screen: Screen) => void;
  newRun: (seed?: number) => void;
  chooseNode: (index: number) => void;
  lift: (index: number | null) => void;
  confirm: () => void;
  redraw: () => void;
  whisperLifted: () => void;
  advance: () => void;
  endRun: () => void;
}

function buzz(ms: number | number[]) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* unsupported */
  }
}

function learn(k: Knowledge, run: RunState): Knowledge {
  const last = run.history[run.history.length - 1];
  if (!last) return k;
  let next = k;
  for (const s of run.slots) {
    if (s.chosen !== null) next = noteResolved(next, s.candidates[s.chosen].cardId, s.slot);
  }
  if (run.phase.kind === 'dead') next = noteDeath(next, finalSpread(run));
  if (run.phase.kind === 'ascended') next = noteAscension(next, finalSpread(run));
  return next;
}

export const useGame = create<GameStore>((set, get) => ({
  screen: 'title',
  run: null,
  knowledge: loadKnowledge(),
  lifted: null,

  goto: (screen) => set({ screen }),

  newRun: (seed = randomSeed()) => {
    const knowledge = noteRunStarted(get().knowledge);
    saveKnowledge(knowledge);
    set({ run: startRun(seed), knowledge, screen: 'run', lifted: null });
  },

  chooseNode: (index) => {
    const { run } = get();
    if (!run) return;
    buzz(6);
    set({ run: chooseNodeRun(run, index), lifted: null });
  },

  lift: (index) => {
    if (index !== null) buzz(4);
    set({ lifted: index });
  },

  confirm: () => {
    const { run, lifted, knowledge } = get();
    if (!run || lifted === null) return;
    const next = chooseCandidate(run, lifted);
    if (next.phase.kind === 'reading') {
      buzz(10);
      set({ run: next, lifted: null });
      return;
    }
    const tier = next.phase.kind === 'map' ? null : next.phase.resolution.tier;
    buzz(tier === 'calamity' ? [40, 30, 80] : tier === 'triumph' ? [15, 20, 15, 20, 30] : 20);
    const learned = learn(knowledge, next);
    saveKnowledge(learned);
    set({ run: next, knowledge: learned, lifted: null });
  },

  redraw: () => {
    const { run } = get();
    if (!run) return;
    set({ run: redrawActive(run), lifted: null });
  },

  whisperLifted: () => {
    const { run, lifted, knowledge } = get();
    if (!run || lifted === null) return;
    const next = whisperRun(run, lifted);
    if (next === run) return;
    const slot = next.slots[next.activeSlot];
    const cardId = slot.candidates[lifted].cardId;
    getCard(cardId); // assert
    const learned = noteWhisper(knowledge, cardId);
    saveKnowledge(learned);
    buzz([5, 40, 5]);
    set({ run: next, knowledge: learned });
  },

  advance: () => {
    const { run } = get();
    if (!run) return;
    set({ run: advanceRun(run), lifted: null });
  },

  endRun: () => set({ run: null, screen: 'title', lifted: null }),
}));
