import { describe, expect, it } from 'vitest';
import { resolveReading, tierFor, type Reading } from '../resolve';
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
    expect(tierFor(-3)).toBe('harm');
    expect(tierFor(0)).toBe('neutral');
    expect(tierFor(4)).toBe('boon');
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
