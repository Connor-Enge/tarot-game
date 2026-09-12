import { describe, expect, it } from 'vitest';
import { RESOLVES_TO_GLIMPSE, emptyKnowledge, loadKnowledge, noteAscension, noteDeath, noteResolved, saveKnowledge, tierOf } from '../knowledge';

describe('knowledge', () => {
  it('glimpses a card after enough resolves', () => {
    let k = emptyKnowledge();
    for (let i = 0; i < RESOLVES_TO_GLIMPSE; i++) k = noteResolved(k, 'major-0', 'hand');
    expect(tierOf(k, 'major-0')).toBe(1);
    expect(k.cards['major-0'].seats.hand).toBe(RESOLVES_TO_GLIMPSE);
  });

  it('death reveals the final spread and names the seats', () => {
    let k = emptyKnowledge();
    k = noteDeath(k, [
      { cardId: 'major-16', reversed: false },
      { cardId: 'major-13', reversed: true },
    ]);
    expect(tierOf(k, 'major-16')).toBe(2);
    expect(tierOf(k, 'major-13')).toBe(3);
    expect(k.seatsNamed).toBe(true);
    expect(k.deaths).toBe(1);
  });

  it('never lowers a tier', () => {
    let k = emptyKnowledge();
    k = noteAscension(k, [{ cardId: 'cups-1' }]);
    k = noteDeath(k, [{ cardId: 'cups-1', reversed: false }]);
    expect(tierOf(k, 'cups-1')).toBe(3);
  });

  it('round-trips through storage', () => {
    const mem = new Map<string, string>();
    const storage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
    const k = noteDeath(emptyKnowledge(), [{ cardId: 'major-1', reversed: false }]);
    saveKnowledge(k, storage);
    expect(loadKnowledge(storage)).toEqual(k);
    expect(loadKnowledge({ getItem: () => 'garbage' })).toEqual(emptyKnowledge());
  });
});

describe('whisper', () => {
  it('counts toward glimpsing', async () => {
    const { noteWhisper } = await import('../knowledge');
    let k = emptyKnowledge();
    for (let i = 0; i < RESOLVES_TO_GLIMPSE; i++) k = noteWhisper(k, 'swords-3');
    expect(tierOf(k, 'swords-3')).toBe(1);
  });
});

describe('witness + combos + reset', () => {
  it('records witnessed orientations and discovered combos', async () => {
    const { noteCombos, witnessed, resetKnowledge } = await import('../knowledge');
    let k = emptyKnowledge();
    k = noteResolved(k, 'major-16', 'threshold', true);
    expect(witnessed(k, 'major-16', true)).toBe(true);
    expect(witnessed(k, 'major-16', false)).toBe(false);
    k = noteCombos(k, ['tower-then-star', 'tower-then-star']);
    expect(k.combos).toEqual(['tower-then-star']);
    const removed: string[] = [];
    expect(resetKnowledge({ removeItem: (key) => void removed.push(key) })).toEqual(emptyKnowledge());
    expect(removed.length).toBe(1);
  });
});

describe('seat outcomes', () => {
  it('tallies good and bad per seat', () => {
    let k = emptyKnowledge();
    k = noteResolved(k, 'cups-2', 'hand', false, 'good');
    k = noteResolved(k, 'cups-2', 'hand', false, 'bad');
    k = noteResolved(k, 'cups-2', 'wake', false, 'even');
    expect(k.cards['cups-2'].seatOutcomes?.hand).toEqual({ good: 1, bad: 1 });
    expect(k.cards['cups-2'].seatOutcomes?.wake).toEqual({ good: 0, bad: 0 });
  });
});

describe('whisperWords', () => {
  it('rotates by seat and respects count', async () => {
    const { whisperWords } = await import('../knowledge');
    const kw = ['a', 'b', 'c'];
    expect(whisperWords(kw, 'vessel')).toEqual(['a']);
    expect(whisperWords(kw, 'hand')).toEqual(['c']);
    expect(whisperWords(kw, 'wake', 2)).toEqual(['a', 'b']);
    expect(whisperWords(['x'], 'threshold', 2)).toEqual(['x']);
  });
});

