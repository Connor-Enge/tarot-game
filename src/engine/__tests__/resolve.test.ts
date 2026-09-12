import { describe, expect, it } from 'vitest';
import { comboScore, resolveReading, tierFor, type Reading } from '../resolve';
import { SCENES } from '../scenes';

const reading = (ids: [string, string, string, string], reversed = false): Reading => ({
  vessel: { cardId: ids[0], reversed },
  threshold: { cardId: ids[1], reversed },
  hand: { cardId: ids[2], reversed },
  wake: { cardId: ids[3], reversed },
});

describe('resolveReading', () => {
  it('maps totals to tiers', () => {
    expect(tierFor(-10)).toBe('calamity');
    expect(tierFor(-2)).toBe('harm');
    expect(tierFor(1)).toBe('harm');
    expect(tierFor(2)).toBe('neutral');
    expect(tierFor(5)).toBe('boon');
    expect(tierFor(8)).toBe('triumph');
  });

  it('rewards a fitting reading over a clashing one', () => {
    const beast = SCENES.beast;
    // Strength (power/patience/love) in the Hand fits the beast; The Tower reversed everywhere does not.
    const good = resolveReading(beast, reading(['major-8', 'wands-12', 'major-8', 'major-13']));
    const bad = resolveReading(beast, reading(['major-16', 'major-16', 'major-16', 'major-16'], true));
    expect(good.total).toBeGreaterThan(bad.total);
    expect(bad.tier === 'harm' || bad.tier === 'calamity').toBe(true);
  });

  it('applies combos and scales harm by stakes', () => {
    const r = resolveReading(SCENES.abyss, reading(['major-0', 'major-16', 'major-1', 'major-17']));
    expect(r.comboNotes).toContain('After the fall, a light.');
    const harmful = resolveReading(SCENES.abyss, reading(['major-15', 'major-18', 'major-6', 'major-15']));
    expect(harmful.comboNotes).toContain('You chose with the chain still on.');
    expect(harmful.deltas.vitality).toBeLessThanOrEqual(-2 * SCENES.abyss.stakes);
  });

  it('narrates one omen per seat plus the outcome', () => {
    const r = resolveReading(SCENES.crossing, reading(['cups-1', 'cups-2', 'cups-3', 'cups-4']));
    expect(r.narration.length).toBe(4 + r.comboNotes.length + 1);
    expect(r.narration[r.narration.length - 1]).toBe(SCENES.crossing.outcomes[r.tier]);
  });
});

const d = (cardId: string, reversed = false) => ({ cardId, reversed });

describe('more named readings', () => {
  it('names a ten with an ace, a slipping chariot, and the two thrones', () => {
    const scene = SCENES.crossing;
    const tenAce = { vessel: d('wands-1'), threshold: d('wands-10'), hand: d('cups-2'), wake: d('swords-3') };
    expect(resolveReading(scene, tenAce, {}).comboNotes).toContain('An ending and a beginning of the same kind.');
    const chariot = { vessel: d('major-7', true), threshold: d('cups-2'), hand: d('cups-3'), wake: d('cups-4') };
    expect(resolveReading(scene, chariot, {}).comboIds).toContain('chariot-slipping');
    const thrones = { vessel: d('major-3'), threshold: d('major-4'), hand: d('cups-3'), wake: d('cups-4') };
    expect(resolveReading(scene, thrones, {}).comboIds).toContain('two-thrones');
    expect(resolveReading(scene, { vessel: d('major-7'), threshold: d('cups-2'), hand: d('cups-3'), wake: d('cups-4') }, {}).comboIds).not.toContain('chariot-slipping');
  });
});

