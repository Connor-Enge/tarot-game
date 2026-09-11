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
      <circle cx={17} cy={44} r={3} fill={PALE} stroke={INK} strokeWidth={0.5} />
      <circle cx={17} cy={44} r={1} fill={GOLD_FLAT} />
      <ellipse cx={12} cy={75} rx={4} ry={2.4} fill={PALE} stroke={INK} strokeWidth={0.6} />
      <circle cx={15.5} cy={72.5} r={1.8} fill={PALE} stroke={INK} strokeWidth={0.6} />
    </g>
  ),
  1: () => (
    <g>
      <Infinity x={40} y={16} s={5} />
      <Figure x={40} y={80} h={44} arms="left-up" fill={BLOOD} />
      <line x1={26} y1={38} x2={26} y2={28} stroke={GOLD_FLAT} strokeWidth={1.4} />
      <rect x={14} y={82} width={52} height={5} fill={PALE} stroke={INK} strokeWidth={0.8} />
      <Wand x={22} y={76} s={5} />
      <Cup x={34} y={77} s={4.5} />
      <Sword x={47} y={76} s={5} />
      <Pentacle x={59} y={76} s={4.5} />
      <path d="M0 96 q20 -8 40 0 t40 0 v16 h-80 z" fill="#5a7a3a" opacity={0.55} />
      {[8, 20, 32].map((x) => <circle key={x} cx={x} cy={100 + (x % 3)} r={2} fill={BLOOD} stroke={INK} strokeWidth={0.3} />)}
      {[50, 62, 74].map((x) => <path key={x} d={`M${x} 104 l-2 -5 l2 2 l2 -2 z`} fill={PALE} stroke={INK} strokeWidth={0.3} />)}
    </g>
  ),
  2: () => (
    <g>
      <Pillar x={10} y={6} h={90} dark />
      <Pillar x={70} y={6} h={90} />
      <rect x={16} y={6} width={48} height={70} fill="url(#veil)" opacity={0.8} />
      <Moon x={40} y={12} r={5} />
      <Throne x={40} y={92} w={26} h={20} fill={PALE} />
      <Figure x={40} y={92} h={44} arms="hold" fill="#3f6fa8" cloak crown />
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
      <Figure x={44} y={88} h={44} arms="out" fill="#e9d9b6" cloak crown />
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
      <Mountains y={56} opacity={0.45} fill={BLOOD} />
      <Sun x={66} y={14} r={5} rays={8} />
      <Throne x={40} y={94} w={38} h={48} fill={INK} />
      {/* ram heads on the throne */}
      {[22, 58].map((x) => (
        <g key={x}>
          <circle cx={x} cy={50} r={3.5} fill={GOLD} stroke={INK} strokeWidth={0.5} />
          <path d={`M${x - 3} 48 q-4 -3 -2 -7 q3 1 3 5 M${x + 3} 48 q4 -3 2 -7 q-3 1 -3 5`} fill="none" stroke={GOLD_FLAT} strokeWidth={1} />
        </g>
      ))}
      <Figure x={40} y={94} h={48} arms="hold" fill={PALE} crown />
      {/* ankh and orb */}
      <path d="M21 86 v-14 M17 78 h8" stroke={GOLD_FLAT} strokeWidth={1.4} />
      <circle cx={21} cy={68} r={2.6} fill="none" stroke={GOLD_FLAT} strokeWidth={1.4} />
      <circle cx={59} cy={80} r={3.2} fill={GOLD} stroke={INK} strokeWidth={0.5} />
      <line x1={59} y1={76.8} x2={59} y2={74} stroke={GOLD_FLAT} strokeWidth={1} />
      <Ground y={102} />
    </g>
  ),
  5: () => (
    <g>
      <Pillar x={12} y={4} h={94} />
      <Pillar x={68} y={4} h={94} />
      <rect x={20} y={84} width={40} height={12} fill={PALE} stroke={INK} strokeWidth={0.8} />
      <Figure x={40} y={84} h={50} arms="right-up" fill={BLOOD} cloak />
      {/* triple crown */}
      <path d="M34 36 h12 l-1 -4 h-10 z M35 32 h10 l-1 -4 h-8 z M36 28 h8 l-1 -4 h-6 z" fill={GOLD} stroke={INK} strokeWidth={0.5} />
      <circle cx={40} cy={22} r={1.6} fill={GOLD} stroke={INK} strokeWidth={0.4} />
      {/* triple-cross staff */}
      <path d="M52 44 v-18 M49 30 h6 M50 26 h4 M50.5 34 h3" stroke={GOLD_FLAT} strokeWidth={1.2} />
      {/* two acolytes */}
      <Figure x={26} y={100} h={18} arms="up" />
      <Figure x={54} y={100} h={18} arms="up" />
      <circle cx={26} cy={84.5} r={1.4} fill={PALE} />
      <circle cx={54} cy={84.5} r={1.4} fill={PALE} />
      {/* crossed keys */}
      <g stroke={GOLD_FLAT} strokeWidth={1.2} fill="none">
        <path d="M34 104 l12 -8 M46 104 l-12 -8" />
        <circle cx={33} cy={104.6} r={1.6} />
        <circle cx={47} cy={104.6} r={1.6} />
      </g>
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
      <rect x={0} y={22} width={80} height={12} fill={PALE} opacity={0.55} />
      {[6, 20, 34, 48, 62, 76].map((x) => (
        <rect key={x} x={x - 3} y={16} width={6} height={7} fill={PALE} opacity={0.55} />
      ))}
      <Mountains y={70} opacity={0.2} />
      {/* canopy on four poles */}
      <rect x={16} y={30} width={48} height={8} fill="url(#skyDeep)" stroke={INK} strokeWidth={0.8} />
      {[18, 30, 42, 54].map((x, i) => (
        <Star key={i} x={x + 4} y={34} r={2} points={5} />
      ))}
      {[18, 62].map((x) => (
        <line key={x} x1={x} y1={38} x2={x} y2={70} stroke={INK} strokeWidth={1.2} />
      ))}
      {/* chariot box */}
      <path d="M20 70 h40 v18 q0 3 -3 3 h-34 q-3 0 -3 -3 z" fill={PALE} stroke={INK} strokeWidth={0.9} />
      <Star x={40} y={80} r={4} points={8} />
      <Figure x={40} y={72} h={36} arms="hold" fill={INK} crown />
      <line x1={26} y1={62} x2={26} y2={46} stroke={GOLD_FLAT} strokeWidth={1.4} />
      {/* wheels */}
      <circle cx={24} cy={94} r={6} fill={GOLD} stroke={INK} strokeWidth={0.8} />
      <circle cx={56} cy={94} r={6} fill={GOLD} stroke={INK} strokeWidth={0.8} />
      <path d="M24 88 v12 M18 94 h12 M56 88 v12 M50 94 h12" stroke={INK} strokeWidth={0.6} />
      {/* two sphinxes, seated */}
      <path d="M4 104 q0 -10 8 -12 q4 -1 6 3 v9 z" fill={INK} />
      <circle cx={13} cy={92} r={3.2} fill={INK} />
      <path d="M76 104 q0 -10 -8 -12 q-4 -1 -6 3 v9 z" fill={PALE} stroke={INK} strokeWidth={0.7} />
      <circle cx={67} cy={92} r={3.2} fill={PALE} stroke={INK} strokeWidth={0.7} />
      <Ground y={104} fill={GOLD_FLAT} opacity={0.5} />
    </g>
  ),
  8: () => (
    <g>
      <Infinity x={26} y={14} s={5} />
      <Mountains y={74} opacity={0.22} />
      <Ground y={100} fill="#d9b06a" opacity={0.6} />
      {/* she stands behind the lion, one hand resting on the mane, unhurried */}
      <Figure x={18} y={94} h={40} arms="right-up" fill={PALE} />
      <path d="M10 52 q8 -7 16 0" fill="none" stroke="#7aa35a" strokeWidth={1.6} strokeLinecap="round" />
      {[12, 18, 24].map((x) => <circle key={x} cx={x} cy={50.5} r={1.2} fill="#c94a4a" />)}
      {/* the lion: body, mane, face, a tail curling up */}
      <ellipse cx={54} cy={92} rx={20} ry={9} fill="#c98a3c" stroke={INK} strokeWidth={0.8} />
      <path d="M72 90 q10 -6 4 -18" fill="none" stroke="#c98a3c" strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={70} cy={70} r={2} fill="#8a5a22" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <path key={i} d={`M${40 + Math.cos(a) * 11} ${78 + Math.sin(a) * 11} l${Math.cos(a) * 6} ${Math.sin(a) * 6}`} stroke="#8a5a22" strokeWidth={3} strokeLinecap="round" />;
      })}
      <circle cx={40} cy={78} r={11.5} fill="#e0a85a" stroke={INK} strokeWidth={0.8} />
      <circle cx={36} cy={76} r={1.2} fill={INK} />
      <circle cx={44} cy={76} r={1.2} fill={INK} />
      <path d="M37 83 q3 3 6 0" fill="none" stroke={INK} strokeWidth={0.8} />
      <path d="M40 80 l-1.5 2 h3 z" fill={INK} />
    </g>
  ),
  9: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill="#0e0c1c" opacity={0.8} />
      <Star x={16} y={18} r={2} points={5} />
      <Star x={66} y={12} r={1.6} points={5} />
      <Mountains y={90} opacity={0.9} fill="#1c1830" />
      <path d="M0 112 L20 96 L40 104 L60 92 L80 100 V112 Z" fill="#26213d" />
      {/* the lantern's light, then the lantern, then the one who carries it */}
      <circle cx={60} cy={40} r={22} fill={GOLD_FLAT} opacity={0.12} />
      <circle cx={60} cy={40} r={11} fill={GOLD_FLAT} opacity={0.18} />
      <Figure x={40} y={98} h={46} arms="right-up" fill="#a9acb8" cloak />
      <line x1={28} y1={98} x2={28} y2={50} stroke={GOLD_FLAT} strokeWidth={1.6} />
      <circle cx={28} cy={49} r={2} fill={GOLD_FLAT} />
      <Lantern x={60} y={40} />
      <path d="M52 52 q4 -6 7 -9" fill="none" stroke={PALE} strokeWidth={2} strokeLinecap="round" />
    </g>
  ),
  10: () => (
    <g>
      <Cloud x={2} y={14} w={20} />
      <Cloud x={56} y={12} w={22} />
      <Cloud x={2} y={100} w={20} />
      <Cloud x={56} y={100} w={22} />
      <g className="live-spin">
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
      </g>
      <path d="M12 70 q-6 12 2 22" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <path d="M66 40 l6 -10 l4 12 z" fill={BLOOD} />
      <path d="M32 24 q8 -8 16 0 l-2 6 h-12 z" fill={GOLD} stroke={INK} strokeWidth={0.6} />
    </g>
  ),
  11: () => (
    <g>
      <Pillar x={10} y={4} h={94} />
      <Pillar x={70} y={4} h={94} />
      <rect x={16} y={4} width={48} height={90} fill="#5a2d7a" opacity={0.28} />
      <Throne x={40} y={92} w={30} h={30} fill={PALE} />
      <Figure x={40} y={92} h={48} arms="right-up" fill={BLOOD} cloak crown />
      <Sword x={56} y={40} s={11} />
      {/* balance scales */}
      <g stroke={GOLD_FLAT} strokeWidth={1} fill="none">
        <line x1={20} y1={62} x2={20} y2={54} />
        <line x1={12} y1={54} x2={28} y2={54} />
        <line x1={12} y1={54} x2={9} y2={64} />
        <line x1={12} y1={54} x2={15} y2={64} />
        <line x1={28} y1={54} x2={25} y2={64} />
        <line x1={28} y1={54} x2={31} y2={64} />
      </g>
      <path d="M8 64 h8 q-1 3 -4 3 q-3 0 -4 -3 z M24 64 h8 q-1 3 -4 3 q-3 0 -4 -3 z" fill={GOLD} stroke={INK} strokeWidth={0.5} />
      <rect x={38} y={56} width={4} height={4} fill={PALE} stroke={INK} strokeWidth={0.4} />
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
      <g className="live-sway">
      <line x1={40} y1={11} x2={40} y2={24} stroke={INK} strokeWidth={1.8} />
      <path d="M40 24 l-8 10 M40 24 l6 4" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M32 34 l16 0 l-4 30 l-8 0 z" fill={INK} />
      <path d="M34 62 l-6 8 M46 62 l6 8" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={40} cy={76} r={4.4} fill={INK} />
      <circle cx={40} cy={76} r={8} fill="none" stroke={GOLD_FLAT} strokeWidth={0.9} />
      </g>
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
      {[0, 1, 2, 3, 4].map((i) => { const a = (i / 5) * Math.PI * 2; return <circle key={i} cx={61 + Math.cos(a) * 2.6} cy={51 + Math.sin(a) * 2.6} r={1.8} fill={PALE} />; })}
      <circle cx={61} cy={51} r={1.2} fill={PALE} />
      <line x1={52} y1={44} x2={52} y2={72} stroke={INK} strokeWidth={1.4} />
      <circle cx={38} cy={50} r={3.6} fill={PALE} stroke={INK} strokeWidth={0.6} />
      <path d="M36.5 49.5 h1 M39 49.5 h1 M37 52 h2" stroke={INK} strokeWidth={0.7} />
      <Ground y={104} />
    </g>
  ),
  14: () => (
    <g>
      <Sun x={66} y={12} r={6} rays={8} />
      <path d="M62 20 l4 -6 l4 6 z" fill={GOLD} stroke={INK} strokeWidth={0.4} />
      <path d="M52 30 q12 18 4 36 q-6 12 10 30" fill="none" stroke={GOLD_FLAT} strokeWidth={2.2} opacity={0.5} />
      <Wings x={36} y={46} span={40} />
      <Figure x={36} y={92} h={52} arms="out" fill={PALE} halo />
      <path d="M32 60 l4 -6 l4 6 z" fill="none" stroke={GOLD_FLAT} strokeWidth={0.9} />
      <Cup x={14} y={64} s={5} />
      <Cup x={58} y={72} s={5} />
      {/* the stream, poured at an impossible angle */}
      <path d="M17 60 q18 -10 40 8" fill="none" stroke="#6ab7d6" strokeWidth={2.2} strokeLinecap="round" />
      <path d="M17 60 q18 -10 40 8" fill="none" stroke={PALE} strokeWidth={0.6} strokeLinecap="round" opacity={0.7} />
      <Water y={96} rows={3} />
      {/* irises */}
      {[6, 12].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={100} x2={x} y2={88} stroke="#5a7a3a" strokeWidth={1} />
          <path d={`M${x} 88 l-3 -4 l3 1 l3 -1 z`} fill="#7a3fa0" stroke={INK} strokeWidth={0.3} />
        </g>
      ))}
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
      <path className="live-rise" d="M36 104 q4 -6 8 0 q-2 4 -4 4 q-2 0 -4 -4 M34 100 l2 4 M46 100 l-2 4" fill={BLOOD} stroke={INK} strokeWidth={0.5} />
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
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI - Math.PI;
        return <line key={i} x1={40} y1={26} x2={40 + Math.cos(a) * 60} y2={26 + Math.sin(a) * 60} stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.35} />;
      })}
      <Cloud x={2} y={26} w={30} />
      <Cloud x={48} y={22} w={32} />
      <Wings x={40} y={24} span={38} />
      <Figure x={40} y={42} h={28} arms="left-up" fill={PALE} halo />
      {/* trumpet with banner */}
      <path d="M30 24 l-12 -6 v10 z" fill={GOLD} stroke={INK} strokeWidth={0.5} />
      <line x1={30} y1={24} x2={36} y2={26} stroke={GOLD_FLAT} strokeWidth={1.4} />
      <rect x={17} y={28} width={10} height={9} fill={PALE} stroke={INK} strokeWidth={0.5} />
      <path d="M22 29 v7 M18.5 32.5 h7" stroke={BLOOD} strokeWidth={1.2} />
      <Mountains y={72} opacity={0.3} />
      <Water y={104} rows={2} />
      {[14, 40, 66].map((x, i) => (
        <g key={i}>
          <path d={`M${x - 10} 104 v-14 h20 v14`} fill={INK} stroke={PALE} strokeWidth={0.5} />
          <Figure x={x} y={93} h={26} arms="raised" fill={i === 1 ? INK : PALE} />
        </g>
      ))}
    </g>
  ),
  21: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill="url(#skyDeep)" opacity={0.25} />
      {/* laurel wreath */}
      <g className="live-spin live-spin--slow">
      <ellipse cx={40} cy={56} rx={27} ry={41} fill="none" stroke={INK} strokeWidth={7} />
      <ellipse cx={40} cy={56} rx={27} ry={41} fill="none" stroke="#5a7a3a" strokeWidth={5} />
      {Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        const x = 40 + Math.cos(a) * 27;
        const y = 56 + Math.sin(a) * 41;
        return <ellipse key={i} cx={x} cy={y} rx={3.2} ry={1.6} fill="#8fb35a" stroke={INK} strokeWidth={0.4} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} />;
      })}
      </g>
      {[[40, 15], [40, 97]].map(([x, y], i) => (
        <path key={i} d={`M${x - 5} ${y} q5 -4 10 0 q-5 4 -10 0`} fill={BLOOD} stroke={INK} strokeWidth={0.5} />
      ))}
      {/* dancer with two wands and a sash */}
      <Figure x={40} y={82} h={44} arms="up" fill={PALE} />
      <line x1={22} y1={42} x2={19} y2={30} stroke={GOLD_FLAT} strokeWidth={1.6} />
      <line x1={58} y1={42} x2={61} y2={30} stroke={GOLD_FLAT} strokeWidth={1.6} />
      <path d="M30 52 q10 10 20 -4 q-6 14 -20 4" fill="#7a3fa0" stroke={INK} strokeWidth={0.4} />
      {/* four corners: angel, eagle, lion, bull */}
      <Cloud x={-2} y={14} w={18} />
      <circle cx={7} cy={9} r={2.6} fill={PALE} stroke={INK} strokeWidth={0.5} />
      <Cloud x={62} y={14} w={18} />
      <path d="M67 5 l4 -3 l4 3 l-1 5 l-3 -2 l-3 2 z" fill={INK} />
      <Cloud x={-2} y={106} w={18} />
      <circle cx={7} cy={101} r={3} fill={GOLD} stroke={INK} strokeWidth={0.5} />
      <Cloud x={62} y={106} w={18} />
      <path d="M67 103 q4 -6 8 0 M68 99 l-2 -3 M74 99 l2 -3" fill="none" stroke={INK} strokeWidth={1} />
    </g>
  ),
};
