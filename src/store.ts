import { create } from 'zustand';
import { sfx, startDrone, stopDrone } from './audio';
import {
  advance as advanceRun,
  chooseCandidate,
  chooseNode as chooseNodeRun,
  chooseRelic as chooseRelicRun,
  dailySeed,
  finalSpread,
  getCard,
  loadKnowledge,
  noteAscension,
  noteCombos,
  noteDeath,
  noteResolved,
  noteRunStarted,
  noteWhisper,
  randomSeed,
  redrawActive,
  resetKnowledge,
  saveKnowledge,
  startRun,
  whisper as whisperRun,
  type Knowledge,
  type RunState,
} from './engine';

export type Screen = 'title' | 'run' | 'codex' | 'settings';
export type RunMode = { kind: 'free' } | { kind: 'daily'; label: string };

interface GameStore {
  screen: Screen;
  run: RunState | null;
  mode: RunMode;
  knowledge: Knowledge;
  /** UI-only: index of the candidate currently "lifted" before confirming. */
  lifted: number | null;
  /** Card opened in the Codex detail view. */
  codexOpen: string | null;

  goto: (screen: Screen) => void;
  newRun: (seed?: number) => void;
  newDaily: () => void;
  chooseNode: (index: number) => void;
  chooseRelic: (index: number) => void;
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
    if (s.chosen !== null) {
      const c = s.candidates[s.chosen];
      next = noteResolved(next, c.cardId, s.slot, c.reversed);
    }
  }
  next = noteCombos(next, last.resolution.comboIds);
  if (run.phase.kind === 'dead') next = noteDeath(next, finalSpread(run));
  if (run.phase.kind === 'ascended') next = noteAscension(next, finalSpread(run));
  return next;
}

export const useGame = create<GameStore>((set, get) => ({
  screen: 'title',
  run: null,
  mode: { kind: 'free' },
  knowledge: loadKnowledge(),
  lifted: null,
  codexOpen: null,

  goto: (screen) => set({ screen, codexOpen: null }),

  newRun: (seed = randomSeed()) => {
    const knowledge = noteRunStarted(get().knowledge);
    saveKnowledge(knowledge);
    startDrone();
    set({ run: startRun(seed), mode: { kind: 'free' }, knowledge, screen: 'run', lifted: null });
  },

  newDaily: () => {
    const { seed, label } = dailySeed();
    const knowledge = noteRunStarted(get().knowledge);
    saveKnowledge(knowledge);
    startDrone();
    set({ run: startRun(seed), mode: { kind: 'daily', label }, knowledge, screen: 'run', lifted: null });
  },

  chooseNode: (index) => {
    const { run } = get();
    if (!run) return;
    buzz(6);
    sfx.node();
    set({ run: chooseNodeRun(run, index), lifted: null });
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
    const next = chooseCandidate(run, lifted);
    if (next.phase.kind === 'reading') {
      buzz(10);
      sfx.place();
      set({ run: next, lifted: null });
      return;
    }
    const tier = 'resolution' in next.phase ? next.phase.resolution.tier : null;
    buzz(tier === 'calamity' ? [40, 30, 80] : tier === 'triumph' ? [15, 20, 15, 20, 30] : 20);
    sfx.place();
    if (tier) sfx.resolve(tier);
    if (next.phase.kind === 'dead') {
      stopDrone();
      sfx.death();
    }
    if (next.phase.kind === 'ascended') {
      stopDrone();
      sfx.ascend();
    }
    const learned = learn(knowledge, next);
    saveKnowledge(learned);
    set({ run: next, knowledge: learned, lifted: null });
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

  chooseRelic: (index) => {
    const { run } = get();
    if (!run) return;
    buzz([8, 30, 8]);
    sfx.whisper();
    set({ run: chooseRelicRun(run, index), lifted: null });
  },

  endRun: () => {
    stopDrone();
    set({ run: null, screen: 'title', lifted: null });
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
  const head = mode.kind === 'daily' ? `Arcana Descent · Daily ${mode.label}` : `Arcana Descent · seed ${run.seed.toString(36)}`;
  return `${head}\n${end}\n${tiers}\n${spread}`;
}
