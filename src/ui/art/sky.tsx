import { moonPhase, type Daylight } from '../../engine';
import { GOLD_FLAT, PALE } from './primitives';

/**
 * Tonight's moon, drawn by phase, or the day's sun. Sits behind the title fan.
 * A phase is drawn as a lit disc with a shadow disc slid across it.
 */
export function TitleSky({ date = new Date(), light }: { date?: Date; light: Daylight }) {
  const phase = moonPhase(date);
  const stars = Array.from({ length: 14 }, (_, i) => ({ x: (i * 53 + 17) % 200, y: (i * 29 + 5) % 44, r: i % 3 === 0 ? 1.1 : 0.7 }));
  if (light === 'day' || light === 'dawn' || light === 'dusk') {
    const low = light !== 'day';
    return (
      <svg className={`sky sky--${light}`} viewBox="0 0 200 70" aria-hidden preserveAspectRatio="xMidYMid slice">
        <circle cx={light === 'dawn' ? 26 : light === 'dusk' ? 174 : 174} cy={low ? 40 : 16} r={low ? 10 : 8} fill={GOLD_FLAT} opacity={low ? 0.8 : 0.55} />
        <circle cx={light === 'dawn' ? 26 : light === 'dusk' ? 174 : 174} cy={low ? 40 : 16} r={low ? 22 : 16} fill={GOLD_FLAT} opacity={0.08} />
      </svg>
    );
  }
  // Moon: lit fraction from phase. Waxing lights the right side, waning the left.
  const r = 9;
  const cx = 174;
  const cy = 16;
  const waxing = phase < 0.5;
  const k = Math.cos(phase * Math.PI * 2); // 1 at new, -1 at full
  const half = waxing ? 1 : -1;
  // Terminator as an ellipse whose x-radius follows the cosine of the phase.
  const rx = Math.abs(k) * r;
  const lit = k < 0; // past quarter: the terminator bulges toward the lit side
  const d = [
    `M${cx} ${cy - r}`,
    `A${r} ${r} 0 0 ${half > 0 ? 1 : 0} ${cx} ${cy + r}`,
    `A${rx} ${r} 0 0 ${(lit ? 1 : 0) ^ (half > 0 ? 0 : 1) ? 1 : 0} ${cx} ${cy - r}`,
    'Z',
  ].join(' ');
  return (
    <svg className="sky sky--night" viewBox="0 0 200 70" aria-hidden preserveAspectRatio="xMidYMid slice">
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={PALE} opacity={0.35 + (i % 4) * 0.12} className="sky__star" style={{ animationDelay: `${(i * 0.7) % 4}s` }} />
      ))}
      <circle cx={cx} cy={cy} r={r + 6} fill={GOLD_FLAT} opacity={0.06} />
      <circle cx={cx} cy={cy} r={r} fill="rgba(233,228,242,0.12)" />
      <path d={d} fill={PALE} opacity={0.92} />
    </svg>
  );
}
