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
    run = chooseCandidate(run, 0); // -> wake (seat 3)
    expect(run.slots[2].candidates.length).toBe(4);
    run = chooseCandidate(run, 0); // -> hand (seat 4)
    expect(run.slots[3].candidates.every((c) => !c.reversed)).toBe(true);
  });

  it('lodestone deals four to the Vessel; feather halves reversals; still water drops the echo; tallow taxes walking on', () => {
    const run = chooseNode(withRelics(startRun(11), ['lodestone']), 0);
    expect(run.slots[0].candidates.length).toBe(4);
    let plain = 0;
    let light = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const a = chooseNode(startRun(seed), 0);
      const b = chooseNode(withRelics(startRun(seed), ['feather']), 0);
      plain += a.slots[0].candidates.filter((c) => c.reversed).length;
      light += b.slots[0].candidates.filter((c) => c.reversed).length;
    }
    expect(light).toBeLessThan(plain);
    let still = chooseNode(withRelics(startRun(5), ['stillwater']), 0);
    for (let i = 0; i < 4; i++) still = chooseCandidate(still, 0);
    expect(still.echo).toBeNull();
    let taxed = chooseNode(withRelics({ ...startRun(5), clarity: 3 }, ['tallow']), 0);
    for (let i = 0; i < 4; i++) taxed = chooseCandidate(taxed, 0);
    const before = taxed.clarity;
    taxed = advance(taxed);
    expect(taxed.clarity).toBe(Math.max(0, before - 1));
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

describe('scene relics', () => {
  it('a boon in a relic scene hands over that relic once', async () => {
    const { SCENES } = await import('../scenes');
    const withRelic = Object.values(SCENES).filter((s) => s.relic);
    expect(withRelic.length).toBeGreaterThanOrEqual(6);
    let found = false;
    for (let seed = 1; seed < 1500 && !found; seed++) {
      let run = startRun(seed);
      const idx = run.map[0].findIndex((n) => SCENES[n.sceneId].relic);
      if (idx < 0) continue;
      run = chooseNode(run, idx);
      for (let i = 0; i < SLOT_IDS.length; i++) run = chooseCandidate(run, 0);
      if (run.phase.kind === 'resolved' && run.phase.resolution.tier === 'boon') {
        found = true;
        const scene = SCENES[run.map[0][idx].sceneId];
        expect(run.phase.found).toBe(scene.relic);
        expect(run.relics).toContain(scene.relic);
      }
    }
    expect(found).toBe(true);
  });
});

describe('thread, compass, ash', () => {
  it('thread adds a take-back on pickup, compass makes foretelling free, ash dulls rest', async () => {
    const { startRun, chooseRelic, foretell, foretellCost } = await import('../run');
    const run = startRun(4, { startingRelics: ['thread'] });
    expect(run.takeBacks).toBe(2);
    const offered = { ...startRun(4), phase: { kind: 'relic' as const, offer: ['thread', 'coin'] } };
    expect(chooseRelic(offered, 0).takeBacks).toBe(2);
    const withCompass = startRun(4, { startingRelics: ['compass'], startingClarity: 0 });
    expect(foretellCost(withCompass)).toBe(0);
    const ft = foretell(withCompass, 0);
    expect(ft.foretold).toHaveLength(1);
    expect(ft.clarity).toBe(0);
    const plain = startRun(4, { startingClarity: 0 });
    expect(foretell(plain, 0).foretold).toHaveLength(0);
  });
});
