import { describe, expect, it } from 'vitest';
import { chooseCandidate, chooseNode, holdCandidate, startRun, whisper, type RunState } from '../run';
import { RITES, ritesWalked, SCENES } from '../scenes';
import { resolveReading } from '../resolve';

/** Put a scene with the given rite at the first door. */
function enter(seed: number, sceneId: string, extra: Parameters<typeof startRun>[1] = {}): RunState {
  const run = startRun(seed, { startingClarity: 6, ...extra });
  const map = run.map.map((layer, i) => (i === 0 ? layer.map((n, j) => (j === 0 ? { ...n, sceneId } : n)) : layer));
  return chooseNode({ ...run, map }, 0);
}

describe('rites', () => {
  it('every rite is stated, and the scenes that carry one exist', () => {
    for (const r of Object.values(RITES)) expect(r.text.length).toBeGreaterThan(10);
    const carried = Object.values(SCENES).filter((s) => s.rite).map((s) => s.rite);
    expect(carried.length).toBeGreaterThanOrEqual(7);
    for (const rite of Object.keys(RITES)) expect(carried).toContain(rite);
  });
  it('the Bare Table deals one fewer to every seat', () => {
    let run = enter(2, 'tomb');
    expect(SCENES.tomb.rite).toBe('bare');
    for (let i = 0; i < 3; i++) {
      expect(run.slots[run.activeSlot].candidates.length).toBe(2);
      run = chooseCandidate(run, 0);
    }
    expect(run.slots[3].candidates.length).toBe(2);
  });
  it('Moonlit deals one more to the Wake only', () => {
    let run = enter(3, 'hollow');
    expect(run.slots[0].candidates.length).toBe(3);
    for (let i = 0; i < 2; i++) run = chooseCandidate(run, 0);
    expect(run.slots[2].candidates.length).toBe(4);
    run = chooseCandidate(run, 0);
    expect(run.slots[3].candidates.length).toBe(3);
  });
  it('the Hush allows no whisper', () => {
    const run = enter(4, 'library');
    expect(whisper(run, 0)).toBe(run);
    const plain = enter(4, 'crossing');
    expect(whisper(plain, 0)).not.toBe(plain);
  });
  it('the Tithe takes a drop at the door and lights one Clarity, and never takes the last drop', () => {
    const run = enter(5, 'toll');
    expect(run.vitality).toBe(startRun(5).vitality - 1);
    expect(run.clarity).toBe(7);
    const thin = startRun(6, { startingVitality: 1 });
    const map = thin.map.map((layer, i) => (i === 0 ? layer.map((n, j) => (j === 0 ? { ...n, sceneId: 'toll' } : n)) : layer));
    expect(chooseNode({ ...thin, map }, 0).vitality).toBe(1);
  });
  it('the Ember mends one on a neutral reading', () => {
    let found = false;
    for (let seed = 1; seed < 60 && !found; seed++) {
      let run = enter(seed, 'hearth');
      for (let i = 0; i < 4; i++) run = chooseCandidate(run, 0);
      const entry = run.history[0];
      if (entry.resolution.tier !== 'neutral') continue;
      found = true;
      expect(entry.resolution.deltas.vitality).toBe(1);
      const plain = resolveReading({ ...SCENES.hearth, rite: undefined }, entry.reading);
      expect(plain.tier).toBe('neutral');
      expect(plain.deltas.vitality).toBe(0);
    }
    expect(found).toBe(true);
  });
  it('the Long Look lays every seat bare at once, one more each, with the fog lifted, and walks them in order', () => {
    let run = enter(9, 'abyss', { startingRelics: ['fog'] });
    expect(run.laidBare).toBe(true);
    expect(run.slots.length).toBe(4);
    for (const seat of run.slots) {
      expect(seat.candidates.length).toBe(4);
      expect(seat.candidates.some((c) => c.hidden)).toBe(false);
      expect(seat.chosen).toBeNull();
    }
    const dealtIds = run.slots.flatMap((s) => s.candidates.map((c) => c.cardId));
    expect(new Set(dealtIds).size).toBe(16);
    const before = run.slots[1].candidates.map((c) => c.cardId);
    run = chooseCandidate(run, 0);
    expect(run.activeSlot).toBe(1);
    expect(run.slots[1].candidates.map((c) => c.cardId)).toEqual(before);
    for (let i = 1; i < 4; i++) run = chooseCandidate(run, 0);
    expect(run.phase.kind).not.toBe('reading');
  });
  it('a hold joins the next seat even when it was laid bare', () => {
    let run = enter(10, 'abyss');
    const held = run.slots[0].candidates[1];
    run = holdCandidate(run, 1);
    run = chooseCandidate(run, 0);
    expect(run.slots[1].candidates.length).toBe(5);
    expect(run.slots[1].candidates.at(-1)?.cardId).toBe(held.cardId);
    expect(run.slots[1].candidates.at(-1)?.held).toBe(true);
  });
  it('rites walked are read from the omen log', () => {
    expect(ritesWalked(undefined)).toEqual([]);
    expect(ritesWalked([{ scene: 'crossing' }])).toEqual([]);
    expect(ritesWalked([{ scene: 'mirror' }, { scene: 'toll' }, { scene: 'mirror' }])).toEqual(['mirror', 'tithe']);
  });
  it('the Mirror reads every card the other way up', () => {
    let run = enter(7, 'mirror', { reversedChance: 1 });
    for (let i = 0; i < 4; i++) run = chooseCandidate(run, 0);
    const entry = run.history[0];
    expect(entry.sceneId).toBe('mirror');
    for (const c of Object.values(entry.reading)) expect(c.reversed).toBe(false);
  });
});

describe('the Dark', () => {
  it('lets no lamp burn in its scene, and the lit seats of other scenes are remembered', async () => {
    const { canLamp, lightLamp } = await import('../run');
    expect(SCENES.rest.rite).toBe('dark');
    let run = enter(5, 'rest');
    expect(run.clarity).toBeGreaterThanOrEqual(2);
    expect(canLamp(run)).toBe(false);
    expect(lightLamp(run)).toBe(run);
    let lit = enter(5, 'crossing', { startingClarity: 12 });
    for (let i = 0; i < 4; i++) {
      lit = lightLamp(lit);
      lit = chooseCandidate(lit, 0);
    }
    expect(lit.history[0].lit).toEqual(['vessel', 'threshold', 'wake', 'hand']);
    expect(lit.lamps).toBe(4);
  });
});

describe('the Lit Street', () => {
  it('lights every seat for free, so the lamp shows the hand without a Clarity asked', async () => {
    const { canLamp, lampVerdicts } = await import('../run');
    expect(SCENES.lamps.rite).toBe('lit');
    let run = enter(9, 'lamps', { startingClarity: 0 });
    expect(run.slots[0].lit).toBe(true);
    expect(canLamp(run)).toBe(false);
    expect(lampVerdicts(run).length).toBe(run.slots[0].candidates.length);
    expect(run.clarity).toBe(0);
    for (let i = 0; i < 3; i++) run = chooseCandidate(run, 0);
    expect(run.slots[3].lit).toBe(true);
    expect(run.history.length === 0 || run.history[0].lit?.length === 4).toBe(true);
  });
});
