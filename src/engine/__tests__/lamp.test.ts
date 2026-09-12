import { describe, expect, it } from 'vitest';
import { canLamp, chooseCandidate, chooseNode, LAMP_COST, lampVerdicts, lightLamp, startRun } from '../run';
import { scoreSlot } from '../resolve';
import { currentScene } from '../run';

describe('the lamp', () => {
  it('lights once per seat for clarity and shows each card\'s verdict in the seat, never its score', () => {
    let run = chooseNode(startRun(4, { startingClarity: 5 }), 0);
    expect(lampVerdicts(run)).toEqual([]);
    expect(canLamp(run)).toBe(true);
    run = lightLamp(run);
    expect(run.clarity).toBe(5 - LAMP_COST);
    expect(run.lamps).toBe(1);
    expect(canLamp(run)).toBe(false);
    expect(lightLamp(run)).toBe(run);
    const v = lampVerdicts(run);
    const slot = run.slots[0];
    expect(v).toHaveLength(slot.candidates.length);
    const scene = currentScene(run);
    slot.candidates.forEach((c, i) => {
      const score = scoreSlot(scene, slot.slot, c, run.marks).score;
      expect(v[i]).toBe(score >= 1 ? 'helped' : score <= -1 ? 'hurt' : 'neither');
    });
    // The next seat is dark again.
    run = chooseCandidate(run, 0);
    expect(run.slots[1].lit).toBeUndefined();
    expect(lampVerdicts(run)).toEqual([]);
    expect(canLamp(run)).toBe(true);
  });

  it('refuses without clarity and leaves hidden cards dark', () => {
    let run = chooseNode(startRun(4, { startingClarity: 1 }), 0);
    expect(canLamp(run)).toBe(false);
    run = { ...run, clarity: 4, slots: [{ ...run.slots[0], candidates: run.slots[0].candidates.map((c, i) => (i === 0 ? { ...c, hidden: true } : c)) }] };
    run = lightLamp(run);
    const v = lampVerdicts(run);
    expect(v[0]).toBeNull();
    expect(v.slice(1).every((x) => x !== null)).toBe(true);
    const allHidden = { ...run, slots: [{ ...run.slots[0], lit: undefined, candidates: run.slots[0].candidates.map((c) => ({ ...c, hidden: true })) }] };
    expect(canLamp(allHidden)).toBe(false);
  });
});
