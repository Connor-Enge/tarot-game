import type { ReactElement } from 'react';
import {
  BLOOD, Chain, Cloud, Cup, Figure, Flame, GOLD, GOLD_FLAT, Ground, Horse, INK, Infinity, Lantern, Lightning, Moon, Mountains, PALE, Pentacle, Pillar, Star, Sun, Sword, Throne, Tree, Wand, Water, Wings,
} from './primitives';

/** One composition per Major Arcana, drawn in the 80 x 112 art window. */
export const MAJOR_ART: Record<number, () => ReactElement> = {
  0: () => (
    <g>
      <Sun x={66} y={16} r={8} />
      <Mountains y={70} opacity={0.3} />
      <path d="M0 78 L34 78 Q40 80 40 88 L40 112 L0 112 Z" fill={INK} />
      <Figure x={28} y={78} h={38} arms="left-up" />
      <line x1={18} y1={44} x2={24} y2={62} stroke={INK} strokeWidth={1.2} />
      <circle cx={17} cy={44} r={3} fill={GOLD} stroke={INK} strokeWidth={0.5} />
      <ellipse cx={12} cy={75} rx={4} ry={2.4} fill={PALE} stroke={INK} strokeWidth={0.6} />
      <circle cx={15.5} cy={72.5} r={1.8} fill={PALE} stroke={INK} strokeWidth={0.6} />
    </g>
  ),
  1: () => (
    <g>
      <Infinity x={40} y={16} s={5} />
      <Figure x={40} y={80} h={44} arms="left-up" />
      <line x1={26} y1={38} x2={26} y2={28} stroke={GOLD_FLAT} strokeWidth={1.4} />
      <rect x={14} y={82} width={52} height={5} fill={PALE} stroke={INK} strokeWidth={0.8} />
      <Wand x={22} y={76} s={5} />
      <Cup x={34} y={77} s={4.5} />
      <Sword x={47} y={76} s={5} />
      <Pentacle x={59} y={76} s={4.5} />
      <path d="M0 96 q20 -8 40 0 t40 0 v16 h-80 z" fill={BLOOD} opacity={0.5} />
    </g>
  ),
  2: () => (
    <g>
      <Pillar x={10} y={6} h={90} dark />
      <Pillar x={70} y={6} h={90} />
      <rect x={16} y={6} width={48} height={70} fill="url(#veil)" opacity={0.8} />
      <Moon x={40} y={12} r={5} />
      <Throne x={40} y={92} w={26} h={20} fill={PALE} />
      <Figure x={40} y={92} h={44} arms="hold" cloak crown />
      <path d="M32 96 q8 -6 16 0" fill="none" stroke={GOLD_FLAT} strokeWidth={1.4} />
      <Water y={100} rows={2} />
    </g>
  ),
  3: () => (
    <g>
      {[14, 26, 40, 54, 66].map((x, i) => (
        <Star key={i} x={x} y={8 + (i % 2) * 4} r={2.5} points={6} />
      ))}
      <Tree x={12} y={70} h={24} fill={INK} />
      <Throne x={44} y={88} w={34} h={32} fill={PALE} />
      <Figure x={44} y={88} h={44} arms="out" cloak crown />
      <path d="M52 78 l4 -4 l4 4 l-4 6 z" fill={BLOOD} stroke={INK} strokeWidth={0.5} />
      <g stroke={GOLD_FLAT} strokeWidth={1} fill="none">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${4 + i * 6.6} 112 l1.5 -8 l1.5 8`} />
        ))}
      </g>
      <Water y={98} rows={2} />
    </g>
  ),
  4: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={BLOOD} opacity={0.18} />
      <Mountains y={60} opacity={0.4} fill={BLOOD} />
      <Throne x={40} y={92} w={36} h={44} fill={INK} />
      {[24, 56].map((x) => (
        <path key={x} d={`M${x - 4} 52 q4 -8 8 0 q-4 -3 -8 0`} fill={GOLD} stroke={INK} strokeWidth={0.5} />
      ))}
      <Figure x={40} y={92} h={46} arms="hold" fill={PALE} crown />
      <path d="M22 78 l0 -10 M20 70 h4 M22 68 a2 2 0 1 0 0.01 0" stroke={GOLD_FLAT} strokeWidth={1.2} fill="none" />
      <circle cx={58} cy={74} r={3} fill={GOLD} stroke={INK} strokeWidth={0.5} />
      <Ground y={100} />
    </g>
  ),
  5: () => (
    <g>
      <Pillar x={12} y={4} h={94} />
      <Pillar x={68} y={4} h={94} />
      <rect x={20} y={84} width={40} height={12} fill={PALE} stroke={INK} strokeWidth={0.8} />
      <Figure x={40} y={84} h={50} arms="right-up" cloak />
      <path d="M36 36 h8 M36 32 h8 M36 28 h8" stroke={GOLD_FLAT} strokeWidth={1.6} />
      <circle cx={40} cy={26} r={3} fill={GOLD} stroke={INK} strokeWidth={0.5} />
      <path d="M52 40 v-14 M50 26 h4" stroke={GOLD_FLAT} strokeWidth={1.2} />
      <Figure x={26} y={100} h={18} arms="up" />
      <Figure x={54} y={100} h={18} arms="up" />
      <path d="M32 104 l4 -3 l4 3 M40 104 l4 -3 l4 3" stroke={GOLD_FLAT} strokeWidth={1} fill="none" />
    </g>
  ),
  6: () => (
    <g>
      <Sun x={40} y={10} r={12} rays={16} />
      <Wings x={40} y={22} span={26} />
      <Figure x={40} y={34} h={20} arms="out" fill={PALE} />
      <Mountains y={78} opacity={0.25} />
      <Tree x={12} y={90} h={30} />
      <path d="M8 88 q4 -8 0 -16 q-4 -8 0 -14" fill="none" stroke={GOLD_FLAT} strokeWidth={1.2} />
      {[64, 70, 76].map((x, i) => (
        <Flame key={i} x={x} y={66 + (i % 2) * 6} s={4} />
      ))}
      <line x1={70} y1={90} x2={70} y2={70} stroke={INK} strokeWidth={1.6} />
      <Figure x={28} y={100} h={34} arms="right-up" />
      <Figure x={52} y={100} h={34} arms="left-up" fill={INK} />
      <Ground y={100} fill={GOLD_FLAT} opacity={0.6} />
    </g>
  ),
  7: () => (
    <g>
      <rect x={0} y={20} width={80} height={14} fill={PALE} opacity={0.6} />
      {[8, 24, 40, 56, 72].map((x) => (
        <rect key={x} x={x - 4} y={24} width={8} height={10} fill={INK} opacity={0.5} />
      ))}
      <rect x={18} y={38} width={44} height={30} fill="url(#skyDeep)" stroke={INK} strokeWidth={0.8} />
      {[24, 34, 44, 54].map((x, i) => (
        <Star key={i} x={x} y={44 + (i % 2) * 6} r={2} points={5} />
      ))}
      <rect x={22} y={66} width={36} height={22} fill={PALE} stroke={INK} strokeWidth={0.8} />
      <Figure x={40} y={68} h={36} arms="hold" fill={INK} crown />
      <ellipse cx={20} cy={98} rx={12} ry={7} fill={INK} />
      <circle cx={10} cy={92} r={4} fill={INK} />
      <ellipse cx={60} cy={98} rx={12} ry={7} fill={PALE} stroke={INK} strokeWidth={0.8} />
      <circle cx={70} cy={92} r={4} fill={PALE} stroke={INK} strokeWidth={0.8} />
      <circle cx={30} cy={98} r={5} fill={GOLD} stroke={INK} strokeWidth={0.8} />
      <circle cx={50} cy={98} r={5} fill={GOLD} stroke={INK} strokeWidth={0.8} />
    </g>
  ),
  8: () => (
    <g>
      <Infinity x={30} y={14} s={5} />
      <Mountains y={72} opacity={0.25} />
      <Figure x={30} y={80} h={44} arms="down" fill={PALE} />
      <circle cx={56} cy={82} r={11} fill={GOLD} stroke={INK} strokeWidth={0.8} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <path key={i} d={`M${56 + Math.cos(a) * 11} ${82 + Math.sin(a) * 11} l${Math.cos(a) * 4} ${Math.sin(a) * 4}`} stroke={BLOOD} strokeWidth={1.6} strokeLinecap="round" />;
      })}
      <circle cx={53} cy={80} r={1} fill={INK} />
      <circle cx={60} cy={80} r={1} fill={INK} />
      <ellipse cx={72} cy={94} rx={12} ry={6} fill={GOLD} stroke={INK} strokeWidth={0.8} />
      <path d="M36 72 q12 4 16 8" stroke={PALE} strokeWidth={2} fill="none" strokeLinecap="round" />
      <Ground y={102} fill={GOLD_FLAT} opacity={0.5} />
    </g>
  ),
  9: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={INK} opacity={0.55} />
      <Mountains y={84} opacity={0.6} fill={PALE} />
      <Figure x={40} y={88} h={56} arms="left-up" fill={INK} cloak />
      <line x1={58} y1={90} x2={58} y2={36} stroke={GOLD_FLAT} strokeWidth={1.4} />
      <Lantern x={22} y={46} />
      <circle cx={22} cy={46} r={12} fill={GOLD_FLAT} opacity={0.15} />
    </g>
  ),
  10: () => (
    <g>
      <Cloud x={2} y={14} w={20} />
      <Cloud x={56} y={12} w={22} />
      <Cloud x={2} y={100} w={20} />
      <Cloud x={56} y={100} w={22} />
      <circle cx={40} cy={56} r={28} fill={PALE} stroke={INK} strokeWidth={1.2} />
      <circle cx={40} cy={56} r={18} fill="none" stroke={INK} strokeWidth={0.8} />
      <circle cx={40} cy={56} r={6} fill={GOLD} stroke={INK} strokeWidth={0.8} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <line key={i} x1={40 + Math.cos(a) * 6} y1={56 + Math.sin(a) * 6} x2={40 + Math.cos(a) * 18} y2={56 + Math.sin(a) * 18} stroke={INK} strokeWidth={0.8} />;
      })}
      {['T', 'A', 'R', 'O'].map((ch, i) => {
        const a = (i / 4) * Math.PI * 2 - Math.PI / 4;
        return <text key={ch} x={40 + Math.cos(a) * 23} y={56 + Math.sin(a) * 23 + 2.5} fontSize={7} textAnchor="middle" fill={INK} fontFamily="serif">{ch}</text>;
      })}
      <path d="M12 70 q-6 12 2 22" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <path d="M66 40 l6 -10 l4 12 z" fill={BLOOD} />
      <path d="M32 24 q8 -8 16 0 l-2 6 h-12 z" fill={GOLD} stroke={INK} strokeWidth={0.6} />
    </g>
  ),
  11: () => (
    <g>
      <Pillar x={10} y={4} h={94} />
      <Pillar x={70} y={4} h={94} />
      <rect x={16} y={4} width={48} height={90} fill={BLOOD} opacity={0.18} />
      <Throne x={40} y={92} w={30} h={30} fill={PALE} />
      <Figure x={40} y={92} h={48} arms="right-up" cloak crown />
      <Sword x={56} y={40} s={10} />
      <path d="M22 66 h-10 M12 66 l-3 8 h6 z M22 66 l-3 8 h6 z" fill={GOLD} stroke={INK} strokeWidth={0.6} />
      <line x1={17} y1={66} x2={17} y2={60} stroke={INK} strokeWidth={0.8} />
    </g>
  ),
  12: () => (
    <g>
      <rect x={14} y={6} width={5} height={100} fill={INK} />
      <rect x={61} y={6} width={5} height={100} fill={INK} />
      <rect x={10} y={6} width={60} height={5} fill={INK} />
      {[20, 30, 46, 56].map((x) => (
        <path key={x} d={`M${x} 11 q3 4 0 8 q-3 -4 0 -8`} fill={GOLD} stroke={INK} strokeWidth={0.4} />
      ))}
      <g transform="rotate(180 40 58)">
        <Figure x={40} y={44} h={40} arms="hold" halo />
      </g>
      <line x1={40} y1={11} x2={40} y2={20} stroke={INK} strokeWidth={1.6} />
      <path d="M34 26 l8 8" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
    </g>
  ),
  13: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill="url(#skyDeep)" opacity={0.35} />
      <rect x={4} y={40} width={8} height={30} fill={INK} opacity={0.6} />
      <rect x={68} y={40} width={8} height={30} fill={INK} opacity={0.6} />
      <Sun x={40} y={52} r={7} rays={8} />
      <Water y={64} rows={2} />
      <Horse x={40} y={100} fill={PALE} w={44} />
      <Figure x={38} y={82} h={34} arms="right-up" fill={INK} />
      <path d="M52 44 h18 v14 h-18 z" fill={INK} />
      <Star x={61} y={51} r={4} points={5} fill={PALE} />
      <line x1={52} y1={44} x2={52} y2={72} stroke={INK} strokeWidth={1.4} />
      <circle cx={38} cy={50} r={3.6} fill={PALE} stroke={INK} strokeWidth={0.6} />
      <path d="M36.5 49.5 h1 M39 49.5 h1 M37 52 h2" stroke={INK} strokeWidth={0.7} />
      <Ground y={104} />
    </g>
  ),
  14: () => (
    <g>
      <Sun x={64} y={14} r={6} rays={8} />
      <path d="M60 22 l4 -6 l4 6 z" fill={GOLD} stroke={INK} strokeWidth={0.4} />
      <path d="M56 30 q10 20 0 40 q-8 10 4 24" fill="none" stroke={GOLD_FLAT} strokeWidth={2} opacity={0.6} />
      <Wings x={36} y={46} span={40} />
      <Figure x={36} y={92} h={52} arms="out" fill={PALE} halo />
      <Cup x={16} y={62} s={5} />
      <Cup x={56} y={72} s={5} />
      <path d="M18 60 q20 -6 38 8" fill="none" stroke="#6ab7d6" strokeWidth={1.6} />
      <Water y={96} rows={3} />
    </g>
  ),
  15: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={INK} opacity={0.75} />
      <Star x={40} y={10} r={6} points={5} fill={PALE} />
      <Wings x={40} y={30} span={44} />
      <Figure x={40} y={74} h={50} arms="left-up" fill={INK} />
      <path d="M33 26 l-4 -9 l6 5 M47 26 l4 -9 l-6 5" fill={INK} stroke={PALE} strokeWidth={0.6} />
      <rect x={30} y={74} width={20} height={10} fill={INK} stroke={PALE} strokeWidth={0.8} />
      <Chain x={18} y={80} len={10} />
      <Chain x={52} y={80} len={10} />
      <Figure x={16} y={106} h={26} arms="down" fill={PALE} />
      <Figure x={64} y={106} h={26} arms="down" fill={PALE} />
      <Flame x={64} y={80} s={3} />
    </g>
  ),
  16: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill="url(#skyDeep)" opacity={0.6} />
      <Mountains y={90} opacity={0.9} fill={INK} />
      <rect x={30} y={36} width={20} height={60} fill={PALE} stroke={INK} strokeWidth={1} />
      {[32, 38, 44].map((x) => (
        <rect key={x} x={x} y={32} width={4} height={5} fill={PALE} stroke={INK} strokeWidth={0.8} />
      ))}
      <path d="M28 30 l6 -8 l6 6 l6 -6 l6 8 z" fill={GOLD} stroke={INK} strokeWidth={0.7} transform="rotate(-25 40 26) translate(-6 -6)" />
      <Lightning x={62} y={4} len={44} />
      <Flame x={34} y={40} s={5} />
      <Flame x={46} y={48} s={6} />
      <Flame x={40} y={60} s={4} />
      <g transform="rotate(150 18 62)">
        <Figure x={18} y={62} h={20} arms="raised" />
      </g>
      <g transform="rotate(-140 62 70)">
        <Figure x={62} y={70} h={20} arms="raised" fill={PALE} />
      </g>
      {[8, 14, 66, 72, 20, 60].map((x, i) => (
        <path key={i} d={`M${x} ${20 + i * 8} q1 3 0 5 q-1 -2 0 -5`} fill={GOLD} />
      ))}
    </g>
  ),
  17: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill="url(#skyDeep)" opacity={0.3} />
      <Star x={40} y={20} r={13} points={8} />
      {[10, 24, 56, 70, 14, 66, 40].map((x, i) => (
        <Star key={i} x={x} y={[34, 8, 8, 34, 52, 52, 44][i]} r={3} points={8} fill={PALE} />
      ))}
      <Tree x={70} y={80} h={20} />
      <circle cx={70} cy={64} r={1.6} fill={BLOOD} />
      <Figure x={34} y={92} h={32} arms="out" fill={PALE} />
      <Cup x={14} y={82} s={4} />
      <Cup x={54} y={84} s={4} />
      <path d="M16 86 q-4 8 -2 14 M56 88 q4 6 2 12" fill="none" stroke="#6ab7d6" strokeWidth={1.4} />
      <Water y={100} rows={2} />
    </g>
  ),
  18: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill="url(#skyDeep)" opacity={0.7} />
      <Moon x={40} y={22} r={13} face />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <line key={i} x1={40 + Math.cos(a) * 16} y1={22 + Math.sin(a) * 16} x2={40 + Math.cos(a) * 20} y2={22 + Math.sin(a) * 20} stroke={GOLD_FLAT} strokeWidth={0.8} />;
      })}
      {[20, 30, 50, 60].map((x, i) => (
        <path key={i} d={`M${x} ${38 + (i % 2) * 6} q1 3 0 5 q-1 -2 0 -5`} fill={GOLD} />
      ))}
      <rect x={6} y={50} width={9} height={26} fill={INK} />
      <rect x={65} y={50} width={9} height={26} fill={INK} />
      <path d="M38 112 q-6 -20 4 -40 q6 -10 -2 -20" fill="none" stroke={PALE} strokeWidth={2.4} opacity={0.6} />
      <ellipse cx={20} cy={82} rx={6} ry={3.5} fill={PALE} stroke={INK} strokeWidth={0.6} />
      <circle cx={25} cy={78} r={2.2} fill={PALE} stroke={INK} strokeWidth={0.6} />
      <ellipse cx={60} cy={82} rx={6} ry={3.5} fill={INK} />
      <circle cx={55} cy={78} r={2.2} fill={INK} />
      <Water y={94} rows={3} />
      <path d="M36 104 q4 -6 8 0 q-2 4 -4 4 q-2 0 -4 -4 M34 100 l2 4 M46 100 l-2 4" fill={BLOOD} stroke={INK} strokeWidth={0.5} />
    </g>
  ),
  19: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={GOLD_FLAT} opacity={0.18} />
      <Sun x={40} y={24} r={14} rays={20} face />
      <rect x={0} y={54} width={80} height={16} fill={PALE} stroke={INK} strokeWidth={0.8} />
      {[8, 24, 40, 56, 72].map((x, i) => (
        <line key={i} x1={x} y1={54} x2={x} y2={70} stroke={INK} strokeWidth={0.5} opacity={0.5} />
      ))}
      {[10, 26, 54, 70].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={54} x2={x} y2={44} stroke={INK} strokeWidth={1} />
          <circle cx={x} cy={42} r={4} fill={GOLD} stroke={INK} strokeWidth={0.6} />
          <circle cx={x} cy={42} r={1.5} fill={INK} />
        </g>
      ))}
      <Horse x={40} y={102} fill={PALE} w={40} />
      <Figure x={38} y={86} h={22} arms="right-up" fill={PALE} />
      <path d="M46 62 h14 v10 h-14 z" fill={BLOOD} />
      <line x1={46} y1={60} x2={46} y2={76} stroke={INK} strokeWidth={1.2} />
      <Ground y={104} fill={GOLD_FLAT} opacity={0.7} />
    </g>
  ),
  20: () => (
    <g>
      <Cloud x={6} y={24} w={30} />
      <Cloud x={44} y={20} w={32} />
      <Wings x={40} y={22} span={36} />
      <Figure x={40} y={40} h={26} arms="left-up" fill={PALE} halo />
      <path d="M28 20 l-10 -6 v10 z" fill={GOLD} stroke={INK} strokeWidth={0.5} />
      <Mountains y={70} opacity={0.3} />
      <Water y={104} rows={2} />
      {[14, 40, 66].map((x, i) => (
        <g key={i}>
          <rect x={x - 9} y={90} width={18} height={12} fill={INK} />
          <Figure x={x} y={92} h={26} arms="raised" fill={i === 1 ? INK : PALE} />
        </g>
      ))}
    </g>
  ),
  21: () => (
    <g>
      <ellipse cx={40} cy={56} rx={26} ry={40} fill="none" stroke={INK} strokeWidth={6} strokeDasharray="3 2" />
      <ellipse cx={40} cy={56} rx={26} ry={40} fill="none" stroke={GOLD_FLAT} strokeWidth={1.2} />
      <Figure x={40} y={80} h={44} arms="up" fill={PALE} />
      <line x1={22} y1={40} x2={20} y2={30} stroke={GOLD_FLAT} strokeWidth={1.4} />
      <line x1={58} y1={40} x2={60} y2={30} stroke={GOLD_FLAT} strokeWidth={1.4} />
      <path d="M32 56 q8 4 16 -2" stroke={BLOOD} strokeWidth={3} fill="none" />
      <Cloud x={0} y={12} w={16} />
      <Cloud x={62} y={12} w={16} />
      <Cloud x={0} y={104} w={16} />
      <Cloud x={62} y={104} w={16} />
      <circle cx={8} cy={8} r={2} fill={INK} />
      <path d="M68 4 l3 -3 l3 3 l-3 4 z" fill={INK} />
      <circle cx={8} cy={100} r={2.4} fill={GOLD} stroke={INK} strokeWidth={0.5} />
      <path d="M68 96 q3 -4 6 0 q-3 4 -6 0" fill={INK} />
    </g>
  ),
};
