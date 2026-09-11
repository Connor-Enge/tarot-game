import { describe, expect, it } from 'vitest';
import { dailySeed } from '../rng';
import { startRun } from '../run';
import { dailyWeather, weeklyWeather, WEATHERS } from '../weather';

describe('daily weather', () => {
  it('is stable for a seed and covers the list over a month', () => {
    const seen = new Set<string>();
    for (let d = 1; d <= 31; d++) {
      const { seed } = dailySeed(new Date(Date.UTC(2026, 8, d)));
      expect(dailyWeather(seed)).toBe(dailyWeather(seed));
      seen.add(dailyWeather(seed).id);
    }
    expect(seen.size).toBeGreaterThanOrEqual(5);
  });

  it('every weather starts a playable run', () => {
    for (const w of WEATHERS) {
      const run = startRun(3, w.config);
      expect(run.map.length).toBeGreaterThan(2);
      expect(run.vitality).toBeGreaterThan(0);
      expect(run.deck.draw.length).toBeGreaterThan(20);
    }
  });
});

describe('weekly weather', () => {
  it('never picks the long road', () => {
    for (let i = 0; i < 200; i++) expect(weeklyWeather(i * 7919 + 3).id).not.toBe('long');
  });
});