describe('links', () => {
  it('counts sorted pairs from a reading', async () => {
    const { noteLinks } = await import('../knowledge');
    let k = noteLinks(emptyKnowledge(), ['b', 'a', 'c', 'a']);
    expect(Object.keys(k.links!).sort()).toEqual(['a|b', 'a|c', 'b|c']);
    k = noteLinks(k, ['a', 'b']);
    expect(k.links!['a|b']).toBe(2);
  });
});

describe('omen log', () => {
  it('appends in order with the run number and caps', async () => {
    const { noteOmens, OMEN_LOG_CAP } = await import('../knowledge');
    let k = { ...emptyKnowledge(), runs: 3 };
    k = noteOmens(k, [{ scene: 'crossing', seat: 'hand', cardId: 'major-0', reversed: false, tier: 'boon' }]);
    expect(k.omenLog?.[0]).toEqual({ run: 3, scene: 'crossing', seat: 'hand', cardId: 'major-0', reversed: false, tier: 'boon' });
    for (let i = 0; i < OMEN_LOG_CAP; i++) k = noteOmens(k, [{ scene: 'well', seat: 'wake', cardId: 'cups-1', reversed: true, tier: 'neutral' }]);
    expect(k.omenLog?.length).toBe(OMEN_LOG_CAP);
    expect(k.omenLog?.at(-1)?.cardId).toBe('cups-1');
  });
});

describe('study', () => {
  it('asks where a card was read once the log spans three places', async () => {
    const { placeQuestion, noteOmens } = await import('../knowledge');
    const { createRng } = await import('../rng');
    let k = emptyKnowledge();
    expect(placeQuestion(k, createRng(1), () => 'x')).toBeNull();
    k = noteOmens(k, [
      { scene: 'bridge', seat: 'hand', cardId: 'major-0', reversed: false, tier: 'boon' },
      { scene: 'well', seat: 'hand', cardId: 'major-1', reversed: false, tier: 'harm' },
    ]);
    expect(placeQuestion(k, createRng(1), () => 'x')).toBeNull();
    k = noteOmens(k, [{ scene: 'fire', seat: 'wake', cardId: 'major-2', reversed: true, tier: 'neutral' }]);
    const q = placeQuestion(k, createRng(5), (id, r) => `${id}:${r}`)!;
    expect(q).not.toBeNull();
    expect(q.kind).toBe('place');
    expect(q.choices.length).toBe(3);
    expect(new Set(q.choices).size).toBe(3);
    expect(q.scenes.length).toBe(1);
    expect(q.choices).toContain(q.scenes[0]);
    expect(q.omen).toBe(`${q.cardId}:${q.reversed}`);
    // The filter narrows the card asked about, never the places offered.
    const cups = placeQuestion(k, createRng(5), () => 'x', (id) => id === 'major-2');
    expect(cups?.cardId).toBe('major-2');
    expect(placeQuestion(k, createRng(5), () => 'x', (id) => id.startsWith('cups-'))).toBeNull();
  });
  it('builds a question only from witnessed cards and counts results', async () => {
    const { studyQuestion, noteStudyResult } = await import('../knowledge');
    const { createRng } = await import('../rng');
    let k = emptyKnowledge();
    expect(studyQuestion(k, createRng(1), () => 'x')).toBeNull();
    k = noteResolved(k, 'major-0', 'hand', false);
    k = noteResolved(k, 'major-1', 'hand', true);
    k = noteResolved(k, 'major-2', 'wake', false);
    const q = studyQuestion(k, createRng(2), (id, r) => `${id}:${r}`)!;
    expect(q).not.toBeNull();
    expect(q.choices.length).toBe(3);
    expect(q.choices).toContain(q.answer);
    expect(q.omen).toBe(`${q.answer}:${q.reversed}`);
    k = noteStudyResult(k, true, 1);
    k = noteStudyResult(k, false, 0);
    expect(k.study).toEqual({ correct: 1, asked: 2, bestStreak: 1 });
  });
});

