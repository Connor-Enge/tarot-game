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
  it('has sixteen distinct weathers', () => {
    expect(WEATHERS.length).toBe(16);
    expect(new Set(WEATHERS.map((w) => w.id)).size).toBe(16);
    expect(new Set(WEATHERS.map((w) => w.name)).size).toBe(16);
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

describe('lantern walk and old company', () => {
  it('lantern walk lights every seat; old company doubles what kin lift', async () => {
    const { chooseNode, chooseCandidate } = await import('../run');
    const { getWeather } = await import('../weather');
    let lit = chooseNode(startRun(5, getWeather('lantern-walk').config), 0);
    expect(lit.slots[0].lit).toBe(true);
    lit = chooseCandidate(lit, 0);
    expect(lit.slots[1].lit).toBe(true);
    const { resolveReading } = await import('../resolve');
    const { SCENES } = await import('../scenes');
    const scene = Object.values(SCENES).find((s) => !s.terminal)!;
    const up = (cardId: string) => ({ cardId, reversed: false });
    const reading = { vessel: up('major-0'), threshold: up('cups-2'), wake: up('major-19'), hand: up('wands-5') };
    const half = resolveReading(scene, reading, {}, { kin: ['major-0|major-19'] });
    const full = resolveReading(scene, reading, {}, { kin: ['major-0|major-19'], kinBonus: 1 });
    expect(full.total).toBeCloseTo(half.total + 0.5);
    expect(startRun(5, getWeather('old-company').config).mods.kinBonus).toBe(1);
  });
});
