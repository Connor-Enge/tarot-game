import { describe, expect, it } from 'vitest';
import { BOON_IDS, CURSE_IDS, RELICS } from '../relics';
import { advance, chooseCandidate, chooseNode, chooseRelic, redrawActive, redrawCost, startRun, whisper, whisperCost, type RunState } from '../run';
import { SLOT_IDS } from '../scenes';

function withRelics(run: RunState, relics: string[]): RunState {
  return { ...run, relics };
}

describe('relics', () => {
  it('has distinct boons and curses with text', () => {
    expect(BOON_IDS.length).toBeGreaterThanOrEqual(6);
    expect(CURSE_IDS.length).toBeGreaterThanOrEqual(4);
    for (const r of Object.values(RELICS)) expect(r.text.length).toBeGreaterThan(8);
  });

  it('lens and shard deal four; salt keeps the Hand upright; fog hides one', () => {
    let run = chooseNode(withRelics(startRun(11), ['lens', 'shard', 'salt', 'fog']), 0);
    expect(run.slots[0].candidates.filter((c) => c.hidden).length).toBe(1);
    run = chooseCandidate(run, 0); // -> threshold
    expect(run.slots[1].candidates.length).toBe(4);
    run = chooseCandidate(run, 0); // -> hand
    expect(run.slots[2].candidates.every((c) => !c.reversed)).toBe(true);
    run = chooseCandidate(run, 0); // -> wake
    expect(run.slots[3].candidates.length).toBe(4);
  });

  it('splinter forces a reversed card in the Vessel', () => {
    for (let seed = 1; seed < 20; seed++) {
      const run = chooseNode(withRelics(startRun(seed), ['splinter']), 0);
      expect(run.slots[0].candidates.some((c) => c.reversed)).toBe(true);
    }
  });

  it('coin makes the first redraw free, hush doubles whispers, debt caps clarity', () => {
    let run = chooseNode(withRelics(startRun(3), ['coin', 'hush']), 0);
    expect(redrawCost(run)).toBe(0);
    run = redrawActive(run);
    expect(run.clarity).toBe(2);
    expect(redrawCost(run)).toBe(1);
    expect(whisperCost(run)).toBe(2);
    run = whisper(run, 0);
    expect(run.clarity).toBe(0);
    // debt: clarity stays <= 2 through resolution
    let d = chooseNode(withRelics({ ...startRun(4), clarity: 2 }, ['debt']), 0);
    for (let i = 0; i < SLOT_IDS.length; i++) d = chooseCandidate(d, 0);
    expect(d.clarity).toBeLessThanOrEqual(2);
  });

  it('offers two boons after a triumph and walks on after choosing', () => {
    let found = false;
    for (let seed = 1; seed < 600 && !found; seed++) {
      let run = chooseNode(startRun(seed), 0);
      for (let i = 0; i < SLOT_IDS.length; i++) run = chooseCandidate(run, 0);
      if (run.phase.kind === 'resolved' && run.phase.resolution.tier === 'triumph') {
        found = true;
        expect(run.phase.offer?.length).toBe(2);
        const relicPhase = advance(run);
        expect(relicPhase.phase.kind).toBe('relic');
        const after = chooseRelic(relicPhase, 1);
        expect(after.phase.kind).toBe('map');
        expect(after.relics).toEqual([run.phase.offer![1]]);
        expect(after.layer).toBe(1);
      }
    }
    expect(found).toBe(true);
  });

  it('inflicts a curse after a calamity', () => {
    let found = false;
    for (let seed = 1; seed < 800 && !found; seed++) {
      let run = chooseNode({ ...startRun(seed), vitality: 50 }, 0);
      for (let i = 0; i < SLOT_IDS.length; i++) run = chooseCandidate(run, i % 3);
      if (run.phase.kind === 'resolved' && run.phase.resolution.tier === 'calamity') {
        found = true;
        expect(run.phase.cursed).toBeDefined();
        expect(CURSE_IDS).toContain(run.phase.cursed!);
        expect(run.relics).toContain(run.phase.cursed!);
      }
    }
    expect(found).toBe(true);
  });

  it('candle grants clarity on walking on', () => {
    let run = chooseNode(withRelics(startRun(5), ['candle']), 0);
    for (let i = 0; i < SLOT_IDS.length; i++) run = chooseCandidate(run, 0);
    if (run.phase.kind === 'resolved') {
      const before = run.clarity;
      const next = advance(run);
      expect(next.clarity).toBe(before + 1);
    }
  });
});
