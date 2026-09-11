import { memo } from 'react';
import { getCard, type Card } from '../../engine';
import { MAJOR_ART } from './majors';
import { minorArt } from './minors';
import { majorMood, minorMood, MOOD_SKY } from './palette';
import { GOLD_FLAT, INK, PALE } from './primitives';

/**
 * Shared gradients, patterns and filters. Rendered ONCE at the app root;
 * every card references them by id, so 12 cards on screen share one defs block.
 */
export function ArtDefs() {
  return (
    <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <linearGradient id="goldFoil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dc8a" />
          <stop offset="0.45" stopColor="#c9a24a" />
          <stop offset="0.7" stopColor="#f0d67a" />
          <stop offset="1" stopColor="#a67c2e" />
        </linearGradient>
        <linearGradient id="skyDeep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1a3f" />
          <stop offset="1" stopColor="#4b3a6b" />
        </linearGradient>
        <linearGradient id="paperMajor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1e5c8" />
          <stop offset="1" stopColor="#d9c08a" />
        </linearGradient>
        <linearGradient id="paperWands" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5e2cc" />
          <stop offset="1" stopColor="#dda87a" />
        </linearGradient>
        <linearGradient id="paperCups" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2ecf2" />
          <stop offset="1" stopColor="#9fbfd6" />
        </linearGradient>
        <linearGradient id="paperSwords" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ecebf0" />
          <stop offset="1" stopColor="#b6b8c8" />
        </linearGradient>
        <linearGradient id="paperPentacles" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8ecd8" />
          <stop offset="1" stopColor="#b3be94" />
        </linearGradient>
        <linearGradient id="artSkyMajor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8d7fb5" />
          <stop offset="1" stopColor="#e9d9b6" />
        </linearGradient>
        <linearGradient id="artSkyWands" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e0a068" />
          <stop offset="1" stopColor="#f6e3c8" />
        </linearGradient>
        <linearGradient id="artSkyCups" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f9dbb" />
          <stop offset="1" stopColor="#dbe9ef" />
        </linearGradient>
        <linearGradient id="artSkySwords" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d80a0" />
          <stop offset="1" stopColor="#e6e6ec" />
        </linearGradient>
        <linearGradient id="artSkyPentacles" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fa072" />
          <stop offset="1" stopColor="#e8ecd8" />
        </linearGradient>
        {/* mood skies: colour as meaning, after the Waite-Smith convention */}
        <linearGradient id="skyJoy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0cf62" />
          <stop offset="1" stopColor="#fbeec6" />
        </linearGradient>
        <linearGradient id="skySpirit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d80bd" />
          <stop offset="1" stopColor="#d3e2f2" />
        </linearGradient>
        <linearGradient id="skyGrey" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d8090" />
          <stop offset="1" stopColor="#d9dadf" />
        </linearGradient>
        <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f0d20" />
          <stop offset="1" stopColor="#3b3159" />
        </linearGradient>
        <linearGradient id="skyDawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8603c" />
          <stop offset="1" stopColor="#f5cf9a" />
        </linearGradient>
        <linearGradient id="skyGrowth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c9c66" />
          <stop offset="1" stopColor="#e6ecd4" />
        </linearGradient>
        <linearGradient id="skyDusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d3f80" />
          <stop offset="1" stopColor="#c9b8dc" />
        </linearGradient>
        <linearGradient id="skyStorm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f4252" />
          <stop offset="1" stopColor="#9a9eae" />
        </linearGradient>
        <pattern id="veil" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.2" fill="#c9a24a" opacity="0.5" />
        </pattern>
        <pattern id="backLattice" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="12" height="12" fill="none" />
          <path d="M0 6 H12 M6 0 V12" stroke="#c9a24a" strokeWidth="0.5" opacity="0.5" />
          <circle cx="6" cy="6" r="1" fill="#c9a24a" opacity="0.6" />
        </pattern>
        <radialGradient id="backGlow" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#4a3f7c" />
          <stop offset="1" stopColor="#151230" />
        </radialGradient>
        <radialGradient id="backGlow-arcana" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#6b5a2a" />
          <stop offset="1" stopColor="#1e1708" />
        </radialGradient>
        <radialGradient id="backGlow-inverted" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#6e2a3a" />
          <stop offset="1" stopColor="#1c0a10" />
        </radialGradient>
        <radialGradient id="backGlow-fogbound" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#3f5a5a" />
          <stop offset="1" stopColor="#0f1a1a" />
        </radialGradient>
        <radialGradient id="backGlow-thin" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#5a1c1c" />
          <stop offset="1" stopColor="#140606" />
        </radialGradient>
        <radialGradient id="backGlow-weekly" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#2f5a4a" />
          <stop offset="1" stopColor="#0a1a14" />
        </radialGradient>
        <radialGradient id="backGlow-night" cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#2b3a6a" />
          <stop offset="1" stopColor="#070a1a" />
        </radialGradient>
        <radialGradient id="backGlow-well" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#1a1a2e" />
          <stop offset="1" stopColor="#020208" />
        </radialGradient>
        <filter id="paper" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.18  0 0 0 0.08 0" />
        </filter>
      </defs>
    </svg>
  );
}

