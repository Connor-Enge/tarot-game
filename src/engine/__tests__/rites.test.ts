import { describe, expect, it } from 'vitest';
import { chooseCandidate, chooseNode, startRun, whisper, type RunState } from '../run';
import { RITES, SCENES } from '../scenes';

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
    expect(carried.length).toBeGreaterThanOrEqual(5);
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
    for (let i = 0; i < 3; i++) run = chooseCandidate(run, 0);
    expect(run.slots[3].candidates.length).toBe(4);
  });
  it('the Hush allows no whisper', () => {
    const run = enter(4, 'library');
    expect(whisper(run, 0)).toBe(run);
    const plain = enter(4, 'crossing');
    expect(whisper(plain, 0)).not.toBe(plain);
  });
  it('the Tithe takes a drop at the door, and never the last one', () => {
    const run = enter(5, 'toll');
    expect(run.vitality).toBe(startRun(5).vitality - 1);
    const thin = startRun(6, { startingVitality: 1 });
    const map = thin.map.map((layer, i) => (i === 0 ? layer.map((n, j) => (j === 0 ? { ...n, sceneId: 'toll' } : n)) : layer));
    expect(chooseNode({ ...thin, map }, 0).vitality).toBe(1);
  });
  it('the Mirror reads every card the other way up', () => {
    let run = enter(7, 'mirror', { reversedChance: 1 });
    for (let i = 0; i < 4; i++) run = chooseCandidate(run, 0);
    const entry = run.history[0];
    expect(entry.sceneId).toBe('mirror');
    for (const c of Object.values(entry.reading)) expect(c.reversed).toBe(false);
  });
});
