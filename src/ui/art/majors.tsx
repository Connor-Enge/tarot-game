import type { ReactElement } from 'react';
import {
  BLOOD, Chain, Cloud, Cup, Flame, GOLD, GOLD_FLAT, Ground, Horse, INK, Infinity, Lantern, Lightning, Moon, Mountains, PALE, Pentacle, Pillar, Star, Sun, Sword, Throne, Tree, Wand, Water, Wings,
} from './primitives';
import { Cliff, Grass, Head, Lily, Person, Pomegranate, Rose, Sphinx, Wheat, hands, SKIN, SKIN_INK, LEAF } from './figure';

/** One composition per Major Arcana, drawn in the 80 x 112 art window. */
export const MAJOR_ART: Record<number, () => ReactElement> = {
  0: () => (
    <g>
      <Sun x={64} y={16} r={8} face />
      <Mountains y={66} opacity={0.35} />
      <path d="M0 74 Q30 70 46 82 L46 112 L0 112 Z" fill="#c9c9c9" opacity={0.25} />
      <Cliff x={0} y={80} w={44} drop={32} />
      {/* the walker: fine clothes, a feather in the cap, eyes on the sky */}
      {(() => { const hd = hands(28, 80, 54, 'raise-left'); return (
        <g>
          {/* the bindle staff runs from the raised hand back over the shoulder */}
          <line x1={hd.l.x} y1={hd.l.y} x2={hd.l.x + 31} y2={hd.l.y - 5} stroke={INK} strokeWidth={1.2} strokeLinecap="round" />
        </g>
      ); })()}
      <Person x={28} y={80} h={54} pose="raise-left" robe="#e9d9b6" inner="#b8462f" hair="#8a5a3a" />
      {(() => { const hd = hands(28, 80, 54, 'raise-left'); return (
        <g>
          {/* the bundle hangs behind, a white rose in the near hand */}
          <path d={`M${hd.l.x + 29} ${hd.l.y - 5} q1 5 3 7`} fill="none" stroke={INK} strokeWidth={0.6} />
          <circle cx={hd.l.x + 33} cy={hd.l.y + 2} r={3.6} fill={BLOOD} stroke={INK} strokeWidth={0.5} />
          <path d={`M${hd.l.x + 30.5} ${hd.l.y + 0.5} q2.5 -2 5 0`} fill="none" stroke={INK} strokeWidth={0.5} />
          <Rose x={hd.r.x + 1} y={hd.r.y - 3} r={2.6} color={PALE} />
        </g>
      ); })()}
      {/* the feather, worn to the left */}
      <path d="M25 27 q-6 -8 -12 -6 q4 3 9 8" fill="none" stroke={PALE} strokeWidth={1.4} strokeLinecap="round" />
      <path d="M25 27 q-6 -8 -12 -6" fill="none" stroke={INK} strokeWidth={0.4} />
      {/* the little white dog, up on its hind legs */}
      <g>
        <path d="M14 78 q3 -8 9 -6 q3 1 3 5 l-1 3 q-4 2 -8 0 z" fill={PALE} stroke={INK} strokeWidth={0.6} />
        <circle cx={24} cy={70} r={2.6} fill={PALE} stroke={INK} strokeWidth={0.6} />
        <path d="M22 68 l-1.5 -3 l2.5 1.5 M25.5 68 l1.5 -3 l-2.5 1.5" fill="none" stroke={INK} strokeWidth={0.6} />
        <circle cx={25} cy={70} r={0.4} fill={INK} />
        <path d="M15 79 q-3 -3 -1 -6" fill="none" stroke={INK} strokeWidth={0.7} strokeLinecap="round" />
        <path d="M18 80 l-1 3 M21 80 l0 3" stroke={INK} strokeWidth={0.7} strokeLinecap="round" />
      </g>
      <Grass x={2} y={80} w={12} n={5} color={PALE} />
    </g>
  ),
  1: () => (
    <g>
      <Infinity x={40} y={12} s={5} />
      {/* rose arbour above, lilies and roses below */}
      <path d="M0 4 q40 10 80 0" fill="none" stroke={LEAF} strokeWidth={1.2} />
      {[4, 15, 30, 50, 66, 77].map((x, i) => <path key={x} d={`M${x} ${5 + (i % 2) * 3} q-3 -4 -1 -6 q3 2 1 6 q3 -4 5 -2 q-3 3 -5 2`} fill={LEAF} stroke={INK} strokeWidth={0.3} />)}
      {[8, 22, 40, 58, 72].map((x, i) => <Rose key={x} x={x} y={6 + (i % 2) * 2} r={2.4} />)}
      <path d="M0 96 q20 -8 40 0 t40 0 v16 h-80 z" fill={LEAF} opacity={0.5} />
      {[6, 18, 30].map((x, i) => <Rose key={x} x={x} y={101 + (i % 2) * 3} r={2.6} />)}
      {[50, 62, 74].map((x, i) => <Lily key={x} x={x} y={100 + (i % 2) * 2} s={3.2} />)}
      {/* the magician: red mantle over white, wand raised, hand to the earth */}
      <Person x={40} y={82} h={50} pose="point-down" robe="#b8462f" inner={PALE} hair="#3a2a1e" belt={null} />
      {(() => { const hd = hands(40, 82, 50, 'point-down'); return (
        <g>
          <line x1={hd.r.x} y1={hd.r.y + 3} x2={hd.r.x} y2={hd.r.y - 11} stroke={PALE} strokeWidth={1.4} strokeLinecap="round" />
          <line x1={hd.r.x} y1={hd.r.y + 3} x2={hd.r.x} y2={hd.r.y - 11} stroke={INK} strokeWidth={0.4} />
          <circle cx={hd.r.x} cy={hd.r.y - 12.5} r={1.4} fill={GOLD} stroke={INK} strokeWidth={0.4} />
          <circle cx={hd.r.x} cy={hd.r.y + 4.5} r={1.4} fill={GOLD} stroke={INK} strokeWidth={0.4} />
          <line x1={hd.l.x} y1={hd.l.y} x2={hd.l.x - 1} y2={hd.l.y + 4} stroke={SKIN_INK} strokeWidth={0.6} strokeLinecap="round" />
        </g>
      ); })()}
      {/* the table and the four tools */}
      <rect x={12} y={81} width={56} height={5} fill="#c9a877" stroke={INK} strokeWidth={0.7} />
      <rect x={12} y={84} width={56} height={2} fill="url(#hatch)" opacity={0.7} />
      <path d="M14 82.5 h52" stroke={PALE} strokeWidth={0.4} opacity={0.6} />
      {[16, 62].map((x) => (
        <g key={x}>
          <path d={`M${x} 86 v12 M${x - 1.5} 90 q1.5 -1 3 0 M${x - 1.5} 95 q1.5 1 3 0`} fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
          <path d={`M${x - 2.5} 98 h5`} stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
        </g>
      ))}
      <Wand x={21} y={75} s={6} />
      <Cup x={34} y={76} s={5.5} />
      <Sword x={47} y={75} s={6} />
      <Pentacle x={60} y={75} s={5.5} />
      {/* the serpent belt, biting its tail */}
      <path d="M34 57 q6 -3 12 0 q-6 3 -12 0 z" fill="none" stroke={LEAF} strokeWidth={1} />
      <circle cx={46} cy={57} r={0.7} fill={LEAF} />
      {/* the white headband */}
      <path d="M35.2 35.2 q4.8 -1.6 9.6 0 v2 q-4.8 -1.6 -9.6 0 z" fill={PALE} stroke={INK} strokeWidth={0.35} />
    </g>
  ),
  2: () => (
    <g>
      <Pillar x={8} y={4} h={94} dark />
      <Pillar x={72} y={4} h={94} />
      <text x={12} y={30} fontSize={7} fill={PALE} fontFamily="Georgia, serif" textAnchor="middle">B</text>
      <text x={76} y={30} fontSize={7} fill={INK} fontWeight="bold" fontFamily="Georgia, serif" textAnchor="middle">J</text>
      {/* the veil, hung with pomegranates and palms */}
      <rect x={16} y={4} width={48} height={74} fill="#e8e0c4" opacity={0.9} />
      <rect x={16} y={4} width={48} height={74} fill="url(#hatch)" opacity={0.5} />
      {[[24, 12], [40, 10], [56, 12], [20, 28], [36, 26], [52, 28], [28, 44], [44, 42], [60, 44], [24, 60], [40, 58], [56, 60]].map(([x, y], i) => <Pomegranate key={i} x={x} y={y} r={2.3} />)}
      {[[32, 18], [48, 18], [32, 52], [48, 52]].map(([x, y], i) => <path key={i} d={`M${x} ${y + 4} q-3 -6 0 -9 q3 3 0 9 M${x} ${y + 4} q-5 -3 -6 -7 M${x} ${y + 4} q5 -3 6 -7`} fill="none" stroke={LEAF} strokeWidth={0.5} />)}
      {/* the throne, the priestess, the scroll on her knee */}
      <Throne x={40} y={94} w={30} h={22} fill={PALE} back="plain" />
      <Person x={40} y={94} h={50} pose="sit-hold" robe="#3f6fa8" inner="#d9e4f2" hair="#3a2a1e" belt={null} />
      {/* the veil falls either side of her face */}
      <path d="M35.5 46 q-2 5 -2 12 M44.5 46 q2 5 2 12" fill="none" stroke="#d9e4f2" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M35.5 46 q-2 5 -2 12 M44.5 46 q2 5 2 12" fill="none" stroke={INK} strokeWidth={0.35} />
      {/* the crown: horns of the moon about a full orb, above the brow */}
      <g>
        <circle cx={40} cy={41.5} r={2.3} fill={PALE} stroke={INK} strokeWidth={0.5} />
        <path d="M35.5 39.5 q-3 3 0 6 M44.5 39.5 q3 3 0 6" fill="none" stroke={PALE} strokeWidth={1.4} />
        <path d="M35.5 39.5 q-3 3 0 6 M44.5 39.5 q3 3 0 6" fill="none" stroke={INK} strokeWidth={0.4} />
      </g>
      {/* the cross on her breast, the scroll, the moon at her feet */}
      <path d="M40 60 v6 M37 63 h6" stroke={PALE} strokeWidth={1.2} />
      <rect x={34} y={70} width={13} height={5} rx={1} fill={PALE} stroke={INK} strokeWidth={0.5} />
      <text x={40.5} y={73.8} fontSize={3.4} fill={INK} fontFamily="Georgia, serif" textAnchor="middle" letterSpacing={0.4}>TORA</text>
      <path d="M32 96 q8 -7 16 0 q-8 -3 -16 0 z" fill={GOLD} stroke={INK} strokeWidth={0.5} />
      <Water y={101} rows={2} />
    </g>
  ),
  3: () => (
    <g>
      {/* twelve stars over her, cypresses and a stream behind */}
      {Array.from({ length: 12 }, (_, i) => <Star key={i} x={40 + Math.cos((i / 12) * Math.PI * 2 - Math.PI / 2) * 11} y={8 + Math.sin((i / 12) * Math.PI * 2 - Math.PI / 2) * 5} r={1.4} points={6} />)}
      {[6, 12, 68, 74].map((x, i) => <path key={x} d={`M${x} 62 q-3 -14 0 -30 q3 16 0 30 z`} fill={LEAF} opacity={0.85 - (i % 2) * 0.2} stroke={INK} strokeWidth={0.3} />)}
      {/* the waterfall behind the cypresses, falling to the stream */}
      <path d="M60 30 q2 14 -2 32" fill="none" stroke="#8fc3e0" strokeWidth={4} opacity={0.6} />
      <path d="M59 30 q2 14 -2 32 M61.5 30 q2 14 -2 32" fill="none" stroke={PALE} strokeWidth={0.6} opacity={0.7} />
      <path d="M0 64 q20 -4 40 0 t40 0 v6 q-20 4 -40 0 t-40 0 z" fill="#5a7a3a" opacity={0.6} />
      <path d="M0 62 q22 -3 44 1 t36 -1" fill="none" stroke="#8fc3e0" strokeWidth={2.2} opacity={0.8} />
      <path d="M0 62 q22 -3 44 1 t36 -1" fill="none" stroke={PALE} strokeWidth={0.6} opacity={0.6} strokeDasharray="3 4" />
      {/* the cushioned throne, the empress, sceptre and shield */}
      <Throne x={42} y={92} w={34} h={26} fill="#c94a3a" back="arch" />
      <rect x={26} y={68} width={32} height={6} rx={3} fill="#e0a39a" stroke={INK} strokeWidth={0.4} />
      <rect x={26} y={68} width={32} height={6} rx={3} fill="url(#hatch)" opacity={0.3} />
      {/* the Venus sign on the cushion, and a myrtle wreath under her crown */}
      <circle cx={30} cy={70.5} r={1.4} fill="none" stroke={INK} strokeWidth={0.4} />
      <path d="M30 72 v2 M29 73 h2" stroke={INK} strokeWidth={0.4} />
      <Person x={42} y={92} h={50} pose="raise-right" robe="#f1e5c8" inner="#e9d9b6" hair="#d9a441" crown belt="#c94a3a" />
      <path d="M37 44.5 q5 2 10 0" fill="none" stroke={LEAF} strokeWidth={1.2} />
      {[38, 41, 44, 46].map((x, i) => <path key={x} d={`M${x} ${45 + (i % 2) * 0.6} q1 -1.5 2 0 q-1 1.2 -2 0 z`} fill={LEAF} stroke={INK} strokeWidth={0.2} />)}
      {[[36, 74], [44, 78], [40, 84], [48, 86], [34, 82], [46, 70], [38, 66], [50, 80]].map(([x, y], i) => <Pomegranate key={i} x={x} y={y} r={1.5} />)}
      {(() => { const hd = hands(42, 92, 50, 'raise-right'); return (
        <g>
          <line x1={hd.r.x} y1={hd.r.y + 2} x2={hd.r.x + 1} y2={hd.r.y - 9} stroke={GOLD_FLAT} strokeWidth={1.2} strokeLinecap="round" />
          <circle cx={hd.r.x + 1} cy={hd.r.y - 10.5} r={2.2} fill={GOLD} stroke={INK} strokeWidth={0.4} />
          <path d={`M${hd.r.x + 1} ${hd.r.y - 12.7} v-2.4 M${hd.r.x - 0.2} ${hd.r.y - 14} h2.4`} fill="none" stroke={INK} strokeWidth={0.5} />
        </g>
      ); })()}
      <path d="M18 84 q0 -8 7 -8 q7 0 7 8 q0 6 -7 10 q-7 -4 -7 -10 z" fill={BLOOD} stroke={INK} strokeWidth={0.5} />
      <circle cx={25} cy={81} r={2.2} fill="none" stroke={PALE} strokeWidth={0.8} />
      <path d="M25 83.2 v5 M23 86 h4" stroke={PALE} strokeWidth={0.8} />
      {/* the wheat */}
      <path d="M0 100 q40 -6 80 0 v12 h-80 z" fill="#d9c08a" opacity={0.7} />
      {Array.from({ length: 11 }, (_, i) => <Wheat key={i} x={3 + i * 7.5} y={112} h={12 + (i % 3) * 2} />)}
    </g>
  ),
  4: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={BLOOD} opacity={0.18} />
      <Mountains y={60} opacity={0.45} fill={BLOOD} />
      <path d="M0 64 Q30 60 52 66 T80 64" fill="none" stroke="#7fa3c9" strokeWidth={1.4} opacity={0.7} />
      <Sun x={66} y={14} r={5} rays={8} />
      {/* a throne of grey stone, rams at the corners */}
      <Throne x={40} y={94} w={36} h={44} fill="#8b8a86" back="square" dais />
      {[[24, 41], [56, 41], [18, 72], [62, 72]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={3.2} fill={GOLD} stroke={INK} strokeWidth={0.5} />
          <path d={`M${x - 2.8} ${y - 1.5} q-4 -3 -2 -7 q3 1 3 5 M${x + 2.8} ${y - 1.5} q4 -3 2 -7 q-3 1 -3 5`} fill="none" stroke={GOLD_FLAT} strokeWidth={1} />
          <path d={`M${x - 1.2} ${y + 0.5} h2.4 M${x} ${y + 1} v1.5`} stroke={INK} strokeWidth={0.4} />
        </g>
      ))}
      {/* the emperor: red robe over mail, a long white beard, crown, ankh and orb */}
      <path d="M28 58 L20 94 H60 L52 58 Z" fill="#8a2e24" stroke={INK} strokeWidth={0.4} opacity={0.9} />
      <path d="M28 58 L20 94 H32 L34 58 Z" fill="url(#hatch)" opacity={0.4} />
      <Person x={40} y={94} h={52} pose="sit-hold" robe="#b8462f" inner="#8a8f99" hair="#e8e2d6" crown belt={GOLD_FLAT} />
      {/* mail shows at the boots */}
      <path d="M29 88 h8 v5 h-8 z M43 88 h8 v5 h-8 z" fill="#8a8f99" stroke={INK} strokeWidth={0.4} />
      <path d="M29 88 h8 v5 h-8 z M43 88 h8 v5 h-8 z" fill="url(#crosshatch)" opacity={0.7} />
      <path d="M35.6 48.5 q1 4 4.4 10 q3.4 -6 4.4 -10 q-4.4 3 -8.8 0 z" fill="#e8e2d6" stroke={INK} strokeWidth={0.35} />
      <path d="M38 50 q2 2 4 0" fill="none" stroke={INK} strokeWidth={0.3} />
      {(() => { const hd = hands(40, 94, 52, 'sit-hold'); return (
        <g>
          <g transform={`rotate(30 ${hd.r.x} ${hd.r.y})`}>
            <line x1={hd.r.x} y1={hd.r.y + 2} x2={hd.r.x} y2={hd.r.y - 13} stroke={GOLD_FLAT} strokeWidth={1.4} strokeLinecap="round" />
            <path d={`M${hd.r.x - 3} ${hd.r.y - 10.5} h6`} stroke={GOLD_FLAT} strokeWidth={1.3} />
            <circle cx={hd.r.x} cy={hd.r.y - 15.5} r={2.4} fill="none" stroke={GOLD_FLAT} strokeWidth={1.4} />
          </g>
          <circle cx={hd.l.x} cy={hd.l.y - 3.4} r={3} fill={GOLD} stroke={INK} strokeWidth={0.5} />
          <path d={`M${hd.l.x} ${hd.l.y - 6.4} v-2.2 M${hd.l.x - 1.2} ${hd.l.y - 7.6} h2.4`} stroke={INK} strokeWidth={0.5} />
        </g>
      ); })()}
      <Ground y={102} fill="#5a3a30" opacity={0.6} />
    </g>
  ),
  5: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill="#d8d4c8" opacity={0.5} />
      <Pillar x={10} y={4} h={94} />
      <Pillar x={70} y={4} h={94} />
      <path d="M22 10 h36 M22 14 h36" stroke={INK} strokeWidth={0.4} opacity={0.4} />
      {/* carved capitals on the grey pillars, a red carpet down the steps */}
      {[10, 70].map((x) => <path key={x} d={`M${x - 6} 8 q3 -3 6 0 q3 -3 6 0 v2 h-12 z`} fill={PALE} stroke={INK} strokeWidth={0.5} />)}
      <path d="M22 96 h36 v16 h-36 z" fill={BLOOD} opacity={0.45} />
      <path d="M24 100 h32 M24 106 h32" stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.7} />
      {/* the seat, the teacher in red with the white pallium, the triple crown */}
      <Throne x={40} y={84} w={28} h={28} fill="#b8b4a8" back="plain" />
      <Person x={40} y={84} h={50} pose="raise-right" robe="#b8462f" inner={PALE} hair="#9a9088" belt={null} />
      <path d="M38.5 60 v14 M36.5 66 h4" stroke="#b8462f" strokeWidth={0.8} />
      <g>
        <path d="M35 35.5 h10 l-1 -4 h-8 z M36 31.5 h8 l-1 -4 h-6 z M37 27.5 h6 l-1 -3.5 h-4 z" fill={GOLD} stroke={INK} strokeWidth={0.5} />
        <circle cx={40} cy={22.5} r={1.5} fill={GOLD} stroke={INK} strokeWidth={0.4} />
        <path d="M36 33.5 h8 M37 29.5 h6" stroke={INK} strokeWidth={0.3} opacity={0.6} />
      </g>
      {(() => { const hd = hands(40, 84, 50, 'raise-right'); return (
        <g>
          {/* two fingers raised in blessing; the triple-cross staff in the other hand */}
          <path d={`M${hd.r.x - 1} ${hd.r.y - 2} v-4 M${hd.r.x + 1.2} ${hd.r.y - 2} v-4.5`} stroke={SKIN_INK} strokeWidth={0.9} strokeLinecap="round" />
          <line x1={hd.l.x} y1={hd.l.y + 3} x2={hd.l.x} y2={hd.l.y - 32} stroke={GOLD_FLAT} strokeWidth={1.3} strokeLinecap="round" />
          <path d={`M${hd.l.x - 3.5} ${hd.l.y - 22} h7 M${hd.l.x - 3} ${hd.l.y - 26} h6 M${hd.l.x - 2.2} ${hd.l.y - 30} h4.4`} stroke={GOLD_FLAT} strokeWidth={1.2} />
        </g>
      ); })()}
      {/* two acolytes kneel with their backs to us, one in roses, one in lilies */}
      <Person x={23} y={106} h={24} pose="sit" robe="#d9b86a" hair="#3a2a1e" face={false} belt={null} />
      <Person x={57} y={106} h={24} pose="sit" robe="#e9e2d0" hair="#8a5a3a" face={false} belt={null} />
      <circle cx={23} cy={84.4} r={1.1} fill={SKIN} />
      <circle cx={57} cy={84.4} r={1.1} fill={SKIN} />
      {[[19, 98], [26, 101], [22, 104]].map(([x, y], i) => <Rose key={i} x={x} y={y} r={1.4} />)}
      {[[53, 99], [60, 102]].map(([x, y], i) => <Lily key={i} x={x} y={y} s={2.4} />)}
      {/* the crossed keys */}
      <g stroke={GOLD_FLAT} strokeWidth={1.3} fill="none" strokeLinecap="round">
        <path d="M33 108 l14 -9 M47 108 l-14 -9" />
        <circle cx={32} cy={108.8} r={2} />
        <circle cx={48} cy={108.8} r={2} />
        <path d="M45.5 100 l1.5 -1 M44 101 l1.5 -1 M34.5 100 l-1.5 -1 M36 101 l-1.5 -1" strokeWidth={1} />
      </g>
    </g>
  ),
  6: () => (
    <g>
      <Sun x={40} y={8} r={11} rays={16} />
      <Cloud x={40} y={44} w={40} />
      {/* the angel, wings spread, arms out in blessing over both */}
      <Wings x={40} y={26} span={38} />
      <Person x={40} y={46} h={28} pose="out" robe="#7d5aa6" inner="#a98bd0" hair="#c94a3a" halo belt={null} />
      <Mountains y={86} opacity={0.3} />
      {/* the tree of knowledge with the serpent, and the tree of flame */}
      <Tree x={11} y={100} h={32} fill={LEAF} />
      {[[7, 78], [14, 74], [10, 84], [16, 82], [5, 86], [18, 78]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.3} fill={BLOOD} stroke={INK} strokeWidth={0.3} />)}
      <path d="M8 98 q5 -8 -1 -14 q-5 -6 2 -12" fill="none" stroke={GOLD_FLAT} strokeWidth={1.4} strokeLinecap="round" />
      <path d="M8 98 q5 -8 -1 -14 q-5 -6 2 -12" fill="none" stroke={INK} strokeWidth={0.35} strokeLinecap="round" opacity={0.6} />
      <path d="M9 72 q1.5 -2 3.5 -1 q-1 1.5 -3.5 1 z" fill={GOLD_FLAT} stroke={INK} strokeWidth={0.3} />
      <circle cx={11} cy={71.6} r={0.3} fill={INK} />
      <path d="M12.5 71.2 l1.5 -0.4 M12.5 71.6 l1.5 0.4" stroke={BLOOD} strokeWidth={0.3} />
      <path d="M67.5 100 l0.5 -24 l2 0 l0.5 24 z" fill="#5a3a22" stroke={INK} strokeWidth={0.5} />
      <path d="M69 84 l-5 -6 M69 80 l5 -5 M69 88 l5 -4" stroke="#5a3a22" strokeWidth={1.2} strokeLinecap="round" />
      {[[61, 74], [66, 68], [72, 66], [77, 73], [69, 78], [63, 80], [75, 82]].map(([x, y], i) => <Flame key={i} x={x} y={y} s={4} />)}
      {/* the two, unclothed, one looking to the angel, one to her */}
      <Person x={27} y={100} h={36} pose="raise-left" robe={SKIN} hair="#d9a441" belt={null} />
      <Person x={53} y={100} h={37} pose="out" robe={SKIN} hair="#3a2a1e" belt={null} />
      <Ground y={100} fill={LEAF} opacity={0.6} />
      <Grass x={34} y={100} w={14} n={5} />
    </g>
  ),
  7: () => (
    <g>
      <Water y={36} rows={1} />
      <rect x={0} y={22} width={80} height={12} fill={PALE} opacity={0.65} />
      <rect x={0} y={22} width={80} height={12} fill="url(#hatch)" opacity={0.25} />
      <path d="M0 26 h80 M0 30 h80 M10 22 v4 M30 22 v4 M50 22 v4 M70 22 v4 M20 26 v4 M40 26 v4 M60 26 v4" stroke={INK} strokeWidth={0.3} opacity={0.4} />
      {[6, 20, 34, 48, 62, 76].map((x) => (
        <rect key={x} x={x - 3} y={16} width={6} height={7} fill={PALE} opacity={0.65} />
      ))}
      <path d="M40 22 v-10 h6 v10 M40 12 l3 -3 l3 3" fill={PALE} opacity={0.65} />
      <path d="M0 34 h80" stroke={INK} strokeWidth={0.4} opacity={0.4} />
      {/* a canopy of stars on four poles */}
      <rect x={16} y={28} width={48} height={8} fill="url(#skyDeep)" stroke={INK} strokeWidth={0.8} />
      {[18, 30, 42, 54].map((x, i) => (
        <Star key={i} x={x + 4} y={32} r={2} points={5} />
      ))}
      {[24, 36, 48, 60].map((x) => <Star key={x} x={x} y={30} r={0.9} points={5} fill={PALE} />)}
      {/* a fringe along the canopy's hem */}
      <path d={Array.from({ length: 12 }, (_, i) => `M${17 + i * 4} 36 l2 3 l2 -3`).join(' ')} fill="none" stroke={GOLD_FLAT} strokeWidth={0.5} />
      {[18, 62].map((x) => (
        <line key={x} x1={x} y1={36} x2={x} y2={72} stroke={INK} strokeWidth={1.2} />
      ))}
      {/* the charioteer in armour, moons at the shoulders, a star on the crown */}
      <Person x={40} y={86} h={46} pose="hold" robe="#8a8f99" inner="#c9cdd4" hair="#d9a441" crown belt={GOLD_FLAT} />
      {/* the breastplate with its square, and mail over the skirt */}
      <rect x={35.5} y={52} width={9} height={9} rx={1} fill="#b0b5be" stroke={INK} strokeWidth={0.4} />
      <rect x={38.2} y={54.7} width={3.6} height={3.6} fill="none" stroke={INK} strokeWidth={0.5} />
      <path d="M33 66 h14 v6 h-14 z" fill="url(#crosshatch)" opacity={0.6} />
      <Star x={40} y={35.5} r={2.2} points={8} />
      <path d="M29.5 49 a3 3 0 1 0 4 4 a2.3 2.3 0 1 1 -4 -4 z M50.5 49 a3 3 0 1 1 -4 4 a2.3 2.3 0 1 0 4 -4 z" fill={PALE} stroke={INK} strokeWidth={0.4} />
      {(() => { const hd = hands(40, 86, 46, 'hold'); return (
        <line x1={hd.r.x} y1={hd.r.y + 2} x2={hd.r.x + 1} y2={hd.r.y - 18} stroke={GOLD_FLAT} strokeWidth={1.3} strokeLinecap="round" />
      ); })()}
      {/* the chariot box, a winged disc on its face */}
      <path d="M18 72 h44 v18 q0 3 -3 3 h-38 q-3 0 -3 -3 z" fill="#d8d4c8" stroke={INK} strokeWidth={0.9} />
      <rect x={18} y={72} width={44} height={21} fill="url(#hatch)" opacity={0.5} />
      <g>
        <circle cx={40} cy={78} r={2.6} fill={GOLD} stroke={INK} strokeWidth={0.4} />
        <path d="M37.4 78 q-6 -4 -12 -1 q5 0 8 2.5 M42.6 78 q6 -4 12 -1 q-5 0 -8 2.5" fill={GOLD} stroke={INK} strokeWidth={0.4} />
        <circle cx={40} cy={87} r={2.2} fill="none" stroke={INK} strokeWidth={0.6} />
        <path d="M40 85 v-2" stroke={INK} strokeWidth={0.8} />
      </g>
      {/* wheels */}
      <circle cx={22} cy={96} r={6} fill={GOLD} stroke={INK} strokeWidth={0.8} />
      <circle cx={58} cy={96} r={6} fill={GOLD} stroke={INK} strokeWidth={0.8} />
      <path d="M22 90 v12 M16 96 h12 M58 90 v12 M52 96 h12 M18 92 l8 8 M18 100 l8 -8 M54 92 l8 8 M54 100 l8 -8" stroke={INK} strokeWidth={0.5} />
      {/* two sphinxes, black and white, couchant either side */}
      <Sphinx x={2} y={106} fill={INK} face="#4a4a58" feature={PALE} />
      <Sphinx x={78} y={106} fill={PALE} face={SKIN} feature={INK} facing="left" />
      <Ground y={106} fill={GOLD_FLAT} opacity={0.5} />
    </g>
  ),
  8: () => (
    <g>
      <Mountains y={74} opacity={0.22} />
      <path d="M0 82 q30 -10 80 -4 v10 q-40 -4 -80 4 z" fill={LEAF} opacity={0.35} />
      <Ground y={100} fill="#d9b06a" opacity={0.6} />
      <Grass x={2} y={100} w={20} n={6} />
      {[[6, 98], [12, 96]].map(([x, y], i) => <Rose key={i} x={x} y={y} r={1.3} color={PALE} />)}
      {/* the lion: a tawny body, a hatched flank, a scalloped mane, the muzzle turned up to her hands */}
      <path d="M70 92 q10 -8 3 -20" fill="none" stroke="#c98a3c" strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={72.5} cy={71} r={2.2} fill="#8a5a22" />
      <ellipse cx={57} cy={92} rx={18} ry={8.5} fill="#c98a3c" stroke={INK} strokeWidth={0.7} />
      <path d="M46 97 l-2 5 h5 M62 97 l1 5 h5 M71 96 l1 5 h4" fill="none" stroke={INK} strokeWidth={0.8} strokeLinecap="round" />
      <path d="M46 97 l-2 5 h5 z M62 97 l1 5 h5 z M71 96 l1 5 h4 z" fill="#c98a3c" />
      <ellipse cx={60} cy={94} rx={14} ry={6} fill="url(#hatch)" opacity={0.45} />
      <path d="M47 66 q4 -6 8 -2 q6 -4 10 2 q6 0 6 6 q4 4 0 9 q2 6 -4 7 q-2 5 -8 3 q-5 4 -9 -1 q-6 1 -7 -5 q-5 -2 -2 -8 q-3 -6 3 -8 z" fill="#8a5a22" stroke={INK} strokeWidth={0.5} />
      <path d="M50 70 q6 -3 12 0 q4 3 4 8 q-1 6 -6 8 q-6 1 -10 -3 q-3 -6 0 -13 z" fill="url(#crosshatch)" opacity={0.5} />
      <circle cx={49} cy={78} r={9.5} fill="#e0a85a" stroke={INK} strokeWidth={0.7} />
      <path d="M44 74 q2 -1.5 4 0 M50 74 q2 -1.5 4 0" fill="none" stroke={INK} strokeWidth={0.7} />
      <circle cx={46} cy={75.2} r={0.8} fill={INK} />
      <circle cx={52} cy={75.2} r={0.8} fill={INK} />
      <ellipse cx={45} cy={82} rx={5} ry={3.6} fill="#e9c58a" stroke={INK} strokeWidth={0.5} />
      <path d="M43.5 80.5 l-1.5 1.5 h3 z" fill={INK} />
      <path d="M41 83 q2 2 4 0.5 M45 83.5 q2 1.5 4 0" fill="none" stroke={INK} strokeWidth={0.5} />
      <path d="M40 82 l-3 -0.5 M40 84 l-3 0.8 M50 82 l3 -0.5 M50 84 l3 0.8" stroke={INK} strokeWidth={0.35} opacity={0.7} />
      {/* she leans in, both hands at the jaw, a garland at her waist and in her hair */}
      <Person x={22} y={96} h={44} pose="reach-right" robe={PALE} inner="#f3ecd8" hair="#d9a441" belt={null} />
      {/* a garland of roses climbs from her waist over her shoulder */}
      <path d="M14 73 q8 3 14 0 q4 -6 2 -14" fill="none" stroke={LEAF} strokeWidth={0.8} />
      {[[15, 73], [19, 74.5], [23, 74.5], [27, 73], [29.5, 66], [30, 60]].map(([x, y], i) => <Rose key={i} x={x} y={y} r={1.5} />)}
      {[[18.5, 51], [25.5, 51]].map(([x, y], i) => <Rose key={i} x={x} y={y} r={1.3} />)}
      <Infinity x={22} y={46} s={4} />
    </g>
  ),
  9: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill="#0e0c1c" opacity={0.8} />
      <Star x={16} y={18} r={2} points={5} />
      <Star x={66} y={12} r={1.6} points={5} />
      <Star x={30} y={8} r={1.2} points={5} />
      {/* snow on the peaks, then the dark below */}
      <Mountains y={90} opacity={0.9} fill="#1c1830" />
      <path d="M0 112 L20 96 L40 104 L60 92 L80 100 V112 Z" fill="#26213d" />
      <path d="M0 112 L20 96 L40 104 L60 92 L80 100 V112 Z" fill="url(#hatch)" opacity={0.6} />
      <path d="M0 96 l6 -6 l6 6 M60 92 l6 -6 l6 6" fill="#e8e6f0" opacity={0.6} />
      {/* the lantern's light, then the lantern held up, then the one who carries it */}
      <circle cx={61} cy={44} r={22} fill={GOLD_FLAT} opacity={0.12} />
      <circle cx={61} cy={44} r={11} fill={GOLD_FLAT} opacity={0.18} />
      {Array.from({ length: 18 }, (_, i) => <circle key={i} cx={(i * 17 + 5) % 80} cy={(i * 23 + 9) % 100} r={0.7} fill={PALE} opacity={0.6} />)}
      <Person x={40} y={98} h={48} pose="raise-right" robe="#a9acb8" inner="#8f93a0" hair="#d0d0d0" belt={null} shade />
      {/* deep folds in the grey cloak */}
      <path d="M30 70 q-2 12 -1 26 M36 66 q-1 14 0 30 M46 68 q1 14 0 28" fill="none" stroke={INK} strokeWidth={0.4} opacity={0.5} />
      <ellipse cx={58} cy={100} rx={16} ry={4} fill={GOLD_FLAT} opacity={0.12} />
      {/* hood over the head, a long white beard */}
      <path d="M33 56 q0 -9 7 -10 q7 1 7 10 q-2 -5 -7 -5 q-5 0 -7 5 z" fill="#8f93a0" stroke={INK} strokeWidth={0.5} />
      <path d="M36.5 57 q1 6 3.5 12 q2.5 -6 3.5 -12 q-3.5 3 -7 0 z" fill="#e8e6f0" stroke={INK} strokeWidth={0.35} />
      {(() => { const hd = hands(40, 98, 48, 'raise-right'); return (
        <g>
          <path d={`M${hd.r.x} ${hd.r.y} q1 3 3 5`} fill="none" stroke={INK} strokeWidth={0.8} />
          <Lantern x={hd.r.x + 3} y={hd.r.y + 10} />
          <line x1={hd.l.x} y1={hd.l.y + 4} x2={hd.l.x} y2={hd.l.y - 40} stroke={GOLD_FLAT} strokeWidth={1.6} strokeLinecap="round" />
          <line x1={hd.l.x} y1={hd.l.y + 4} x2={hd.l.x} y2={hd.l.y - 40} stroke={INK} strokeWidth={0.4} strokeLinecap="round" opacity={0.5} />
          <circle cx={hd.l.x} cy={hd.l.y - 41} r={1.8} fill={GOLD_FLAT} stroke={INK} strokeWidth={0.4} />
          <path d={`M${hd.l.x - 1.6} ${hd.l.y - 20} q1.6 1.5 3.2 0 M${hd.l.x - 1.6} ${hd.l.y - 8} q1.6 1.5 3.2 0`} fill="none" stroke={INK} strokeWidth={0.4} opacity={0.6} />
        </g>
      ); })()}
    </g>
  ),
  10: () => (
    <g>
      {/* the four in the corners, each on a cloud with a book: angel, eagle, lion, bull */}
      {[[10, 14], [70, 14], [10, 100], [70, 100]].map(([x, y], i) => <Cloud key={i} x={x - 8} y={y + 2} w={18} />)}
      <g>
        <Wings x={10} y={12} span={12} />
        <Person x={10} y={20} h={13} pose="hold" robe={PALE} hair="#d9a441" belt={null} shade={false} />
        <g>
          <ellipse cx={70} cy={16} rx={3.6} ry={4.6} fill="#8a5a22" stroke={INK} strokeWidth={0.4} />
          <path d="M66.5 14 q-6 -6 -8 0 q4 -1 6 3 M73.5 14 q6 -6 8 0 q-4 -1 -6 3" fill="#8a5a22" stroke={INK} strokeWidth={0.4} />
          <circle cx={70} cy={10.5} r={2.4} fill={PALE} stroke={INK} strokeWidth={0.4} />
          <path d="M71.5 10.5 l2.5 0.8 l-2.5 1.2 z" fill={GOLD_FLAT} stroke={INK} strokeWidth={0.3} />
          <circle cx={69.4} cy={10} r={0.4} fill={INK} />
        </g>
        <g>
          <circle cx={10} cy={97} r={3.4} fill="#e0a85a" stroke={INK} strokeWidth={0.4} />
          {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <line key={i} x1={10 + Math.cos(a) * 3.4} y1={97 + Math.sin(a) * 3.4} x2={10 + Math.cos(a) * 5.4} y2={97 + Math.sin(a) * 5.4} stroke="#8a5a22" strokeWidth={1.4} strokeLinecap="round" />; })}
          <circle cx={8.8} cy={96.4} r={0.4} fill={INK} />
          <circle cx={11.2} cy={96.4} r={0.4} fill={INK} />
        </g>
        <g>
          <circle cx={70} cy={97} r={3.6} fill="#5a4a3a" stroke={INK} strokeWidth={0.4} />
          <path d="M66.5 95 q-3 -4 -1 -6 q2 1 2 5 M73.5 95 q3 -4 1 -6 q-2 1 -2 5" fill="none" stroke={PALE} strokeWidth={1} />
          <circle cx={68.8} cy={97} r={0.4} fill={PALE} />
          <circle cx={71.2} cy={97} r={0.4} fill={PALE} />
        </g>
        {[[10, 24], [70, 24], [10, 104], [70, 104]].map(([x, y], i) => (
          <g key={i}>
            <path d={`M${x - 4.5} ${y} q4.5 -1.5 9 0 v3 q-4.5 -1.5 -9 0 z`} fill={PALE} stroke={INK} strokeWidth={0.35} />
            <path d={`M${x} ${y - 0.5} v3.5 M${x - 3} ${y + 1} h2 M${x + 1} ${y + 1} h2 M${x - 3} ${y + 2} h2 M${x + 1} ${y + 2} h2`} stroke={INK} strokeWidth={0.25} opacity={0.7} />
          </g>
        ))}
      </g>
      <circle cx={40} cy={56} r={30} fill={GOLD_FLAT} opacity={0.12} />
      <g className="live-spin">
        <circle cx={40} cy={56} r={26} fill={PALE} stroke={INK} strokeWidth={1.2} />
        <circle cx={40} cy={56} r={26} fill="url(#hatch)" opacity={0.12} />
        <circle cx={40} cy={56} r={23.5} fill="none" stroke={INK} strokeWidth={0.4} opacity={0.5} />
        <circle cx={40} cy={56} r={17} fill="none" stroke={INK} strokeWidth={0.8} />
        <circle cx={40} cy={56} r={6} fill={GOLD} stroke={INK} strokeWidth={0.8} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <line key={i} x1={40 + Math.cos(a) * 6} y1={56 + Math.sin(a) * 6} x2={40 + Math.cos(a) * 17} y2={56 + Math.sin(a) * 17} stroke={INK} strokeWidth={0.8} />;
        })}
        {['T', 'A', 'R', 'O'].map((ch, i) => {
          const a = (i / 4) * Math.PI * 2 - Math.PI / 4;
          return <text key={ch} x={40 + Math.cos(a) * 21.5} y={56 + Math.sin(a) * 21.5 + 2.5} fontSize={6.5} textAnchor="middle" fill={INK} fontFamily="Georgia, serif">{ch}</text>;
        })}
        {/* the four alchemical marks between the letters */}
        <g stroke={INK} strokeWidth={0.6} fill="none">
          <path d="M40 34 v4 M38 36 h4 M38.5 31.5 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0" />
          <path d="M60 54 l2 4 h-4 z M60 58 v2 M58 60 h4" />
          <path d="M38 79 l2 -4 l2 4 z" />
          <path d="M18.5 56 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 M18.5 56 h4" />
        </g>
      </g>
      {/* the serpent down the left, the jackal up the right, the sphinx on top */}
      <path d="M14 66 q-6 10 2 22" fill="none" stroke="#d9a441" strokeWidth={2} strokeLinecap="round" />
      <path d="M14 66 q-6 10 2 22" fill="none" stroke={INK} strokeWidth={0.4} />
      <circle cx={13.5} cy={65} r={1.6} fill="#d9a441" stroke={INK} strokeWidth={0.4} />
      {/* the jackal-headed one rises on the right: a red figure, a jackal's muzzle and tall ears */}
      <g transform="translate(3 4)">
        <Person x={68} y={86} h={30} pose="raise-left" robe={BLOOD} inner="#c94a3a" hair="none" belt={GOLD_FLAT} face={false} shade={false} />
        <path d="M64 61 q4 -3 8 0 l3 2 q-1 2 -3 1.5 l-8 0 z" fill={BLOOD} stroke={INK} strokeWidth={0.4} />
        <path d="M65 60 l-1.5 -6 l3.5 4.5 M71 60 l1.5 -6 l-3.5 4.5" fill={BLOOD} stroke={INK} strokeWidth={0.4} />
        <circle cx={69.5} cy={61.2} r={0.5} fill={PALE} />
        <circle cx={75} cy={63} r={0.5} fill={INK} />
      </g>
      <g>
        <Sphinx x={26} y={30} fill="#5f7fb0" face="#8fa8d0" feature={INK} />
        <line x1={51} y1={28} x2={51} y2={12} stroke={GOLD_FLAT} strokeWidth={1.2} strokeLinecap="round" />
        <path d="M49 26 h4" stroke={GOLD_FLAT} strokeWidth={1} />
      </g>
    </g>
  ),
  11: () => (
    <g>
      <Pillar x={10} y={4} h={94} />
      <Pillar x={70} y={4} h={94} />
      <rect x={16} y={4} width={48} height={90} fill="#5a2d7a" opacity={0.28} />
      <rect x={16} y={4} width={48} height={90} fill="url(#hatch)" opacity={0.25} />
      {/* the veil hangs from a rod, its folds falling straight */}
      <path d="M14 6 h52" stroke={GOLD_FLAT} strokeWidth={1.2} strokeLinecap="round" />
      {[22, 30, 38, 46, 54, 62].map((x) => <path key={x} d={`M${x} 7 q-1 40 0 86`} fill="none" stroke="#5a2d7a" strokeWidth={0.6} opacity={0.5} />)}
      {[10, 70].map((x) => <path key={x} d={`M${x - 6} 8 q3 -3 6 0 q3 -3 6 0 v2 h-12 z`} fill={PALE} stroke={INK} strokeWidth={0.5} />)}
      <Throne x={40} y={92} w={30} h={30} fill="#b8b4a8" back="square" />
      {/* the green mantle, then the red robe, crown with its square jewel */}
      <path d="M28 52 L18 92 H62 L52 52 Z" fill={LEAF} stroke={INK} strokeWidth={0.5} />
      <Person x={40} y={92} h={50} pose="raise-right" robe="#b8462f" inner="#c94a3a" hair="#3a2a1e" crown belt={GOLD_FLAT} />
      <rect x={38.4} y={40.2} width={3.2} height={3.2} fill={PALE} stroke={INK} strokeWidth={0.4} />
      <rect x={37.5} y={55} width={5} height={5} rx={0.5} fill={GOLD} stroke={INK} strokeWidth={0.4} transform="rotate(45 40 57.5)" />
      {(() => { const hd = hands(40, 92, 50, 'raise-right'); return (
        <g>
          {/* the sword upright in one hand, the scales in the other */}
          <line x1={hd.r.x} y1={hd.r.y + 2} x2={hd.r.x} y2={hd.r.y - 20} stroke="#c9cdd4" strokeWidth={2.2} strokeLinecap="round" />
          <line x1={hd.r.x} y1={hd.r.y - 4} x2={hd.r.x} y2={hd.r.y - 21} stroke={INK} strokeWidth={0.5} />
          <path d={`M${hd.r.x - 4} ${hd.r.y - 3} h8`} stroke={GOLD_FLAT} strokeWidth={1.4} />
          <g stroke={GOLD_FLAT} strokeWidth={1} fill="none">
            <line x1={hd.l.x} y1={hd.l.y} x2={hd.l.x} y2={hd.l.y - 5} />
            <line x1={hd.l.x - 8} y1={hd.l.y - 5} x2={hd.l.x + 8} y2={hd.l.y - 5} />
            <path d={`M${hd.l.x - 8} ${hd.l.y - 5} l-3 9 M${hd.l.x - 8} ${hd.l.y - 5} l3 9 M${hd.l.x + 8} ${hd.l.y - 5} l-3 9 M${hd.l.x + 8} ${hd.l.y - 5} l3 9`} />
          </g>
          <path d={`M${hd.l.x - 12} ${hd.l.y + 4} h8 q-1 3 -4 3 q-3 0 -4 -3 z M${hd.l.x + 4} ${hd.l.y + 4} h8 q-1 3 -4 3 q-3 0 -4 -3 z`} fill={GOLD} stroke={INK} strokeWidth={0.5} />
        </g>
      ); })()}
    </g>
  ),
  12: () => (
    <g>
      {/* a living gallows: two trunks and a beam, leaves still on it */}
      <rect x={13} y={6} width={5} height={102} fill="#5a3a22" stroke={INK} strokeWidth={0.5} />
      <rect x={62} y={6} width={5} height={102} fill="#5a3a22" stroke={INK} strokeWidth={0.5} />
      <rect x={10} y={6} width={60} height={5} fill="#5a3a22" stroke={INK} strokeWidth={0.5} />
      <path d="M15 12 q1 20 -0.5 40 q1.5 24 0 54 M64.5 12 q-1 20 0.5 40 q-1.5 24 0 54 M12 8.5 q30 1 56 0" fill="none" stroke={INK} strokeWidth={0.35} opacity={0.5} />
      <rect x={16} y={6} width={2} height={102} fill="url(#hatch)" opacity={0.6} />
      <rect x={65} y={6} width={2} height={102} fill="url(#hatch)" opacity={0.6} />
      <circle cx={40} cy={82} r={12} fill={GOLD_FLAT} opacity={0.12} />
      {[20, 30, 46, 56].map((x) => (
        <path key={x} d={`M${x} 11 q3 4 0 8 q-3 -4 0 -8`} fill={LEAF} stroke={INK} strokeWidth={0.4} />
      ))}
      {[[13, 30], [18, 50], [13, 70], [67, 40], [62, 60], [67, 84], [18, 90], [62, 24], [13, 100]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} q${x < 40 ? 4 : -4} -3 ${x < 40 ? 6 : -6} 0 q${x < 40 ? -3 : 3} 3 ${x < 40 ? -6 : 6} 0 z`} fill={LEAF} stroke={INK} strokeWidth={0.35} />
      ))}
      <g className="live-sway">
        {/* the rope, the tied foot, the straight leg; the other leg bent behind into a four */}
        <line x1={48} y1={11} x2={48} y2={22} stroke="#b89a6a" strokeWidth={1.4} />
        <path d="M36 50 L28 40 L44 33" fill="none" stroke="#c94a3a" strokeWidth={4.2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M36 50 L28 40 L44 33" fill="none" stroke={INK} strokeWidth={0.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <ellipse cx={45.5} cy={32} rx={2.6} ry={1.6} fill="#d9a441" stroke={INK} strokeWidth={0.4} transform="rotate(-30 45.5 32)" />
        <line x1={44} y1={52} x2={48} y2={24} stroke="#c94a3a" strokeWidth={4.4} strokeLinecap="round" />
        <ellipse cx={48.3} cy={21.5} rx={2.8} ry={1.7} fill="#d9a441" stroke={INK} strokeWidth={0.4} />
        <path d="M46.5 22 h4" stroke="#b89a6a" strokeWidth={1.2} />
        {/* arms folded behind the back */}
        <path d="M33 72 q-4 -8 2 -14 M47 72 q4 -8 -2 -14" fill="none" stroke="#3f6fa8" strokeWidth={3} strokeLinecap="round" />
        {/* the blue tunic, belted, and the head with its halo */}
        <path d="M32 50 h16 l-1 24 q-7 3 -14 0 z" fill="#3f6fa8" stroke={INK} strokeWidth={0.6} />
        <path d="M40 50 h8 l-1 24 q-3.5 1.5 -7 1.5 z" fill="url(#hatch)" />
        <path d="M35 54 q0 10 0.5 18 M44.5 54 q0 10 -0.5 18" fill="none" stroke={INK} strokeWidth={0.35} opacity={0.5} />
        <path d="M32 52 h16" stroke={GOLD_FLAT} strokeWidth={1.4} />
        <path d="M34 76 q6 -3 12 0" fill="none" stroke={INK} strokeWidth={0.4} />
        {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <line key={i} x1={40 + Math.cos(a) * 7} y1={82 + Math.sin(a) * 7} x2={40 + Math.cos(a) * 10} y2={82 + Math.sin(a) * 10} stroke={GOLD_FLAT} strokeWidth={0.9} strokeLinecap="round" />; })}
        <g transform="rotate(180 40 82)">
          <Head x={40} y={82} r={5} hair="#d9a441" />
        </g>
      </g>
    </g>
  ),
  13: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill="url(#skyDeep)" opacity={0.35} />
      {/* the two towers on the horizon, the sun rising between them, the river */}
      <rect x={4} y={34} width={9} height={28} fill={INK} opacity={0.6} />
      <rect x={67} y={34} width={9} height={28} fill={INK} opacity={0.6} />
      <path d="M3 34 h11 M66 34 h11" stroke={INK} strokeWidth={1} opacity={0.6} />
      <Sun x={40} y={38} r={7} rays={8} />
      <Water y={60} rows={2} />
      <path d="M0 68 h80 v44 h-80 z" fill="#3a3040" opacity={0.4} />
      <Ground y={104} fill="#2a2030" opacity={0.7} />
      {/* the fallen king, crown rolled away, under the hooves */}
      <g transform="rotate(-84 12 104)">
        <Person x={12} y={104} h={26} pose="stand" robe="#7d5aa6" inner="#d9a441" hair="#9a9088" belt={null} face={false} />
      </g>
      <path d="M2 108 l0 -4 l2 2 l2 -3 l2 3 l2 -2 l0 4 z" fill={GOLD} stroke={INK} strokeWidth={0.4} />
      {/* the bishop pleads, the child kneels with a flower */}
      <Person x={70} y={104} h={24} pose="raise-right" robe="#d9b86a" inner={PALE} hair="none" belt={null} />
      <path d="M67.3 82.5 l2.7 -5.5 l2.7 5.5 z" fill={GOLD} stroke={INK} strokeWidth={0.4} />
      <Person x={58} y={106} h={13} pose="sit" robe="#e9e2d0" hair="#d9a441" belt={null} face={false} />
      <Rose x={54} y={103} r={1.3} color={PALE} />
      {/* the pale horse, and its rider in black armour with the banner of the white rose */}
      <Horse x={46} y={104} fill={PALE} w={48} />
      <Person x={42} y={88} h={44} pose="hold" robe={INK} inner="#3a3a44" hair="none" belt="#3a3a44" face={false} />
      {(() => { const hd = hands(42, 88, 44, 'hold'); return (
        <g>
          <line x1={hd.l.x + 2} y1={hd.l.y + 4} x2={24} y2={24} stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
          <path d="M24 24 h-20 l2 9 l-2 9 h20 z" fill={INK} stroke="#3a3a44" strokeWidth={0.5} />
          {[0, 1, 2, 3, 4].map((i) => { const a = (i / 5) * Math.PI * 2; return <circle key={i} cx={13 + Math.cos(a) * 2.6} cy={33 + Math.sin(a) * 2.6} r={1.7} fill={PALE} />; })}
          <circle cx={13} cy={33} r={1.2} fill={PALE} />
        </g>
      ); })()}
      {/* the skull under the crested helm */}
      <circle cx={42} cy={48.4} r={4.4} fill={PALE} stroke={INK} strokeWidth={0.5} />
      <circle cx={40.3} cy={48} r={1} fill={INK} />
      <circle cx={43.7} cy={48} r={1} fill={INK} />
      <path d="M41.5 50.2 l0.5 1 l0.5 -1" fill="none" stroke={INK} strokeWidth={0.4} />
      <path d="M40 52.2 h4 M41 52.2 v1.2 M42 52.2 v1.2 M43 52.2 v1.2" stroke={INK} strokeWidth={0.4} />
      <path d="M37 45 q5 -5 10 0 l-0.5 -3 q-4.5 -3 -9 0 z" fill={INK} stroke="#3a3a44" strokeWidth={0.4} />
      <path d="M41.5 42 q0.5 -5 1 -8 q1 4 0.5 8 z" fill={BLOOD} stroke={INK} strokeWidth={0.3} />
    </g>
  ),
  14: () => (
    <g>
      {/* the road to the crown of light, the pool, the irises */}
      <Sun x={66} y={12} r={6} rays={8} />
      <path d="M62 20 l4 -6 l4 6 z" fill={GOLD} stroke={INK} strokeWidth={0.4} />
      <path d="M54 30 q12 18 2 36 q-6 12 10 30" fill="none" stroke="#d9c39a" strokeWidth={4} opacity={0.7} />
      <Mountains y={72} opacity={0.18} />
      <path d="M0 92 q20 -6 34 0 v20 h-34 z" fill="#7fa3c9" opacity={0.6} />
      <path d="M30 90 q4 2 6 6 v16 h-6 z" fill="url(#hatch)" opacity={0.4} />
      <path d="M2 96 q1 -6 0 -12 M5 98 q1 -6 0 -11" fill="none" stroke={LEAF} strokeWidth={0.7} />
      <Water y={96} rows={2} />
      {[[44, 100], [50, 104], [56, 99], [62, 106], [68, 101]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={2.2} ry={1.1} fill="#8c8a94" stroke={INK} strokeWidth={0.3} opacity={0.8} />)}
      {[6, 12].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={100} x2={x} y2={84} stroke="#5a7a3a" strokeWidth={1} />
          <path d={`M${x} 84 l-3 -4 l3 1 l3 -1 z M${x} 84 l-2 3 M${x} 84 l2 3`} fill="#7a3fa0" stroke={INK} strokeWidth={0.3} />
          <path d={`M${x} 94 q-3 -2 -4 -6 q3 1 4 6 M${x} 92 q3 -2 4 -6 q-3 1 -4 6`} fill={LEAF} stroke={INK} strokeWidth={0.25} />
        </g>
      ))}
      {/* the angel: one foot in the water, one on the stone, a cup in either hand */}
      <Wings x={38} y={48} span={44} />
      <Person x={38} y={92} h={52} pose="out" robe={PALE} inner="#f3ecd8" hair="#d9a441" halo belt={null} />
      <circle cx={38} cy={46.2} r={1.6} fill={GOLD} stroke={INK} strokeWidth={0.3} />
      <path d="M34 66 l4 -6 l4 6 z" fill="none" stroke={GOLD_FLAT} strokeWidth={0.9} />
      <rect x={32.5} y={67} width={11} height={1.2} fill={GOLD_FLAT} />
      {(() => { const hd = hands(38, 92, 52, 'out'); return (
        <g>
          <Cup x={hd.l.x - 1} y={hd.l.y - 8} s={4.5} />
          <Cup x={hd.r.x + 1} y={hd.r.y + 2} s={4.5} />
          <path d={`M${hd.l.x - 1} ${hd.l.y - 11} q14 -8 ${hd.r.x - hd.l.x + 2} ${hd.r.y - hd.l.y + 10}`} fill="none" stroke="#6ab7d6" strokeWidth={2.2} strokeLinecap="round" />
          <path d={`M${hd.l.x - 1} ${hd.l.y - 11} q14 -8 ${hd.r.x - hd.l.x + 2} ${hd.r.y - hd.l.y + 10}`} fill="none" stroke={PALE} strokeWidth={0.6} strokeLinecap="round" opacity={0.7} />
        </g>
      ); })()}
    </g>
  ),
  15: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={INK} opacity={0.75} />
      <Star x={40} y={9} r={6} points={5} fill={PALE} />
      {/* bat wings, the horned one on the half cube, torch pointed down */}
      <path d="M36 36 q-14 -12 -30 -4 q6 2 6 8 q6 -2 8 4 q6 -2 8 6 z M44 36 q14 -12 30 -4 q-6 2 -6 8 q-6 -2 -8 4 q-6 -2 -8 6 z" fill="#2a2030" stroke={PALE} strokeWidth={0.5} />
      <path d="M28 74 l4 -4 h24 l-4 4 z" fill="#3a3040" stroke={PALE} strokeWidth={0.5} />
      <rect x={28} y={74} width={24} height={12} fill={INK} stroke={PALE} strokeWidth={0.8} />
      <rect x={28} y={74} width={24} height={12} fill="url(#hatch)" opacity={0.5} />
      <circle cx={40} cy={80} r={1.8} fill="none" stroke={PALE} strokeWidth={0.7} />
      <path d="M40 78.2 v-2" stroke={PALE} strokeWidth={0.6} />
      {/* veins in the bat wings */}
      <path d="M36 36 q-8 -6 -18 -4 M36 36 q-6 -2 -12 4 M44 36 q8 -6 18 -4 M44 36 q6 -2 12 4" fill="none" stroke={PALE} strokeWidth={0.3} opacity={0.6} />
      <Person x={40} y={76} h={50} pose="raise-right" robe="#5a4a3a" inner="#6f5c48" hair="#3a2a1e" belt={null} />
      <path d="M35.5 28 q-5 -4 -3 -11 q2 4 5 8 M44.5 28 q5 -4 3 -11 q-2 4 -5 8" fill="#3a2a1e" stroke={PALE} strokeWidth={0.4} />
      <path d="M38.2 24 l1.8 3.2 l1.8 -3.2 l-3.6 2 h3.6 z" fill={PALE} opacity={0.9} />
      <path d="M33 74 l-6 8 q-2 3 2 4 M47 74 l6 8 q2 3 -2 4" fill="none" stroke="#5a4a3a" strokeWidth={1.2} />
      {(() => { const hd = hands(40, 76, 50, 'raise-right'); return (
        <g>
          <path d={`M${hd.r.x - 1.5} ${hd.r.y - 2} v-4 M${hd.r.x + 1.5} ${hd.r.y - 2} v-4 M${hd.r.x - 0.2} ${hd.r.y - 2.5} v-4.5`} stroke={SKIN_INK} strokeWidth={0.8} strokeLinecap="round" />
          <line x1={hd.l.x} y1={hd.l.y} x2={hd.l.x - 2} y2={hd.l.y + 12} stroke="#8a5a22" strokeWidth={1.6} strokeLinecap="round" />
          <g transform={`rotate(180 ${hd.l.x - 2} ${hd.l.y + 14})`}>
            <Flame x={hd.l.x - 2} y={hd.l.y + 14} s={4} />
          </g>
        </g>
      ); })()}
      {/* the two, chained loosely, small horns and tails, one tail aflame */}
      <Person x={16} y={108} h={28} pose="stand" robe={SKIN} hair="#3a2a1e" belt={null} />
      <Person x={64} y={108} h={28} pose="stand" robe={SKIN} hair="#d9a441" belt={null} />
      <path d="M13.5 82 l-1 -3 l2 2 M18.5 82 l1 -3 l-2 2 M61.5 82 l-1 -3 l2 2 M66.5 82 l1 -3 l-2 2" fill="none" stroke={INK} strokeWidth={0.7} />
      <path d="M21 100 q6 -2 4 -8" fill="none" stroke={SKIN_INK} strokeWidth={1} strokeLinecap="round" />
      <path d="M59 100 q-6 -2 -4 -8" fill="none" stroke={SKIN_INK} strokeWidth={1} strokeLinecap="round" />
      <Flame x={55} y={91} s={2.6} />
      <Chain x={18} y={88} len={12} angle={-30} />
      <Chain x={50} y={82} len={12} angle={30} />
      <circle cx={16.5} cy={86.5} r={1.6} fill="none" stroke={INK} strokeWidth={0.7} />
      <circle cx={63.5} cy={86.5} r={1.6} fill="none" stroke={INK} strokeWidth={0.7} />
      <Ground y={108} fill="#1a1420" />
    </g>
  ),
  16: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill="url(#skyDeep)" opacity={0.6} />
      <Cloud x={2} y={22} w={26} />
      <Cloud x={52} y={16} w={26} />
      <Mountains y={90} opacity={0.9} fill={INK} />
      {/* the tower of grey stone on its crag, the crown struck off */}
      <path d="M22 112 l8 -18 h20 l8 18 z" fill="#2a2030" />
      <path d="M22 112 l8 -18 h20 l8 18 z" fill="url(#crosshatch)" opacity={0.5} />
      <path d="M26 104 l4 -6 M52 100 l4 6" stroke={INK} strokeWidth={0.5} opacity={0.6} />
      {/* smoke rolls from the windows, and the bolt lights the sky about it */}
      <circle cx={58} cy={18} r={14} fill={GOLD_FLAT} opacity={0.1} />
      <path d="M36 48 q-6 -4 -4 -12 q4 4 6 10 M46 64 q6 -4 5 -12 q-4 4 -5 10" fill="#3a3040" opacity={0.6} />
      <rect x={30} y={36} width={20} height={60} fill="#b8b4a8" stroke={INK} strokeWidth={1} />
      <rect x={30} y={36} width={20} height={60} fill="url(#hatch)" opacity={0.7} />
      {[[33, 44], [43, 44], [33, 56], [43, 56], [33, 68], [43, 68], [33, 80], [43, 80]].map(([x, y], i) => <path key={i} d={`M${x} ${y} h5 M${x + 2} ${y} v${i % 2 ? 4 : 0}`} stroke={INK} strokeWidth={0.4} opacity={0.6} />)}
      {[32, 38, 44].map((x) => (
        <rect key={x} x={x} y={32} width={4} height={5} fill="#b8b4a8" stroke={INK} strokeWidth={0.8} />
      ))}
      <rect x={35} y={50} width={4} height={6} fill="#1a1420" />
      <rect x={41} y={66} width={4} height={6} fill="#1a1420" />
      <g transform="rotate(-25 40 26) translate(-6 -6)">
        <path d="M28 30 l6 -8 l6 6 l6 -6 l6 8 z" fill={GOLD} stroke={INK} strokeWidth={0.7} />
        <circle cx={34} cy={23.5} r={0.8} fill={BLOOD} />
        <circle cx={46} cy={23.5} r={0.8} fill={BLOOD} />
        <circle cx={40} cy={27.5} r={0.8} fill="#6ab7d6" />
      </g>
      <Lightning x={62} y={4} len={44} />
      <Flame x={34} y={40} s={5} />
      <Flame x={46} y={48} s={6} />
      <Flame x={37} y={52} s={4} />
      <Flame x={43} y={68} s={4} />
      {/* two fall headlong, the crowned one and the one in blue */}
      <g transform="rotate(150 17 64)">
        <Person x={17} y={64} h={22} pose="raise-right" robe="#b8462f" inner="#d9a441" hair="#9a9088" crown belt={null} />
      </g>
      <g transform="rotate(-140 63 72)">
        <Person x={63} y={72} h={22} pose="raise-left" robe="#3f6fa8" inner="#7fa3c9" hair="#d9a441" belt={null} />
      </g>
      {[8, 14, 66, 72, 20, 60, 10, 70, 24, 58].map((x, i) => (
        <path key={i} d={`M${x} ${18 + i * 7} q1.2 3 0 5 q-1.2 -2 0 -5`} fill={GOLD} />
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
      <Mountains y={78} opacity={0.18} />
      {/* the ibis in its tree */}
      <Tree x={70} y={82} h={22} fill={LEAF} />
      <path d="M68 66 q3 -3 5 0 l1 3 h-6 z" fill={PALE} stroke={INK} strokeWidth={0.4} />
      <path d="M73 65 q3 -1 4 2" fill="none" stroke={INK} strokeWidth={0.7} />
      {/* the pool, and the dry ground with its five streams */}
      <path d="M0 90 q14 -6 30 0 v22 h-30 z" fill="#7fa3c9" opacity={0.6} />
      <path d="M0 90 q14 -6 30 0 v3 q-16 -5 -30 0 z" fill="url(#hatch)" opacity={0.5} />
      <Star x={12} y={104} r={2.4} points={8} fill={PALE} />
      <Water y={96} rows={2} />
      <Ground y={100} fill={LEAF} opacity={0.5} />
      <Grass x={50} y={100} w={22} n={6} />
      <Grass x={34} y={106} w={12} n={4} />
      {[[62, 104], [72, 102]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.1} fill={PALE} stroke={INK} strokeWidth={0.25} />)}
      {/* she kneels, one knee on the land, and pours from both jugs */}
      <Person x={42} y={98} h={38} pose="reach-left" robe={SKIN} hair="#d9a441" belt={null} />
      {(() => { const hd = hands(42, 98, 38, 'reach-left'); return (
        <g>
          <g transform={`rotate(-40 ${hd.l.x - 2} ${hd.l.y + 3})`}>
            <Cup x={hd.l.x - 2} y={hd.l.y + 3} s={3.6} />
          </g>
          <path d={`M${hd.l.x - 6} ${hd.l.y + 2} q-6 6 -6 14`} fill="none" stroke="#6ab7d6" strokeWidth={1.6} strokeLinecap="round" />
          <g transform={`rotate(-40 ${hd.r.x + 3} ${hd.r.y + 4})`}>
            <Cup x={hd.r.x + 3} y={hd.r.y + 4} s={3.6} />
          </g>
          <path d={`M${hd.r.x} ${hd.r.y + 3} q-2 8 6 18`} fill="none" stroke="#6ab7d6" strokeWidth={1.6} strokeLinecap="round" />
          <path d={`M${hd.r.x + 6} ${hd.r.y + 21} l-4 3 M${hd.r.x + 6} ${hd.r.y + 21} l-1 4 M${hd.r.x + 6} ${hd.r.y + 21} l2 4 M${hd.r.x + 6} ${hd.r.y + 21} l5 2`} fill="none" stroke="#6ab7d6" strokeWidth={1} strokeLinecap="round" />
        </g>
      ); })()}
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
      {[20, 30, 50, 60, 12, 68].map((x, i) => (
        <path key={i} d={`M${x} ${38 + (i % 2) * 6} q1 3 0 5 q-1 -2 0 -5`} fill={GOLD} />
      ))}
      <Mountains y={62} opacity={0.5} fill="#2a2440" />
      {/* the two towers, the path that winds between them, the pool below */}
      <rect x={6} y={46} width={9} height={30} fill="#3a3040" stroke={INK} strokeWidth={0.6} />
      <rect x={65} y={46} width={9} height={30} fill="#3a3040" stroke={INK} strokeWidth={0.6} />
      <path d="M5 46 h11 M64 46 h11 M8 43 h2 v3 h-2 z M12 43 h2 v3 h-2 z M67 43 h2 v3 h-2 z M71 43 h2 v3 h-2 z" fill="#3a3040" stroke={INK} strokeWidth={0.5} />
      <path d="M38 112 q-6 -20 4 -40 q6 -10 -2 -20" fill="none" stroke={PALE} strokeWidth={3} opacity={0.5} />
      <path d="M38 112 q-6 -20 4 -40 q6 -10 -2 -20" fill="none" stroke="url(#hatch)" strokeWidth={3} opacity={0.6} />
      {/* the dog and the wolf, both baying at the moon */}
      <g>
        <path d="M13 88 q0 -8 6 -9 l4 -1 q3 2 2 6 v4 z" fill="#d9c39a" stroke={INK} strokeWidth={0.6} />
        <path d="M23 78 l3 -6 l2 2 l2 -2 q1 5 -3 7 q-3 1 -4 -1 z" fill="#d9c39a" stroke={INK} strokeWidth={0.6} />
        <path d="M26 74 q5 -1 6 3" fill="none" stroke={INK} strokeWidth={0.5} />
        <circle cx={27.5} cy={76} r={0.5} fill={INK} />
        <path d="M13 88 q-4 -3 -2 -8" fill="none" stroke="#d9c39a" strokeWidth={1.4} strokeLinecap="round" />
      </g>
      <g>
        <path d="M67 88 q0 -8 -6 -9 l-4 -1 q-3 2 -2 6 v4 z" fill="#3a3a44" stroke={INK} strokeWidth={0.6} />
        <path d="M57 78 l-3 -6 l-2 2 l-2 -2 q-1 5 3 7 q3 1 4 -1 z" fill="#3a3a44" stroke={INK} strokeWidth={0.6} />
        <path d="M54 74 q-5 -1 -6 3" fill="none" stroke={PALE} strokeWidth={0.5} />
        <circle cx={52.5} cy={76} r={0.5} fill={PALE} />
        <path d="M67 88 q4 -3 2 -8" fill="none" stroke="#3a3a44" strokeWidth={1.4} strokeLinecap="round" />
      </g>
      <path d="M0 92 q40 -8 80 0 v20 h-80 z" fill="#2a3a5a" opacity={0.7} />
      <Water y={94} rows={3} />
      {/* the crayfish climbing out */}
      <g className="live-rise">
        <path d="M36 104 q4 -6 8 0 q-2 4 -4 4 q-2 0 -4 -4" fill={BLOOD} stroke={INK} strokeWidth={0.5} />
        <path d="M37 103 l-3 -5 l-2 1 M43 103 l3 -5 l2 1 M35 106 l-3 1 M45 106 l3 1 M36 108 l-2 2 M44 108 l2 2" fill="none" stroke={BLOOD} strokeWidth={1.2} strokeLinecap="round" />
        <path d="M34 98 l-1.5 -2 M36 98 l1.5 -2 M46 98 l1.5 -2 M44 98 l-1.5 -2" stroke={BLOOD} strokeWidth={1} strokeLinecap="round" />
      </g>
    </g>
  ),
  19: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={GOLD_FLAT} opacity={0.18} />
      <Sun x={40} y={22} r={14} rays={20} face />
      {/* the garden wall, sunflowers turned to the child */}
      <rect x={0} y={56} width={80} height={16} fill="#d9c39a" stroke={INK} strokeWidth={0.8} />
      <rect x={0} y={56} width={80} height={16} fill="url(#hatch)" opacity={0.45} />
      {[[0, 60], [16, 60], [32, 60], [48, 60], [64, 60], [8, 66], [24, 66], [40, 66], [56, 66], [72, 66]].map(([x, y], i) => <path key={i} d={`M${x} ${y} h14`} stroke={INK} strokeWidth={0.4} opacity={0.5} />)}
      {[10, 26, 54, 70].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={56} x2={x} y2={46} stroke={LEAF} strokeWidth={1.2} />
          <path d={`M${x - 3} 52 q-4 -1 -5 2 q3 1 5 -1`} fill={LEAF} stroke={INK} strokeWidth={0.3} />
          {Array.from({ length: 10 }, (_, k) => { const a = (k / 10) * Math.PI * 2; return <ellipse key={k} cx={x + Math.cos(a) * 4.6} cy={44 + Math.sin(a) * 4.6} rx={1.6} ry={1} fill={GOLD} stroke={INK} strokeWidth={0.3} transform={`rotate(${(a * 180) / Math.PI} ${x + Math.cos(a) * 4.6} ${44 + Math.sin(a) * 4.6})`} />; })}
          <circle cx={x} cy={44} r={2.6} fill="#5a3a22" stroke={INK} strokeWidth={0.4} />
        </g>
      ))}
      <Ground y={104} fill={GOLD_FLAT} opacity={0.7} />
      {/* the child on the white horse, a red feather in the hair, the banner streaming */}
      <Horse x={40} y={102} fill={PALE} w={40} />
      <Person x={38} y={90} h={26} pose="out" robe={SKIN} hair="#d9a441" belt={null} />
      <path d="M40 64 q-1 -8 4 -12 q0 6 -2 11" fill={BLOOD} stroke={INK} strokeWidth={0.3} /><path d="M40 64 q1 -6 3 -9" fill="none" stroke={INK} strokeWidth={0.3} />
      {[[33, 66], [36, 64.5], [39, 64], [42, 64.5], [45, 66]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={0.9} fill={BLOOD} />)}
      {(() => { const hd = hands(38, 90, 26, 'out'); return (
        <g>
          <line x1={hd.l.x} y1={hd.l.y + 2} x2={hd.l.x - 2} y2={hd.l.y - 22} stroke={INK} strokeWidth={1.2} strokeLinecap="round" />
          <path d={`M${hd.l.x - 2} ${hd.l.y - 22} l-16 4 q4 4 0 8 l16 2 z`} fill={BLOOD} stroke={INK} strokeWidth={0.5} />
        </g>
      ); })()}
    </g>
  ),
  20: () => (
    <g>
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI - Math.PI;
        return <line key={i} x1={40} y1={26} x2={40 + Math.cos(a) * 60} y2={26 + Math.sin(a) * 60} stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.35} />;
      })}
      <Cloud x={2} y={30} w={30} />
      <Cloud x={48} y={26} w={32} />
      {/* the angel in the clouds, the trumpet raised, the banner of the cross */}
      <Wings x={40} y={26} span={40} />
      <Person x={40} y={46} h={30} pose="raise-left" robe="#7fa3c9" inner="#d9e4f2" hair="#d9a441" halo belt={null} />
      {(() => { const hd = hands(40, 46, 30, 'raise-left'); return (
        <g>
          <line x1={hd.l.x + 1} y1={hd.l.y + 1} x2={hd.l.x - 6} y2={hd.l.y - 5} stroke={GOLD_FLAT} strokeWidth={1.6} strokeLinecap="round" />
          <path d={`M${hd.l.x - 6} ${hd.l.y - 5} l-8 -5 l2 9 z`} fill={GOLD} stroke={INK} strokeWidth={0.5} />
          <rect x={hd.l.x - 8} y={hd.l.y + 2} width={9} height={8} fill={PALE} stroke={INK} strokeWidth={0.5} />
          <path d={`M${hd.l.x - 3.5} ${hd.l.y + 3} v6 M${hd.l.x - 6.5} ${hd.l.y + 6} h6`} stroke={BLOOD} strokeWidth={1.2} />
        </g>
      ); })()}
      <Mountains y={74} opacity={0.3} />
      <path d="M0 74 l8 -8 l8 8 M64 74 l8 -8 l8 8" fill={PALE} opacity={0.5} />
      <Water y={104} rows={2} />
      {/* the three rise grey from their coffins on the water, arms lifted */}
      {[14, 40, 66].map((x, i) => (
        <g key={i}>
          <path d={`M${x - 10} 106 v-14 h20 v14`} fill="#3a3040" stroke={PALE} strokeWidth={0.5} />
          <path d={`M${x - 10} 96 h20`} stroke={PALE} strokeWidth={0.4} opacity={0.6} />
          <Person x={x} y={94} h={28} pose="up" robe="#c9c4d4" inner="#dedae6" hair={i === 1 ? '#3a2a1e' : '#9a9088'} belt={null} face={i !== 1} />
        </g>
      ))}
    </g>
  ),
  21: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill="url(#skyDeep)" opacity={0.25} />
      {/* laurel wreath tied with red ribbons */}
      <g className="live-spin live-spin--slow">
        <ellipse cx={40} cy={56} rx={27} ry={41} fill="none" stroke={INK} strokeWidth={7} />
        <ellipse cx={40} cy={56} rx={27} ry={41} fill="none" stroke="#5a7a3a" strokeWidth={5} />
        {Array.from({ length: 26 }, (_, i) => {
          const a = (i / 26) * Math.PI * 2;
          const x = 40 + Math.cos(a) * 27;
          const y = 56 + Math.sin(a) * 41;
          return <ellipse key={i} cx={x} cy={y} rx={3.4} ry={1.6} fill={i % 2 ? '#8fb35a' : '#7aa050'} stroke={INK} strokeWidth={0.4} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} />;
        })}
      </g>
      {[[40, 15], [40, 97]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x - 6} ${y} q6 -4 12 0 q-6 4 -12 0`} fill={BLOOD} stroke={INK} strokeWidth={0.5} />
          <path d={`M${x - 3} ${y + 1} l-3 5 M${x + 3} ${y + 1} l3 5`} stroke={BLOOD} strokeWidth={1.4} strokeLinecap="round" />
        </g>
      ))}
      {/* the dancer, a wand in either hand, the sash about her */}
      <Person x={40} y={84} h={46} pose="out" robe={SKIN} hair="#8a5a3a" belt={null} />
      {(() => { const hd = hands(40, 84, 46, 'out'); return (
        <g>
          <line x1={hd.l.x} y1={hd.l.y + 3} x2={hd.l.x - 2} y2={hd.l.y - 9} stroke={GOLD_FLAT} strokeWidth={1.6} strokeLinecap="round" />
          <line x1={hd.r.x} y1={hd.r.y + 3} x2={hd.r.x + 2} y2={hd.r.y - 9} stroke={GOLD_FLAT} strokeWidth={1.6} strokeLinecap="round" />
        </g>
      ); })()}
      <path d="M30 56 q10 8 20 -6 q2 14 -8 20 q-4 -8 -12 -14 z" fill="#7a3fa0" stroke={INK} strokeWidth={0.4} />
      <path d="M32 58 q8 6 16 -4" fill="none" stroke={INK} strokeWidth={0.3} opacity={0.6} />
      {/* the four in the corners */}
      {[[8, 12], [72, 12], [8, 100], [72, 100]].map(([x, y], i) => <Cloud key={i} x={x - 9} y={y + 3} w={18} />)}
      <Head x={8} y={9} r={3.4} hair="#d9a441" />
      <g>
        <ellipse cx={72} cy={12} rx={3.2} ry={4} fill="#8a5a22" stroke={INK} strokeWidth={0.4} />
        <path d="M69 10 q-5 -5 -7 0 q3 -1 5 2 M75 10 q5 -5 7 0 q-3 -1 -5 2" fill="#8a5a22" stroke={INK} strokeWidth={0.4} />
        <circle cx={72} cy={7} r={2.2} fill={PALE} stroke={INK} strokeWidth={0.4} />
        <path d="M73.5 7 l2.2 0.7 l-2.2 1.1 z" fill={GOLD_FLAT} stroke={INK} strokeWidth={0.3} />
      </g>
      <g>
        <circle cx={8} cy={99} r={3.2} fill="#e0a85a" stroke={INK} strokeWidth={0.4} />
        {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <line key={i} x1={8 + Math.cos(a) * 3.2} y1={99 + Math.sin(a) * 3.2} x2={8 + Math.cos(a) * 5} y2={99 + Math.sin(a) * 5} stroke="#8a5a22" strokeWidth={1.3} strokeLinecap="round" />; })}
        <circle cx={6.9} cy={98.4} r={0.4} fill={INK} />
        <circle cx={9.1} cy={98.4} r={0.4} fill={INK} />
      </g>
      <g>
        <circle cx={72} cy={99} r={3.4} fill="#5a4a3a" stroke={INK} strokeWidth={0.4} />
        <path d="M68.6 97 q-3 -4 -1 -6 q2 1 2 5 M75.4 97 q3 -4 1 -6 q-2 1 -2 5" fill="none" stroke={PALE} strokeWidth={1} />
        <circle cx={70.8} cy={99} r={0.4} fill={PALE} />
        <circle cx={73.2} cy={99} r={0.4} fill={PALE} />
      </g>
    </g>
  ),
};
