import { describe, expect, it } from 'vitest';
import {
  CANDIDATES_PER_SLOT, advance, chooseCandidate, chooseNode, finalSpread, isOver, readingOf, redrawActive, startRun, whisper,
} from '../run';
import { SLOT_IDS, TOTAL_LAYERS } from '../scenes';

function playScene(run: ReturnType<typeof startRun>, pick = 0) {
  if (run.phase.kind === 'map') run = chooseNode(run, 0);
  for (let i = 0; i < SLOT_IDS.length; i++) run = chooseCandidate(run, pick);
  return run;
}

describe('run', () => {
  it('starts on the map with a layered path ending in the abyss', () => {
    const run = startRun(123);
    expect(run.phase.kind).toBe('map');
    expect(run.map.length).toBe(TOTAL_LAYERS);
    expect(run.map.at(-1)!.length).toBe(1);
    expect(run.map.at(-1)![0].sceneId).toBe('abyss');
    for (const layer of run.map.slice(0, -1)) expect(layer.length).toBeGreaterThanOrEqual(2);
    // no rest scenes in the first layer of the run
    expect(run.map[0].every((n) => n.kind !== 'rest')).toBe(true);
  });

  it('deals three candidates for the first seat after picking a node', () => {
    const run = chooseNode(startRun(123), 1);
    expect(run.node).toBe(1);
    expect(run.slots.length).toBe(1);
    expect(run.slots[0].candidates.length).toBe(CANDIDATES_PER_SLOT);
  });

  it('walks seat by seat and resolves after the fourth choice', () => {
    let run = chooseNode(startRun(123), 0);
    run = chooseCandidate(run, 1);
    expect(run.activeSlot).toBe(1);
    expect(run.slots.length).toBe(2);
    expect(run.deck.discard.length).toBe(2);
    run = chooseCandidate(run, 0);
    run = chooseCandidate(run, 2);
    expect(run.phase.kind).toBe('reading');
    run = chooseCandidate(run, 0);
    expect(['resolved', 'dead']).toContain(run.phase.kind);
    expect(readingOf(run)).not.toBeNull();
    expect(run.history.length).toBe(1);
    expect(run.deck.discard.length).toBe(12);
  });

  it('is deterministic per seed', () => {
    const a = playScene(startRun(99), 2);
    const b = playScene(startRun(99), 2);
    expect(a).toEqual(b);
  });

  it('redraw costs clarity and re-deals the active seat', () => {
    let run = chooseNode(startRun(5), 0);
    const before = run.slots[0].candidates;
    run = redrawActive(run);
    expect(run.clarity).toBe(1);
    expect(run.slots[0].candidates).not.toEqual(before);
    run = redrawActive(run);
    const after = run.slots[0].candidates;
    expect(run.clarity).toBe(0);
    expect(redrawActive(run).slots[0].candidates).toEqual(after);
  });

  it('whisper costs clarity, once per candidate', () => {
    let run = chooseNode(startRun(7), 0);
    run = whisper(run, 1, ['order']);
    expect(run.clarity).toBe(1);
    expect(run.slots[0].whispered).toEqual([1]);
    expect(run.slots[0].whisperedTags?.[1]).toEqual(['order']);
    run = whisper(run, 1);
    expect(run.clarity).toBe(1);
    run = whisper(run, 0);
    expect(run.clarity).toBe(0);
    expect(whisper(run, 2).slots[0].whispered).toEqual([1, 0]);
  });

  it('marks cards after triumph and calamity and honors marks on later deals', () => {
    // brute force a seed that produces a triumph or calamity in the first scene
    let found = false;
    for (let seed = 1; seed < 400 && !found; seed++) {
      const run = playScene(startRun(seed), 0);
      const tier = run.history[0].resolution.tier;
      if (tier === 'triumph' || tier === 'calamity') {
        found = true;
        const mark = tier === 'triumph' ? 'charged' : 'scarred';
        for (const c of finalSpread(run)) expect(run.marks[c.cardId]).toBe(mark);
      }
    }
    expect(found).toBe(true);
  });

  it('advances to the map and ends in death or ascension', () => {
    let run = startRun(2024);
    let guard = 0;
    while (!isOver(run) && guard++ < 30) {
      run = playScene(run, 0);
      if (run.phase.kind === 'resolved') {
        run = advance(run);
        expect(run.phase.kind).toBe('map');
      }
    }
    expect(isOver(run)).toBe(true);
    expect(finalSpread(run).length).toBe(4);
    if (run.phase.kind === 'dead') expect(run.vitality).toBe(0);
    else expect(run.layer).toBe(TOTAL_LAYERS - 1);
  });
});

describe('cut the deck', () => {
  it('rotates the top cards to the bottom, once, only before the first scene', async () => {
    const { canCut, cutDeck } = await import('../run');
    const run = startRun(31);
    expect(canCut(run)).toBe(true);
    const before = run.deck.draw;
    const cut = cutDeck(run, 10);
    expect(cut.cut).toBe(10);
    expect(cut.deck.draw.length).toBe(before.length);
    expect(cut.deck.draw.slice(0, 10)).toEqual(before.slice(-10));
    expect(cut.deck.draw.slice(10)).toEqual(before.slice(0, -10));
    expect(canCut(cut)).toBe(false);
    expect(cutDeck(cut, 5)).toBe(cut);
    expect(canCut(chooseNode(run, 0))).toBe(false);
  });
});

