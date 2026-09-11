import { describe, expect, it } from 'vitest';
import { dailySeed } from '../rng';
import { startRun } from '../run';
import { dailyCharges, dailyWeather, dayCard, weeklyWeather, WEATHERS } from '../weather';
import { emptyKnowledge } from '../knowledge';

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
  it('never picks a road length', () => {
    for (let i = 0; i < 200; i++) expect(['long', 'short']).not.toContain(weeklyWeather(i * 7919 + 3).id);
  });
  it('has fourteen distinct weathers', () => {
    expect(WEATHERS.length).toBe(14);
    expect(new Set(WEATHERS.map((w) => w.id)).size).toBe(14);
    expect(new Set(WEATHERS.map((w) => w.name)).size).toBe(14);
  });
});

describe('the card of the day', () => {
  it('is stable for a seed and charged in a run that asks for it', () => {
    const { seed } = dailySeed(new Date(Date.UTC(2026, 8, 11)));
    expect(dayCard(seed)).toBe(dayCard(seed));
    const run = startRun(seed, { charged: [dayCard(seed)] });
    expect(run.marks[dayCard(seed)]).toBe('charged');
    expect(Object.keys(startRun(seed).marks)).toHaveLength(0);
  });
});

describe("the week's card", () => {
  it('is charged too once the daily streak reaches seven', () => {
    const label = '2026-09-11';
    const day = 12345;
    const week = 999;
    const fresh = emptyKnowledge();
    expect(dailyCharges(fresh, label, day, week)).toEqual([dayCard(day)]);
    const long = { ...fresh, daily: { last: label, streak: 7, best: 7 } };
    const charges = dailyCharges(long, label, day, week);
    expect(charges[0]).toBe(dayCard(day));
    expect(charges).toContain(dayCard(week));
    const stale = { ...fresh, daily: { last: '2026-09-01', streak: 9, best: 9 } };
    expect(dailyCharges(stale, label, day, week)).toEqual([dayCard(day)]);
  });
});
