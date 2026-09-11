import { describe, expect, it } from 'vitest';
import { daylight, moonPhase } from '../sky';

describe('sky', () => {
  it('finds the full moon of January 2024 and the new moon two weeks before', () => {
    expect(moonPhase(new Date(Date.UTC(2024, 0, 25, 17, 54)))).toBeCloseTo(0.5, 1);
    const nm = moonPhase(new Date(Date.UTC(2024, 0, 11, 11, 57)));
    expect(Math.min(nm, 1 - nm)).toBeLessThan(0.02);
  });
  it('names the light by local hour', () => {
    const at = (h: number, m = 0) => { const d = new Date(2024, 5, 1); d.setHours(h, m); return d; };
    expect(daylight(at(6))).toBe('dawn');
    expect(daylight(at(12))).toBe('day');
    expect(daylight(at(18, 30))).toBe('dusk');
    expect(daylight(at(23))).toBe('night');
    expect(daylight(at(2))).toBe('night');
  });
});

describe('moon names', () => {
  it('names the eight phases and wraps at the end of the cycle', async () => {
    const { moonName } = await import('../sky');
    expect(moonName(0)).toBe('New Moon');
    expect(moonName(0.5)).toBe('Full Moon');
    expect(moonName(0.25)).toBe('First Quarter');
    expect(moonName(0.99)).toBe('New Moon');
    expect(moonName(0.62)).toBe('Waning Gibbous');
  });
});