describe('echo', () => {
  it('deals the last Wake into the next Vessel without duplicating it', () => {
    let run = chooseNode({ ...startRun(8), vitality: 99 }, 0);
    for (let i = 0; i < SLOT_IDS.length; i++) run = chooseCandidate(run, 0);
    expect(run.phase.kind).toBe('resolved');
    const wake = run.history[0].reading.wake;
    expect(run.echo?.cardId).toBe(wake.cardId);
    run = advance(run);
    if (run.phase.kind === 'relic') run = { ...run, phase: { kind: 'map' }, layer: run.layer + 1, node: null } as typeof run;
    run = chooseNode(run, 0);
    const vessel = run.slots[0].candidates;
    expect(vessel.length).toBe(4);
    const echoed = vessel.find((c) => c.echo);
    expect(echoed?.cardId).toBe(wake.cardId);
    expect(run.echo).toBeNull();
    // exactly one copy of the card in circulation
    const all = [...run.deck.draw, ...run.deck.discard, ...vessel.map((c) => c.cardId)];
    expect(all.filter((id) => id === wake.cardId).length).toBe(1);
  });
});

describe('weekly config', () => {
  it('builds a longer map and seeds by ISO week', async () => {
    const { WEEKLY_CONFIG } = await import('../descents');
    const { weeklySeed } = await import('../rng');
    const run = startRun(3, WEEKLY_CONFIG);
    expect(run.map.length).toBe(11);
    expect(run.vitality).toBe(12);
    const a = weeklySeed(new Date('2026-09-07T01:00:00Z'));
    const b = weeklySeed(new Date('2026-09-13T23:00:00Z'));
    const c = weeklySeed(new Date('2026-09-14T01:00:00Z'));
    expect(a.seed).toBe(b.seed);
    expect(a.label).toBe('2026-W37');
    expect(a.seed).not.toBe(c.seed);
  });
});

describe('clarity spent per scene', () => {
  it('records redraws and whispers into the history entry', () => {
    let run = chooseNode({ ...startRun(6), clarity: 5 }, 0);
    run = redrawActive(run);
    run = whisper(run, 0);
    for (let i = 0; i < SLOT_IDS.length; i++) run = chooseCandidate(run, 0);
    expect(run.history[0].spent).toEqual({ redraws: 1, whispers: 1 });
  });
});

describe('foretell', () => {
  it('costs clarity once per node and only on the map', async () => {
    const { foretell, FORETELL_COST } = await import('../run');
    let run = startRun(13);
    run = foretell(run, 0);
    expect(run.clarity).toBe(2 - FORETELL_COST);
    expect(run.foretold).toEqual([run.map[0][0].id]);
    expect(foretell(run, 0)).toBe(run);
    run = foretell(run, 1);
    expect(run.clarity).toBe(0);
    expect(foretell(run, 2 % run.map[0].length)).toBe(run);
    expect(foretell(chooseNode(startRun(13), 0), 0).foretold).toEqual([]);
  });
});

describe('take back', () => {
  it('restores the previous seat and re-deals the next seat unchanged, once', async () => {
    const { canTakeBack, takeBack } = await import('../run');
    let run = chooseNode(startRun(17), 0);
    expect(canTakeBack(run)).toBe(false);
    const vesselCandidates = run.slots[0].candidates;
    run = chooseCandidate(run, 1);
    const thresholdCandidates = run.slots[1].candidates;
    const discardBefore = run.deck.discard.length;
    expect(canTakeBack(run)).toBe(true);
    const back = takeBack(run);
    expect(back.activeSlot).toBe(0);
    expect(back.slots.length).toBe(1);
    expect(back.slots[0].chosen).toBeNull();
    expect(back.slots[0].candidates).toEqual(vesselCandidates);
    expect(back.deck.discard.length).toBe(discardBefore - 2);
    expect(back.takeBacks).toBe(0);
    // choose differently; the threshold seat is dealt exactly as before
    const again = chooseCandidate(back, 2);
    expect(again.slots[1].candidates).toEqual(thresholdCandidates);
    expect(again.pendingDeal).toBeNull();
    expect(canTakeBack(again)).toBe(false);
    // total cards in circulation unchanged
    const live = again.slots.flatMap((s) => (s.chosen === null ? s.candidates.map((c) => c.cardId) : [s.candidates[s.chosen].cardId]));
    const all = [...again.deck.draw, ...again.deck.discard, ...live];
    expect(all.length).toBe(78);
    expect(new Set(all).size).toBe(78);
  });
});

describe('the Abyss deals from what you have read', () => {
  it('shuffles the discard onto the top of the deck as you step in', async () => {
    const { chooseNode, startRun } = await import('../run');
    const { SLOT_IDS } = await import('../scenes');
    let run = startRun(21);
    const last = run.map.length - 1;
    const read = run.deck.draw.slice(0, 20);
    run = { ...run, layer: last, deck: { draw: run.deck.draw.slice(20), discard: read } };
    const next = chooseNode(run, 0);
    expect(next.abyssRemade).toBe(true);
    for (const c of next.slots[0].candidates) expect(read).toContain(c.cardId);
    // Too little read: the Abyss deals as any scene does.
    const thin = chooseNode({ ...startRun(21), layer: last, deck: { draw: startRun(21).deck.draw.slice(4), discard: startRun(21).deck.draw.slice(0, 4) } }, 0);
    expect(thin.abyssRemade).toBeUndefined();
    void SLOT_IDS;
  });
});
