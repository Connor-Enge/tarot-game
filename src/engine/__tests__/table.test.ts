import { describe, expect, it } from 'vitest';
import { emptyKnowledge } from '../knowledge';
import { resolveReading, COMBO_IDS } from '../resolve';
import { SCENES, SLOT_IDS } from '../scenes';
import { canLay, layTable, nextEmptySeat, tableCards, tableScenes } from '../table';

const scene = Object.values(SCENES).find((s) => !s.terminal)!;

function known(ids: string[], tier = 1) {
  const k = emptyKnowledge();
  for (const id of ids) k.cards[id] = { tier, resolved: 1, seats: {}, seen: 1 } as never;
  return k;
}

describe('the table', () => {
  it('remembers only scenes the player has read at, each once, in first-met order', () => {
    const k = emptyKnowledge();
    expect(tableScenes(k)).toEqual([]);
    k.omenLog = [
      { run: 1, scene: 'crossing', seat: 'vessel', cardId: 'major-0', reversed: false, tier: 'boon' },
      { run: 1, scene: 'crossing', seat: 'threshold', cardId: 'major-16', reversed: false, tier: 'boon' },
      { run: 1, scene: 'no-such-scene', seat: 'wake', cardId: 'major-19', reversed: false, tier: 'boon' },
      { run: 2, scene: 'crossing', seat: 'hand', cardId: 'major-18', reversed: false, tier: 'harm' },
    ];
    const ids = tableScenes(k).map((s) => s.id);
    expect(ids.filter((id) => id === 'crossing')).toHaveLength(1);
    expect(ids).not.toContain('no-such-scene');
  });

  it('lets only glimpsed cards onto the table', () => {
    const k = known(['major-0', 'major-16'], 1);
    k.cards['major-19'] = { tier: 0, resolved: 0, seats: {}, seen: 1 } as never;
    expect(tableCards(k).sort()).toEqual(['major-0', 'major-16']);
    expect(canLay(k, 'major-0')).toBe(true);
    expect(canLay(k, 'major-19')).toBe(false);
    expect(canLay(k, 'major-17')).toBe(false);
  });

  it('reckons the seats laid so far and holds the tally until all four are down', () => {
    const k = known(['major-0', 'major-16', 'major-19', 'major-18']);
    const part = layTable(scene, { vessel: { cardId: 'major-0', reversed: false }, wake: { cardId: 'major-19', reversed: true } }, k);
    expect(part.placed).toBe(2);
    expect(part.seats.map((s) => s.slot)).toEqual(['vessel', 'wake']);
    expect(part.full).toBeUndefined();
    expect(nextEmptySeat({ vessel: { cardId: 'major-0', reversed: false } })).toBe('threshold');
  });

  it('a full table matches the true resolution, naming only readings already found', () => {
    const k = known(['major-0', 'major-16', 'major-19', 'major-18']);
    const lay = { vessel: { cardId: 'major-0', reversed: false }, threshold: { cardId: 'major-16', reversed: false }, wake: { cardId: 'major-19', reversed: false }, hand: { cardId: 'major-18', reversed: false } };
    const t = layTable(scene, lay, k);
    const res = resolveReading(scene, { vessel: lay.vessel, threshold: lay.threshold, wake: lay.wake, hand: lay.hand }, {});
    expect(t.full).toBeDefined();
    expect(t.full!.total).toBe(res.total);
    expect(t.full!.tier).toBe(res.tier);
    // Four majors upright: at least the all-majors and four-upright readings fire, none of them found yet.
    expect(res.comboIds.length).toBeGreaterThan(0);
    expect(t.full!.named).toEqual([]);
    expect(t.full!.unnamed.count).toBe(res.comboIds.length);
    // Once found, they are named.
    k.combos = [...res.comboIds];
    const t2 = layTable(scene, lay, k);
    expect(t2.full!.named.map((n) => n.id)).toEqual(res.comboIds);
    expect(t2.full!.unnamed.count).toBe(0);
    expect(nextEmptySeat(lay)).toBeNull();
    expect(COMBO_IDS.length).toBeGreaterThan(30);
    expect(SLOT_IDS).toHaveLength(4);
  });
});
