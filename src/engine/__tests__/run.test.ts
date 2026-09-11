import { describe, expect, it } from 'vitest';
import {
  CANDIDATES_PER_SLOT, advance, chooseCandidate, chooseNode, finalSpread, isOver, readingOf, redrawActive, startRun, whisper,
} from '../run';
import { SLOT_IDS, TOTAL_LAYERS } from '../scenes';

function playScene(run: ReturnType<typeof startRun>, pick = 0) {
  if (run.phase.kind === 'map') run = chooseNode(run, 0);
  for (let i = 0; i < SLOT_IDS.length; i++) run = chooseCandidate(run, pick);
  return run;
}

describe('run', () => {
  it('starts on the map with a layered path ending in the abyss', () => {
    const run = startRun(123);
    expect(run.phase.kind).toBe('map');
    expect(run.map.length).toBe(TOTAL_LAYERS);
    expect(run.map.at(-1)!.length).toBe(1);
    expect(run.map.at(-1)![0].sceneId).toBe('abyss');
    for (const layer of run.map.slice(0, -1)) expect(layer.length).toBeGreaterThanOrEqual(2);
    // no rest scenes in the first layer of the run
    expect(run.map[0].every((n) => n.kind !== 'rest')).toBe(true);
  });

  it('deals three candidates for the first seat after picking a node', () => {
    const run = chooseNode(startRun(123), 1);
    expect(run.node).toBe(1);
    expect(run.slots.length).toBe(1);
    expect(run.slots[0].candidates.length).toBe(CANDIDATES_PER_SLOT);
  });

  it('walks seat by seat and resolves after the fourth choice', () => {
    let run = chooseNode(startRun(123), 0);
    run = chooseCandidate(run, 1);
    expect(run.activeSlot).toBe(1);
    expect(run.slots.length).toBe(2);
    expect(run.deck.discard.length).toBe(2);
    run = chooseCandidate(run, 0);
    run = chooseCandidate(run, 2);
    expect(run.phase.kind).toBe('reading');
    run = chooseCandidate(run, 0);
    expect(['resolved', 'dead']).toContain(run.phase.kind);
    expect(readingOf(run)).not.toBeNull();
    expect(run.history.length).toBe(1);
    expect(run.deck.discard.length).toBe(12);
  });

  it('is deterministic per seed', () => {
    const a = playScene(startRun(99), 2);
    const b = playScene(startRun(99), 2);
    expect(a).toEqual(b);
  });

  it('redraw costs clarity and re-deals the active seat', () => {
    let run = chooseNode(startRun(5), 0);
    const before = run.slots[0].candidates;
    run = redrawActive(run);
    expect(run.clarity).toBe(1);
    expect(run.slots[0].candidates).not.toEqual(before);
    run = redrawActive(run);
    const after = run.slots[0].candidates;
    expect(run.clarity).toBe(0);
    expect(redrawActive(run).slots[0].candidates).toEqual(after);
  });

  it('whisper costs clarity, once per candidate', () => {
    let run = chooseNode(startRun(7), 0);
    run = whisper(run, 1);
    expect(run.clarity).toBe(1);
    expect(run.slots[0].whispered).toEqual([1]);
    run = whisper(run, 1);
    expect(run.clarity).toBe(1);
    run = whisper(run, 0);
    expect(run.clarity).toBe(0);
    expect(whisper(run, 2).slots[0].whispered).toEqual([1, 0]);
  });

  it('marks cards after triumph and calamity and honors marks on later deals', () => {
    // brute force a seed that produces a triumph or calamity in the first scene
    let found = false;
    for (let seed = 1; seed < 400 && !found; seed++) {
      const run = playScene(startRun(seed), 0);
      const tier = run.history[0].resolution.tier;
      if (tier === 'triumph' || tier === 'calamity') {
        found = true;
        const mark = tier === 'triumph' ? 'charged' : 'scarred';
        for (const c of finalSpread(run)) expect(run.marks[c.cardId]).toBe(mark);
      }
    }
    expect(found).toBe(true);
  });

  it('advances to the map and ends in death or ascension', () => {
    let run = startRun(2024);
    let guard = 0;
    while (!isOver(run) && guard++ < 30) {
      run = playScene(run, 0);
      if (run.phase.kind === 'resolved') {
        run = advance(run);
        expect(run.phase.kind).toBe('map');
      }
    }
    expect(isOver(run)).toBe(true);
    expect(finalSpread(run).length).toBe(4);
    if (run.phase.kind === 'dead') expect(run.vitality).toBe(0);
    else expect(run.layer).toBe(TOTAL_LAYERS - 1);
  });
});
