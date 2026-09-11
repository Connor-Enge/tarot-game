import { describe, expect, it } from 'vitest';
import { acceptTrade, startRun, type RunState } from '../run';

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
});
