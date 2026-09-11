import { describe, expect, it } from 'vitest';
import { advance, chooseCandidate, chooseNode, chooseRelic, currentAct, cycleLength, startRun, wellTurn, type RunState } from '../run';
import { SCENES } from '../scenes';

function readScene(run: RunState): RunState {
  let r = run;
  for (let i = 0; i < 4; i++) r = chooseCandidate(r, 0);
  return r;
}

/** Walk to the Abyss with unlimited vitality so the reading never ends the run. */
function walkToAbyss(run: RunState): RunState {
  let r = run;
  let guard = 0;
  while (!SCENES[r.map[r.layer][0].sceneId].terminal && guard++ < 40) {
    r = { ...r, vitality: 99 };
    r = chooseNode(r, 0);
    r = readScene(r);
    if (r.phase.kind === 'resolved') r = advance(r);
    if (r.phase.kind === 'relic') r = chooseRelic(r, 0);
  }
  return { ...r, vitality: 99 };
}

describe('the well', () => {
  it('opens a deeper map under the Abyss instead of ascending, and stakes climb', () => {
    let run = startRun(5, { endless: true, actLayers: [1, 1] });
    expect(run.well).toBe(0);
    expect(cycleLength(run)).toBe(3);
    const before = run.map.length;
    run = walkToAbyss(run);
    expect(SCENES[run.map[run.layer][0].sceneId].terminal).toBe(true);
    run = chooseNode(run, 0);
    const vit = run.vitality;
    run = readScene(run);
    expect(run.phase.kind).toBe('resolved');
    expect(run.well).toBe(1);
    expect(wellTurn(run)).toBe(2);
    expect(run.map.length).toBe(before * 2);
    expect(run.vitality).toBe(vit + run.history[run.history.length - 1].resolution.deltas.vitality + 2);
    // Node ids and layers continue past the first map.
    const next = run.map[before][0];
    expect(next.layer).toBe(before);
    expect(next.id.startsWith(`${before}-`)).toBe(true);
    run = advance(run);
    expect(run.phase.kind).toBe('map');
    expect(run.layer).toBe(before);
    expect(currentAct(run)).toBe(1);
    // A second cycle reads at higher stakes: the same harm costs more.
    run = walkToAbyss(run);
    run = chooseNode(run, 0);
    run = readScene(run);
    expect(run.well).toBe(2);
    expect(run.map.length).toBe(before * 3);
  });

  it('is absent outside the well and the Abyss still returns you', () => {
    let run = startRun(5, { actLayers: [1, 1] });
    expect(run.well).toBeUndefined();
    run = walkToAbyss(run);
    run = chooseNode(run, 0);
    run = readScene(run);
    expect(run.phase.kind).toBe('ascended');
  });
});
