import type { DrawnCard } from './deck';
import type { HistoryEntry } from './run';
import { CHARGED_BONUS, scoreSlot, type Marks } from './resolve';
import { SLOT_IDS, type Scene, type SlotId } from './scenes';

/**
 * The road not taken: for each seat of a remembered reading, the cards
 * that were in the hand and passed over, scored as they would have been in
 * that seat. Consequence only, never meaning: the player saw these faces in
 * the hand, and now learns what each would have cost or given.
 */
export interface RoadSeat {
  slot: SlotId;
  chosen: { drawn: DrawnCard; score: number };
  passed: { drawn: DrawnCard; score: number; delta: number }[];
  /** The best card in the hand for this seat, if it was not the one played. */
  better: { drawn: DrawnCard; score: number; delta: number } | null;
}

export interface Road {
  seats: RoadSeat[];
  /** What the best card in every seat would have added over what was played. */
  regret: number;
  /** Seats where the played card was already the best in the hand. */
  wellPlayed: number;
}

export function roadNotTaken(scene: Scene, entry: HistoryEntry, marks: Marks = {}, chargedBonus = CHARGED_BONUS): Road | null {
  if (!entry.passed) return null;
  const seats: RoadSeat[] = SLOT_IDS.map((slot) => {
    const drawn = entry.reading[slot];
    const chosenScore = scoreSlot(scene, slot, drawn, marks, chargedBonus).score;
    const passed = (entry.passed![slot] ?? []).map((p) => {
      const score = scoreSlot(scene, slot, p, marks, chargedBonus).score;
      return { drawn: p, score, delta: score - chosenScore };
    });
    const best = passed.reduce<RoadSeat['passed'][number] | null>((a, x) => (a === null || x.delta > a.delta ? x : a), null);
    return { slot, chosen: { drawn, score: chosenScore }, passed, better: best && best.delta > 0 ? best : null };
  });
  const regret = seats.reduce((a, s) => a + (s.better?.delta ?? 0), 0);
  const wellPlayed = seats.filter((s) => s.passed.length > 0 && !s.better).length;
  return { seats, regret, wellPlayed };
}

/** One line on how the hand was played, for the end of a scene. */
export function roadText(road: Road): string {
  if (road.regret === 0) return 'Every seat took the best card the hand held.';
  const n = road.seats.filter((s) => s.better).length;
  const fmt = (x: number) => (x % 1 === 0 ? `${x}` : x.toFixed(1));
  return n === 1 ? `One seat held a better card: +${fmt(road.regret)} left in the hand.` : `${n} seats held a better card: +${fmt(road.regret)} left in the hand.`;
}
