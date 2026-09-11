import type { ReactElement } from 'react';
import { Chain, Cloud, Figure, Flame, GOLD_FLAT, INK, Lightning, Moon, Mountains, PALE, Pillar, Star, Sun, Tree, Water } from './primitives';

/**
 * A small vignette per scene, drawn in a 200 x 60 window. Silhouettes on a
 * transparent ground so the scene hue shows through. Same vocabulary as the
 * cards, so the world and the deck look like they belong together.
 */
const DARK = 'rgba(10,8,18,0.85)';
const HAZE = 'rgba(233,228,242,0.16)';

const ART: Record<string, () => ReactElement> = {
  crossing: () => (
    <g>
      <path d="M0 22 L44 30 L52 60 L0 60 Z" fill={DARK} />
      <path d="M200 22 L156 30 L148 60 L200 60 Z" fill={DARK} />
      <path d="M44 30 Q100 44 156 30" fill="none" stroke={GOLD_FLAT} strokeWidth={1.2} />
      <path d="M44 24 Q100 38 156 24" fill="none" stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.7} />
      {[56, 72, 88, 104, 120, 136].map((x) => (
        <line key={x} x1={x} y1={24 + (x - 44) * 0.06 + Math.sin(((x - 44) / 112) * Math.PI) * 9} x2={x} y2={30 + Math.sin(((x - 44) / 112) * Math.PI) * 14} stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.6} />
      ))}
      <ellipse cx={100} cy={58} rx={40} ry={4} fill={HAZE} />
    </g>
  ),
  stranger: () => (
    <g>
      {[70, 86, 102, 118, 134].map((x, i) => (
        <ellipse key={i} cx={x} cy={54} rx={5} ry={2.4} fill={DARK} />
      ))}
      <Flame x={100} y={50} s={7} />
      <Flame x={94} y={52} s={4} />
      <Figure x={140} y={54} h={26} arms="hold" fill={DARK} cloak />
      <circle cx={100} cy={46} r={26} fill={GOLD_FLAT} opacity={0.08} />
    </g>
  ),
  door: () => (
    <g>
      {Array.from({ length: 24 }, (_, i) => (
        <path key={i} d={`M${6 + i * 8} 60 q1 -5 3 -8`} fill="none" stroke={DARK} strokeWidth={1} />
      ))}
      <rect x={88} y={16} width={24} height={40} rx={2} fill={DARK} />
      <path d="M88 20 a12 12 0 0 1 24 0" fill={DARK} />
      <rect x={91} y={20} width={18} height={36} fill={HAZE} />
      <circle cx={105} cy={40} r={1.4} fill={GOLD_FLAT} />
    </g>
  ),
  beast: () => (
    <g>
      <Tree x={30} y={60} h={40} fill={DARK} />
      <Tree x={62} y={60} h={48} fill={DARK} />
      <Tree x={140} y={60} h={46} fill={DARK} />
      <Tree x={172} y={60} h={38} fill={DARK} />
      <circle cx={97} cy={38} r={1.8} fill={GOLD_FLAT} />
      <circle cx={107} cy={38} r={1.8} fill={GOLD_FLAT} />
      <ellipse cx={102} cy={58} rx={34} ry={3} fill={HAZE} />
    </g>
  ),
  well: () => (
    <g>
      <rect x={86} y={34} width={28} height={22} fill={DARK} />
      <ellipse cx={100} cy={34} rx={14} ry={4} fill={INK} />
      <line x1={86} y1={34} x2={86} y2={14} stroke={DARK} strokeWidth={2} />
      <line x1={114} y1={34} x2={114} y2={14} stroke={DARK} strokeWidth={2} />
      <path d="M84 14 h32" stroke={DARK} strokeWidth={2.5} />
      <line x1={100} y1={14} x2={100} y2={30} stroke={GOLD_FLAT} strokeWidth={0.7} />
      {[0, 1, 2].map((i) => (
        <text key={i} x={124 + i * 10} y={26 - i * 6} fontSize={7} fill={GOLD_FLAT} opacity={0.7 - i * 0.2} fontFamily="serif">♪</text>
      ))}
    </g>
  ),
  ruin: () => (
    <g>
      <Mountains y={44} fill={DARK} opacity={0.5} />
      <path d="M84 60 v-34 l6 -4 l4 5 l6 -6 l5 4 l4 -3 v38 z" fill={DARK} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={110 + i * 6} y={44 - i * 6} width={6} height={3} fill={DARK} />
      ))}
      <rect x={92} y={44} width={4} height={6} fill={HAZE} />
    </g>
  ),
  rest: () => (
    <g>
      <path d="M0 60 Q100 -10 200 60 Z" fill={DARK} />
      <path d="M78 60 Q100 30 122 60 Z" fill="#060410" />
      <Star x={30} y={14} r={1.6} points={4} fill={PALE} />
      <Star x={170} y={10} r={1.6} points={4} fill={PALE} />
      <Star x={150} y={22} r={1.2} points={4} fill={PALE} />
    </g>
  ),
  market: () => (
    <g>
      {[20, 60, 100, 140].map((x, i) => (
        <g key={i}>
          <path d={`M${x} 34 l20 -10 l20 10 z`} fill={i % 2 ? GOLD_FLAT : PALE} opacity={0.5} />
          <rect x={x + 2} y={34} width={36} height={22} fill={DARK} />
          <line x1={x + 2} y1={34} x2={x + 2} y2={56} stroke={DARK} strokeWidth={2} />
        </g>
      ))}
    </g>
  ),
  mirror: () => (
    <g>
      <line x1={0} y1={38} x2={200} y2={38} stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.6} />
      <Figure x={100} y={38} h={30} arms="down" fill={DARK} />
      <g transform="scale(1 -1) translate(0 -76)" opacity={0.45}>
        <Figure x={104} y={38} h={30} arms="down" fill={DARK} />
      </g>
      <rect x={0} y={38} width={200} height={22} fill={HAZE} />
    </g>
  ),
  gallows: () => (
    <g>
      <path d="M0 58 h200" stroke={DARK} strokeWidth={3} />
      <rect x={96} y={10} width={5} height={48} fill={DARK} />
      <rect x={96} y={10} width={40} height={4} fill={DARK} />
      <line x1={130} y1={14} x2={130} y2={30} stroke={GOLD_FLAT} strokeWidth={1} />
      <ellipse cx={130} cy={34} rx={4} ry={5} fill="none" stroke={GOLD_FLAT} strokeWidth={1} />
      <path d="M60 58 l-20 -6 M140 58 l20 -6" stroke={DARK} strokeWidth={1.5} />
    </g>
  ),
  procession: () => (
    <g>
      {Array.from({ length: 9 }, (_, i) => (
        <Figure key={i} x={20 + i * 20} y={58} h={22 + (i % 3) * 2} arms="hold" fill={DARK} cloak />
      ))}
      <ellipse cx={100} cy={59} rx={96} ry={2} fill={HAZE} />
    </g>
  ),
  storm: () => (
    <g>
      <Cloud x={20} y={22} w={60} />
      <Cloud x={110} y={18} w={70} />
      <Lightning x={104} y={22} len={28} />
      <path d="M0 56 q50 -6 100 0 t100 0 v4 h-200 z" fill={DARK} />
      {[30, 70, 150].map((x) => (
        <line key={x} x1={x} y1={30} x2={x - 4} y2={44} stroke={PALE} strokeWidth={0.6} opacity={0.5} />
      ))}
    </g>
  ),
  library: () => (
    <g>
      {[14, 30, 46].map((y) => (
        <g key={y}>
          <rect x={20} y={y} width={160} height={2} fill={DARK} />
          {Array.from({ length: 26 }, (_, i) => (
            <rect key={i} x={24 + i * 6} y={y - 9 - (i % 3)} width={4} height={9 + (i % 3)} fill={i % 5 === 0 ? GOLD_FLAT : DARK} opacity={i % 5 === 0 ? 0.7 : 1} />
          ))}
        </g>
      ))}
      <rect x={86} y={50} width={28} height={6} fill={PALE} opacity={0.8} />
    </g>
  ),
  siege: () => (
    <g>
      <rect x={0} y={20} width={200} height={40} fill={DARK} />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={i * 20 + 4} y={14} width={12} height={7} fill={DARK} />
      ))}
      <path d="M86 60 v-22 a14 14 0 0 1 28 0 v22 z" fill="#060410" />
      <path d="M100 30 l-3 8 l4 4 l-2 8" fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} />
      <path d="M92 38 l-2 6 l3 5" fill="none" stroke={GOLD_FLAT} strokeWidth={0.6} />
    </g>
  ),
  shrine: () => (
    <g>
      <rect x={80} y={40} width={40} height={16} fill={DARK} />
      <rect x={76} y={38} width={48} height={3} fill={DARK} />
      {[86, 96, 106, 116].map((x, i) => (
        <g key={x}>
          <rect x={x - 1.2} y={30 - (i % 2) * 3} width={2.4} height={8 + (i % 2) * 3} fill={PALE} />
          <Flame x={x} y={29 - (i % 2) * 3} s={2.2} />
        </g>
      ))}
      <circle cx={100} cy={34} r={24} fill={GOLD_FLAT} opacity={0.08} />
    </g>
  ),
  orchard: () => (
    <g>
      {[24, 58, 92, 126, 160].map((x, i) => (
        <g key={x}>
          <Tree x={x} y={58} h={34 + (i % 2) * 6} fill={DARK} />
          {[0, 1, 2].map((j) => (
            <circle key={j} cx={x - 8 + j * 8} cy={40 + (j % 2) * 6} r={1.8} fill={GOLD_FLAT} opacity={0.85} />
          ))}
          <circle cx={x + 6} cy={57} r={1.6} fill={GOLD_FLAT} opacity={0.6} />
        </g>
      ))}
    </g>
  ),
  toll: () => (
    <g>
      <path d="M0 60 L0 10 L60 30 L70 60 Z" fill={DARK} />
      <path d="M200 60 L200 10 L140 30 L130 60 Z" fill={DARK} />
      <Chain x={70} y={40} len={60} />
      <Figure x={128} y={58} h={26} arms="hold" fill={DARK} cloak />
      <ellipse cx={100} cy={57} rx={5} ry={2} fill={GOLD_FLAT} opacity={0.8} />
    </g>
  ),
  abyss: () => (
    <g>
      <rect x={0} y={0} width={200} height={60} fill="#060410" opacity={0.9} />
      <ellipse cx={100} cy={40} rx={70} ry={16} fill="none" stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.35} />
      <ellipse cx={100} cy={40} rx={40} ry={9} fill="none" stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.5} />
      <ellipse cx={100} cy={40} rx={14} ry={3.5} fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} opacity={0.8} />
      <Moon x={100} y={16} r={5} />
    </g>
  ),
};

