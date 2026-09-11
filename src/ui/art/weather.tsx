import type { ReactElement } from 'react';
import { GOLD_FLAT, PALE } from './primitives';

const GROUND = 'rgba(233,228,242,0.10)';
const EDGE = 'rgba(233,228,242,0.45)';
const MIST = 'rgba(233,228,242,0.28)';
const RED = '#e08a86';

/** A small vignette for each daily weather, 150 x 36. Shown on the title beside the day's condition. */
const ART: Record<string, () => ReactElement> = {
  clear: () => (
    <g>
      {[[12, 10], [40, 22], [75, 8], [110, 18], [138, 12], [58, 30], [92, 28]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.9 - (i % 3) * 0.2} fill={PALE} opacity={0.7} />
      ))}
      <path d="M0 34 H150" stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.5} />
    </g>
  ),
  'reversed-winds': () => (
    <g>
      {[10, 30, 50, 70, 90, 110, 130].map((x, i) => (
        <path key={x} d={`M${x} ${4 + (i % 2) * 6} l-8 ${22 - (i % 2) * 6}`} stroke={PALE} strokeWidth={0.7} opacity={0.5} strokeLinecap="round" />
      ))}
      <path d="M0 34 H150" stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.5} />
    </g>
  ),
  'thin-air': () => (
    <g>
      <path d="M0 34 L40 20 L70 30 L110 14 L150 34 Z" fill={GROUND} stroke={EDGE} strokeWidth={0.6} />
      <path d="M110 14 l4 -6 M40 20 l-3 -6" stroke={PALE} strokeWidth={0.5} opacity={0.5} />
      <circle cx={132} cy={9} r={3} fill="none" stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.8} />
    </g>
  ),
  lantern: () => (
    <g>
      <path d="M0 34 H150" stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.5} />
      <path d="M72 6 v4 M68 10 h8 v14 h-8 Z" fill="none" stroke={GOLD_FLAT} strokeWidth={0.9} />
      <ellipse cx={72} cy={17} rx={2} ry={3.5} fill="#f3dc8a" opacity={0.9} />
      <ellipse cx={72} cy={30} rx={30} ry={5} fill="#f3dc8a" opacity={0.12} />
    </g>
  ),
  salted: () => (
    <g>
      <path d="M0 34 Q75 26 150 34 Z" fill={GROUND} stroke={EDGE} strokeWidth={0.5} />
      {[20, 38, 55, 72, 90, 108, 126].map((x, i) => (
        <circle key={x} cx={x} cy={27 - (i % 3) * 2} r={0.8} fill={PALE} opacity={0.8} />
      ))}
    </g>
  ),
  fog: () => (
    <g>
      {[8, 16, 24].map((y, i) => (
        <path key={y} d={`M${10 + i * 12} ${y} q30 -4 60 0 t60 0`} fill="none" stroke={MIST} strokeWidth={4} strokeLinecap="round" opacity={0.7 - i * 0.15} />
      ))}
      <path d="M0 34 H150" stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.4} />
    </g>
  ),
  heavy: () => (
    <g>
      <path d="M0 0 H150 V14 Q110 22 75 14 Q40 6 0 16 Z" fill={GROUND} stroke={EDGE} strokeWidth={0.6} />
      <path d="M0 34 H150" stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.5} />
      <path d="M50 20 v6 M100 22 v6" stroke={PALE} strokeWidth={0.5} opacity={0.4} />
    </g>
  ),
  still: () => (
    <g>
      {[22, 27, 32].map((y, i) => (
        <path key={y} d={`M0 ${y} q10 -2 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t10 0`} fill="none" stroke="#8fc3e0" strokeWidth={0.6} opacity={0.6 - i * 0.15} />
      ))}
      <circle cx={75} cy={9} r={3.5} fill="none" stroke={PALE} strokeWidth={0.6} opacity={0.6} />
    </g>
  ),
  long: () => (
    <g>
      <path d="M0 34 H150" stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.5} />
      <path d="M10 33 Q75 10 140 33" fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} strokeDasharray="3 3" opacity={0.8} />
      <path d="M8 34 L150 4" stroke={PALE} strokeWidth={0.4} opacity={0.3} />
    </g>
  ),
  short: () => (
    <g>
      <path d="M0 34 H150" stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.5} />
      <path d="M50 33 Q75 18 100 33" fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} strokeDasharray="3 3" opacity={0.8} />
    </g>
  ),
  feathered: () => (
    <g>
      <path d="M60 30 Q70 12 92 6" fill="none" stroke={GOLD_FLAT} strokeWidth={0.9} strokeLinecap="round" />
      <path d="M62 26 Q78 22 90 7 Q72 12 62 26 Z" fill={GOLD_FLAT} opacity={0.35} />
      {[20, 40, 110, 130].map((x, i) => (
        <path key={x} d={`M${x} ${20 - (i % 2) * 8} l12 -3`} stroke={PALE} strokeWidth={0.5} opacity={0.4} />
      ))}
    </g>
  ),
  candlelit: () => (
    <g>
      <path d="M0 34 H150" stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.5} />
      <path d="M72 18 h6 v14 h-6 Z" fill={GOLD_FLAT} opacity={0.6} />
      <path d="M75 17 q-2 -4 0 -7 q2 3 0 7" fill="#f3dc8a" />
      <ellipse cx={75} cy={30} rx={28} ry={5} fill="#f3dc8a" opacity={0.12} />
    </g>
  ),
  guttering: () => (
    <g>
      <path d="M0 34 H150" stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.5} />
      <path d="M72 20 h6 v12 h-6 Z" fill={RED} opacity={0.45} />
      <path d="M72 20 q2 5 -1 8 q4 -1 4 4 q1 -5 3 -4 q-2 -5 0 -8" fill={RED} opacity={0.5} />
      <path d="M75 19 q-1.5 -3 0 -5 q1.5 2 0 5" fill={RED} opacity={0.9} />
    </g>
  ),
  'black-tide': () => (
    <g>
      <path d="M0 36 V22 Q20 14 40 22 T80 22 T120 22 T150 22 V36 Z" fill="#05040c" />
      <path d="M0 22 Q20 14 40 22 T80 22 T120 22 T150 22" fill="none" stroke={PALE} strokeWidth={0.5} opacity={0.4} />
      <circle cx={130} cy={8} r={3} fill="none" stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.6} />
    </g>
  ),
};

