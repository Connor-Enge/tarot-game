import { describe, expect, it } from 'vitest';
import { emptyKnowledge, noteRecord, noteSigils } from '../knowledge';
import { advance, chooseCandidate, chooseNode, chooseRelic, isOver, startRun, type RunState } from '../run';
import { newSigils, SIGILS } from '../sigils';

function finish(seed: number, vitality = 999): RunState {
  let run = { ...startRun(seed), vitality };
  let guard = 0;
  while (!isOver(run) && guard++ < 40) {
    if (run.phase.kind === 'map') run = chooseNode(run, 0);
    while (run.phase.kind === 'reading') run = chooseCandidate(run, 0);
    if (run.phase.kind === 'resolved') run = advance(run);
    if (run.phase.kind === 'relic') run = chooseRelic(run, 0);
  }
  return run;
}

describe('sigils', () => {
  it('all have unique ids and text', () => {
    expect(new Set(SIGILS.map((s) => s.id)).size).toBe(SIGILS.length);
    for (const s of SIGILS) expect(s.text.length).toBeGreaterThan(3);
  });

  it('awards Surfaced on ascension and First Hand without redraws, never twice', () => {
    const run = finish(12);
    expect(run.phase.kind).toBe('ascended');
    let k = emptyKnowledge();
    const got = newSigils(run, k);
    expect(got).toContain('first-return');
    expect(got).toContain('no-redraw');
    k = noteSigils(k, got);
    expect(newSigils(run, k)).toEqual([]);
  });

  it('marks the blessing, the cut, and three Codex milestones', async () => {
    const { acceptTrade } = await import('../run');
    const { newKnowledgeSigils } = await import('../sigils');
    const { noteVow, noteAlmanac, noteResolved } = await import('../knowledge');
    const sig = (id: string) => SIGILS.find((s) => s.id === id)!;
    let run = { ...startRun(3), clarity: 3, phase: { kind: 'resolved', resolution: {} as never, trade: { id: 'bless-hand', give: 2, cardId: 'major-1' } } } as RunState;
    run = acceptTrade(run);
    expect(run.tradeTaken).toBe('bless-hand');
    expect(sig('blessed').when(run, emptyKnowledge())).toBe(true);
    const back = { ...finish(12), cut: 20 };
    expect(sig('cut-return').when(back, emptyKnowledge())).toBe(true);
    expect(sig('cut-return').when({ ...back, cut: undefined }, emptyKnowledge())).toBe(false);
    let k = emptyKnowledge();
    for (let i = 1; i <= 7; i++) k = noteAlmanac(k, `2026-01-0${i}`, { depth: 9, returned: true, good: 3 });
    for (const v of ['silence', 'thrift', 'long-way']) k = noteVow(k, v, 'kept');
    for (let i = 0; i < 25; i++) k = noteResolved(k, 'major-0', 'hand', false);
    const got = newKnowledgeSigils(k);
    expect(got).toContain('seven-days');
    expect(got).toContain('three-vows');
    expect(got).toContain('well-worn');
  });

  it('Held Before needs an Abyss card that was placed earlier in the descent', () => {
    const sig = SIGILS.find((s) => s.id === 'held-before')!;
    const d = (cardId: string) => ({ cardId, reversed: false });
    const entry = (ids: string[]) => ({ sceneId: 'crossing', reading: { vessel: d(ids[0]), threshold: d(ids[1]), hand: d(ids[2]), wake: d(ids[3]) }, resolution: {} as never });
    const base = { ...startRun(2), phase: { kind: 'ascended', resolution: {} as never } } as RunState;
    const yes = { ...base, history: [entry(['major-0', 'major-1', 'major-2', 'major-3']), entry(['cups-2', 'cups-3', 'major-1', 'cups-5'])] };
    const no = { ...base, history: [entry(['major-0', 'major-1', 'major-2', 'major-3']), entry(['cups-2', 'cups-3', 'cups-4', 'cups-5'])] };
    expect(sig.when(yes, emptyKnowledge())).toBe(true);
    expect(sig.when(no, emptyKnowledge())).toBe(false);
    expect(sig.when({ ...yes, phase: { kind: 'dead', resolution: {} as never } }, emptyKnowledge())).toBe(false);
  });

  it('a suit read through, once every card of it has been read', async () => {
    const { noteResolved } = await import('../knowledge');
    const { newKnowledgeSigils } = await import('../sigils');
    let k = emptyKnowledge();
    for (let i = 1; i <= 13; i++) k = noteResolved(k, `cups-${i}`, 'hand', false);
    expect(newKnowledgeSigils(k)).not.toContain('cups-read');
    k = noteResolved(k, 'cups-14', 'wake', true);
    expect(newKnowledgeSigils(k)).toContain('cups-read');
    expect(newKnowledgeSigils(k)).not.toContain('wands-read');
  });

  it('does nothing mid-run', () => {
    expect(newSigils(startRun(1), emptyKnowledge())).toEqual([]);
  });

  it('keeps per-descent records', () => {
    let k = noteRecord(emptyKnowledge(), 'standard', 4, false);
    k = noteRecord(k, 'standard', 9, true);
    expect(k.records?.standard).toEqual({ runs: 2, returns: 1, bestDepth: 9, deepestReturn: 0 });
  });
});

