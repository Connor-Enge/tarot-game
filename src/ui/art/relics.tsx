import type { ReactElement } from 'react';
import { GOLD_FLAT, PALE } from './primitives';

const RED = '#e08a86';
const DIM = 'rgba(233,228,242,0.35)';

/**
 * Small drawn tokens for the relics, 40 x 40. Boons in gold, curses in a
 * cooler red. Same line weight as the card art so they feel like they were
 * found in the same world.
 */
const ART: Record<string, () => ReactElement> = {
  lens: () => (
    <g>
      <circle cx={20} cy={20} r={12} fill="none" stroke={GOLD_FLAT} strokeWidth={1.4} />
      <circle cx={20} cy={20} r={12} fill={PALE} opacity={0.08} />
      <path d="M12 12 L19 20 L15 27 M19 20 L27 16" fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} opacity={0.8} />
      <path d="M8 34 L14 28" stroke={GOLD_FLAT} strokeWidth={2} strokeLinecap="round" />
    </g>
  ),
  shard: () => (
    <g>
      <path d="M14 6 L30 14 L22 34 Z" fill={PALE} opacity={0.18} stroke={GOLD_FLAT} strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M17 12 L24 26" stroke={PALE} strokeWidth={0.8} opacity={0.7} />
    </g>
  ),
  salt: () => (
    <g>
      <path d="M10 30 Q20 8 30 30 Z" fill="none" stroke={GOLD_FLAT} strokeWidth={1.2} strokeLinejoin="round" />
      {[[16, 26], [20, 20], [24, 26], [20, 27]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.3} fill={PALE} />
      ))}
    </g>
  ),
  coin: () => (
    <g>
      <circle cx={20} cy={20} r={11} fill={GOLD_FLAT} opacity={0.25} stroke={GOLD_FLAT} strokeWidth={1.4} />
      <circle cx={20} cy={20} r={3} fill="none" stroke={GOLD_FLAT} strokeWidth={1.2} />
      <path d="M20 9 v3 M20 28 v3 M9 20 h3 M28 20 h3" stroke={GOLD_FLAT} strokeWidth={0.8} />
    </g>
  ),
  bell: () => (
    <g>
      <path d="M12 26 C12 14 14 10 20 8 C26 10 28 14 28 26 Z" fill={GOLD_FLAT} opacity={0.25} stroke={GOLD_FLAT} strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M10 26 H30" stroke={GOLD_FLAT} strokeWidth={1.3} strokeLinecap="round" />
      <circle cx={20} cy={30} r={2} fill={GOLD_FLAT} />
      <circle cx={20} cy={7} r={1.4} fill={GOLD_FLAT} />
    </g>
  ),
  candle: () => (
    <g>
      <rect x={17} y={16} width={6} height={16} rx={1} fill={PALE} opacity={0.9} />
      <path d="M20 15 C17 11 18 8 20 6 C22 8 23 11 20 15 Z" fill={GOLD_FLAT} />
      <path d="M20 13 C19 11 19.5 9.5 20 8.5 C20.5 9.5 21 11 20 13 Z" fill={PALE} />
      <path d="M14 33 H26" stroke={GOLD_FLAT} strokeWidth={1.2} strokeLinecap="round" />
    </g>
  ),
  ring: () => (
    <g>
      <circle cx={20} cy={21} r={9} fill="none" stroke={DIM} strokeWidth={3.5} />
      <circle cx={20} cy={21} r={9} fill="none" stroke={GOLD_FLAT} strokeWidth={1} />
      <circle cx={20} cy={11} r={2.2} fill={GOLD_FLAT} />
    </g>
  ),
  bread: () => (
    <g>
      <path d="M9 24 C9 16 14 13 20 13 C26 13 31 16 31 24 Q20 30 9 24 Z" fill={GOLD_FLAT} opacity={0.3} stroke={GOLD_FLAT} strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M14 17 L17 21 M19 15 L22 20 M25 16 L27 20" stroke={GOLD_FLAT} strokeWidth={0.9} strokeLinecap="round" />
    </g>
  ),
  thread: () => (
    <g>
      <path d="M8 24 C14 8 26 8 20 20 C14 32 26 32 32 16" fill="none" stroke="#d6605e" strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={8} cy={24} r={1.6} fill="#d6605e" />
      <circle cx={32} cy={16} r={1.6} fill="#d6605e" />
    </g>
  ),
  compass: () => (
    <g>
      <circle cx={20} cy={20} r={12} fill="none" stroke={GOLD_FLAT} strokeWidth={1.2} />
      <path d="M20 10 L23 20 L20 30 L17 20 Z" fill={GOLD_FLAT} opacity={0.85} transform="rotate(28 20 20)" />
      <path d="M10 20 L20 17 L30 20 L20 23 Z" fill={PALE} opacity={0.5} transform="rotate(28 20 20)" />
      <circle cx={20} cy={20} r={1.5} fill={PALE} />
    </g>
  ),
  lodestone: () => (
    <g>
      <path d="M14 10 V22 a6 6 0 0 0 12 0 V10" fill="none" stroke={GOLD_FLAT} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M12 10 H17 M23 10 H28" stroke={PALE} strokeWidth={1.4} strokeLinecap="round" />
      {[[20, 33], [16, 35], [24, 35]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1} fill={GOLD_FLAT} opacity={0.7 - i * 0.2} />
      ))}
      <path d="M20 28 v3" stroke={GOLD_FLAT} strokeWidth={0.8} opacity={0.6} />
    </g>
  ),
  feather: () => (
    <g>
      <path d="M12 30 Q14 14 28 8" fill="none" stroke={GOLD_FLAT} strokeWidth={1.2} strokeLinecap="round" />
      <path d="M13 26 Q22 24 27 9 Q18 12 13 26 Z" fill={GOLD_FLAT} opacity={0.35} />
      {[[15, 22], [17, 18], [20, 15], [23, 12]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l5 -1.5`} stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.6} />
      ))}
      <path d="M12 30 l-2 3" stroke={DIM} strokeWidth={1} strokeLinecap="round" />
    </g>
  ),
  stillwater: () => (
    <g>
      <path d="M8 22 Q14 19 20 22 T32 22" fill="none" stroke={RED} strokeWidth={1.3} strokeLinecap="round" />
      <path d="M8 27 Q14 24 20 27 T32 27" fill="none" stroke={RED} strokeWidth={1} strokeLinecap="round" opacity={0.6} />
      <path d="M16 10 a4 4 0 1 0 0.01 0" fill="none" stroke={RED} strokeWidth={1} strokeDasharray="1.5 2" opacity={0.7} />
      <path d="M20 14 v4" stroke={RED} strokeWidth={0.8} opacity={0.5} strokeLinecap="round" />
    </g>
  ),
  tallow: () => (
    <g>
      <path d="M16 32 V16 H24 V32 Z" fill={RED} opacity={0.35} />
      <path d="M16 16 q2 6 -1 10 q4 -2 5 3 q1 -5 4 -3 q-2 -6 0 -10" fill={RED} opacity={0.5} />
      <path d="M20 16 V11" stroke={RED} strokeWidth={0.9} strokeLinecap="round" />
      <path d="M20 10 q-2 -3 0 -5 q2 2 0 5" fill={DIM} />
      <path d="M12 33 H28" stroke={RED} strokeWidth={1} strokeLinecap="round" opacity={0.7} />
    </g>
  ),
  ash: () => (
    <g>
      <path d="M10 30 Q20 24 30 30" fill="none" stroke={RED} strokeWidth={1.3} strokeLinecap="round" />
      {[[14, 22], [20, 17], [26, 22], [18, 12], [23, 26]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.3 - (i % 2) * 0.4} fill={RED} opacity={0.7} />
      ))}
      <path d="M20 8 q-3 4 0 8 q3 -4 0 -8" fill={RED} opacity={0.35} />
    </g>
  ),
  fog: () => (
    <g>
      {[14, 20, 26].map((y, i) => (
        <path key={y} d={`M8 ${y} q6 -4 12 0 t12 0`} fill="none" stroke={RED} strokeWidth={1.2} strokeLinecap="round" opacity={0.9 - i * 0.2} />
      ))}
    </g>
  ),
  splinter: () => (
    <g>
      <path d="M10 30 L18 20 L16 17 L24 12 L22 16 L30 8" fill="none" stroke={RED} strokeWidth={1.4} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M10 30 L13 31" stroke={RED} strokeWidth={1.4} strokeLinecap="round" />
    </g>
  ),
  debt: () => (
    <g>
      <circle cx={20} cy={20} r={11} fill="none" stroke={RED} strokeWidth={1.3} />
      <path d="M13 20 H27" stroke={RED} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M8 32 L32 8" stroke={RED} strokeWidth={0.7} opacity={0.5} />
    </g>
  ),
  weight: () => (
    <g>
      <path d="M12 12 H28 L26 30 H14 Z" fill={RED} opacity={0.18} stroke={RED} strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M17 12 Q20 6 23 12" fill="none" stroke={RED} strokeWidth={1.3} />
      <path d="M18 22 H22" stroke={RED} strokeWidth={1.2} strokeLinecap="round" />
    </g>
  ),
  hush: () => (
    <g>
      <circle cx={20} cy={20} r={11} fill="none" stroke={RED} strokeWidth={1.3} />
      <path d="M12 28 L28 12" stroke={RED} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M16 20 q4 -3 8 0" fill="none" stroke={RED} strokeWidth={0.9} opacity={0.6} />
    </g>
  ),
};

export function RelicArt({ id, className }: { id: string; className?: string }) {
  const Art = ART[id];
  if (!Art) return null;
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <Art />
    </svg>
  );
}

/** Vow tokens: the same hand, drawn in pale ink rather than gold. Sworn things, not found things. */
const VOW_ART: Record<string, () => ReactElement> = {
  'steady-hand': () => (
    <g>
      <rect x={12} y={12} width={16} height={16} rx={2} fill="none" stroke={PALE} strokeWidth={1.3} />
      <path d="M12 28 L8 32 M28 28 L32 32" stroke={PALE} strokeWidth={1} strokeLinecap="round" opacity={0.6} />
      <path d="M16 20 H24" stroke={GOLD_FLAT} strokeWidth={1.2} strokeLinecap="round" />
    </g>
  ),
  silence: () => (
    <g>
      <path d="M12 20 q4 -6 8 0 t8 0" fill="none" stroke={PALE} strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
      <path d="M12 26 q4 -6 8 0 t8 0" fill="none" stroke={PALE} strokeWidth={1.2} strokeLinecap="round" opacity={0.3} />
      <path d="M10 30 L30 10" stroke={GOLD_FLAT} strokeWidth={1.4} strokeLinecap="round" />
    </g>
  ),
  'first-instinct': () => (
    <g>
      <path d="M20 8 L20 26" stroke={PALE} strokeWidth={1.3} strokeLinecap="round" />
      <path d="M14 14 L20 8 L26 14" fill="none" stroke={PALE} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={20} cy={31} r={2} fill={GOLD_FLAT} />
    </g>
  ),
  'small-wake': () => (
    <g>
      <path d="M24 8 A12 12 0 1 0 24 32 A9 9 0 1 1 24 8 Z" fill={PALE} opacity={0.85} />
      <circle cx={28} cy={20} r={1.6} fill={GOLD_FLAT} />
    </g>
  ),
  'long-way': () => (
    <g>
      <path d="M8 32 C14 28 12 20 18 18 C24 16 22 10 32 8" fill="none" stroke={PALE} strokeWidth={1.3} strokeLinecap="round" strokeDasharray="3 3" />
      <circle cx={8} cy={32} r={1.8} fill={GOLD_FLAT} />
      <circle cx={32} cy={8} r={1.8} fill={GOLD_FLAT} />
    </g>
  ),
  'high-threshold': () => (
    <g>
      <path d="M20 8 L31 30 H9 Z" fill="none" stroke={PALE} strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M20 14 L26 26 H14 Z" fill={GOLD_FLAT} opacity={0.5} />
    </g>
  ),
};

VOW_ART.thrift = () => (
  <g>
    <path d="M20 8 L32 20 L20 32 L8 20 Z" fill="none" stroke={PALE} strokeWidth={1.3} strokeLinejoin="round" />
    <path d="M20 14 L26 20 L20 26 L14 20 Z" fill="none" stroke={GOLD_FLAT} strokeWidth={1} strokeLinejoin="round" />
    <path d="M10 30 L30 10" stroke={PALE} strokeWidth={1} strokeLinecap="round" opacity={0.5} />
  </g>
);

export function VowArt({ id, className }: { id: string; className?: string }) {
  const Art = VOW_ART[id];
  if (!Art) return null;
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <Art />
    </svg>
  );
}
