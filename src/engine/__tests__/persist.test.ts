import { describe, expect, it } from 'vitest';
import { chooseCandidate, chooseNode, startRun } from '../run';

describe('run state is a plain value', () => {
  it('survives a JSON round trip and keeps working', () => {
    let run = chooseNode(startRun(21), 0);
    run = chooseCandidate(run, 1);
    const copy = JSON.parse(JSON.stringify(run)) as typeof run;
    expect(copy).toEqual(run);
    const a = chooseCandidate(run, 0);
    const b = chooseCandidate(copy, 0);
    expect(b).toEqual(a);
  });
});