describe('best spread', () => {
  it('prefers a return, then depth, then good readings', () => {
    const a = [{ cardId: 'major-0', reversed: false }];
    let k = noteRecord(emptyKnowledge(), 'standard', 4, false, 0, { cards: a, good: 1 });
    expect(k.records?.standard.best?.depth).toBe(4);
    k = noteRecord(k, 'standard', 6, false, 0, { cards: a, good: 0 });
    expect(k.records?.standard.best?.depth).toBe(6);
    k = noteRecord(k, 'standard', 3, false, 0, { cards: a, good: 3 });
    expect(k.records?.standard.best?.depth).toBe(6);
    k = noteRecord(k, 'standard', 9, true, 0, { cards: a, good: 2 });
    expect(k.records?.standard.best?.returned).toBe(true);
    k = noteRecord(k, 'standard', 9, true, 0, { cards: a, good: 5 });
    expect(k.records?.standard.best?.good).toBe(5);
    k = noteRecord(k, 'standard', 9, false, 0, { cards: a, good: 8 });
    expect(k.records?.standard.best?.returned).toBe(true);
  });
});

describe('knowledge-only sigils', () => {
  it('awards Remembered from Study and Bound from links', async () => {
    const { newKnowledgeSigils } = await import('../sigils');
    const { noteStudyResult, noteLinks } = await import('../knowledge');
    let k = emptyKnowledge();
    for (let i = 0; i < 10; i++) k = noteStudyResult(k, true, i + 1);
    expect(newKnowledgeSigils(k)).toContain('remembered');
    const ids = Array.from({ length: 15 }, (_, i) => `c${i}`);
    k = noteLinks(k, ids); // 105 pairs
    expect(newKnowledgeSigils(k)).toContain('bound');
    k = noteSigils(k, newKnowledgeSigils(k));
    expect(newKnowledgeSigils(k)).toEqual([]);
  });
});

describe('reader title', () => {
  it('scales with the deck known', async () => {
    const { readerTitle } = await import('../knowledge');
    let k = emptyKnowledge();
    expect(readerTitle(k)).toBe('Unread');
    k = { ...k, cards: { a: { tier: 1 as const, resolved: 1, seats: {} } } };
    expect(readerTitle(k)).toBe('Novice');
    const many = Object.fromEntries(Array.from({ length: 70 }, (_, i) => [`x${i}`, { tier: 2 as const, resolved: 1, seats: {} }]));
    expect(readerTitle({ ...k, cards: many })).toBe('Oracle');
  });
});