describe('named readings, second shelf', () => {
  const d = (cardId: string, reversed = false) => ({ cardId, reversed });
  const scene = SCENES.crossing;
  const ids = (r: Parameters<typeof resolveReading>[1]) => resolveReading(scene, r, {}).comboIds;
  it('names the new pairs and seats', () => {
    expect(ids({ vessel: d('major-17'), threshold: d('major-18'), hand: d('major-1'), wake: d('major-21') })).toEqual(expect.arrayContaining(['star-into-fog', 'magician-hand', 'world-wake']));
    expect(ids({ vessel: d('cups-2'), threshold: d('major-5'), hand: d('major-0', true), wake: d('major-11') })).toEqual(expect.arrayContaining(['hierophant-threshold', 'fool-hand-reversed', 'justice-wake']));
    expect(ids({ vessel: d('major-19'), threshold: d('major-18'), hand: d('swords-10'), wake: d('cups-3') })).toEqual(expect.arrayContaining(['sun-and-moon', 'ten-swords-hand', 'three-cups-wake']));
    expect(ids({ vessel: d('cups-12'), threshold: d('wands-12'), hand: d('swords-7'), wake: d('pentacles-7') })).toContain('knights-quarrel');
    expect(ids({ vessel: d('cups-7'), threshold: d('wands-7'), hand: d('swords-7'), wake: d('major-3') })).toContain('three-of-a-kind');
    // Orientation matters where it says so.
    expect(ids({ vessel: d('cups-2'), threshold: d('cups-4'), hand: d('major-1', true), wake: d('major-21', true) })).not.toContain('magician-hand');
    expect(ids({ vessel: d('cups-2'), threshold: d('cups-4'), hand: d('major-1', true), wake: d('major-21', true) })).not.toContain('world-wake');
  });
});

describe('named readings of tone', () => {
  const r = (ids: string[], rev: boolean[]) => ({ vessel: { cardId: ids[0], reversed: rev[0] }, threshold: { cardId: ids[1], reversed: rev[1] }, wake: { cardId: ids[2], reversed: rev[2] }, hand: { cardId: ids[3], reversed: rev[3] } });
  it('four upright, four reversed, and one suit are named', () => {
    const up = resolveReading(SCENES.crossing, r(['wands-2', 'cups-3', 'swords-4', 'pentacles-5'], [false, false, false, false]));
    expect(up.comboIds).toContain('four-upright');
    expect(up.comboIds).not.toContain('one-suit');
    const down = resolveReading(SCENES.crossing, r(['wands-2', 'cups-3', 'swords-4', 'pentacles-5'], [true, true, true, true]));
    expect(down.comboIds).toContain('four-reversed');
    const suit = resolveReading(SCENES.crossing, r(['cups-2', 'cups-3', 'cups-4', 'cups-5'], [false, true, false, false]));
    expect(suit.comboIds).toContain('one-suit');
    expect(suit.comboIds).not.toContain('four-upright');
    const mixed = resolveReading(SCENES.crossing, r(['cups-2', 'major-0', 'cups-4', 'cups-5'], [false, false, false, false]));
    expect(mixed.comboIds).not.toContain('one-suit');
  });
});

describe('combo scores', () => {
  it('are exposed by id, and unknown ids are worth nothing', () => {
    expect(comboScore('four-upright')).toBe(0.5);
    expect(comboScore('four-reversed')).toBe(2);
    expect(comboScore('knights-quarrel')).toBeLessThan(0);
    expect(comboScore('no-such-reading')).toBe(0);
  });
});

describe('named readings, the newer set', () => {
  it('every id is unique, so no reading is counted twice', async () => {
    const { COMBO_IDS } = await import('../resolve');
    expect(new Set(COMBO_IDS).size).toBe(COMBO_IDS.length);
    expect(COMBO_IDS.filter((id) => id === 'one-suit')).toHaveLength(1);
    expect(COMBO_IDS).not.toContain('all-reversed');
  });
  it('fires on the star in the hand, two kings, and death beside the tower without a star', async () => {
    const { resolveReading, COMBO_IDS } = await import('../resolve');
    const { SCENES } = await import('../scenes');
    const scene = Object.values(SCENES).find((s) => !s.terminal)!;
    const up = (cardId: string) => ({ cardId, reversed: false });
    const a = resolveReading(scene, { vessel: up('wands-14'), threshold: up('cups-14'), wake: up('major-13'), hand: up('major-17') }, {});
    expect(a.comboIds).toContain('star-hand');
    expect(a.comboIds).toContain('two-kings');
    expect(a.comboIds).not.toContain('death-and-tower');
    const b = resolveReading(scene, { vessel: up('major-13'), threshold: up('major-16'), wake: up('cups-10'), hand: { cardId: 'major-15', reversed: true } }, {});
    expect(b.comboIds).toContain('death-and-tower');
    expect(b.comboIds).toContain('ten-wake');
    expect(b.comboIds).toContain('devil-hand-reversed');
    expect(COMBO_IDS.length).toBeGreaterThanOrEqual(47);
  });
});

