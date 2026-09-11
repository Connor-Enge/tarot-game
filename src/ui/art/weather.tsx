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

export function WeatherArt({ id, className }: { id: string; className?: string }) {
  const Art = ART[id];
  if (!Art) return null;
  return (
    <svg viewBox="0 0 150 36" className={className} aria-hidden preserveAspectRatio="xMidYMid meet">
      <Art />
    </svg>
  );
}