/** The sky behind each weather: two stops, top to horizon. */
const SKY: Record<string, [string, string]> = {
  clear: ['#0b1030', '#1c2350'],
  'reversed-winds': ['#141a3a', '#2b2a4a'],
  'thin-air': ['#1a2240', '#3a4670'],
  lantern: ['#120c18', '#3a2a1e'],
  salted: ['#10142a', '#2a3050'],
  fog: ['#1c1e2c', '#3a3c4c'],
  heavy: ['#1a1a26', '#2e2c3a'],
  still: ['#0c1a2c', '#1e3a52'],
  long: ['#0e0c1e', '#2a2038'],
  short: ['#141224', '#2c2646'],
  feathered: ['#1a1830', '#3c3560'],
  candlelit: ['#160e10', '#3c2418'],
  guttering: ['#1a0c10', '#3a1418'],
  'black-tide': ['#050410', '#0e0c1e'],
};

/** A moon at the given phase, 0 new through 0.5 full to 1 new again. The shadow disc is clipped to the moon. */
function MoonArt({ x, y, r, phase }: { x: number; y: number; r: number; phase: number }) {
  const lit = 1 - Math.abs(phase - 0.5) * 2; // 0 new, 1 full
  const waxing = phase < 0.5;
  const k = lit * r * 2; // 0: shadow covers the moon; 2r: shadow clear of it
  const clip = `moon-clip-${Math.round(phase * 1000)}`;
  return (
    <g>
      <clipPath id={clip}>
        <circle cx={x} cy={y} r={r} />
      </clipPath>
      <circle cx={x} cy={y} r={r + 3} fill={PALE} opacity={0.05 + lit * 0.1} />
      <circle cx={x} cy={y} r={r} fill={PALE} opacity={0.92} />
      <circle cx={x + (waxing ? -k : k)} cy={y} r={r} fill="#0b1030" opacity={0.94} clipPath={`url(#${clip})`} />
      <circle cx={x} cy={y} r={r} fill="none" stroke={PALE} strokeWidth={0.3} opacity={0.5} />
    </g>
  );
}

/**
 * The day's weather as a small sky: a gradient tinted by the weather, a
 * few stars, tonight's moon at its phase, and the weather's vignette on
 * the ground line. Wide as the title, 150 x 44.
 */
export function WeatherArt({ id, phase, className }: { id: string; phase?: number; className?: string }) {
  const Art = ART[id];
  if (!Art) return null;
  const [top, low] = SKY[id] ?? SKY.clear;
  const gid = `wsky-${id}`;
  return (
    <svg viewBox="0 0 150 44" className={className} aria-hidden preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={low} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={150} height={44} fill={`url(#${gid})`} />
      {[[9, 6], [31, 13], [52, 4], [97, 9], [121, 5], [143, 15], [70, 3]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.55 + (i % 3) * 0.2} fill={PALE} opacity={0.35 + (i % 2) * 0.25} className="live-star" style={{ animationDelay: `${(i * 7) % 5 * -0.6}s` }} />
      ))}
      {phase !== undefined && <MoonArt x={132} y={11} r={4.5} phase={phase} />}
      <g transform="translate(0 8)">
        <Art />
      </g>
      <rect x={0} y={0} width={150} height={44} fill="none" stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.5} />
    </svg>
  );
}
