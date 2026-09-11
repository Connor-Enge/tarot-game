import { describe, expect, it } from 'vitest';
import { DESCENTS, getDescent } from '../descents';
import { emptyKnowledge } from '../knowledge';
import { chooseNode, startRun } from '../run';

describe('descents', () => {
  it('standard is always unlocked; others state their unlock', () => {
    const k = emptyKnowledge();
    expect(getDescent('standard').unlocked(k)).toBe(true);
    for (const d of DESCENTS.slice(1)) {
      if (d.unlockText === '') {
        expect(d.unlocked(k)).toBe(true);
        continue;
      }
      expect(d.unlocked(k)).toBe(false);
    }
    expect(getDescent('arcana').unlocked({ ...k, ascensions: 1 })).toBe(true);
  });

  it('applies deck, reversed chance, relics and stats', () => {
    const arcana = chooseNode(startRun(9, getDescent('arcana').config), 0);
    expect(arcana.deck.draw.length + arcana.slots[0].candidates.length).toBe(22);
    expect(arcana.slots[0].candidates.every((c) => c.cardId.startsWith('major-'))).toBe(true);

    const fog = startRun(9, getDescent('fogbound').config);
    expect(fog.relics).toEqual(['fog']);
    expect(fog.clarity).toBe(4);

    const thin = startRun(9, getDescent('thin').config);
    expect(thin.vitality).toBe(6);

    // inverted: over many deals, most land reversed
    let rev = 0;
    let total = 0;
    for (let seed = 1; seed < 40; seed++) {
      const r = chooseNode(startRun(seed, getDescent('inverted').config), 0);
      for (const c of r.slots[0].candidates) {
        total++;
        if (c.reversed) rev++;
      }
    }
    expect(rev / total).toBeGreaterThan(0.45);
  });
});

describe('majorsFirst', () => {
  it('deals only Major Arcana for the whole first scene', async () => {
    const { chooseCandidate } = await import('../run');
    let run = chooseNode(startRun(77, { majorsFirst: true }), 0);
    const seen: string[] = [];
    for (let i = 0; i < 4; i++) {
      seen.push(...run.slots[i].candidates.map((c) => c.cardId));
      run = chooseCandidate(run, 0);
    }
    expect(seen.length).toBe(12);
    expect(seen.every((id) => id.startsWith('major-'))).toBe(true);
    expect(new Set(seen).size).toBe(12);
  });
});

describe('depths', () => {
  it('stack modifiers and are gated by returns', async () => {
    const { DEPTHS, depthConfig, maxDepthUnlocked } = await import('../descents');
    expect(DEPTHS.length).toBe(5);
    expect(maxDepthUnlocked(0)).toBe(0);
    expect(maxDepthUnlocked(3)).toBe(3);
    expect(maxDepthUnlocked(99)).toBe(5);
    const c3 = depthConfig(3);
    expect(c3.startingVitality).toBe(8);
    expect(c3.reversedChance).toBe(0.35);
    expect(c3.extraNeutralCost).toBe(1);
    expect(c3.noEcho).toBeUndefined();
    const run = startRun(5, depthConfig(5));
    expect(run.vitality).toBe(8);
    expect(run.mods).toEqual({ extraNeutralCost: 1, noEcho: true, abyssStakes: 4 });
  });

  it('noEcho suppresses the echo and extraNeutralCost bites', async () => {
    const { chooseCandidate } = await import('../run');
    const { SLOT_IDS } = await import('../scenes');
    let run = chooseNode({ ...startRun(8, { noEcho: true, extraNeutralCost: 2 }), vitality: 50 }, 0);
    for (let i = 0; i < SLOT_IDS.length; i++) run = chooseCandidate(run, 0);
    expect(run.echo).toBeNull();
    if (run.phase.kind === 'resolved' && run.phase.resolution.tier === 'neutral') {
      expect(run.phase.resolution.deltas.vitality).toBeLessThanOrEqual(-3);
    }
  });
});

describe('short road', () => {
  it('is always unlocked and builds seven scenes', async () => {
    const { getDescent } = await import('../descents');
    const d = getDescent('short');
    expect(d.unlocked(emptyKnowledge())).toBe(true);
    expect(startRun(2, d.config).map.length).toBe(7);
  });
});

describe('the Long Night', () => {
  it('unlocks after five deaths and a return, and reads under the Moon with the Wake dealing four', () => {
    const k = emptyKnowledge();
    const d = getDescent('night');
    expect(d.unlocked({ ...k, deaths: 5 })).toBe(false);
    expect(d.unlocked({ ...k, deaths: 5, ascensions: 1 })).toBe(true);
    const run = startRun(4, d.config);
    expect(run.relics).toEqual(['shard']);
    expect(run.clarity).toBe(4);
  });
});
