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
