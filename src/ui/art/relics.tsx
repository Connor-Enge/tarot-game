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
  oil: () => (
    <g>
      <path d="M17 8 H23 V12 C27 14 29 18 29 24 C29 30 25 34 20 34 C15 34 11 30 11 24 C11 18 13 14 17 12 Z" fill={PALE} opacity={0.14} stroke={GOLD_FLAT} strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M13 26 C15 24 18 25 20 27 C22 29 25 28 27 26 L27 28 C25 31 23 32 20 32 C17 32 14 30 13 28 Z" fill={GOLD_FLAT} opacity={0.7} />
      <path d="M16 6 H24" stroke={GOLD_FLAT} strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={16} cy={17} r={1.2} fill={PALE} opacity={0.8} />
    </g>
  ),
  wax: () => (
    <g>
      <path d="M20 8 C25 7 30 9 32 14 C34 19 32 25 28 28 C24 31 17 33 12 29 C8 26 7 19 10 14 C12 10 15 9 20 8 Z" fill="#b8423f" opacity={0.85} />
      <path d="M20 8 C25 7 30 9 32 14 C34 19 32 25 28 28 C24 31 17 33 12 29 C8 26 7 19 10 14 C12 10 15 9 20 8 Z" fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} opacity={0.7} />
      <circle cx={20} cy={19} r={6.5} fill="none" stroke={PALE} strokeWidth={1} opacity={0.75} />
      <text x={20} y={21.6} textAnchor="middle" fontSize={7} fill={PALE} fontFamily="Georgia, serif" opacity={0.9}>♪</text>
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
  soot: () => (
    <g>
      <path d="M8 30 C12 24 14 26 17 22 C20 18 24 20 27 16 C30 13 32 15 33 12" fill="none" stroke={DIM} strokeWidth={4} strokeLinecap="round" opacity={0.9} />
      <path d="M8 30 C12 24 14 26 17 22 C20 18 24 20 27 16 C30 13 32 15 33 12" fill="none" stroke="#0b0a12" strokeWidth={2.2} strokeLinecap="round" opacity={0.85} />
      <circle cx={12} cy={14} r={1.6} fill={DIM} opacity={0.7} />
      <circle cx={30} cy={26} r={1.2} fill={DIM} opacity={0.6} />
      <circle cx={22} cy={30} r={0.9} fill={DIM} opacity={0.6} />
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
  unlit: () => (
    <g>
      <path d="M17 8 H23 V12 C27 14 29 18 29 24 C29 30 25 34 20 34 C15 34 11 30 11 24 C11 18 13 14 17 12 Z" fill="none" stroke={PALE} strokeWidth={1.2} strokeLinejoin="round" opacity={0.8} />
      <path d="M16 6 H24" stroke={PALE} strokeWidth={1.4} strokeLinecap="round" opacity={0.8} />
      <path d="M12 30 L28 14" stroke={PALE} strokeWidth={1.3} strokeLinecap="round" opacity={0.85} />
    </g>
  ),
  lamplit: () => (
    <g>
      <path d="M17 12 H23 V15 C27 17 29 21 29 26 C29 31 25 34 20 34 C15 34 11 31 11 26 C11 21 13 17 17 15 Z" fill="none" stroke={PALE} strokeWidth={1.2} strokeLinejoin="round" opacity={0.85} />
      <path d="M16 10 H24" stroke={PALE} strokeWidth={1.4} strokeLinecap="round" opacity={0.85} />
      <path d="M20 22 C18 19 18.5 17 20 15 C21.5 17 22 19 20 22 Z" fill={GOLD_FLAT} />
      {[[6, 12], [34, 12], [20, 4]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={0.9} fill={GOLD_FLAT} opacity={0.8} />)}
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

/**
 * The alcove where relics are found: a niche in dark stone, a low shelf,
 * candlelight pooling on it. Drawn 200 x 80, above the offer.
 */
/**
 * The alcove: a stone niche with a candle, and the offered relics set on
 * the shelf in its light. Pass `lit` to brighten one of them while its
 * card is hovered or focused. The candle flame licks when held alive.
 */
export function AlcoveArt({ className, offer = [], lit = null }: { className?: string; offer?: string[]; lit?: number | null }) {
  const slots = offer.length === 1 ? [100] : offer.length === 2 ? [66, 134] : [56, 100, 144];
  return (
    <svg viewBox="0 0 200 80" className={className} aria-hidden preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="alcoveGlow" cx="50%" cy="70%" r="55%">
          <stop offset="0%" stopColor="#f3dc8a" stopOpacity={0.45} />
          <stop offset="55%" stopColor="#d6b25e" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#d6b25e" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="alcoveStone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1626" />
          <stop offset="1" stopColor="#0c0a14" />
        </linearGradient>
      </defs>
      <path d="M0 80 V30 Q0 0 30 0 H170 Q200 0 200 30 V80 Z" fill="url(#alcoveStone)" />
      {/* mortar lines in the stone */}
      {[[8, 40], [8, 56], [8, 72], [164, 40], [164, 56], [164, 72]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} h26`} stroke={GOLD_FLAT} strokeWidth={0.4} opacity={0.18} />
      ))}
      {[[20, 32], [20, 64], [176, 48]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} v8`} stroke={GOLD_FLAT} strokeWidth={0.4} opacity={0.18} />
      ))}
      {/* the niche, with a keystone */}
      <path d="M40 80 V34 Q40 14 60 14 H140 Q160 14 160 34 V80 Z" fill="#050410" />
      <path d="M40 80 V34 Q40 14 60 14 H140 Q160 14 160 34 V80" fill="none" stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.35} />
      <path d="M95 14 l2 -6 h6 l2 6 z" fill="#1a1626" stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.6} />
      <ellipse cx={100} cy={64} rx={70} ry={26} fill="url(#alcoveGlow)" />
      <path d="M44 64 H156" stroke={GOLD_FLAT} strokeWidth={0.8} opacity={0.7} />
      <path d="M46 66 H154" stroke={GOLD_FLAT} strokeWidth={0.4} opacity={0.35} />
      {/* the offered relics on the shelf */}
      {offer.map((id, i) => {
        const Art = ART[id];
        if (!Art) return null;
        const x = slots[i] ?? 100;
        const on = lit === i;
        return (
          <g key={id} className={`alcove__item ${on ? 'alcove__item--lit' : ''}`} transform={`translate(${x - 13} ${on ? 36 : 38}) scale(0.65)`}>
            <ellipse cx={20} cy={41} rx={13} ry={2.4} fill="#000" opacity={0.5} />
            <Art />
          </g>
        );
      })}
      {/* the candle, at the back */}
      <path d="M98 64 V54 H102 V64 Z" fill={GOLD_FLAT} opacity={0.55} />
      <path d="M100 53 q-2.2 -4 0 -7 q2.2 3 0 7" fill="#f3dc8a" opacity={0.95} className="live-flame" />
      <circle cx={100} cy={50} r={6} fill="#f3dc8a" opacity={0.12} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${52 + i * 6} 14 v-${4 + i * 2}`} stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.25} />
      ))}
    </svg>
  );
}
