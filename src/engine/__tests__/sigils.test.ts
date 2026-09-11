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
    expect(k.records?.standard).toEqual({ runs: 2, returns: 1, bestDepth: 9 });
  });
});
