/**
 * The real sky, for the title screen. Nothing here touches the rules.
 * The moon on the title is tonight's moon; the light is the hour's light.
 */

const SYNODIC_MONTH = 29.530588853;
/** A reference new moon: 2000-01-06 18:14 UTC. */
const NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14);

/** Fraction of the lunar cycle, 0 = new, 0.5 = full, wrapping back to 0. */
export function moonPhase(date: Date = new Date()): number {
  const days = (date.getTime() - NEW_MOON_EPOCH) / 86_400_000;
  const f = (days / SYNODIC_MONTH) % 1;
  return f < 0 ? f + 1 : f;
}

export const MOON_NAMES = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'] as const;

/** The common name for a phase fraction: eight names around the cycle. */
export function moonName(phase: number): (typeof MOON_NAMES)[number] {
  return MOON_NAMES[Math.round(phase * 8) % 8];
}

export type Daylight = 'dawn' | 'day' | 'dusk' | 'night';

/** Local hour to a light. Dawn and dusk are short on purpose. */
export function daylight(date: Date = new Date()): Daylight {
  const h = date.getHours() + date.getMinutes() / 60;
  if (h >= 5 && h < 7.5) return 'dawn';
  if (h >= 7.5 && h < 17.5) return 'day';
  if (h >= 17.5 && h < 20) return 'dusk';
  return 'night';
}