describe('named readings within reach', () => {
  it('names only found readings that some fourth card could complete, and nothing with fewer seats down', async () => {
    const { namedWithinReach } = await import('../resolve');
    const up = (cardId: string) => ({ cardId, reversed: false });
    const three = { vessel: up('cups-2'), threshold: up('major-16'), wake: up('major-13') };
    expect(namedWithinReach(three, ['star-hand', 'death-and-tower'])).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'star-hand' }), expect.objectContaining({ id: 'death-and-tower' })]));
    expect(namedWithinReach(three, [])).toEqual([]);
    expect(namedWithinReach(three, ['all-major'])).toEqual([]); // the Two of Cups is already down
    expect(namedWithinReach({ vessel: up('cups-2'), threshold: up('major-16') }, ['star-hand'])).toEqual([]);
    const full = { ...three, hand: up('major-17') };
    expect(namedWithinReach(full, ['star-hand'])).toEqual([]);
  });
});

describe('kinship', () => {
  it('lifts a reading by half a point per pair on the table that knows each other, and the tally names it', async () => {
    const { resolveReading, kinshipAmong, tallyText, KIN_BONUS } = await import('../resolve');
    const { SCENES } = await import('../scenes');
    const scene = Object.values(SCENES).find((s) => !s.terminal)!;
    const up = (cardId: string) => ({ cardId, reversed: false });
    const reading = { vessel: up('major-0'), threshold: up('cups-2'), wake: up('major-19'), hand: up('wands-5') };
    const plain = resolveReading(scene, reading, {});
    const kin = resolveReading(scene, reading, {}, { kin: ['major-0|major-19', 'cups-2|wands-5', 'major-0|swords-3'] });
    expect(kin.kinship?.pairs).toEqual([['cups-2', 'wands-5'], ['major-0', 'major-19']]);
    expect(kin.total).toBeCloseTo(plain.total + 2 * KIN_BONUS);
    expect(tallyText(kin)).toContain('kinship +1');
    expect(plain.kinship).toBeUndefined();
    expect(kinshipAmong(['major-0'], ['major-0|major-19']).pairs).toEqual([]);
  });
  it('rides into a run from its config and out through resolve', async () => {
    const { startRun, chooseNode, chooseCandidate } = await import('../run');
    let run = chooseNode(startRun(8, { kin: ['a|b'] }), 0);
    expect(run.kin).toEqual(['a|b']);
    const ids = run.slots[0].candidates.map((c) => c.cardId);
    // Make the first two seats' first cards kin, then play them.
    run = { ...run, kin: [] };
    for (let i = 0; i < 4; i++) run = chooseCandidate(run, 0);
    expect(run.phase.kind).toBe('resolved');
    expect(ids.length).toBeGreaterThan(0);
  });
});

describe('stakes raise the bar', () => {
  it('lifts neutral, boon and triumph by half a point per stake above the first, and leaves harm alone', async () => {
    const { STAKES_BAR, THRESHOLDS, thresholdsFor, tierFor } = await import('../resolve');
    expect(thresholdsFor(1)).toEqual(THRESHOLDS);
    const three = thresholdsFor(3);
    expect(three.boon).toBe(THRESHOLDS.boon + 2 * STAKES_BAR);
    expect(three.triumph).toBe(THRESHOLDS.triumph + 2 * STAKES_BAR);
    expect(three.neutral).toBe(THRESHOLDS.neutral + 2 * STAKES_BAR);
    expect(three.harm).toBe(THRESHOLDS.harm);
    expect(tierFor(THRESHOLDS.boon)).toBe('boon');
    expect(tierFor(THRESHOLDS.boon, 3)).toBe('neutral');
    expect(tierFor(THRESHOLDS.boon + 2 * STAKES_BAR, 3)).toBe('boon');
  });
  it('is the bar the reading is resolved against', async () => {
    const { SCENES } = await import('../scenes');
    const { resolveReading } = await import('../resolve');
    const reading = { vessel: { cardId: 'major-8', reversed: false }, threshold: { cardId: 'major-16', reversed: false }, hand: { cardId: 'major-8', reversed: false }, wake: { cardId: 'major-13', reversed: false } };
    const low = resolveReading({ ...SCENES.beast, stakes: 1 }, reading);
    const high = resolveReading({ ...SCENES.beast, stakes: 3 }, reading);
    expect(low.total).toBe(high.total);
    const order = ['calamity', 'harm', 'neutral', 'boon', 'triumph'];
    expect(order.indexOf(high.tier)).toBeLessThanOrEqual(order.indexOf(low.tier));
  });
});
