import { describe, expect, it } from 'vitest';
import { DESCENTS, getDescent } from '../descents';
import { emptyKnowledge } from '../knowledge';
import { chooseNode, startRun } from '../run';

describe('descents', () => {
  it('standard is always unlocked; others state their unlock', () => {
    const k = emptyKnowledge();
    expect(getDescent('standard').unlocked(k)).toBe(true);
    for (const d of DESCENTS.slice(1)) {
      expect(d.unlocked(k)).toBe(false);
      expect(d.unlockText.length).toBeGreaterThan(0);
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
