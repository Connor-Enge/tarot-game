import type { ReactElement } from 'react';
import {
  BLOOD, Chain, Cloud, Cup, Figure, Flame, GOLD, GOLD_FLAT, Ground, Horse, INK, Infinity, Lantern, Lightning, Moon, Mountains, PALE, Pentacle, Pillar, Star, Sun, Sword, Throne, Tree, Wand, Water, Wings,
} from './primitives';
import { Cliff, Grass, Lily, Person, Pomegranate, Rose, Wheat, hands, SKIN, SKIN_INK, LEAF } from './figure';

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
      <path d="M0 4 q40 10 80 0" fill="none" stroke={LEAF} strokeWidth={1} />
      {[8, 22, 40, 58, 72].map((x, i) => <Rose key={x} x={x} y={6 + (i % 2) * 2} r={2.4} />)}
      <path d="M0 96 q20 -8 40 0 t40 0 v16 h-80 z" fill={LEAF} opacity={0.5} />
      {[6, 18, 30].map((x, i) => <Rose key={x} x={x} y={101 + (i % 2) * 3} r={2.6} />)}
      {[50, 62, 74].map((x, i) => <Lily key={x} x={x} y={100 + (i % 2) * 2} s={3.2} />)}
      {/* the table and the four tools */}
      <rect x={13} y={82} width={54} height={4} fill={PALE} stroke={INK} strokeWidth={0.7} />
      <rect x={14} y={86} width={52} height={2} fill="url(#hatch)" />
      {[17, 63].map((x) => <rect key={x} x={x} y={86} width={2.2} height={12} fill={INK} />)}
      <Wand x={22} y={76} s={5} />
      <Cup x={34} y={77} s={4.5} />
      <Sword x={47} y={76} s={5} />
      <Pentacle x={59} y={76} s={4.5} />
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
      {/* the serpent belt, biting its tail */}
      <path d="M34 57 q6 -3 12 0 q-6 3 -12 0 z" fill="none" stroke={LEAF} strokeWidth={1} />
      <circle cx={46} cy={57} r={0.7} fill={LEAF} />
      <circle cx={40} cy={30} r={2} fill={PALE} stroke={INK} strokeWidth={0.4} />
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
      <path d="M0 64 q20 -4 40 0 t40 0 v6 q-20 4 -40 0 t-40 0 z" fill="#5a7a3a" opacity={0.6} />
      <path d="M0 62 q22 -3 44 1 t36 -1" fill="none" stroke="#8fc3e0" strokeWidth={2.2} opacity={0.8} />
      <path d="M0 62 q22 -3 44 1 t36 -1" fill="none" stroke={PALE} strokeWidth={0.6} opacity={0.6} strokeDasharray="3 4" />
      {/* the cushioned throne, the empress, sceptre and shield */}
      <Throne x={42} y={92} w={34} h={26} fill="#c94a3a" back="arch" />
      <rect x={26} y={68} width={32} height={6} rx={3} fill="#e0a39a" stroke={INK} strokeWidth={0.4} />
      <Person x={42} y={92} h={50} pose="raise-right" robe="#f1e5c8" inner="#e9d9b6" hair="#d9a441" crown belt="#c94a3a" />
      {[[36, 74], [44, 78], [40, 84], [48, 86]].map(([x, y], i) => <Pomegranate key={i} x={x} y={y} r={1.5} />)}
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
      <Person x={40} y={94} h={52} pose="sit-hold" robe="#b8462f" inner="#8a8f99" hair="#e8e2d6" crown belt={GOLD_FLAT} />
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
      <g stroke={GOLD_FLAT} strokeWidth={1.2} fill="none">
        <path d="M34 108 l12 -8 M46 108 l-12 -8" />
        <circle cx={33} cy={108.6} r={1.6} />
        <circle cx={47} cy={108.6} r={1.6} />
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
      {[[7, 78], [14, 74], [10, 84], [16, 82]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.3} fill={BLOOD} stroke={INK} strokeWidth={0.3} />)}
      <path d="M8 98 q5 -8 -1 -14 q-5 -6 2 -12" fill="none" stroke={GOLD_FLAT} strokeWidth={1.3} strokeLinecap="round" />
      <circle cx={9.5} cy={71.5} r={1.1} fill={GOLD_FLAT} />
      <line x1={69} y1={100} x2={69} y2={76} stroke={INK} strokeWidth={1.8} />
      {[[61, 74], [66, 68], [72, 66], [77, 73], [69, 78]].map(([x, y], i) => <Flame key={i} x={x} y={y} s={4.2} />)}
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
      {[6, 20, 34, 48, 62, 76].map((x) => (
        <rect key={x} x={x - 3} y={16} width={6} height={7} fill={PALE} opacity={0.65} />
      ))}
      <path d="M0 34 h80" stroke={INK} strokeWidth={0.4} opacity={0.4} />
      {/* a canopy of stars on four poles */}
      <rect x={16} y={28} width={48} height={8} fill="url(#skyDeep)" stroke={INK} strokeWidth={0.8} />
      {[18, 30, 42, 54].map((x, i) => (
        <Star key={i} x={x + 4} y={32} r={2} points={5} />
      ))}
      {[18, 62].map((x) => (
        <line key={x} x1={x} y1={36} x2={x} y2={72} stroke={INK} strokeWidth={1.2} />
      ))}
      {/* the charioteer in armour, moons at the shoulders, a star on the crown */}
      <Person x={40} y={86} h={46} pose="hold" robe="#8a8f99" inner="#c9cdd4" hair="#d9a441" crown belt={GOLD_FLAT} />
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
      {/* two sphinxes, black and white, lying in wait */}
      <g>
        <path d="M2 106 v-6 q1 -7 8 -8 h6 q4 1 4 6 v8 z" fill={INK} />
        <circle cx={17} cy={93} r={3.4} fill={INK} />
        <path d="M13.5 91 l-1.5 6 h10 l-1.5 -6 z" fill={INK} />
        <path d="M14 91 q3 -3 6 0" fill="none" stroke={GOLD_FLAT} strokeWidth={0.6} />
        <circle cx={16} cy={93.5} r={0.5} fill={PALE} />
        <circle cx={18.5} cy={93.5} r={0.5} fill={PALE} />
      </g>
      <g>
        <path d="M78 106 v-6 q-1 -7 -8 -8 h-6 q-4 1 -4 6 v8 z" fill={PALE} stroke={INK} strokeWidth={0.6} />
        <circle cx={63} cy={93} r={3.4} fill={PALE} stroke={INK} strokeWidth={0.6} />
        <path d="M59.5 91 l-1.5 6 h10 l-1.5 -6 z" fill={PALE} stroke={INK} strokeWidth={0.5} />
        <path d="M60 91 q3 -3 6 0" fill="none" stroke={GOLD_FLAT} strokeWidth={0.6} />
        <circle cx={61.5} cy={93.5} r={0.5} fill={INK} />
        <circle cx={64} cy={93.5} r={0.5} fill={INK} />
      </g>
      <Ground y={106} fill={GOLD_FLAT} opacity={0.5} />
    </g>
  ),
  8: () => (
    <g>
      <Mountains y={74} opacity={0.22} />
      <Ground y={100} fill="#d9b06a" opacity={0.6} />
      <Grass x={2} y={100} w={20} n={6} />
      {/* the lion: body, legs, mane, a face that has stopped roaring, a tail curling up */}
      <path d="M70 92 q10 -8 3 -20" fill="none" stroke="#c98a3c" strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={72.5} cy={71} r={2.2} fill="#8a5a22" />
      <ellipse cx={56} cy={92} rx={19} ry={8.5} fill="#c98a3c" stroke={INK} strokeWidth={0.7} />
      <path d="M44 96 l-2 5 h5 M60 96 l1 5 h5 M70 96 l1 5 h4" fill="none" stroke={INK} strokeWidth={0.8} strokeLinecap="round" />
      <rect x={38} y={84} width={36} height={16} fill="url(#hatch)" opacity={0.4} />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <path key={i} d={`M${47 + Math.cos(a) * 10} ${78 + Math.sin(a) * 10} l${Math.cos(a) * 6} ${Math.sin(a) * 6}`} stroke="#8a5a22" strokeWidth={3} strokeLinecap="round" />;
      })}
      <circle cx={47} cy={78} r={10.5} fill="#e0a85a" stroke={INK} strokeWidth={0.8} />
      <circle cx={43.5} cy={76} r={1.1} fill={INK} />
      <circle cx={50.5} cy={76} r={1.1} fill={INK} />
      <path d="M47 80 l-1.5 2 h3 z" fill={INK} />
      <path d="M43 84 q4 2 8 0" fill="none" stroke={INK} strokeWidth={0.8} />
      {/* she leans in, both hands at the jaw, a garland at her waist and in her hair */}
      <Person x={22} y={96} h={44} pose="reach-right" robe={PALE} inner="#f3ecd8" hair="#d9a441" belt={null} />
      {[[15, 73], [19, 74.5], [23, 74.5], [27, 73]].map(([x, y], i) => <Rose key={i} x={x} y={y} r={1.5} />)}
      <path d="M14 73 q8 3 14 0" fill="none" stroke={LEAF} strokeWidth={0.7} />
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
      <Person x={40} y={98} h={48} pose="raise-right" robe="#a9acb8" inner="#8f93a0" hair="#d0d0d0" belt={null} shade />
      {/* hood over the head, a long white beard */}
      <path d="M33 56 q0 -9 7 -10 q7 1 7 10 q-2 -5 -7 -5 q-5 0 -7 5 z" fill="#8f93a0" stroke={INK} strokeWidth={0.5} />
      <path d="M36.5 57 q1 6 3.5 12 q2.5 -6 3.5 -12 q-3.5 3 -7 0 z" fill="#e8e6f0" stroke={INK} strokeWidth={0.35} />
      {(() => { const hd = hands(40, 98, 48, 'raise-right'); return (
        <g>
          <path d={`M${hd.r.x} ${hd.r.y} q1 3 3 5`} fill="none" stroke={INK} strokeWidth={0.8} />
          <Lantern x={hd.r.x + 3} y={hd.r.y + 10} />
          <line x1={hd.l.x} y1={hd.l.y + 4} x2={hd.l.x} y2={hd.l.y - 40} stroke={GOLD_FLAT} strokeWidth={1.6} strokeLinecap="round" />
          <circle cx={hd.l.x} cy={hd.l.y - 41} r={1.8} fill={GOLD_FLAT} />
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
        {[[10, 24], [70, 24], [10, 104], [70, 104]].map(([x, y], i) => <path key={i} d={`M${x - 4} ${y} h8 v2.5 h-8 z M${x} ${y} v2.5`} fill={PALE} stroke={INK} strokeWidth={0.35} />)}
      </g>
      <g className="live-spin">
        <circle cx={40} cy={56} r={26} fill={PALE} stroke={INK} strokeWidth={1.2} />
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
      <g>
        <path d="M62 84 q3 -14 6 -22 q3 8 6 22 z" fill={BLOOD} stroke={INK} strokeWidth={0.5} />
        <circle cx={68} cy={60} r={2.6} fill={BLOOD} stroke={INK} strokeWidth={0.5} />
        <path d="M66 58 l-1 -4 l2.5 2.5 M70 58 l1 -4 l-2.5 2.5" fill="none" stroke={BLOOD} strokeWidth={1.2} />
        <path d="M68 62 l3 1" stroke={INK} strokeWidth={0.6} />
      </g>
      <g>
        <path d="M30 30 h20 v-6 q-2 -6 -10 -6 q-8 0 -10 6 z" fill="#5f7fb0" stroke={INK} strokeWidth={0.5} />
        <circle cx={40} cy={16} r={3.6} fill="#5f7fb0" stroke={INK} strokeWidth={0.5} />
        <path d="M36 14 l-1.5 6 h11 l-1.5 -6 z" fill="#5f7fb0" stroke={INK} strokeWidth={0.4} />
        <circle cx={38.8} cy={16.4} r={0.5} fill={INK} />
        <circle cx={41.2} cy={16.4} r={0.5} fill={INK} />
        <line x1={47} y1={26} x2={47} y2={12} stroke={GOLD_FLAT} strokeWidth={1.2} />
      </g>
    </g>
  ),
  11: () => (
    <g>
      <Pillar x={10} y={4} h={94} />
      <Pillar x={70} y={4} h={94} />
      <rect x={16} y={4} width={48} height={90} fill="#5a2d7a" opacity={0.28} />
      <rect x={16} y={4} width={48} height={90} fill="url(#hatch)" opacity={0.25} />
      <Throne x={40} y={92} w={30} h={30} fill="#b8b4a8" back="square" />
      {/* the green mantle, then the red robe, crown with its square jewel */}
      <path d="M28 52 L18 92 H62 L52 52 Z" fill={LEAF} stroke={INK} strokeWidth={0.5} />
      <Person x={40} y={92} h={50} pose="raise-right" robe="#b8462f" inner="#c94a3a" hair="#3a2a1e" crown belt={GOLD_FLAT} />
      <rect x={38.4} y={40.2} width={3.2} height={3.2} fill={PALE} stroke={INK} strokeWidth={0.4} />
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