describe('transfer', () => {
  it('round-trips through export/import and rejects junk', async () => {
    const { exportKnowledge, importKnowledge } = await import('../knowledge');
    let k = noteResolved(emptyKnowledge(), 'major-13', 'wake', true);
    k = { ...k, runs: 4, deaths: 2 };
    const text = exportKnowledge(k);
    expect(text.startsWith('ARCANA1.')).toBe(true);
    expect(importKnowledge(text)).toEqual(k);
    expect(importKnowledge('hello')).toBeNull();
    expect(importKnowledge('ARCANA1.!!!')).toBeNull();
  });
});

describe('dealt + parseShare', () => {
  it('remembers dealt cards and parses share texts', async () => {
    const { noteDealt, parseShare } = await import('../knowledge');
    let k = noteDealt(emptyKnowledge(), ['major-0', 'cups-2']);
    expect(k.dealt).toEqual({ 'major-0': true, 'cups-2': true });
    expect(noteDealt(k, ['major-0'])).toBe(k);
    const names = [{ id: 'standard', name: 'The Descent' }, { id: 'arcana', name: 'Arcana Only' }];
    expect(parseShare('Arcana Descent · Arcana Only · Depth 2 · seed 1k2j\\nDied at scene 4', names)).toEqual({ seed: parseInt('1k2j', 36), descent: 'arcana', depth: 2 });
    expect(parseShare('c', names)).toEqual({ seed: 12 });
    expect(parseShare('hello world', names)).toBeNull();
    expect(parseShare('', names)).toBeNull();
  });
});

describe('resetRecords', () => {
  it('keeps cards, links and the book; clears the road', async () => {
    const { resetRecords, noteLinks, noteRecord, noteSigils } = await import('../knowledge');
    let k = noteResolved(emptyKnowledge(), 'major-1', 'hand', false, 'good');
    k = noteLinks(k, ['major-1', 'cups-2']);
    k = noteRecord(k, 'standard', 4, true);
    k = noteSigils(k, ['first-return']);
    k = { ...k, runs: 3, deaths: 1, ascensions: 1 };
    const r = resetRecords(k);
    expect(r.cards['major-1']).toEqual(k.cards['major-1']);
    expect(r.links).toEqual(k.links);
    expect(r.records).toBeUndefined();
    expect(r.sigils).toBeUndefined();
    expect(r.runs).toBe(0);
    expect(r.ascensions).toBe(0);
  });
});

describe('noteRecord', () => {
  it('keeps the road taken alongside the finest spread', async () => {
    const { noteRecord } = await import('../knowledge');
    const spread = { cards: [{ cardId: 'major-0', reversed: false }], good: 2, road: '⛩✧⚔' };
    let k = noteRecord(emptyKnowledge(), 'standard', 3, false, 0, spread);
    expect(k.records?.standard.best?.road).toBe('⛩✧⚔');
    // A shallower death does not replace it; a return does, road and all.
    k = noteRecord(k, 'standard', 2, false, 0, { ...spread, good: 0, road: '⚔' });
    expect(k.records?.standard.best?.road).toBe('⛩✧⚔');
    k = noteRecord(k, 'standard', 9, true, 0, { ...spread, road: '⛩✧⚔♨⚔✧⛩♨◉' });
    expect(k.records?.standard.best?.road).toBe('⛩✧⚔♨⚔✧⛩♨◉');
  });
});

