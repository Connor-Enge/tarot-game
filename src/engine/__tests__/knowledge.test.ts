import { describe, expect, it } from 'vitest';
import { RESOLVES_TO_GLIMPSE, emptyKnowledge, loadKnowledge, noteAscension, noteDeath, noteResolved, saveKnowledge, tierOf } from '../knowledge';

describe('knowledge', () => {
  it('glimpses a card after enough resolves', () => {
    let k = emptyKnowledge();
    for (let i = 0; i < RESOLVES_TO_GLIMPSE; i++) k = noteResolved(k, 'major-0', 'hand');
    expect(tierOf(k, 'major-0')).toBe(1);
    expect(k.cards['major-0'].seats.hand).toBe(RESOLVES_TO_GLIMPSE);
  });

  it('death reveals the final spread and names the seats', () => {
    let k = emptyKnowledge();
    k = noteDeath(k, [
      { cardId: 'major-16', reversed: false },
      { cardId: 'major-13', reversed: true },
    ]);
    expect(tierOf(k, 'major-16')).toBe(2);
    expect(tierOf(k, 'major-13')).toBe(3);
    expect(k.seatsNamed).toBe(true);
    expect(k.deaths).toBe(1);
  });

  it('never lowers a tier', () => {
    let k = emptyKnowledge();
    k = noteAscension(k, [{ cardId: 'cups-1' }]);
    k = noteDeath(k, [{ cardId: 'cups-1', reversed: false }]);
    expect(tierOf(k, 'cups-1')).toBe(3);
  });

  it('round-trips through storage', () => {
    const mem = new Map<string, string>();
    const storage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
    const k = noteDeath(emptyKnowledge(), [{ cardId: 'major-1', reversed: false }]);
    saveKnowledge(k, storage);
    expect(loadKnowledge(storage)).toEqual(k);
    expect(loadKnowledge({ getItem: () => 'garbage' })).toEqual(emptyKnowledge());
  });
});

describe('whisper', () => {
  it('counts toward glimpsing', async () => {
    const { noteWhisper } = await import('../knowledge');
    let k = emptyKnowledge();
    for (let i = 0; i < RESOLVES_TO_GLIMPSE; i++) k = noteWhisper(k, 'swords-3');
    expect(tierOf(k, 'swords-3')).toBe(1);
  });
});

describe('witness + combos + reset', () => {
  it('records witnessed orientations and discovered combos', async () => {
    const { noteCombos, witnessed, resetKnowledge } = await import('../knowledge');
    let k = emptyKnowledge();
    k = noteResolved(k, 'major-16', 'threshold', true);
    expect(witnessed(k, 'major-16', true)).toBe(true);
    expect(witnessed(k, 'major-16', false)).toBe(false);
    k = noteCombos(k, ['tower-then-star', 'tower-then-star']);
    expect(k.combos).toEqual(['tower-then-star']);
    const removed: string[] = [];
    expect(resetKnowledge({ removeItem: (key) => void removed.push(key) })).toEqual(emptyKnowledge());
    expect(removed.length).toBe(1);
  });
});

describe('seat outcomes', () => {
  it('tallies good and bad per seat', () => {
    let k = emptyKnowledge();
    k = noteResolved(k, 'cups-2', 'hand', false, 'good');
    k = noteResolved(k, 'cups-2', 'hand', false, 'bad');
    k = noteResolved(k, 'cups-2', 'wake', false, 'even');
    expect(k.cards['cups-2'].seatOutcomes?.hand).toEqual({ good: 1, bad: 1 });
    expect(k.cards['cups-2'].seatOutcomes?.wake).toEqual({ good: 0, bad: 0 });
  });
});

describe('whisperWords', () => {
  it('rotates by seat and respects count', async () => {
    const { whisperWords } = await import('../knowledge');
    const kw = ['a', 'b', 'c'];
    expect(whisperWords(kw, 'vessel')).toEqual(['a']);
    expect(whisperWords(kw, 'hand')).toEqual(['c']);
    expect(whisperWords(kw, 'wake', 2)).toEqual(['a', 'b']);
    expect(whisperWords(['x'], 'threshold', 2)).toEqual(['x']);
  });
});

describe('links', () => {
  it('counts sorted pairs from a reading', async () => {
    const { noteLinks } = await import('../knowledge');
    let k = noteLinks(emptyKnowledge(), ['b', 'a', 'c', 'a']);
    expect(Object.keys(k.links!).sort()).toEqual(['a|b', 'a|c', 'b|c']);
    k = noteLinks(k, ['a', 'b']);
    expect(k.links!['a|b']).toBe(2);
  });
});

describe('omen log', () => {
  it('appends in order with the run number and caps', async () => {
    const { noteOmens, OMEN_LOG_CAP } = await import('../knowledge');
    let k = { ...emptyKnowledge(), runs: 3 };
    k = noteOmens(k, [{ scene: 'crossing', seat: 'hand', cardId: 'major-0', reversed: false, tier: 'boon' }]);
    expect(k.omenLog?.[0]).toEqual({ run: 3, scene: 'crossing', seat: 'hand', cardId: 'major-0', reversed: false, tier: 'boon' });
    for (let i = 0; i < OMEN_LOG_CAP; i++) k = noteOmens(k, [{ scene: 'well', seat: 'wake', cardId: 'cups-1', reversed: true, tier: 'neutral' }]);
    expect(k.omenLog?.length).toBe(OMEN_LOG_CAP);
    expect(k.omenLog?.at(-1)?.cardId).toBe('cups-1');
  });
});

describe('study', () => {
  it('builds a question only from witnessed cards and counts results', async () => {
    const { studyQuestion, noteStudyResult } = await import('../knowledge');
    const { createRng } = await import('../rng');
    let k = emptyKnowledge();
    expect(studyQuestion(k, createRng(1), () => 'x')).toBeNull();
    k = noteResolved(k, 'major-0', 'hand', false);
    k = noteResolved(k, 'major-1', 'hand', true);
    k = noteResolved(k, 'major-2', 'wake', false);
    const q = studyQuestion(k, createRng(2), (id, r) => `${id}:${r}`)!;
    expect(q).not.toBeNull();
    expect(q.choices.length).toBe(3);
    expect(q.choices).toContain(q.answer);
    expect(q.omen).toBe(`${q.answer}:${q.reversed}`);
    k = noteStudyResult(k, true, 1);
    k = noteStudyResult(k, false, 0);
    expect(k.study).toEqual({ correct: 1, asked: 2, bestStreak: 1 });
  });
});
