import { describe, expect, it } from 'vitest';
import { readingSoFar, reckon, reckoningText, resolveReading, tallyText } from '../resolve';
import { SCENES, SLOT_POSITION } from '../scenes';

describe('the reckoning', () => {
  const scene = SCENES.crossing;
  const reading = { vessel: { cardId: 'major-0', reversed: false }, threshold: { cardId: 'major-16', reversed: true }, hand: { cardId: 'wands-1', reversed: false }, wake: { cardId: 'cups-10', reversed: false } };
  it('names what each seat wanted and what the card brought, with the seat score', () => {
    const res = resolveReading(scene, reading);
    const r = reckon(scene, res);
    expect(r).toHaveLength(4);
    for (let i = 0; i < 4; i++) {
      expect(r[i].score).toBe(res.slots[i].score);
      for (const t of r[i].met) expect(scene.affinity[r[i].slot][t]).toBeGreaterThan(0);
      for (const t of r[i].against) expect(scene.affinity[r[i].slot][t]).toBeLessThan(0);
      const text = reckoningText(r[i], res.slots[i].card.name);
      expect(text).toContain(res.slots[i].card.name);
      expect(text.endsWith('.')).toBe(true);
    }
    // Each position tells it in its own terms.
    const texts = r.map((x, i) => reckoningText(x, res.slots[i].card.name));
    expect(texts[0].startsWith('The situation called for')).toBe(true);
    expect(texts[1].startsWith('What stood in the way')).toBe(true);
    expect(texts[2].startsWith('What you might have missed')).toBe(true);
    expect(texts[3].startsWith('The best course was')).toBe(true);
    for (let i = 0; i < 4; i++) expect(/It (served you|cost you|changed little)\.$/.test(texts[i])).toBe(true);
    expect(r[1].reversed).toBe(true);
    expect(reckoningText(r[1], 'The Tower')).toContain('lay reversed');
  });
  it('tallies seats and named readings to the total and tier', () => {
    const res = resolveReading(scene, reading);
    const t = tallyText(res);
    expect(t).toContain('in all');
    expect(t).toContain(res.tier);
    expect(t).not.toContain('the bar sits higher');
    const high = resolveReading({ ...scene, stakes: 3 }, reading);
    expect(high.stakes).toBe(3);
    expect(tallyText(high)).toContain('At stakes 3 the bar sits higher: neutral above 2.5, boon from 5, triumph from 8.');
  });
  it('numbers the seats as a mini cross', () => {
    expect(SLOT_POSITION.vessel.n).toBe(1);
    expect(SLOT_POSITION.threshold.n).toBe(2);
    expect(SLOT_POSITION.wake.n).toBe(3);
    expect(SLOT_POSITION.hand.n).toBe(4);
    for (const p of Object.values(SLOT_POSITION)) expect(p.question.endsWith('?')).toBe(true);
  });
});

describe('the reading so far', () => {
  const scene = SCENES.crossing;
  const cards = [{ slot: 'vessel' as const, drawn: { cardId: 'major-0', reversed: false } }, { slot: 'threshold' as const, drawn: { cardId: 'major-16', reversed: true } }, { slot: 'wake' as const, drawn: { cardId: 'cups-10', reversed: false } }, { slot: 'hand' as const, drawn: { cardId: 'wands-1', reversed: false } }];
  it('scores each placed seat at once, and the running total matches the final fit', () => {
    const none = readingSoFar(scene, []);
    expect(none.placed).toBe(0);
    expect(none.total).toBe(0);
    expect(none.tier).toBe('harm'); // nothing brought reads as harm: a scene demands something
    const two = readingSoFar(scene, cards.slice(0, 2));
    expect(two.placed).toBe(2);
    expect(two.seats[1].reckoning.reversed).toBe(true);
    expect(two.seats[1].omen).toBe(two.seats[1].card.omen.reversed);
    const all = readingSoFar(scene, cards);
    const full = resolveReading(scene, { vessel: cards[0].drawn, threshold: cards[1].drawn, wake: cards[2].drawn, hand: cards[3].drawn });
    const fit = full.slots.reduce((a, s) => a + s.score, 0);
    expect(all.total).toBeCloseTo(fit);
    for (let i = 0; i < 4; i++) expect(all.seats[i].score).toBe(full.slots[i].score);
  });
});

describe('the ask', () => {
  it('names what a seat wants and fears, strongest first, before any card lands', async () => {
    const { askText, seatAsk, tagFit } = await import('../resolve');
    const scene = SCENES.beast;
    const hand = seatAsk(scene, 'hand');
    expect(hand.wanted[0]).toBe('power');
    expect(hand.feared[0]).toBe('chaos');
    expect(askText(hand).startsWith('The best course is power')).toBe(true);
    expect(askText(hand)).toContain('and the worst chaos');
    expect(askText(seatAsk(scene, 'vessel')).startsWith('The situation calls for')).toBe(true);
    expect(askText(seatAsk(scene, 'threshold')).startsWith('What stands in the way answers to')).toBe(true);
    expect(askText(seatAsk(scene, 'wake')).startsWith('What you might miss here is')).toBe(true);
    expect(tagFit(hand, 'power')).toBe('want');
    expect(tagFit(hand, 'chaos')).toBe('fear');
    expect(tagFit(hand, 'wealth')).toBe('none');
  });
  it('agrees with the reckoning after the card lands', async () => {
    const { seatAsk } = await import('../resolve');
    const reading = { vessel: { cardId: 'major-0', reversed: false }, threshold: { cardId: 'major-16', reversed: true }, hand: { cardId: 'wands-1', reversed: false }, wake: { cardId: 'cups-10', reversed: false } };
    for (const scene of Object.values(SCENES)) {
      const res = resolveReading(scene, reading);
      const r = reckon(scene, res);
      for (const x of r) {
        const ask = seatAsk(scene, x.slot);
        expect(ask.wanted).toEqual(x.wanted);
        expect(ask.feared).toEqual(x.feared);
      }
    }
  });
});

describe('what a whisper says', () => {
  it('names a tag the seat wants first, then one it fears, then the rest, skipping what is already known', async () => {
    const { seatAsk, whisperTags } = await import('../resolve');
    const { cardTags, getCard } = await import('../cards');
    const ask = seatAsk(SCENES.beast, 'hand'); // wants power, patience, love, conflict; fears chaos
    // Strength upright: power, patience, love, fire.
    expect(whisperTags('major-8', false, ask, [])).toEqual(['power']);
    expect(whisperTags('major-8', false, ask, ['power'])).toEqual(['patience']);
    expect(whisperTags('major-8', false, ask, [], 2)).toEqual(['power', 'patience']);
    // The Fool upright: beginning, freedom, chaos, hope. Nothing wanted here, so the feared tag comes first.
    expect(whisperTags('major-0', false, ask, [])).toEqual(['chaos']);
    const all = cardTags(getCard('major-0'), false);
    expect(whisperTags('major-0', false, ask, all)).toEqual([]);
  });
});
