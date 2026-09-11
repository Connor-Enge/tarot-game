import { create } from 'zustand';
import { sfx, startDrone, stopDrone } from './audio';
import { clearRun, loadRun, saveRun } from './persist';
import { hapticsEnabled } from './settings';
import {
  advance as advanceRun,
  chooseCandidate,
  chooseNode as chooseNodeRun,
  chooseRelic as chooseRelicRun,
  cutDeck as cutDeckRun,
  foretell as foretellRun,
  takeBack as takeBackRun,
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
  noteDealt,
  noteLinks,
  noteLast,
  noteOmens,
  noteStudy,
  noteStudyResult,
  readerTitle,
  resetRecords,
  SIGILS,
  studyQuestion,
  createRng,
  newSigils,
  newKnowledgeSigils,
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
  /** Study mode. */
  study: { q: ReturnType<typeof studyQuestion>; streak: number; picked: string | null } | null;
  askStudy: () => void;
  answerStudy: (cardId: string) => void;
  /** A return this session: the title and map glow warm until the next run ends. */
  afterglow: boolean;
  /** A brief banner. */
  toast: { glyph: string; text: string; id: number } | null;
  showToast: (glyph: string, text: string) => void;
  resetRecordsOnly: () => void;
  /** Discard viewer open. */
  deckOpen: boolean;
  openDeck: (open: boolean) => void;

  goto: (screen: Screen) => void;
  setDescent: (id: string) => void;
  /** A run saved from a previous session, if any. */
  saved: ReturnType<typeof loadRun>;
  resume: () => void;
  abandon: () => void;
  newRun: (seed?: number, opts?: { descent?: string; depth?: number }) => void;
  newDaily: () => void;
  newWeekly: () => void;
  chooseNode: (index: number) => void;
  chooseRelic: (index: number) => void;
  cutDeck: (at: number) => void;
  foretell: (index: number) => void;
  takeBack: () => void;
  lift: (index: number | null) => void;
  confirm: () => void;
  redraw: () => void;
  whisperLifted: () => void;
  advance: () => void;
  endRun: () => void;
  openCodex: (cardId: string | null) => void;
  resetCodex: () => void;
  importCodex: (k: Knowledge) => void;
}

