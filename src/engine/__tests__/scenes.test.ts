import { describe, expect, it } from 'vitest';
import { RELICS } from '../relics';
import { SCENES, SLOT_IDS, TIERS } from '../scenes';

describe('scenes', () => {
  const scenes = Object.values(SCENES);

  it('every scene narrates all five tiers with distinct lines', () => {
    for (const s of scenes) {
      const lines = TIERS.map((t) => s.outcomes[t]);
      expect(new Set(lines).size, s.id).toBe(5);
      for (const l of lines) expect(l.length, s.id).toBeGreaterThan(20);
    }
  });

  it('the Vessel, Hand and Wake can each be hurt by a wrong card', () => {
    for (const s of scenes) {
      for (const seat of SLOT_IDS.filter((id) => id !== 'threshold')) {
        const weights = Object.values(s.affinity[seat]) as number[];
        expect(weights.length, `${s.id}/${seat}`).toBeGreaterThanOrEqual(3);
        expect(weights.some((w) => w < 0), `${s.id}/${seat}`).toBe(true);
        for (const w of weights) expect(Math.abs(w), `${s.id}/${seat}`).toBeLessThanOrEqual(s.terminal ? 3 : 2);
      }
    }
  });

  it('prompts and places are unique and relics exist', () => {
    expect(new Set(scenes.map((s) => s.prompt)).size).toBe(scenes.length);
    expect(new Set(scenes.map((s) => s.place)).size).toBe(scenes.length);
    for (const s of scenes) if (s.relic) expect(RELICS[s.relic], s.id).toBeDefined();
    expect(scenes.filter((s) => s.terminal)).toHaveLength(1);
  });
});