/** End-of-run vignettes: the dark closing, or the way back up. */
export function EndArt({ kind, className }: { kind: 'dead' | 'ascended'; className?: string }) {
  return (
    <svg viewBox="0 0 200 90" className={className} aria-hidden preserveAspectRatio="xMidYMid meet">
      {kind === 'dead' ? (
        <g>
          <rect x={0} y={0} width={200} height={90} fill="#060410" opacity={0.9} />
          {['◯', '△', '☐', '☾'].map((g, i) => (
            <text key={g} x={56 + i * 30} y={44 + (i % 2) * 6} fontSize={16} textAnchor="middle" fill={GOLD_FLAT} opacity={0.35 - i * 0.05} fontFamily="serif">{g}</text>
          ))}
          <path d="M0 62 q50 -8 100 0 t100 0 v28 h-200 z" fill="#020108" />
          <rect x={98.5} y={52} width={3} height={12} fill={PALE} />
          <Flame x={100} y={51} s={3} />
          <circle cx={100} cy={52} r={18} fill={GOLD_FLAT} opacity={0.08} />
        </g>
      ) : (
        <g>
          {Array.from({ length: 11 }, (_, i) => {
            const a = (i / 10) * Math.PI;
            return <line key={i} x1={100} y1={90} x2={100 + Math.cos(a) * 140} y2={90 - Math.sin(a) * 140} stroke={GOLD_FLAT} strokeWidth={i % 2 ? 0.6 : 1.2} opacity={0.35} />;
          })}
          <path d="M70 90 v-46 a30 30 0 0 1 60 0 v46 z" fill={PALE} opacity={0.9} />
          <path d="M76 90 v-44 a24 24 0 0 1 48 0 v44 z" fill="#f6efdd" />
          <Figure x={100} y={90} h={40} arms="up" fill={DARK} />
          <Sun x={100} y={18} r={7} rays={12} />
        </g>
      )}
    </svg>
  );
}

export function SceneArt({ id, className }: { id: string; className?: string }) {
  const Art = ART[id];
  if (!Art) return null;
  return (
    <svg viewBox="0 0 200 60" className={className} aria-hidden preserveAspectRatio="xMidYMid meet">
      <Art />
    </svg>
  );
}

// Keep the import list honest for tree-shaking of unused primitives.
void Water;
void Pillar;
