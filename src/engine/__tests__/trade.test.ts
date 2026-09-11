import { describe, expect, it } from 'vitest';
import { acceptTrade, isPeddlerTrade, startRun, type RunState } from '../run';

const resolved = (run: RunState, extra: Partial<Extract<RunState['phase'], { kind: 'resolved' }>>): RunState => ({
  ...run,
  phase: { kind: 'resolved', resolution: { slots: {} as never, comboIds: [], comboNotes: [], total: 0, tier: 'neutral', deltas: { vitality: 0, clarity: 0 }, narration: [] }, ...extra },
});

describe("the Stranger's trade", () => {
  it('clarity for vitality, once', () => {
    let run = resolved({ ...startRun(1), clarity: 3, vitality: 5 }, { trade: { id: 'clarity-for-vitality', give: 2, get: 3 } });
    run = acceptTrade(run);
    expect(run.clarity).toBe(1);
    expect(run.vitality).toBe(8);
    expect(run.traded).toBe(true);
    expect(run.phase.kind === 'resolved' && run.phase.trade).toBeUndefined();
    expect(acceptTrade(run)).toBe(run);
  });
  it('swaps a boon and lifts a curse for blood', () => {
    let run = resolved({ ...startRun(1), relics: ['coin', 'fog'], vitality: 6 }, { trade: { id: 'swap-boon', give: 'coin', get: 'bell' } });
    run = acceptTrade(run);
    expect(run.relics).toEqual(['bell', 'fog']);
    let r2 = resolved({ ...startRun(1), relics: ['fog'], vitality: 6 }, { trade: { id: 'lift-curse', give: 3, curse: 'fog' } });
    r2 = acceptTrade(r2);
    expect(r2.relics).toEqual([]);
    expect(r2.vitality).toBe(3);
    // Refuses to kill you.
    const r3 = resolved({ ...startRun(1), relics: ['fog'], vitality: 3 }, { trade: { id: 'lift-curse', give: 3, curse: 'fog' } });
    expect(acceptTrade(r3)).toBe(r3);
  });
  it("the peddler's prices: blood for clarity, a scar for a boon", () => {
    let run = resolved({ ...startRun(1), vitality: 6, clarity: 1 }, { trade: { id: 'vitality-for-clarity', give: 2, get: 3 } });
    expect(isPeddlerTrade(run.phase.kind === 'resolved' ? run.phase.trade! : (null as never))).toBe(true);
    run = acceptTrade(run);
    expect(run.vitality).toBe(4);
    expect(run.clarity).toBe(4);
    expect(run.tradeTaken).toBe('vitality-for-clarity');
    const thin = resolved({ ...startRun(1), vitality: 2 }, { trade: { id: 'vitality-for-clarity', give: 2, get: 3 } });
    expect(acceptTrade(thin)).toBe(thin);
    let scar = resolved({ ...startRun(1), relics: [] }, { trade: { id: 'scar-for-boon', cardId: 'cups-4', get: 'coin' } });
    scar = acceptTrade(scar);
    expect(scar.relics).toEqual(['coin']);
    expect(scar.marks['cups-4']).toBe('scarred');
    expect(isPeddlerTrade({ id: 'lift-curse', give: 3, curse: 'fog' })).toBe(false);
  });
  it('blesses the card you acted with, for clarity', () => {
    let run = resolved({ ...startRun(1), clarity: 3, marks: {} }, { trade: { id: 'bless-hand', give: 2, cardId: 'major-1' } });
    run = acceptTrade(run);
    expect(run.clarity).toBe(1);
    expect(run.marks['major-1']).toBe('charged');
    expect(run.traded).toBe(true);
    const poor = resolved({ ...startRun(1), clarity: 1 }, { trade: { id: 'bless-hand', give: 2, cardId: 'major-1' } });
    expect(acceptTrade(poor)).toBe(poor);
  });
});