function dealtIn(run: RunState): string[] {
  const slot = run.slots[run.activeSlot];
  return slot ? slot.candidates.filter((c) => !c.hidden).map((c) => c.cardId) : [];
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
  next = noteOmens(
    next,
    SLOT_IDS.map((s) => ({ scene: last.sceneId, seat: s, cardId: last.reading[s].cardId, reversed: last.reading[s].reversed, tier })),
  );
  let earned: string[] = [];
  if (run.phase.kind === 'dead' || run.phase.kind === 'ascended') {
    const returned = run.phase.kind === 'ascended';
    if (returned) next = noteAscension(next, finalSpread(run));
    else next = noteDeath(next, finalSpread(run));
    const good = run.history.filter((h) => h.resolution.tier === 'boon' || h.resolution.tier === 'triumph').length;
    next = noteRecord(next, mode.kind === 'free' ? mode.descent : mode.kind, run.history.length, returned, mode.kind === 'free' ? (mode.depth ?? 0) : 0, { cards: finalSpread(run), good });
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
  afterglow: false,
  toast: null,
  showToast: (glyph, text) => {
    const id = Date.now();
    set({ toast: { glyph, text, id } });
    setTimeout(() => {
      if (get().toast?.id === id) set({ toast: null });
    }, 3200);
  },
  resetRecordsOnly: () => {
    const k = resetRecords(get().knowledge);
    saveKnowledge(k);
    set({ knowledge: k });
  },
  study: null,
  askStudy: () => {
    const { knowledge, study } = get();
    const q = studyQuestion(knowledge, createRng(randomSeed()), (id, r) => (r ? getCard(id).omen.reversed : getCard(id).omen.upright));
    set({ study: { q, streak: study?.streak ?? 0, picked: null } });
  },
  answerStudy: (cardId) => {
    const { knowledge, study } = get();
    if (!study?.q || study.picked) return;
    const correct = cardId === study.q.answer;
    const streak = correct ? study.streak + 1 : 0;
    let next = noteStudyResult(knowledge, correct, streak);
    if (correct) {
      next = noteStudy(next, cardId);
      const fresh = newKnowledgeSigils(next);
      next = noteSigils(next, fresh);
      if (fresh.length) {
        const sg = SIGILS.find((x) => x.id === fresh[0]);
        if (sg) get().showToast(sg.glyph, `${sg.name} · ${sg.text}`);
      }
      sfx.whisper();
      buzz([5, 30, 5]);
    } else {
      sfx.resolve('harm');
      buzz(30);
    }
    saveKnowledge(next);
    set({ knowledge: next, study: { ...study, streak, picked: cardId } });
  },
  deckOpen: false,
  openDeck: (open) => {
    if (open) sfx.page();
    set({ deckOpen: open });
  },

  goto: (screen) => set({ screen, codexOpen: null }),
  setDescent: (id) => set({ descent: id }),
  saved: loadRun(),
  resume: () => {
    const { saved } = get();
    if (!saved) return;
    startDrone();
    set({ run: saved.run, mode: saved.mode, firstDescent: saved.firstDescent, screen: 'run', lifted: null, earned: [], saved: null });
  },
  abandon: () => {
    clearRun();
    set({ saved: null });
  },

  newRun: (seed = randomSeed(), opts) => {
    const descent = opts?.descent ?? get().descent;
    const d = getDescent(descent);
    const first = get().knowledge.runs === 0;
    const knowledge = noteRunStarted(get().knowledge);
    saveKnowledge(knowledge);
    startDrone();
    const depth = d.id === 'standard' ? (opts?.depth ?? get().depth) : 0;
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
    const knowledge = noteDealt(get().knowledge, dealtIn(next));
    if (knowledge !== get().knowledge) saveKnowledge(knowledge);
    set({ run: next, lifted: null, knowledge });
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
      const k2 = noteDealt(knowledge, dealtIn(next));
      if (k2 !== knowledge) saveKnowledge(k2);
      set({ run: next, lifted: null, knowledge: k2 });
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
    const afterglow = next.phase.kind === 'ascended' ? true : next.phase.kind === 'dead' ? false : get().afterglow;
    set({ run: next, knowledge: learned, lifted: null, earned, afterglow });
  },

  redraw: () => {
    const { run } = get();
    if (!run) return;
    const next = redrawActive(run);
    if (next !== run) sfx.redraw();
    const knowledge = noteDealt(get().knowledge, dealtIn(next));
    if (knowledge !== get().knowledge) saveKnowledge(knowledge);
    set({ run: next, lifted: null, knowledge });
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

  takeBack: () => {
    const { run } = get();
    if (!run) return;
    const next = takeBackRun(run);
    if (next === run) return;
    buzz(12);
    sfx.flip();
    set({ run: next, lifted: null });
  },

  foretell: (index) => {
    const { run } = get();
    if (!run) return;
    const next = foretellRun(run, index);
    if (next === run) return;
    buzz([5, 40, 5]);
    sfx.whisper();
    set({ run: next });
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

  openCodex: (cardId) => {
    if (cardId) sfx.page();
    set({ codexOpen: cardId });
  },

  resetCodex: () => set({ knowledge: resetKnowledge() }),
  importCodex: (k) => {
    saveKnowledge(k);
    set({ knowledge: k });
  },
}));

/** A shareable line for a finished run. Names the final spread; never the meanings. */
export function shareText(run: RunState, mode: RunMode, knowledge?: Knowledge): string {
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
  const who = knowledge ? `\n— ${readerTitle(knowledge)}, ${Object.values(knowledge.cards).filter((c) => c.tier > 0).length} of 78 known` : '';
  const weekly = mode.kind === 'weekly' && knowledge?.records?.weekly ? `\nDeepest this week: ${Math.max(knowledge.records.weekly.bestDepth, run.history.length)} of ${run.map.length}` : '';
  return `${head}\n${end}\n${tiers}\n${spread}${weekly}${who}`;
}

// Persist the run after every change so a closed tab can resume.
useGame.subscribe((state, prev) => {
  if (state.run !== prev.run || state.mode !== prev.mode) saveRun(state.run, state.mode, state.firstDescent);
});
