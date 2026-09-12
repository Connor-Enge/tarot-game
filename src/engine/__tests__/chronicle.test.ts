import { describe, expect, it } from 'vitest';
import { chronicle, chronicleText } from '../chronicle';
import { advance, chooseCandidate, chooseNode, chooseRelic, isOver, startRun, type RunState } from '../run';
import { SCENES } from '../scenes';

function finish(seed: number): RunState {
  let run = { ...startRun(seed), vitality: 999 } as RunState;
  let guard = 0;
  while (!isOver(run) && guard++ < 40) {
    if (run.phase.kind === 'map') run = chooseNode(run, 0);
    while (run.phase.kind === 'reading') run = chooseCandidate(run, 0);
    if (run.phase.kind === 'resolved') run = advance(run);
    if (run.phase.kind === 'relic') run = chooseRelic(run, 0);
  }
  return run;
}

describe('the chronicle', () => {
  it('tells one paragraph per scene in the scene\'s own words, then grades the hand', () => {
    const run = finish(12);
    const lines = chronicle(run);
    expect(lines).toHaveLength(run.history.length + 1);
    run.history.forEach((h, i) => {
      expect(lines[i]).toContain(SCENES[h.sceneId].place);
      expect(lines[i]).toContain(h.resolution.narration.at(-1)!);
    });
    expect(lines.at(-1)).toMatch(/hand/);
    const text = chronicleText(run, 'A descent');
    expect(text.startsWith('A descent\n\n1. ')).toBe(true);
    expect(text.split('\n')).toHaveLength(run.history.length + 3);
  });
});