const PAPER: Record<string, string> = { major: 'url(#paperMajor)', wands: 'url(#paperWands)', cups: 'url(#paperCups)', swords: 'url(#paperSwords)', pentacles: 'url(#paperPentacles)' };
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
const RANK = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'P', 'Kn', 'Q', 'K'];

function label(card: Card): string {
  return card.arcana === 'major' ? ROMAN[card.number] : RANK[card.number];
}

/** The full card face: frame, paper, art window, plates. viewBox 100 x 160. */
function CardArtInner({ cardId, className, texture = true }: { cardId: string; className?: string; texture?: boolean }) {
  const card = getCard(cardId);
  const kind = card.arcana === 'major' ? 'major' : card.suit!;
  const art = card.arcana === 'major' ? MAJOR_ART[card.number]() : minorArt(card.suit!, card.number);
  const titleSize = card.name.length > 16 ? 6.2 : 7;
  return (
    <svg viewBox="0 0 100 160" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x={0} y={0} width={100} height={160} rx={6} fill={PAPER[kind]} />
      {texture && <rect x={0} y={0} width={100} height={160} rx={6} filter="url(#paper)" />}
      {/* frame */}
      <rect x={3} y={3} width={94} height={154} rx={4} fill="none" stroke={GOLD_FLAT} strokeWidth={1.2} />
      <rect x={6} y={6} width={88} height={148} rx={3} fill="none" stroke={INK} strokeWidth={0.5} opacity={0.6} />
      {[[9, 9], [91, 9], [9, 151], [91, 151]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0`} fill="none" stroke={GOLD_FLAT} strokeWidth={0.6} />
      ))}
      {/* art window */}
      <clipPath id={`clip-${card.id}`}>
        <rect x={10} y={18} width={80} height={112} rx={2} />
      </clipPath>
      <rect x={10} y={18} width={80} height={112} rx={2} fill={MOOD_SKY[card.arcana === 'major' ? majorMood(card.number) : minorMood(card.suit!, card.number)]} />
      <g clipPath={`url(#clip-${card.id})`}>
        <g transform="translate(10 18)">{art}</g>
      </g>
      <rect x={10} y={18} width={80} height={112} rx={2} fill="none" stroke={INK} strokeWidth={0.8} />
      {/* plates */}
      <text x={50} y={13.5} fontSize={7} textAnchor="middle" fill={INK} fontFamily="Georgia, serif" letterSpacing={0.5}>
        {label(card)}
      </text>
      <rect x={12} y={135} width={76} height={16} rx={2} fill={PALE} stroke={INK} strokeWidth={0.5} opacity={0.9} />
      <text x={50} y={146} fontSize={titleSize} textAnchor="middle" fill={INK} fontFamily="Georgia, serif" fontVariant="small-caps" letterSpacing={0.4}>
        {card.name}
      </text>
    </svg>
  );
}

export type BackVariant = 'standard' | 'arcana' | 'inverted' | 'fogbound' | 'thin' | 'weekly' | 'well' | 'night';

function CardBackInner({ className, variant = 'standard' }: { className?: string; variant?: BackVariant }) {
  const glow = variant === 'standard' ? 'url(#backGlow)' : `url(#backGlow-${variant})`;
  return (
    <svg viewBox="0 0 100 160" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x={0} y={0} width={100} height={160} rx={6} fill={glow} />
      <rect x={4} y={4} width={92} height={152} rx={4} fill="url(#backLattice)" />
      <rect x={4} y={4} width={92} height={152} rx={4} fill="none" stroke={GOLD_FLAT} strokeWidth={1.2} />
      <rect x={8} y={8} width={84} height={144} rx={3} fill="none" stroke={GOLD_FLAT} strokeWidth={0.4} opacity={0.6} />
      <circle cx={50} cy={80} r={26} fill={glow} stroke={GOLD_FLAT} strokeWidth={0.8} />
      <circle cx={50} cy={80} r={22} fill="none" stroke={GOLD_FLAT} strokeWidth={0.4} strokeDasharray="1 2" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <line key={i} x1={50 + Math.cos(a) * 8} y1={80 + Math.sin(a) * 8} x2={50 + Math.cos(a) * 20} y2={80 + Math.sin(a) * 20} stroke={GOLD_FLAT} strokeWidth={i % 2 ? 0.5 : 1} />;
      })}
      <circle cx={50} cy={80} r={7} fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} />
      <circle cx={53} cy={79} r={5.5} fill={glow} />
      {variant === 'inverted' && <path d="M50 30 l4 6 h-8 z M50 130 l-4 -6 h8 z" fill={GOLD_FLAT} opacity={0.8} />}
      {variant === 'arcana' && <text x={50} y={26} fontSize={7} textAnchor="middle" fill={GOLD_FLAT} fontFamily="Georgia, serif" letterSpacing={2}>XXII</text>}
      {variant === 'fogbound' && <path d="M14 140 q8 -4 16 0 t16 0 t16 0 t16 0 t8 0" fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} opacity={0.6} />}
      {variant === 'thin' && <path d="M50 22 q-3 4 0 8 q3 -4 0 -8" fill={GOLD_FLAT} opacity={0.8} />}
      {variant === 'weekly' && <path d="M40 22 h20 M50 18 v8" stroke={GOLD_FLAT} strokeWidth={0.8} opacity={0.7} />}
      {variant === 'night' && (
        <g opacity={0.9}>
          <circle cx={50} cy={26} r={6} fill={GOLD_FLAT} opacity={0.9} />
          <circle cx={53} cy={24.5} r={5.2} fill="url(#backGlow-night)" />
          {[[22, 40], [78, 44], [30, 128], [70, 124]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={0.9} fill={GOLD_FLAT} opacity={0.7} />)}
        </g>
      )}
      {variant === 'well' && (
        <g opacity={0.8}>
          <ellipse cx={50} cy={24} rx={10} ry={3.5} fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} />
          <ellipse cx={50} cy={24} rx={6} ry={2} fill="none" stroke={GOLD_FLAT} strokeWidth={0.5} />
          <ellipse cx={50} cy={136} rx={10} ry={3.5} fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} />
          <ellipse cx={50} cy={136} rx={6} ry={2} fill="none" stroke={GOLD_FLAT} strokeWidth={0.5} />
        </g>
      )}
      <circle cx={50} cy={80} r={1.5} fill={GOLD_FLAT} />
      {[[50, 24], [50, 136], [18, 80], [82, 80]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y - 4} l3 4 l-3 4 l-3 -4 z`} fill={GOLD_FLAT} opacity={0.8} />
      ))}
    </svg>
  );
}

/** Card faces never change for a given id, so never re-render them. */
export const CardArt = memo(CardArtInner);
export const CardBack = memo(CardBackInner);
