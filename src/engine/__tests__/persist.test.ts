import { describe, expect, it } from 'vitest';
import { pruneUnknown, emptyKnowledge, type Knowledge } from '../knowledge';
import { chooseCandidate, chooseNode, startRun } from '../run';
import { runLooksValid } from '../../persist';

describe('run state is a plain value', () => {
  it('survives a JSON round trip and keeps working', () => {
    let run = chooseNode(startRun(21), 0);
    run = chooseCandidate(run, 1);
    const copy = JSON.parse(JSON.stringify(run)) as typeof run;
    expect(copy).toEqual(run);
    expect(chooseCandidate(copy, 0)).toEqual(chooseCandidate(run, 0));
  });
});

describe('save hardening', () => {
  it('accepts a real run and rejects unknown cards or scenes', () => {
    const run = chooseNode(startRun(5), 0);
    expect(runLooksValid(run)).toBe(true);
    expect(runLooksValid({ ...run, deck: { ...run.deck, draw: [...run.deck.draw, 'major-99'] } })).toBe(false);
    expect(runLooksValid({ ...run, map: [[{ ...run.map[0][0], sceneId: 'nowhere' }]] })).toBe(false);
    expect(runLooksValid({ ...run, map: [] })).toBe(false);
  });

  it('prunes unknown cards from the Codex', () => {
    const k = { ...emptyKnowledge(), cards: { 'major-0': { tier: 1 as const, resolved: 3, seats: {} }, 'gone-1': { tier: 2 as const, resolved: 1, seats: {} } }, links: { 'gone-1|major-0': 1, 'cups-1|major-0': 2 }, dealt: { 'gone-1': true as const, 'cups-1': true as const } };
    const p = pruneUnknown(k, new Set(['major-0', 'cups-1']));
    expect(Object.keys(p.cards)).toEqual(['major-0']);
    expect(p.links).toEqual({ 'cups-1|major-0': 2 });
    expect(p.dealt).toEqual({ 'cups-1': true });
    expect(pruneUnknown(k, null)).toBe(k);
  });
});

describe('codex round trip', () => {
  it('carries signature, vows and the omen log through export and import, pruning what the deck lacks', async () => {
    const { emptyKnowledge, exportKnowledge, importKnowledge, setKnownCards, noteVow } = await import('../knowledge');
    setKnownCards(['major-0', 'cups-2']);
    let k: Knowledge = { ...emptyKnowledge(), cards: { 'major-0': { tier: 3 as const, resolved: 9, seats: {} }, 'ghost-9': { tier: 3 as const, resolved: 2, seats: {} } }, signature: 'major-0', omenLog: [{ run: 1, scene: 'crossing', seat: 'hand' as const, cardId: 'major-0', reversed: false, tier: 'boon' }, { run: 1, scene: 'crossing', seat: 'wake' as const, cardId: 'ghost-9', reversed: false, tier: 'boon' }] };
    k = noteVow(k, 'silence', 'kept');
    const back = importKnowledge(exportKnowledge(k));
    expect(back).not.toBeNull();
    expect(back!.signature).toBe('major-0');
    expect(back!.vows).toEqual({ silence: { kept: 1, broken: 0 } });
    expect(back!.omenLog).toHaveLength(1);
    expect(back!.cards['ghost-9']).toBeUndefined();
    // A signature the deck no longer has, or that is no longer mastered, is dropped.
    const ghostSig = importKnowledge(exportKnowledge({ ...k, signature: 'ghost-9' }));
    expect(ghostSig!.signature).toBeUndefined();
    const unmastered = importKnowledge(exportKnowledge({ ...k, cards: { 'major-0': { tier: 2 as const, resolved: 4, seats: {} } } }));
    expect(unmastered!.signature).toBeUndefined();
  });
});