describe('daily streak', () => {
  it('counts consecutive days and survives a same-day replay', async () => {
    const { noteDaily, dailyStreakAlive } = await import('../knowledge');
    let k = noteDaily(emptyKnowledge(), '2026-09-10');
    k = noteDaily(k, '2026-09-10');
    expect(k.daily?.streak).toBe(1);
    k = noteDaily(k, '2026-09-11');
    expect(k.daily?.streak).toBe(2);
    expect(dailyStreakAlive(k, '2026-09-11')).toBe(2);
    expect(dailyStreakAlive(k, '2026-09-12')).toBe(2);
    expect(dailyStreakAlive(k, '2026-09-13')).toBe(0);
    k = noteDaily(k, '2026-09-14');
    expect(k.daily).toEqual({ last: '2026-09-14', streak: 1, best: 2 });
  });
});

describe('study filter', () => {
  it('draws only from the filtered pool', async () => {
    const { studyQuestion } = await import('../knowledge');
    const { createRng } = await import('../rng');
    let k = emptyKnowledge();
    for (const id of ['major-0', 'major-1', 'major-2', 'cups-1', 'cups-2', 'cups-3']) k = noteResolved(k, id, 'hand', false);
    const q = studyQuestion(k, createRng(3), () => 'x', (id) => id.startsWith('cups-'))!;
    expect(q.choices.every((id) => id.startsWith('cups-'))).toBe(true);
    expect(studyQuestion(k, createRng(3), () => 'x', (id) => id.startsWith('swords-'))).toBeNull();
  });
});

describe('almanac', () => {
  it('keeps the best of a day and lays out a month', async () => {
    const { emptyKnowledge, noteAlmanac, monthLabels, weekdayOf, resetRecords } = await import('../knowledge');
    let k = emptyKnowledge();
    k = noteAlmanac(k, '2026-09-11', { depth: 4, returned: false, good: 1 });
    k = noteAlmanac(k, '2026-09-11', { depth: 3, returned: false, good: 1 });
    expect(k.almanac?.['2026-09-11'].depth).toBe(4);
    k = noteAlmanac(k, '2026-09-11', { depth: 2, returned: true, good: 1 });
    expect(k.almanac?.['2026-09-11'].returned).toBe(true);
    k = noteAlmanac(k, '2026-09-11', { depth: 9, returned: false, good: 1 });
    expect(k.almanac?.['2026-09-11'].returned).toBe(true);
    expect(monthLabels('2026-09')).toHaveLength(30);
    expect(monthLabels('2026-02')).toHaveLength(28);
    expect(monthLabels('2028-02')).toHaveLength(29);
    expect(weekdayOf('2026-09-11')).toBe(4); // a Friday
    expect(weekdayOf('2026-09-14')).toBe(0); // a Monday
    expect(resetRecords(k).almanac).toBeUndefined();
  });
});

describe('keepsake', () => {
  it('is set by Study and spent by the run that takes it', async () => {
    const { noteKeepsake, takeKeepsake, resetRecords } = await import('../knowledge');
    let k = emptyKnowledge();
    expect(takeKeepsake(k)).toEqual({ knowledge: k });
    k = noteKeepsake(k, 'major-7');
    const taken = takeKeepsake(k);
    expect(taken.keepsake).toBe('major-7');
    expect(taken.knowledge.keepsake).toBeUndefined();
    expect(resetRecords(noteKeepsake(emptyKnowledge(), 'cups-2')).keepsake).toBeUndefined();
  });
});

describe('best seat', () => {
  it('names the position a card has come out ahead in, over at least two reads', async () => {
    const { bestSeat } = await import('../knowledge');
    expect(bestSeat(undefined)).toBeNull();
    const e = { tier: 1 as const, resolved: 5, seats: { hand: 3, wake: 2 }, seatOutcomes: { hand: { good: 1, bad: 2 }, wake: { good: 2, bad: 0 } } };
    expect(bestSeat(e)?.seat).toBe('wake');
    const one = { tier: 1 as const, resolved: 1, seats: { hand: 1 }, seatOutcomes: { hand: { good: 1, bad: 0 } } };
    expect(bestSeat(one)).toBeNull();
    const bad = { tier: 1 as const, resolved: 4, seats: { hand: 4 }, seatOutcomes: { hand: { good: 1, bad: 3 } } };
    expect(bestSeat(bad)).toBeNull();
  });
});

