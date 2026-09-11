import { describe, expect, it } from 'vitest';
import { advance, canTakeVow, chooseCandidate, chooseNode, startRun, takeVow, type RunState } from '../run';
import { SCENES } from '../scenes';
import { getVow, vowOffer, VOW_IDS } from '../vows';

function readScene(run: RunState): RunState {
  let r = run;
  for (let i = 0; i < 4; i++) r = chooseCandidate(r, 0);
  return r;
}

describe('vows', () => {
  it('offers two distinct vows per seed without touching the rng', () => {
    for (const seed of [1, 2, 3, 99, 12345]) {
      const [a, b] = vowOffer(seed);
      expect(a).not.toBe(b);
      expect(VOW_IDS).toContain(a);
    }
    const run = startRun(7);
    expect(takeVow(run, 'silence').rngState).toBe(run.rngState);
  });

  it('can only be taken before the first scene', () => {
    let run = startRun(7);
    expect(canTakeVow(run)).toBe(true);
    run = takeVow(run, 'first-instinct');
    expect(run.vow).toEqual({ id: 'first-instinct', broken: false });
    expect(canTakeVow(run)).toBe(false);
    const later = chooseNode(startRun(7), 0);
    expect(canTakeVow(later)).toBe(false);
    expect(takeVow(later, 'silence').vow).toBeUndefined();
  });

  it('breaks when a scene violates it and stays broken', () => {
    // The Long Way breaks on a rest scene; find one on the map.
    let run = takeVow(startRun(11), 'long-way');
    let guard = 0;
    while (run.phase.kind === 'map' && guard++ < 12) {
      const layer = run.map[run.layer];
      const restIdx = layer.findIndex((n) => SCENES[n.sceneId].kind === 'rest');
      run = chooseNode(run, restIdx >= 0 ? restIdx : 0);
      const restHere = SCENES[layer[restIdx >= 0 ? restIdx : 0].sceneId].kind === 'rest';
      run = readScene(run);
      if (restHere) {
        expect(run.vow?.broken).toBe(true);
        break;
      }
      expect(run.vow?.broken).toBe(false);
      if (run.phase.kind === 'resolved') run = advance(run);
      if (run.phase.kind === 'relic') run = { ...run, phase: { kind: 'map' }, layer: run.layer + 1, node: null, slots: [], activeSlot: 0 };
    }
    expect(run.vow?.broken).toBe(true);
  });

  it('pays out on entering the Abyss when kept', () => {
    let run = takeVow(startRun(5), 'steady-hand');
    // Jump to the last layer with the vow intact and plenty of vitality.
    run = { ...run, layer: run.map.length - 1, vitality: 5, clarity: 1 };
    const before = run.vitality;
    run = chooseNode(run, 0);
    expect(run.vow?.kept).toBe(true);
    expect(run.vitality).toBe(before + (getVow('steady-hand').reward.vitality ?? 0));
    // Rewards are paid once.
    expect(chooseNode({ ...run, phase: { kind: 'map' }, node: null }, 0).vitality).toBe(run.vitality);
  });

  it('does not pay a broken vow', () => {
    let run = takeVow(startRun(5), 'steady-hand');
    run = { ...run, vow: { id: 'steady-hand', broken: true }, layer: run.map.length - 1, vitality: 5 };
    run = chooseNode(run, 0);
    expect(run.vow?.kept).toBeUndefined();
    expect(run.vitality).toBe(5);
  });
});