describe('the last reading remembers its scene', () => {
  it('keeps the scene id when given, so the title can lay it on the Table', async () => {
    const { emptyKnowledge, noteLast } = await import('../knowledge');
    const k = noteLast(emptyKnowledge(), [{ cardId: 'major-0', reversed: false }], 'It held.', true, 1, 'boon', 'crossing');
    expect(k.last?.scene).toBe('crossing');
    expect(noteLast(emptyKnowledge(), [], 'x', false).last?.scene).toBeUndefined();
  });
});

describe('kin', () => {
  it('names a pair once it has been read together three times', async () => {
    const { emptyKnowledge, noteLinks, bondedPairs, BOND_MIN } = await import('../knowledge');
    let k = emptyKnowledge();
    for (let i = 0; i < BOND_MIN - 1; i++) k = noteLinks(k, ['major-0', 'major-19', 'cups-2', 'wands-5']);
    expect(bondedPairs(k)).toEqual([]);
    k = noteLinks(k, ['major-0', 'major-19', 'swords-3', 'pentacles-9']);
    expect(bondedPairs(k)).toEqual(['major-0|major-19']);
  });
});

describe('places read', () => {
  it('gathers visits, best and worst, and the cards laid in each seat', async () => {
    const { emptyKnowledge, placesRead } = await import('../knowledge');
    const k = emptyKnowledge();
    k.omenLog = [
      { run: 1, scene: 'bell', seat: 'vessel', cardId: 'major-0', reversed: false, tier: 'boon' },
      { run: 1, scene: 'bell', seat: 'hand', cardId: 'cups-2', reversed: true, tier: 'boon' },
      { run: 2, scene: 'bell', seat: 'vessel', cardId: 'major-0', reversed: false, tier: 'harm' },
      { run: 2, scene: 'bell', seat: 'hand', cardId: 'wands-5', reversed: false, tier: 'harm' },
      { run: 2, scene: 'crossing', seat: 'wake', cardId: 'major-19', reversed: false, tier: 'triumph' },
    ];
    const places = placesRead(k);
    expect(places.map((p) => p.scene)).toEqual(['bell', 'crossing']);
    const bell = places[0];
    expect(bell.visits).toBe(2);
    expect(bell.best).toBe('boon');
    expect(bell.worst).toBe('harm');
    expect(bell.tiers).toEqual({ boon: 1, harm: 1 });
    expect(bell.seats.vessel).toEqual([{ cardId: 'major-0', reversed: false, tier: 'harm' }]);
    expect(bell.seats.hand.map((c) => c.cardId)).toEqual(['cups-2', 'wands-5']);
    expect(places[1].seats.wake[0].tier).toBe('triumph');
  });
});

describe('what a card was seen to bring', () => {
  it('remembers witnessed tags by orientation and never duplicates them', async () => {
    const { broughtTags, noteBrought } = await import('../knowledge');
    let k = emptyKnowledge();
    expect(broughtTags(k, 'major-4', false)).toEqual([]);
    k = noteBrought(k, 'major-4', false, ['order']);
    k = noteBrought(k, 'major-4', false, ['order', 'power']);
    expect(broughtTags(k, 'major-4', false)).toEqual(['order', 'power']);
    expect(broughtTags(k, 'major-4', true)).toEqual([]);
    k = noteBrought(k, 'major-4', true, ['binding']);
    expect(broughtTags(k, 'major-4', true)).toEqual(['binding']);
    const same = noteBrought(k, 'major-4', true, ['binding']);
    expect(same).toBe(k);
    expect(noteBrought(k, 'major-4', false, [])).toBe(k);
  });
});
