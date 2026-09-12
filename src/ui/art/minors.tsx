import type { ReactElement } from 'react';
import type { Suit } from '../../engine';
import { ROBE, ROBE_PALE } from './palette';
import { BLOOD, Cloud, Flame, GOLD, GOLD_FLAT, Horse, INK, Moon, Mountains, PALE, Star, Sun, SUIT_SYMBOL, Cup as CupSym, Pentacle as PentSym, Sword as SwordSym, Throne, Tree, Water } from './primitives';
import { Person, Rose, hands, LEAF, SKIN, SKIN_INK, type Pose } from './figure';


/**
 * The numbered Minors are scenes, after the Waite-Smith convention: every
 * pip is present, but someone is doing something with them, and the doing
 * is the hint. Colour does the rest (see palette.ts).
 */

const GREEN = '#5a7a3a';
const SNOW = '#eef0f6';
const STONE = '#8c8a94';

/**
 * Each Ace is the suit given from a cloud, with the reference deck's
 * furniture: leaves falling from the living wand over a castle; five streams
 * pouring from the cup while a dove descends; a crown and laurel on the
 * sword's point over grey peaks; a garden gate and lilies under the coin.
 */
function AceScene({ suit }: { suit: Suit }): ReactElement {
  switch (suit) {
    case 'wands':
      return (
        <g>
          <Water y={78} rows={2} />
          <Mountains y={80} opacity={0.25} />
          <path d="M8 76 h14 v-10 h-14 z M10 66 h3 v-4 h-3 z M17 66 h3 v-4 h-3 z" fill={STONE} opacity={0.8} />
          <Ground y={92} fill={GREEN} opacity={0.6} />
          {[[30, 24], [62, 30], [36, 74], [66, 62], [58, 84], [28, 50]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} q2 -6 5 -8 q0 6 -5 8`} fill={GREEN} stroke={INK} strokeWidth={0.3} opacity={0.9} transform={`rotate(${i * 50} ${x} ${y})`} />
          ))}
        </g>
      );
    case 'cups':
      return (
        <g>
          <Water y={88} rows={4} />
          {[8, 20, 62, 72].map((x, i) => <path key={x} d={`M${x} ${94 + (i % 2) * 4} l-3 -6 l3 2 l3 -2 z`} fill="#7a3fa0" opacity={0.8} />)}
          {[38, 44, 50, 56, 62].map((x, i) => <path key={x} d={`M${x} 64 q${(i - 2) * 3} 10 ${(i - 2) * 6} 22`} fill="none" stroke="#6ab7d6" strokeWidth={1.4} strokeLinecap="round" />)}
          <path d="M44 22 q4 -6 8 -2 q-2 4 -6 4 l-4 3 z M52 20 l6 -4 l-2 6 z" fill={PALE} stroke={INK} strokeWidth={0.5} />
          <circle cx={50} cy={34} r={1.6} fill={PALE} stroke={INK} strokeWidth={0.4} />
        </g>
      );
    case 'swords':
      return (
        <g>
          <Mountains y={90} opacity={0.6} fill={STONE} />
          <path d="M40 30 l4 -6 l4 4 l4 -6 l4 6 l4 -4 l4 6 v6 h-24 z" fill={GOLD_FLAT} stroke={INK} strokeWidth={0.5} />
          <path d="M36 40 q14 -14 28 0" fill="none" stroke={GREEN} strokeWidth={2} />
          {[[38, 38], [46, 30], [56, 30], [64, 38]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={2.6} ry={1.2} fill={GREEN} transform={`rotate(${i * 30 - 45} ${x} ${y})`} />)}
          {[[26, 40], [70, 50], [30, 66]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q3 1 4 -2`} fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} />)}
        </g>
      );
    default:
      return (
        <g>
          <Ground y={88} fill={GREEN} opacity={0.6} />
          <path d="M14 88 V60 q26 -26 52 0 V88" fill="none" stroke={GREEN} strokeWidth={4} opacity={0.8} />
          {[18, 26, 54, 62].map((x, i) => <circle key={x} cx={x} cy={58 + (i % 2) * 5} r={2.2} fill={BLOOD} opacity={0.7} />)}
          <Mountains y={62} opacity={0.2} />
          {[10, 22, 58, 70].map((x) => <path key={x} d={`M${x} 96 v-8 M${x} 88 l-3 -4 l3 1 l3 -1 z`} fill={PALE} stroke={INK} strokeWidth={0.4} />)}
        </g>
      );
  }
}

const SUIT_SCENERY: Record<Suit, () => ReactElement> = {
  // a desert: three pyramids on the horizon, hot ground, sparse tufts
  wands: () => (
    <g>
      <Mountains y={84} opacity={0.18} />
      <path d="M8 84 l7 -10 l7 10 z M28 86 l5 -7 l5 7 z M58 85 l8 -12 l8 12 z" fill="#b8763a" opacity={0.45} />
      <path d="M15 74 l7 10 h-7 z M66 73 l8 12 h-8 z" fill="url(#hatch)" opacity={0.5} />
      <path d="M0 88 q20 -4 40 0 t40 0 v24 h-80 z" fill="#d9a36a" opacity={0.35} />
      <path d="M6 96 q2 -4 4 0 M50 100 q2 -4 4 0 M72 94 q2 -4 4 0" fill="none" stroke="#8a5a22" strokeWidth={0.6} opacity={0.6} />
    </g>
  ),
  // a sea: a far cliff, a sail on the horizon, the water, a strand
  cups: () => (
    <g>
      <path d="M56 86 l6 -12 l18 -2 v14 z" fill={STONE} opacity={0.35} />
      <path d="M62 74 l18 -2 v14 h-6 z" fill="url(#hatch)" opacity={0.4} />
      <path d="M18 84 v-9 l6 9 z M17 84 h8" fill={PALE} stroke={INK} strokeWidth={0.4} />
      <path d="M0 86 h80" stroke={INK} strokeWidth={0.4} opacity={0.4} />
      <Water y={98} rows={3} />
      <path d="M0 104 q20 -4 40 0 t40 0 v8 h-80 z" fill="#e9d9b6" opacity={0.5} />
    </g>
  ),
  // a windswept sky: layered clouds, a grey ridge, a tree bent by the wind
  swords: () => (
    <g>
      <Cloud x={-4} y={8} w={20} />
      <Cloud x={50} y={30} w={18} />
      <Cloud x={60} y={104} w={24} />
      <Mountains y={90} opacity={0.22} fill={STONE} />
      <path d="M8 104 q3 -8 -2 -16 q6 4 8 12 q4 -6 10 -6 q-6 4 -8 10 z" fill={INK} opacity={0.5} />
      <path d="M2 60 q8 -3 16 0 M60 70 q8 -3 16 0 M4 74 q6 -2 12 0" fill="none" stroke={PALE} strokeWidth={0.8} opacity={0.8} />
    </g>
  ),
  // a garden: rolling hills, a far castle, a vine on a stake, worked ground
  pentacles: () => (
    <g>
      <path d="M0 86 q20 -12 40 -4 t40 -2 v30 h-80 z" fill={GREEN} opacity={0.25} />
      <path d="M60 78 h4 v-6 h2 v6 h4 v-8 h2 v8 h3 v10 h-15 z" fill={STONE} opacity={0.6} />
      <path d="M0 100 q20 -10 40 0 t40 0 v12 h-80 z" fill={INK} opacity={0.25} />
      {[10, 30, 50, 70].map((x) => (
        <path key={x} d={`M${x} 100 q2 -6 4 0`} fill="none" stroke={INK} strokeWidth={0.8} opacity={0.5} />
      ))}
      <path d="M0 106 q40 -3 80 0 M0 110 q40 -3 80 0" fill="none" stroke={INK} strokeWidth={0.4} opacity={0.35} />
    </g>
  ),
};

/** Hair for each suit's court: fire red, water fair, air dark, earth brown. */
const COURT_HAIR: Record<Suit, string> = { wands: '#c94a3a', cups: '#d9a441', swords: '#3a2a1e', pentacles: '#5a3a22' };

/** Court dressing: what each suit's court carries around it. */
const COURT_DRESSING: Record<Suit, () => ReactElement> = {
  wands: () => (
    <g>
      <Sun x={14} y={16} r={6} rays={10} />
      <Flame x={12} y={100} s={5} />
      <Flame x={68} y={102} s={4} />
    </g>
  ),
  cups: () => (
    <g>
      <path d="M8 90 q5 -4 10 0 q-5 4 -10 0 z M18 90 l4 -3 v6 z" fill={PALE} stroke={INK} strokeWidth={0.5} />
      <path d="M62 104 a6 6 0 0 1 12 0 z" fill={PALE} stroke={INK} strokeWidth={0.5} />
      <path d="M64 104 l4 -5 M68 104 l0 -6 M72 104 l-4 -5" stroke={INK} strokeWidth={0.4} />
      <Star x={70} y={16} r={2.5} points={5} />
    </g>
  ),
  swords: () => (
    <g>
      <path d="M8 16 l4 -3 l4 3 M18 22 l4 -3 l4 3 M60 12 l4 -3 l4 3" fill="none" stroke={INK} strokeWidth={0.8} strokeLinecap="round" />
      <path d="M2 60 q8 -3 16 0 M60 70 q8 -3 16 0 M4 74 q6 -2 12 0" fill="none" stroke={PALE} strokeWidth={0.8} opacity={0.8} />
    </g>
  ),
  pentacles: () => (
    <g>
      <Tree x={12} y={104} h={22} />
      {[0, 1, 2].map((i) => <circle key={i} cx={8 + i * 4} cy={90 - (i % 2) * 4} r={1.3} fill={GOLD_FLAT} />)}
      <path d="M62 104 q6 -14 14 -10 q-2 8 -8 10 M66 100 q8 -2 12 -8" fill="none" stroke={INK} strokeWidth={0.8} />
      <path d="M70 96 q3 -5 7 -4 q-1 4 -7 4 z" fill={INK} opacity={0.6} />
    </g>
  ),
};

/** A plain ground band. */
const Ground = ({ y, fill = GREEN, opacity = 0.7 }: { y: number; fill?: string; opacity?: number }) => <path d={`M0 ${y} Q20 ${y - 3} 40 ${y} T80 ${y} L80 112 L0 112 Z`} fill={fill} opacity={opacity} />;

/** A row of pips laid on the ground as a fence or a stack. */
function Row({ suit, xs, y, s, angle }: { suit: Suit; xs: number[]; y: number; s: number; angle?: number }) {
  const Sym = SUIT_SYMBOL[suit];
  return (
    <g>
      {xs.map((x, i) => (
        <g key={i} transform={angle ? `rotate(${angle} ${x} ${y})` : undefined}>
          <Sym x={x} y={y} s={s} />
        </g>
      ))}
    </g>
  );
}

// --- Wands: will, work, the fire that moves things ------------------------

const WANDS: Record<number, () => ReactElement> = {
  2: () => (
    <g>
      {/* from the battlement he looks out over the bay to the far hills, the world in his hand */}
      <Mountains y={56} opacity={0.22} />
      <Water y={62} rows={2} />
      <path d="M0 74 q12 -4 24 0 v38 h-24 z" fill={GREEN} opacity={0.35} />
      <rect x={0} y={72} width={80} height={40} fill={STONE} />
      <rect x={0} y={72} width={80} height={40} fill="url(#hatch)" opacity={0.35} />
      {[0, 16, 32, 48, 64].map((x) => <rect key={x} x={x} y={66} width={8} height={7} fill={STONE} />)}
      <path d="M0 73 h80 M0 84 h80 M0 96 h80 M12 84 v12 M40 73 v11 M60 84 v12 M26 96 v10 M52 96 v10" stroke={INK} strokeWidth={0.35} opacity={0.4} />
      <Row suit="wands" xs={[70]} y={80} s={11} />
      <path d="M8 62 l2 -3 l2 3 z M20 60 l2 -3 l2 3 z" fill={PALE} stroke={INK} strokeWidth={0.3} />
      <Person x={30} y={100} h={48} pose="raise-left" robe={ROBE.wands} inner={ROBE_PALE.wands} hair="#3a2a1e" />
      <circle cx={13} cy={57} r={4.2} fill="url(#skySpirit)" stroke={INK} strokeWidth={0.6} />
      <path d="M8.8 57 h8.4 M13 52.8 v8.4 M9.5 54.5 q3.5 1.5 7 0 M9.5 59.5 q3.5 -1.5 7 0" fill="none" stroke={INK} strokeWidth={0.4} />
      <Row suit="wands" xs={[44]} y={82} s={11} />
      <path d="M4 100 q4 -6 8 0 q-4 -2 -8 0 z M12 102 q4 -6 8 0 q-4 -2 -8 0 z" fill={BLOOD} stroke={INK} strokeWidth={0.3} opacity={0.8} />
      <path d="M4 100 q2 3 8 0 M12 102 q2 3 8 0" fill="none" stroke={LEAF} strokeWidth={0.6} />
    </g>
  ),
  3: () => (
    <g>
      <Sun x={62} y={14} r={7} rays={10} />
      {/* from the headland he watches his three ships cross the golden sea */}
      <Mountains y={44} opacity={0.15} />
      <path d="M0 48 h80 v22 h-80 z" fill={GOLD_FLAT} opacity={0.2} />
      <Water y={52} rows={3} />
      {[16, 34, 56].map((x, i) => (
        <g key={x}>
          <path d={`M${x} ${52 + i} l2 -6 l2 6 z`} fill={PALE} stroke={INK} strokeWidth={0.4} />
          <path d={`M${x - 1.5} ${52 + i} h7 l-1.5 2 h-4 z`} fill={INK} opacity={0.7} />
        </g>
      ))}
      <path d="M0 78 q20 -8 40 -2 t40 -4 v40 h-80 z" fill="#8a6a3a" />
      <path d="M0 78 q20 -8 40 -2 t40 -4 v6 q-20 -2 -40 4 t-40 2 z" fill="url(#hatch)" opacity={0.4} />
      <Row suit="wands" xs={[18, 62]} y={86} s={11} />
      <Person x={40} y={104} h={52} pose="raise-right" robe={ROBE.wands} inner={ROBE_PALE.wands} hair="#3a2a1e" />
      <Row suit="wands" xs={[52]} y={80} s={11} />
    </g>
  ),
  4: () => (
    <g>
      {/* the castle beyond the moat; four staves hung with a garland of leaves, fruit and roses; two with bouquets raised */}
      <path d="M44 62 h32 v-20 h-32 z M46 42 v-5 h4 v5 M54 42 v-8 h6 v8 M66 42 v-5 h4 v5 M72 42 v-6 h4 v6" fill={STONE} opacity={0.55} />
      <path d="M60 62 v-10 h6 v10" fill={INK} opacity={0.4} />
      <path d="M50 46 h3 v3 h-3 z M68 48 h3 v3 h-3 z" fill={GOLD_FLAT} opacity={0.6} />
      <path d="M0 68 h80 v10 h-80 z" fill="#7fa3c9" opacity={0.35} />
      <Water y={72} rows={1} />
      <Ground y={100} fill={GOLD_FLAT} opacity={0.5} />
      <Row suit="wands" xs={[14, 30, 50, 66]} y={70} s={12} />
      <path d="M14 46 q26 16 52 0" fill="none" stroke={LEAF} strokeWidth={3.2} />
      {[18, 26, 34, 46, 54, 62].map((x, i) => <path key={x} d={`M${x} ${48 + Math.sin(i * 1.1) * 3} q-3 -4 -1 -6 q3 2 1 6 q3 -4 5 -2 q-3 3 -5 2`} fill={LEAF} stroke={INK} strokeWidth={0.3} />)}
      {[[22, 52], [40, 56], [58, 52]].map(([x, y], i) => <Rose key={i} x={x} y={y} r={2} />)}
      {[[30, 55], [50, 55]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} fill="#d98a3c" stroke={INK} strokeWidth={0.3} />)}
      <Person x={30} y={104} h={32} pose="up" robe={ROBE_PALE.wands} inner={PALE} hair="#d9a441" belt={BLOOD} />
      <Person x={50} y={104} h={32} pose="up" robe={ROBE.wands} inner={ROBE_PALE.wands} hair="#3a2a1e" />
      {(() => { const a = hands(30, 104, 32, 'up'); const b = hands(50, 104, 32, 'up'); return (
        <g>
          {[a.l, a.r, b.l, b.r].map((h, i) => (
            <g key={i}>
              <path d={`M${h.x} ${h.y} l${i % 2 ? 1 : -1} -6`} stroke={LEAF} strokeWidth={0.8} />
              <Rose x={h.x + (i % 2 ? 1 : -1)} y={h.y - 7} r={1.8} color={i < 2 ? BLOOD : GOLD_FLAT} />
            </g>
          ))}
        </g>
      ); })()}
    </g>
  ),
  5: () => (
    <g>
      {/* five at odds, staves crossing every way, on rough ground */}
      <Mountains y={70} opacity={0.12} />
      <Ground y={92} fill="#9aa27a" />
      {[[12, 100, 'raise-right', ROBE_PALE.wands, '#3a2a1e'], [28, 96, 'up', ROBE.wands, '#d9a441'], [44, 102, 'raise-left', '#3f6fa8', '#8a5a3a'], [60, 96, 'raise-right', LEAF, '#3a2a1e'], [72, 104, 'up', '#d9b86a', '#c94a3a']].map(([x, y, a, robe, hair], i) => (
        <Person key={i} x={x as number} y={y as number} h={30} pose={a as Pose} robe={robe as string} hair={hair as string} belt={GOLD_FLAT} />
      ))}
      {(() => { const specs: [number, number, Pose][] = [[12, 100, 'raise-right'], [28, 96, 'up'], [44, 102, 'raise-left'], [60, 96, 'raise-right'], [72, 104, 'up']]; const angles = [-25, 15, 35, -40, 10]; return (
        <g>
          {specs.map(([x, y, a], i) => { const hd = hands(x, y, 30, a); const h = a === 'raise-left' ? hd.l : hd.r; return (
            <g key={i} transform={`rotate(${angles[i]} ${h.x} ${h.y})`}>
              <Row suit="wands" xs={[h.x]} y={h.y - 2} s={10} />
            </g>
          ); })}
        </g>
      ); })()}
    </g>
  ),
  6: () => (
    <g>
      {/* the rider comes home laureled on a caparisoned horse; the footmen walk beside with their staves */}
      <Ground y={96} fill={GOLD_FLAT} opacity={0.5} />
      {[[8, 104, '#3a3a44'], [70, 104, LEAF], [16, 103, '#7d5aa6'], [64, 103, BLOOD]].map(([x, y, robe], i) => (
        <Person key={i} x={x as number} y={y as number} h={24} pose="up" robe={robe as string} hair={i % 2 ? '#3a2a1e' : '#d9a441'} belt={null} />
      ))}
      <Row suit="wands" xs={[3, 13, 75, 66]} y={62} s={9} />
      <Horse x={40} y={102} fill={PALE} w={48} />
      <path d="M22 92 q18 8 36 0 v4 q-18 6 -36 0 z" fill={LEAF} opacity={0.8} stroke={INK} strokeWidth={0.4} />
      <Person x={36} y={84} h={34} pose="raise-right" robe={ROBE.wands} inner={ROBE_PALE.wands} hair="#3a2a1e" belt={GOLD_FLAT} />
      {(() => { const hd = hands(36, 84, 34, 'raise-right'); return (
        <g>
          <Row suit="wands" xs={[hd.r.x]} y={hd.r.y - 4} s={10} />
          <ellipse cx={hd.r.x} cy={hd.r.y - 13} rx={5} ry={3} fill="none" stroke={LEAF} strokeWidth={1.6} />
        </g>
      ); })()}
      <ellipse cx={36} cy={50.5} rx={5} ry={2.4} fill="none" stroke={LEAF} strokeWidth={1.4} />
    </g>
  ),
  7: () => (
    <g>
      <Mountains y={70} opacity={0.15} />
      {/* he holds the high ground with his staff crosswise; six rise at him from below */}
      <path d="M0 80 Q40 60 80 80 L80 112 L0 112 Z" fill={GREEN} opacity={0.7} />
      <path d="M0 80 Q40 60 80 80 L80 86 Q40 68 0 86 Z" fill="url(#hatch)" opacity={0.4} />
      <Person x={40} y={78} h={42} pose="hold" robe={ROBE.wands} inner={ROBE_PALE.wands} hair="#3a2a1e" />
      <ellipse cx={36.2} cy={78} rx={3.8} ry={1.4} fill={BLOOD} />
      <Row suit="wands" xs={[40]} y={60} s={13} angle={-38} />
      <Row suit="wands" xs={[6, 20, 34, 48, 62, 76]} y={104} s={13} />
      <Row suit="wands" xs={[13, 41, 69]} y={106} s={11} angle={8} />
    </g>
  ),
  8: () => (
    <g>
      {/* eight staves in flight over the river and the house on the hill */}
      <Mountains y={84} opacity={0.25} />
      <path d="M56 84 h12 v-8 h-12 z M55 76 l7 -5 l7 5 z" fill={PALE} stroke={INK} strokeWidth={0.4} />
      <path d="M0 96 q20 -8 40 -2 t40 -6 v24 h-80 z" fill={GREEN} opacity={0.6} />
      <path d="M0 100 q20 -6 44 2 q14 4 36 -2" fill="none" stroke="#7fa3c9" strokeWidth={3} opacity={0.6} />
      <Water y={101} rows={1} />
      {[[10, 30], [22, 24], [34, 18], [46, 12], [16, 52], [28, 46], [40, 40], [52, 34]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x - 16} ${y + 12} l8 -6 M${x - 20} ${y + 16} l6 -4`} stroke={PALE} strokeWidth={0.6} opacity={0.6} />
          <g transform={`rotate(-35 ${x} ${y})`}>
            <Row suit="wands" xs={[x]} y={y} s={9} />
          </g>
        </g>
      ))}
    </g>
  ),
  9: () => (
    <g>
      <Mountains y={62} opacity={0.15} />
      <Ground y={96} fill="#8a6a3a" opacity={0.6} />
      {/* eight staves stand behind him as a palisade; he leans on the ninth, bandaged, wary */}
      <Row suit="wands" xs={[6, 26, 46, 66]} y={70} s={12} />
      <Row suit="wands" xs={[16, 36, 56, 76]} y={72} s={12} angle={-4} />
      <path d="M0 84 h80" stroke={INK} strokeWidth={0.4} opacity={0.3} />
      <Person x={30} y={104} h={44} pose="hold" robe={ROBE.wands} inner={ROBE_PALE.wands} hair="#3a2a1e" />
      <rect x={25.4} y={60.4} width={9.2} height={2.6} rx={0.5} fill={PALE} stroke={INK} strokeWidth={0.35} />
      <path d="M27 63 l-1 1.5 M33 63 l1 1.5" stroke={INK} strokeWidth={0.3} opacity={0.6} />
      <Row suit="wands" xs={[36]} y={88} s={13} angle={6} />
    </g>
  ),
  10: () => (
    <g>
      {/* bent under ten staves, he carries them toward the town; the road, the furrows, the walls ahead */}
      <Mountains y={70} opacity={0.12} />
      <path d="M58 82 h20 v-12 h-20 z M60 70 v-4 h3 v4 M66 70 v-6 h4 v6 M74 70 v-4 h3 v4 M62 82 v-6 h4 v6" fill={STONE} opacity={0.7} />
      <path d="M56 82 h24" stroke={INK} strokeWidth={0.5} opacity={0.5} />
      <Ground y={92} fill="#8a6a3a" />
      <path d="M0 98 q40 -3 80 0 M0 104 q40 -3 80 0" fill="none" stroke={INK} strokeWidth={0.4} opacity={0.3} />
      <g transform="rotate(26 34 100)">
        <Person x={34} y={102} h={44} pose="up" robe={ROBE.wands} inner={ROBE_PALE.wands} hair="#3a2a1e" face={false} />
      </g>
      <g transform="rotate(18 34 70)">
        <Row suit="wands" xs={[20, 24, 28, 32, 36, 40, 44, 48, 52, 56]} y={68} s={11} />
        <path d="M18 74 h40 M18 80 h40" stroke={INK} strokeWidth={0.5} opacity={0.4} />
      </g>
    </g>
  ),
};

// --- Cups: feeling, the water that fills and spills ----------------------

const CUPS: Record<number, () => ReactElement> = {
  2: () => (
    <g>
      {/* the house on its hill behind; the two face each other and exchange cups under the caduceus and the winged lion */}
      <Mountains y={70} opacity={0.12} />
      <path d="M52 76 q8 -10 24 -6 v10 h-24 z" fill={GREEN} opacity={0.35} />
      <path d="M60 72 v-8 h10 v8 z M58 64 l7 -5 l7 5 z M64 72 v-4 h3 v4" fill={PALE} stroke={INK} strokeWidth={0.4} />
      <Ground y={94} fill={GREEN} opacity={0.6} />
      <Person x={26} y={102} h={44} pose="reach-right" robe={ROBE.cups} inner={ROBE_PALE.cups} hair="#3a2a1e" />
      <Person x={54} y={102} h={44} pose="reach-left" robe={ROBE_PALE.cups} inner={PALE} hair="#d9a441" belt={GOLD_FLAT} />
      <path d="M22 60 q4 -4 8 0 l1 3 q-5 -2 -10 0 z" fill={GOLD_FLAT} stroke={INK} strokeWidth={0.4} />
      <path d="M49 61 q5 -5 10 0 v6 q-5 -3 -10 0 z" fill={PALE} stroke={INK} strokeWidth={0.4} />
      {(() => { const l = hands(26, 102, 44, 'reach-right'); const r = hands(54, 102, 44, 'reach-left'); return (
        <g>
          <CupSym x={l.r.x + 1} y={l.r.y - 4} s={6} />
          <CupSym x={r.l.x - 1} y={r.l.y - 4} s={6} />
        </g>
      ); })()}
      {/* the caduceus: the staff, two serpents twined, wings, the lion's head above */}
      <path d="M40 66 v-30" stroke={GOLD_FLAT} strokeWidth={1.3} strokeLinecap="round" />
      <path d="M36 62 q4 -4 8 -8 q-4 -4 -8 -8 q4 -4 8 -8 M44 62 q-4 -4 -8 -8 q4 -4 8 -8 q-4 -4 -8 -8" fill="none" stroke={BLOOD} strokeWidth={1.2} strokeLinecap="round" />
      <path d="M38 38 q-6 -6 -10 -2 q4 0 6 4 M42 38 q6 -6 10 -2 q-4 0 -6 4" fill={PALE} stroke={INK} strokeWidth={0.4} />
      <circle cx={40} cy={30} r={4} fill="#c98a3c" stroke={INK} strokeWidth={0.5} />
      {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <line key={i} x1={40 + Math.cos(a) * 4} y1={30 + Math.sin(a) * 4} x2={40 + Math.cos(a) * 6.2} y2={30 + Math.sin(a) * 6.2} stroke="#8a5a22" strokeWidth={1.4} strokeLinecap="round" />; })}
      <circle cx={38.6} cy={29.4} r={0.5} fill={INK} />
      <circle cx={41.4} cy={29.4} r={0.5} fill={INK} />
      <path d="M39 32 q1 1 2 0" fill="none" stroke={INK} strokeWidth={0.4} />
    </g>
  ),
  3: () => (
    <g>
      {/* three dance in a ring with cups raised, the harvest heaped about their feet */}
      <Mountains y={74} opacity={0.12} />
      <Ground y={96} fill={GOLD_FLAT} opacity={0.5} />
      <Person x={22} y={104} h={42} pose="raise-right" robe={ROBE.cups} inner={ROBE_PALE.cups} hair="#3a2a1e" belt={GOLD_FLAT} />
      <Person x={40} y={104} h={42} pose="up" robe={PALE} inner="#f3ecd8" hair="#d9a441" belt={BLOOD} />
      <Person x={58} y={104} h={42} pose="raise-left" robe="#d9b86a" inner="#e9d9b6" hair="#8a5a3a" belt={LEAF} />
      {(() => { const a = hands(22, 104, 42, 'raise-right'); const b = hands(40, 104, 42, 'up'); const c = hands(58, 104, 42, 'raise-left'); return (
        <g>
          <CupSym x={a.r.x} y={a.r.y - 5} s={6} />
          <CupSym x={b.r.x} y={b.r.y - 5} s={6} />
          <CupSym x={c.l.x} y={c.l.y - 5} s={6} />
        </g>
      ); })()}
      {[[10, 103], [30, 105], [50, 105], [70, 103]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={4.4} ry={2.8} fill="#d98a3c" stroke={INK} strokeWidth={0.4} />
          <path d={`M${x - 2} ${y - 2.6} q2 -1 4 0 M${x} ${y - 2.8} v-2`} fill="none" stroke={INK} strokeWidth={0.4} />
          <path d={`M${x - 1.5} ${y - 2.4} v4.8 M${x + 1.5} ${y - 2.4} v4.8`} stroke={INK} strokeWidth={0.3} opacity={0.5} />
        </g>
      ))}
      {[[20, 100], [62, 100]].map(([x, y], i) => (
        <g key={i}>
          {[0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={x + (k % 3) * 1.8 - 1.8} cy={y + Math.floor(k / 3) * 1.8} r={1.1} fill="#7a3fa0" stroke={INK} strokeWidth={0.2} />)}
          <path d={`M${x} ${y - 1.5} q-3 -3 -5 -1`} fill="none" stroke={LEAF} strokeWidth={0.6} />
        </g>
      ))}
    </g>
  ),
  4: () => (
    <g>
      <Mountains y={80} opacity={0.15} />
      <Ground y={92} fill={GREEN} opacity={0.6} />
      {/* he sits under the tree with his arms folded, three cups before him and a fourth offered from a cloud */}
      <Tree x={20} y={92} h={60} fill={LEAF} />
      <Person x={26} y={100} h={40} pose="sit-hold" robe={ROBE.cups} inner={ROBE_PALE.cups} hair="#3a2a1e" />
      <path d="M20 79 q6 4 12 0" fill="none" stroke={ROBE.cups} strokeWidth={3.2} strokeLinecap="round" />
      <path d="M20 79 q6 4 12 0" fill="none" stroke={INK} strokeWidth={0.4} opacity={0.5} />
      <Row suit="cups" xs={[44, 56, 68]} y={101} s={6.5} />
      <Cloud x={48} y={52} w={26} />
      <path d="M56 50 q8 -4 16 0 q-6 4 -16 0 z" fill={SKIN} stroke={SKIN_INK} strokeWidth={0.5} />
      <Row suit="cups" xs={[68]} y={42} s={6.5} />
    </g>
  ),
  5: () => (
    <g>
      {/* the river, the bridge, the keep on the far bank */}
      <Mountains y={62} opacity={0.15} />
      <path d="M60 60 h12 v-16 h-12 z M59 44 h3 v-3 h-3 z M64.5 44 h3 v-3 h-3 z M70 44 h3 v-3 h-3 z" fill={STONE} opacity={0.75} />
      <path d="M66 60 v-6 h3 v6" fill={INK} opacity={0.5} />
      <Water y={70} rows={2} />
      <path d="M44 72 q11 -12 24 -2" fill="none" stroke={STONE} strokeWidth={2.6} />
      <path d="M44 72 q11 -12 24 -2" fill="none" stroke={INK} strokeWidth={0.4} opacity={0.5} />
      <Ground y={92} fill={STONE} opacity={0.5} />
      {/* the mourner in the black cloak, hooded, head bowed */}
      <Person x={30} y={104} h={48} pose="stand" robe={INK} inner="#3a3a44" hair="none" face={false} belt={null} shade={false} />
      <path d="M23 62 q1 -9 7 -10 q6 1 7 10 q-3 -4 -7 -4 q-4 0 -7 4 z" fill={INK} stroke="#3a3a44" strokeWidth={0.5} />
      {/* three cups spilled, red and green run out of them; two still stand behind */}
      <Row suit="cups" xs={[8, 18, 44]} y={104} s={6} angle={70} />
      <path d="M11 106 q6 3 10 7 M21 106 q6 3 10 7" fill="none" stroke={BLOOD} strokeWidth={1.2} strokeLinecap="round" />
      <path d="M47 106 q6 3 10 7" fill="none" stroke={LEAF} strokeWidth={1.2} strokeLinecap="round" />
      <Row suit="cups" xs={[58, 70]} y={102} s={6} />
    </g>
  ),
  6: () => (
    <g>
      {/* the courtyard of the old house: the elder child offers a cup of flowers to the younger; the guard walks off; six cups bloom */}
      <rect x={0} y={44} width={80} height={68} fill={GOLD_FLAT} opacity={0.25} />
      <rect x={50} y={30} width={30} height={42} fill={PALE} stroke={INK} strokeWidth={0.6} />
      <rect x={50} y={30} width={30} height={42} fill="url(#hatch)" opacity={0.25} />
      <path d="M50 30 l15 -12 l15 12 z" fill={BLOOD} stroke={INK} strokeWidth={0.5} />
      <path d="M56 40 h6 v7 h-6 z M68 40 h6 v7 h-6 z M62 72 v-12 h8 v12" fill="#7fa3c9" stroke={INK} strokeWidth={0.4} />
      <path d="M62 72 v-12 h8 v12" fill="#5a3a22" />
      <path d="M0 80 h80 M0 90 h80 M0 100 h80 M16 80 v10 M40 80 v10 M64 80 v10 M28 90 v10 M52 90 v10" stroke={INK} strokeWidth={0.4} opacity={0.3} />
      <rect x={4} y={50} width={8} height={30} fill={STONE} opacity={0.6} />
      <path d="M5 56 h6 v8 h-6 z M5 56 l6 8 M11 56 l-6 8" fill={PALE} stroke={INK} strokeWidth={0.4} />
      <Person x={70} y={64} h={18} pose="walk" robe={STONE} hair="none" face={false} belt={null} shade={false} />
      <path d="M69 47 v6" stroke={INK} strokeWidth={0.8} />
      <Person x={30} y={104} h={34} pose="reach-right" robe={ROBE.cups} inner={ROBE_PALE.cups} hair="#d9a441" />
      <path d="M26.5 73 q3.5 -3 7 0 l0.5 2 h-8 z" fill={BLOOD} stroke={INK} strokeWidth={0.3} />
      <Person x={52} y={104} h={24} pose="reach-left" robe={ROBE_PALE.cups} inner={PALE} hair="#3a2a1e" belt={null} />
      {(() => { const hd = hands(30, 104, 34, 'reach-right'); return <CupSym x={hd.r.x + 1} y={hd.r.y - 4} s={5.5} />; })()}
      <Row suit="cups" xs={[10, 22, 66, 76]} y={98} s={5.5} />
      <Row suit="cups" xs={[14]} y={84} s={5.5} />
      {[[10, 92], [22, 92], [66, 92], [76, 92], [14, 78], [44, 75]].map(([x, y], i) => (
        <g key={i}>
          {[0, 1, 2, 3, 4].map((k) => { const a = (k / 5) * Math.PI * 2 - Math.PI / 2; return <circle key={k} cx={x + Math.cos(a) * 1.6} cy={y + Math.sin(a) * 1.6} r={1} fill={PALE} stroke={INK} strokeWidth={0.2} />; })}
          <circle cx={x} cy={y} r={0.6} fill={GOLD_FLAT} />
        </g>
      ))}
    </g>
  ),
  7: () => (
    <g>
      {/* seven cups in a cloud, each with its vision; the dreamer below in shadow, looking up */}
      <Cloud x={-2} y={54} w={84} />
      <Cloud x={6} y={30} w={30} />
      <Cloud x={44} y={28} w={32} />
      <Row suit="cups" xs={[14, 32, 50, 68]} y={30} s={6.5} />
      <Row suit="cups" xs={[22, 40, 58]} y={56} s={6.5} />
      {/* a head, a veiled figure in light, a serpent, a tower, jewels, the wreath with the skull, a dragon */}
      <g>
        <circle cx={14} cy={20} r={3} fill={SKIN} stroke={SKIN_INK} strokeWidth={0.4} />
        <path d="M11 20 a3 3 0 0 1 6 0 q-1 -1 -3 -1 q-2 0 -3 1 z" fill="#d9a441" stroke={INK} strokeWidth={0.3} />
        <circle cx={13} cy={20.5} r={0.35} fill={INK} />
        <circle cx={15} cy={20.5} r={0.35} fill={INK} />
      </g>
      <g>
        {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <line key={i} x1={32 + Math.cos(a) * 4} y1={19 + Math.sin(a) * 4} x2={32 + Math.cos(a) * 6.5} y2={19 + Math.sin(a) * 6.5} stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.8} />; })}
        <path d="M29 24 q0 -8 3 -9 q3 1 3 9 z" fill={PALE} stroke={INK} strokeWidth={0.4} />
      </g>
      <path d="M47 24 q2 -4 5 -2 q3 2 0 -4 q-2 -2 1 -3" fill="none" stroke={LEAF} strokeWidth={1.3} strokeLinecap="round" />
      <circle cx={53.5} cy={15} r={0.9} fill={LEAF} />
      <path d="M65 24 v-7 h1.5 v-2 h1.5 v2 h1.5 v-2 h1.5 v2 h1.5 v7 z" fill={STONE} stroke={INK} strokeWidth={0.4} />
      <path d="M18 51 l2 -3 l2 3 l-2 2 z M22 50 l2 -3 l2 3 l-2 2 z M20 46 l2 -3 l2 3 l-2 2 z" fill={BLOOD} stroke={INK} strokeWidth={0.3} />
      <path d="M22.5 48.5 l1.5 -2 l1.5 2 l-1.5 1.5 z" fill="#6ab7d6" stroke={INK} strokeWidth={0.3} />
      <g>
        <circle cx={40} cy={47} r={4} fill="none" stroke={LEAF} strokeWidth={1.6} />
        <circle cx={40} cy={47} r={2} fill={PALE} stroke={INK} strokeWidth={0.3} />
        <circle cx={39.3} cy={46.6} r={0.4} fill={INK} />
        <circle cx={40.7} cy={46.6} r={0.4} fill={INK} />
      </g>
      <g>
        <path d="M54 50 q4 -5 8 -3 q3 2 2 5 q-4 -2 -6 1 q-3 -1 -4 -3 z" fill="#5a7a3a" stroke={INK} strokeWidth={0.4} />
        <path d="M56 47 l-2 -4 l4 2 M60 46 l1 -4 l2 3" fill="#5a7a3a" stroke={INK} strokeWidth={0.3} />
        <circle cx={63} cy={49} r={0.4} fill={BLOOD} />
      </g>
      <Ground y={100} fill={INK} opacity={0.7} />
      <Person x={40} y={104} h={34} pose="raise-right" robe={INK} inner="#3a3a44" hair="none" face={false} belt={null} shade={false} />
    </g>
  ),
  8: () => (
    <g>
      <Moon x={62} y={18} r={7} face />
      <Mountains y={60} opacity={0.5} fill="#3b3159" />
      <Water y={82} rows={2} />
      <Ground y={92} fill="#3b3159" opacity={0.8} />
      {/* eight cups stacked and left behind; he walks away up the path with his staff, back turned */}
      <Row suit="cups" xs={[10, 20, 30, 40, 50]} y={106} s={5.5} />
      <Row suit="cups" xs={[15, 25, 35]} y={96} s={5.5} />
      <path d="M52 98 q6 -12 10 -30" fill="none" stroke="#d9c39a" strokeWidth={3} opacity={0.5} />
      <Person x={60} y={90} h={36} pose="walk" robe={BLOOD} inner="#8a2e24" hair="#3a2a1e" face={false} belt={null} />
      <line x1={69} y1={92} x2={70} y2={64} stroke="#8a5a22" strokeWidth={1.3} strokeLinecap="round" />
    </g>
  ),
  9: () => (
    <g>
      {/* the arched table draped in blue with nine cups upon it; the stout host on his bench, arms folded, well pleased */}
      <path d="M6 46 q34 -16 68 0 v14 h-68 z" fill={ROBE_PALE.cups} stroke={INK} strokeWidth={0.6} />
      <path d="M6 46 q34 -16 68 0 v14 h-68 z" fill="url(#hatch)" opacity={0.3} />
      <path d="M6 60 h68 v6 h-68 z" fill="#3f6fa8" opacity={0.7} />
      <path d="M8 60 v6 M20 60 v6 M32 60 v6 M44 60 v6 M56 60 v6 M68 60 v6" stroke={INK} strokeWidth={0.4} opacity={0.5} />
      <Row suit="cups" xs={[12, 20, 28, 36, 44, 52, 60, 68, 76]} y={45} s={5} />
      <Ground y={98} fill={GOLD_FLAT} opacity={0.5} />
      <rect x={26} y={84} width={28} height={14} fill="#8a6a3a" stroke={INK} strokeWidth={0.6} />
      <rect x={26} y={84} width={28} height={14} fill="url(#hatch)" opacity={0.4} />
      <Person x={40} y={90} h={40} pose="hold" robe={ROBE.cups} inner={PALE} hair="#5a3a22" belt={GOLD_FLAT} />
      <path d="M35.5 51.5 q4.5 -5 9 0 l1 1.5 h-11 z" fill={BLOOD} stroke={INK} strokeWidth={0.4} />
      <path d="M33 72 q7 5 14 0 M33 72 q7 -2 14 0" fill="none" stroke={ROBE.cups} strokeWidth={3.2} strokeLinecap="round" />
      <path d="M33 72 q7 5 14 0" fill="none" stroke={INK} strokeWidth={0.4} opacity={0.5} />
    </g>
  ),
  10: () => (
    <g>
      {/* the rainbow with its ten cups over the home on the hill; the two with arms raised, the children dancing */}
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M-6 ${64 + i * 4} Q40 ${-36 + i * 4} 86 ${64 + i * 4}`} fill="none" stroke={[BLOOD, GOLD_FLAT, LEAF, '#6ab7d6'][i]} strokeWidth={3} opacity={0.7} />)}
      {[[6, 37], [16, 23], [27, 14], [39, 9], [51, 10], [63, 20], [74, 35], [30, 30], [50, 31], [40, 25]].map(([x, y], i) => <CupSym key={i} x={x} y={y} s={4.4} />)}
      <Mountains y={78} opacity={0.15} />
      <path d="M0 92 q30 -12 44 -6 q18 -6 36 4 v22 h-80 z" fill={GREEN} opacity={0.6} />
      <path d="M52 80 q6 -3 10 4 q4 -3 8 1 v10 h-18 z" fill={LEAF} opacity={0.7} />
      <path d="M48 88 v-12 h16 v12 z M46 76 l10 -8 l10 8 z M54 88 v-6 h4 v6" fill={PALE} stroke={INK} strokeWidth={0.5} />
      <path d="M50 78 h12 v10 h-12 z" fill="url(#hatch)" opacity={0.3} />
      <path d="M40 92 q10 4 20 20" fill="none" stroke="#6ab7d6" strokeWidth={2} opacity={0.6} />
      <Person x={20} y={104} h={40} pose="raise-left" robe={ROBE.cups} inner={ROBE_PALE.cups} hair="#3a2a1e" />
      <Person x={34} y={104} h={40} pose="raise-right" robe={ROBE_PALE.cups} inner={PALE} hair="#d9a441" belt={null} />
      <Person x={56} y={106} h={20} pose="reach-right" robe={BLOOD} hair="#3a2a1e" belt={null} />
      <Person x={68} y={106} h={20} pose="reach-left" robe="#3f6fa8" hair="#d9a441" belt={null} />
    </g>
  ),
};

// --- Swords: thought, the blade that cuts both ways -----------------------

const SWORDS: Record<number, () => ReactElement> = {
  2: () => (
    <g>
      <Moon x={66} y={14} r={5} />
      <Mountains y={54} opacity={0.15} />
      <Water y={60} rows={3} />
      {[12, 30, 52].map((x, i) => (
        <g key={x}>
          <ellipse cx={x} cy={64 + i * 2} rx={5} ry={2.2} fill={STONE} stroke={INK} strokeWidth={0.4} />
          <ellipse cx={x + 1.5} cy={64.6 + i * 2} rx={3} ry={1.4} fill="url(#hatch)" opacity={0.6} />
        </g>
      ))}
      {/* a stone bench; she sits blindfolded with a sword in either hand, crossed over her breast */}
      <rect x={18} y={92} width={44} height={12} fill={STONE} stroke={INK} strokeWidth={0.6} />
      <rect x={18} y={92} width={44} height={12} fill="url(#hatch)" opacity={0.5} />
      <Person x={40} y={98} h={46} pose="sit-hold" robe={ROBE_PALE.swords} inner={PALE} hair="#3a2a1e" belt={null} />
      <Row suit="swords" xs={[29]} y={64} s={15} angle={-32} />
      <Row suit="swords" xs={[51]} y={64} s={15} angle={32} />
      <path d="M34 78 q6 -10 14 -14 M46 78 q-6 -10 -14 -14" fill="none" stroke={ROBE_PALE.swords} strokeWidth={3.4} strokeLinecap="round" />
      <path d="M34 78 q6 -10 14 -14 M46 78 q-6 -10 -14 -14" fill="none" stroke={INK} strokeWidth={0.4} opacity={0.5} />
      <rect x={35.2} y={55.4} width={9.6} height={2.6} rx={0.6} fill={PALE} stroke={INK} strokeWidth={0.4} />
    </g>
  ),
  3: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={STONE} opacity={0.25} />
      <Cloud x={-6} y={22} w={40} />
      <Cloud x={44} y={20} w={42} />
      {Array.from({ length: 16 }, (_, i) => <line key={i} x1={4 + i * 5} y1={26 + (i % 3) * 6} x2={2 + i * 5} y2={40 + (i % 3) * 6} stroke={PALE} strokeWidth={0.7} opacity={0.8} />)}
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={6 + i * 6.5} y1={70 + (i % 4) * 8} x2={4.5 + i * 6.5} y2={80 + (i % 4) * 8} stroke={PALE} strokeWidth={0.6} opacity={0.6} />)}
      {/* the heart, full and shaded, the three blades through it */}
      <path d="M40 94 C16 78 12 50 40 58 C68 50 64 78 40 94 Z" fill={BLOOD} stroke={INK} strokeWidth={0.8} />
      <path d="M40 94 C52 84 62 72 60 62 C56 54 46 54 40 58 Z" fill="url(#crosshatch)" opacity={0.55} />
      <path d="M26 64 q4 -4 9 -2" fill="none" stroke={PALE} strokeWidth={1.2} strokeLinecap="round" opacity={0.6} />
      <Row suit="swords" xs={[40]} y={70} s={17} angle={180} />
      <Row suit="swords" xs={[30]} y={68} s={17} angle={152} />
      <Row suit="swords" xs={[50]} y={68} s={17} angle={208} />
    </g>
  ),
  4: () => (
    <g>
      {/* the chapel: a leaded window, three blades hung on the wall, the knight's effigy on his tomb with the fourth carved in its side */}
      <rect x={0} y={0} width={80} height={112} fill={STONE} opacity={0.3} />
      <path d="M0 64 h80" stroke={INK} strokeWidth={0.4} opacity={0.3} />
      <path d="M50 40 v-26 q11 -12 22 0 v26 z" fill="#3f6fa8" opacity={0.85} />
      <path d="M50 40 v-26 q11 -12 22 0 v26 z" fill="none" stroke={INK} strokeWidth={0.6} />
      <path d="M61 6 v34 M50 24 h22 M50 32 h22" stroke={INK} strokeWidth={0.4} opacity={0.6} />
      <path d="M52 26 h8 v5 h-8 z M62 26 h8 v5 h-8 z M53 15 h7 v7 h-7 z M62 15 h7 v7 h-7 z" fill={GOLD_FLAT} opacity={0.7} />
      {[14, 26, 38].map((x) => (
        <g key={x}>
          <path d={`M${x} 6 v4`} stroke={INK} strokeWidth={0.5} />
          <g transform={`rotate(180 ${x} 22)`}><SwordSym x={x} y={22} s={11} /></g>
        </g>
      ))}
      <rect x={8} y={82} width={64} height={22} fill={PALE} stroke={INK} strokeWidth={0.7} />
      <rect x={8} y={82} width={64} height={22} fill="url(#hatch)" opacity={0.35} />
      <path d="M10 84 h60 M10 102 h60" stroke={INK} strokeWidth={0.4} opacity={0.5} />
      <g transform="rotate(90 40 93)">
        <SwordSym x={40} y={93} s={10} />
      </g>
      <g transform="rotate(-90 68 80)">
        <Person x={68} y={80} h={48} pose="hold" robe="#c9cdd4" inner="#b0b5be" hair="#5a3a22" belt={GOLD_FLAT} face={false} />
      </g>
      <path d="M46 74 q2 -4 4 0 v4 h-4 z" fill={SKIN} stroke={SKIN_INK} strokeWidth={0.4} />
      <path d="M26 74 h4 v-4 h4 v4 h4 M28 68 q4 -6 8 0 q-4 -2 -8 0 z" fill="none" stroke={INK} strokeWidth={0.5} opacity={0.7} />
    </g>
  ),
  5: () => (
    <g>
      {/* torn clouds; the winner gathers the blades with a look back; two walk away to the jagged water */}
      <path d="M-4 24 q10 -10 22 -2 q6 -8 14 0 q-8 6 -16 2 q-6 8 -20 0 z" fill={PALE} stroke={INK} strokeWidth={0.5} />
      <path d="M46 16 q12 -10 24 -2 q8 -6 14 2 q-8 6 -16 2 q-10 8 -22 -2 z" fill={PALE} stroke={INK} strokeWidth={0.5} />
      <Mountains y={54} opacity={0.15} />
      <Water y={62} rows={2} />
      <path d="M0 66 l6 -3 l6 3 l6 -3 l6 3 l6 -3 l6 3" fill="none" stroke={INK} strokeWidth={0.4} opacity={0.5} />
      <Ground y={84} fill={GREEN} opacity={0.5} />
      <Person x={16} y={76} h={24} pose="walk" robe={INK} inner="#3a3a44" hair="#3a2a1e" face={false} belt={null} shade={false} />
      <Person x={34} y={74} h={20} pose="stand" robe="#7d5aa6" hair="#d9a441" face={false} belt={null} />
      <path d="M30 60 q4 -4 8 0" fill="none" stroke="#7d5aa6" strokeWidth={2.4} strokeLinecap="round" />
      <Person x={60} y={104} h={44} pose="raise-left" robe={ROBE.swords} inner={BLOOD} hair="#c94a3a" belt={GOLD_FLAT} />
      {(() => { const hd = hands(60, 104, 44, 'raise-left'); return (
        <g>
          <g transform={`rotate(-20 ${hd.l.x} ${hd.l.y})`}><SwordSym x={hd.l.x} y={hd.l.y - 5} s={11} /></g>
          <g transform={`rotate(-36 ${hd.l.x} ${hd.l.y})`}><SwordSym x={hd.l.x + 3} y={hd.l.y - 6} s={11} /></g>
        </g>
      ); })()}
      <Row suit="swords" xs={[14, 30]} y={104} s={10} angle={80} />
      <Row suit="swords" xs={[42]} y={106} s={10} angle={-100} />
    </g>
  ),
  6: () => (
    <g>
      {/* the far shore with its trees, calm water ahead, rough behind; the ferryman poles the two across with six blades in the bow */}
      <Mountains y={48} opacity={0.3} />
      <Tree x={12} y={56} h={14} fill={LEAF} />
      <Tree x={26} y={58} h={12} fill={LEAF} />
      <Water y={62} rows={5} />
      <path d="M50 66 q4 -2 8 0 t8 0 t8 0 M54 72 q4 -2 8 0 t8 0 t8 0" fill="none" stroke={INK} strokeWidth={0.9} opacity={0.6} />
      <path d="M4 96 q36 14 72 0 v-8 h-72 z" fill="#8a6a3a" stroke={INK} strokeWidth={0.6} />
      <path d="M4 96 q36 14 72 0 v-4 q-36 10 -72 0 z" fill="url(#hatch)" opacity={0.5} />
      <path d="M6 88 h68" stroke={INK} strokeWidth={0.4} opacity={0.5} />
      <Row suit="swords" xs={[12, 18, 24, 30, 36, 42]} y={80} s={9} />
      <Person x={30} y={90} h={24} pose="sit-hold" robe={ROBE_PALE.swords} inner={PALE} hair="none" face={false} belt={null} />
      <path d="M25.5 72 q1 -6 4.5 -6.5 q3.5 0.5 4.5 6.5 q-2 -2.5 -4.5 -2.5 q-2.5 0 -4.5 2.5 z" fill={ROBE_PALE.swords} stroke={INK} strokeWidth={0.4} />
      <Person x={43} y={90} h={15} pose="sit" robe={ROBE_PALE.swords} hair="#d9a441" belt={null} />
      <Person x={64} y={92} h={36} pose="hold" robe={INK} inner="#3a3a44" hair="#3a2a1e" belt={null} shade={false} />
      <line x1={71} y1={50} x2={70} y2={106} stroke="#8a6a3a" strokeWidth={1.4} strokeLinecap="round" />
    </g>
  ),
  7: () => (
    <g>
      <Ground y={92} fill={GOLD_FLAT} opacity={0.4} />
      {[8, 30, 56].map((x, i) => <path key={x} d={`M${x} 92 l10 -22 l10 22 z`} fill={[PALE, BLOOD, GOLD_FLAT][i]} stroke={INK} strokeWidth={0.5} opacity={0.85} />)}
      <Row suit="swords" xs={[60, 68]} y={100} s={9} />
      <g transform="rotate(-12 26 104)">
        <Person x={26} y={104} h={40} pose="hold" robe={ROBE.swords} />
      </g>
      <Row suit="swords" xs={[12, 17, 22, 27, 32]} y={76} s={10} angle={-30} />
    </g>
  ),
  8: () => (
    <g>
      {/* the castle on the cliff; she stands bound and blindfolded among eight blades set point-down in the mud */}
      <path d="M52 50 l8 -6 h16 v8 h-24 z" fill={STONE} opacity={0.5} />
      <path d="M58 44 v-14 h4 v-3 h3 v3 h4 v-3 h3 v3 h4 v14 z M64 30 v-8 h6 v8" fill={STONE} opacity={0.7} />
      <path d="M58 44 h18" stroke={INK} strokeWidth={0.4} opacity={0.5} />
      <Water y={92} rows={2} />
      <Ground y={100} fill={STONE} opacity={0.6} />
      {[[10, 104], [30, 106], [56, 105], [72, 107]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={5} ry={1.4} fill="#7fa3c9" opacity={0.5} />)}
      <Row suit="swords" xs={[8, 18, 28, 52, 62, 72]} y={80} s={12} angle={180} />
      <Row suit="swords" xs={[13, 67]} y={82} s={12} angle={180} />
      <Person x={40} y={102} h={44} pose="hold" robe={ROBE.swords} inner={BLOOD} hair="#3a2a1e" belt={null} />
      {[68, 74, 80].map((y) => <path key={y} d={`M31 ${y} q9 3 18 0`} fill="none" stroke={PALE} strokeWidth={1.6} />)}
      {[68, 74, 80].map((y) => <path key={y} d={`M31 ${y} q9 3 18 0`} fill="none" stroke={INK} strokeWidth={0.3} opacity={0.5} />)}
      <rect x={35} y={61.4} width={10} height={2.6} rx={0.5} fill={PALE} stroke={INK} strokeWidth={0.4} />
    </g>
  ),
  9: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={INK} opacity={0.85} />
      {/* nine swords hung flat on the wall of the dark */}
      {[12, 19, 26, 33, 40, 47, 54, 61, 68].map((y) => (
        <g key={y} transform={`rotate(90 40 ${y})`}>
          <SwordSym x={40} y={y} s={13} />
        </g>
      ))}
      {/* the bed: a carved panel, the quilt of roses and signs */}
      <rect x={4} y={100} width={72} height={8} fill="#5a3a22" stroke={INK} strokeWidth={0.5} />
      <path d="M8 104 q4 -3 8 0 M20 104 q4 -3 8 0 M32 104 q4 -3 8 0 M44 104 q4 -3 8 0 M56 104 q4 -3 8 0" fill="none" stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.8} />
      <Person x={40} y={90} h={36} pose="sit-hold" robe={PALE} inner="#f3ecd8" hair="#3a2a1e" belt={null} />
      <rect x={6} y={80} width={68} height={20} fill={PALE} stroke={INK} strokeWidth={0.6} />
      <rect x={6} y={80} width={68} height={20} fill="url(#hatch)" opacity={0.3} />
      {[[12, 86], [30, 86], [48, 86], [66, 86], [21, 94], [39, 94], [57, 94]].map(([x, y], i) => <path key={i} d={`M${x} ${y} l3 -3 l3 3 l-3 3 z`} fill={[BLOOD, '#6ab7d6', GOLD_FLAT][i % 3]} />)}
      {[[16, 90], [34, 90], [52, 90], [70, 90]].map(([x, y], i) => <Rose key={i} x={x} y={y} r={1.4} />)}
      {/* the hands over the face */}
      <path d="M31 66 q3 -8 7 -8 M49 66 q-3 -8 -7 -8" fill="none" stroke={PALE} strokeWidth={2.6} strokeLinecap="round" />
      <circle cx={37.5} cy={58} r={2.4} fill={SKIN} stroke={SKIN_INK} strokeWidth={0.4} />
      <circle cx={42.5} cy={58} r={2.4} fill={SKIN} stroke={SKIN_INK} strokeWidth={0.4} />
    </g>
  ),
  10: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={INK} opacity={0.7} />
      {/* dawn on the far shore under the black sky */}
      <path d="M0 58 h80 v10 h-80 z" fill={GOLD_FLAT} opacity={0.45} />
      <Mountains y={66} opacity={0.5} fill="#2a2440" />
      <Water y={72} rows={2} />
      <Ground y={88} fill={INK} opacity={0.8} />
      {/* face down under the red cloak, ten blades standing in the back */}
      <g transform="rotate(-90 70 100)">
        <Person x={70} y={100} h={54} pose="stand" robe={BLOOD} inner="#8a2e24" hair="#3a2a1e" belt={null} face={false} />
      </g>
      <path d="M16 96 q20 -4 44 0 q6 2 10 6 l-54 0 z" fill={BLOOD} opacity={0.5} />
      <Row suit="swords" xs={[24, 30, 36, 42, 48, 54, 60, 66, 71, 76]} y={86} s={8} />
    </g>
  ),
};

// --- Pentacles: the body, the coin, the slow work -------------------------

const PENTACLES: Record<number, () => ReactElement> = {
  2: () => (
    <g>
      {/* two ships ride the high waves behind; the dancer in the tall hat keeps two coins in the loop of a ribbon */}
      <Water y={66} rows={3} />
      {[10, 58].map((x, i) => (
        <g key={x}>
          <path d={`M${x + 6} ${66 + i * 4} v-12`} stroke={INK} strokeWidth={0.6} />
          <path d={`M${x + 6} ${55 + i * 4} l7 9 h-7 z`} fill={PALE} stroke={INK} strokeWidth={0.4} />
          <path d={`M${x - 2} ${66 + i * 4} h18 l-4 5 h-11 z`} fill="#5a3a22" stroke={INK} strokeWidth={0.4} />
          <path d={`M${x - 2} ${66 + i * 4} h18 l-4 5 h-11 z`} fill="url(#hatch)" opacity={0.5} />
        </g>
      ))}
      <Ground y={96} fill={GOLD_FLAT} opacity={0.5} />
      <Person x={40} y={104} h={48} pose="out" robe={ROBE.pentacles} inner={BLOOD} hair="#5a3a22" belt={GOLD_FLAT} />
      <path d="M35.5 57 q4.5 -3 9 0 l1.5 -14 q-6 -2 -12 0 z" fill={BLOOD} stroke={INK} strokeWidth={0.4} />
      <path d="M34 57 h12" stroke={INK} strokeWidth={0.5} />
      {(() => { const hd = hands(40, 104, 48, 'out'); return (
        <g>
          {(() => { const w = hd.r.x - hd.l.x; const d = `M${hd.l.x} ${hd.l.y - 2} C${hd.l.x + w * 0.45} ${hd.l.y - 16} ${hd.r.x - w * 0.45} ${hd.r.y + 12} ${hd.r.x} ${hd.r.y - 2} C${hd.r.x - w * 0.45} ${hd.r.y - 16} ${hd.l.x + w * 0.45} ${hd.l.y + 12} ${hd.l.x} ${hd.l.y - 2}`; return (
            <g>
              <path d={d} fill="none" stroke={LEAF} strokeWidth={2.4} />
              <path d={d} fill="none" stroke={INK} strokeWidth={0.4} opacity={0.5} />
            </g>
          ); })()}
          <PentSym x={hd.l.x} y={hd.l.y - 2} s={6} />
          <PentSym x={hd.r.x} y={hd.r.y - 2} s={6} />
        </g>
      ); })()}
    </g>
  ),
  3: () => (
    <g>
      {/* inside the church: a pointed arch with three coins in its tracery, the mason on his bench, the monk and the one with the plans */}
      <rect x={0} y={0} width={80} height={112} fill={STONE} opacity={0.35} />
      <path d="M12 112 V50 q28 -34 56 0 V112" fill="#8c8a94" opacity={0.35} />
      <path d="M12 112 V50 q28 -34 56 0 V112" fill="none" stroke={INK} strokeWidth={2} />
      <path d="M16 112 V52 q24 -30 48 0 V112" fill="none" stroke={INK} strokeWidth={0.5} opacity={0.6} />
      <path d="M40 22 v14 M30 30 l10 6 M50 30 l-10 6" stroke={INK} strokeWidth={0.6} opacity={0.6} />
      <Row suit="pentacles" xs={[40]} y={22} s={5.5} />
      <Row suit="pentacles" xs={[30, 50]} y={32} s={5.5} />
      <path d="M0 96 h80 M0 104 h80 M20 96 v8 M44 96 v8 M64 96 v8" stroke={INK} strokeWidth={0.4} opacity={0.35} />
      <rect x={18} y={88} width={16} height={16} fill="#8a6a3a" stroke={INK} strokeWidth={0.6} />
      <rect x={18} y={88} width={16} height={16} fill="url(#hatch)" opacity={0.4} />
      <Person x={27} y={92} h={34} pose="raise-right" robe={ROBE.pentacles} inner={ROBE_PALE.pentacles} hair="#5a3a22" />
      {(() => { const hd = hands(27, 92, 34, 'raise-right'); return (
        <g>
          <line x1={hd.r.x} y1={hd.r.y} x2={hd.r.x + 2} y2={hd.r.y - 8} stroke="#8a6a3a" strokeWidth={1.4} strokeLinecap="round" />
          <rect x={hd.r.x - 1} y={hd.r.y - 11.5} width={7} height={3.5} rx={1} fill="#5a3a22" stroke={INK} strokeWidth={0.4} />
        </g>
      ); })()}
      <Person x={54} y={106} h={38} pose="hold" robe={INK} inner="#3a3a44" hair="none" face={false} belt={null} shade={false} />
      <path d="M48.5 74 q1 -8 5.5 -9 q4.5 1 5.5 9 q-2.5 -4 -5.5 -4 q-3 0 -5.5 4 z" fill={INK} stroke="#3a3a44" strokeWidth={0.5} />
      <Person x={68} y={106} h={36} pose="hold" robe={PALE} inner="#e9d9b6" hair="#9a9088" belt={GOLD_FLAT} />
      <rect x={58} y={80} width={14} height={9} fill={PALE} stroke={INK} strokeWidth={0.5} />
      <path d="M60 83 h10 M60 85.5 h7 M60 88 h4" stroke={INK} strokeWidth={0.4} opacity={0.7} />
    </g>
  ),
  4: () => (
    <g>
      {/* the city behind him, towers with lit windows */}
      {[4, 18, 32, 50, 64].map((x, i) => (
        <g key={x}>
          <rect x={x} y={40 - (i % 2) * 8} width={10} height={40} fill={STONE} opacity={0.5} />
          <rect x={x + 5} y={40 - (i % 2) * 8} width={5} height={40} fill="url(#hatch)" opacity={0.4} />
          <path d={`M${x - 0.5} ${40 - (i % 2) * 8} h3 v-3 h2 v3 h3 v-3 h2 v3 h1.5`} fill={STONE} opacity={0.5} />
          {[0, 1, 2].map((k) => <rect key={k} x={x + 3} y={48 - (i % 2) * 8 + k * 9} width={2.2} height={3.2} fill={GOLD_FLAT} opacity={0.5} />)}
        </g>
      ))}
      <Ground y={88} fill={STONE} opacity={0.5} />
      <rect x={24} y={86} width={32} height={12} fill="#8a6a3a" stroke={INK} strokeWidth={0.6} />
      <rect x={24} y={86} width={32} height={12} fill="url(#hatch)" opacity={0.4} />
      {/* he clutches a coin to his breast, one balanced on his crown, one under either foot */}
      <Person x={40} y={92} h={44} pose="hold" robe={ROBE.pentacles} inner={ROBE_PALE.pentacles} hair="#5a3a22" crown />
      <Row suit="pentacles" xs={[40]} y={74} s={7} />
      <Row suit="pentacles" xs={[40]} y={39} s={4.5} />
      <Row suit="pentacles" xs={[30, 50]} y={100} s={5.5} />
    </g>
  ),
  5: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={INK} opacity={0.6} />
      {/* the lit window of the church: a pointed arch, leaded, five coins in the tree of its glass */}
      <path d="M42 62 v-40 q15 -18 30 0 v40 z" fill="#3f6fa8" opacity={0.95} />
      <path d="M42 62 v-40 q15 -18 30 0 v40 z" fill="none" stroke={INK} strokeWidth={0.8} />
      <path d="M46 62 v-38 q11 -13 22 0 v38 M57 12 v50 M42 36 h30 M42 50 h30" fill="none" stroke={INK} strokeWidth={0.45} opacity={0.7} />
      <path d="M57 58 v-12 M57 46 l-6 -6 M57 46 l6 -6 M57 38 l-7 -6 M57 38 l7 -6" fill="none" stroke={GOLD_FLAT} strokeWidth={1} />
      {[[57, 20], [51, 40], [63, 40], [50, 32], [64, 32]].map(([x, y], i) => <PentSym key={i} x={x} y={y} s={3.6} />)}
      <path d="M40 66 h34" stroke={STONE} strokeWidth={2} opacity={0.6} />
      {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={(i * 13) % 80} cy={(i * 29) % 100} r={0.9} fill={SNOW} opacity={0.8} />)}
      <Ground y={96} fill={SNOW} opacity={0.85} />
      <path d="M8 104 q2 -1 4 0 M16 108 q2 -1 4 0 M40 106 q2 -1 4 0" fill="none" stroke={STONE} strokeWidth={0.6} opacity={0.6} />
      {/* the one on crutches, a bandaged foot, a bell at the neck; the other barefoot in a shawl */}
      <Person x={14} y={104} h={38} pose="hold" robe={INK} inner="#3a3a44" hair="none" face={false} belt={null} shade={false} />
      <path d="M8.5 70 q1 -7 5.5 -8 q4.5 1 5.5 8 q-2.5 -3 -5.5 -3 q-3 0 -5.5 3 z" fill={INK} stroke="#3a3a44" strokeWidth={0.5} />
      <path d="M22 104 v-28 M19.5 78 h5 M6 104 v-26 M3.5 80 h5" stroke="#5a3a22" strokeWidth={1.3} strokeLinecap="round" />
      <path d="M11 104 q3 -3 6 0 v-4 h-6 z" fill={PALE} stroke={INK} strokeWidth={0.4} />
      <path d="M12.5 101 h3 M12.5 102.5 h3" stroke={INK} strokeWidth={0.3} />
      <circle cx={14} cy={80} r={1.1} fill={GOLD_FLAT} stroke={INK} strokeWidth={0.3} />
      <Person x={31} y={104} h={31} pose="stand" robe={BLOOD} inner="#8a2e24" hair="#3a2a1e" belt={null} />
      <path d="M25 86 q6 -5 12 0 l1 6 q-7 -3 -14 0 z" fill="#6a4a3a" stroke={INK} strokeWidth={0.4} />
      <path d="M25 80 q1 -6 6 -7 q5 1 6 7 q-3 -3 -6 -3 q-3 0 -6 3 z" fill="#6a4a3a" stroke={INK} strokeWidth={0.4} />
    </g>
  ),
  6: () => (
    <g>
      {/* the town behind, the merchant weighing with one hand and giving with the other, two kneeling */}
      <path d="M0 66 h12 v-14 h6 v14 h10 v-10 h8 v10 h8 v-16 h6 v16 h10 v-12 h8 v12 h12 v30 h-80 z" fill={STONE} opacity={0.35} />
      <path d="M0 66 h80" stroke={INK} strokeWidth={0.4} opacity={0.4} />
      <Ground y={96} fill={GOLD_FLAT} opacity={0.5} />
      <Row suit="pentacles" xs={[10, 24, 56, 70]} y={20} s={5} />
      <Row suit="pentacles" xs={[40, 40]} y={14} s={5} />
      <Row suit="pentacles" xs={[40]} y={28} s={5} />
      <Person x={40} y={100} h={50} pose="out" robe={ROBE.pentacles} inner={BLOOD} hair="#5a3a22" belt={GOLD_FLAT} />
      <path d="M35 55 q5 -6 10 0 l1 2 h-12 z" fill={BLOOD} stroke={INK} strokeWidth={0.4} />
      {(() => { const hd = hands(40, 100, 50, 'out'); return (
        <g>
          <g stroke={GOLD_FLAT} strokeWidth={0.9} fill="none">
            <line x1={hd.l.x} y1={hd.l.y} x2={hd.l.x} y2={hd.l.y - 4} />
            <line x1={hd.l.x - 6} y1={hd.l.y - 4} x2={hd.l.x + 6} y2={hd.l.y - 4} />
            <path d={`M${hd.l.x - 6} ${hd.l.y - 4} l-2 7 M${hd.l.x - 6} ${hd.l.y - 4} l2 7 M${hd.l.x + 6} ${hd.l.y - 4} l-2 7 M${hd.l.x + 6} ${hd.l.y - 4} l2 7`} />
          </g>
          <path d={`M${hd.l.x - 9} ${hd.l.y + 3} h6 q-1 2.5 -3 2.5 q-2 0 -3 -2.5 z M${hd.l.x + 3} ${hd.l.y + 3} h6 q-1 2.5 -3 2.5 q-2 0 -3 -2.5 z`} fill={GOLD} stroke={INK} strokeWidth={0.4} />
          {[0, 1, 2].map((i) => <circle key={i} cx={hd.r.x + 2 + i * 1.5} cy={hd.r.y + 5 + i * 6} r={1.3} fill={GOLD} stroke={INK} strokeWidth={0.3} />)}
        </g>
      ); })()}
      <Person x={12} y={106} h={24} pose="up" robe={INK} inner="#3a3a44" hair="#9a9088" belt={null} shade={false} />
      <Person x={68} y={106} h={24} pose="up" robe="#3f6fa8" inner="#5a7fb8" hair="#3a2a1e" belt={null} />
      <path d="M8 90 q2 -4 4 -4 q2 0 4 4 M64 90 q2 -4 4 -4 q2 0 4 4" fill="none" stroke={INK} strokeWidth={0.4} opacity={0.6} />
    </g>
  ),
  7: () => (
    <g>
      <Mountains y={70} opacity={0.15} />
      <Ground y={92} fill={GREEN} opacity={0.65} />
      <path d="M0 98 q40 -3 80 0 M0 104 q40 -3 80 0 M0 110 q40 -3 80 0" fill="none" stroke={INK} strokeWidth={0.4} opacity={0.3} />
      {/* the vine on its stake, heavy with seven coins; he leans on his hoe and looks at it */}
      <line x1={58} y1={92} x2={58} y2={34} stroke="#8a6a3a" strokeWidth={1.4} />
      <path d="M58 88 q-10 -8 -8 -20 q6 6 8 14 M58 76 q10 -8 10 -22 q-6 6 -10 14 M58 62 q-10 -6 -10 -18 q6 4 10 12 M58 52 q10 -4 12 -16 q-8 2 -12 10" fill={LEAF} stroke={INK} strokeWidth={0.4} />
      <path d="M52 78 q4 -3 4 -8 M64 66 q4 -3 4 -8 M52 58 q4 -3 4 -8" fill="none" stroke={INK} strokeWidth={0.3} opacity={0.5} />
      {[[50, 70], [66, 58], [50, 50], [68, 40], [58, 44], [56, 80], [64, 74]].map(([x, y], i) => <PentSym key={i} x={x} y={y} s={4.6} />)}
      <Person x={24} y={102} h={46} pose="reach-right" robe={ROBE.pentacles} inner={ROBE_PALE.pentacles} hair="#5a3a22" />
      <path d="M36 102 v-36" stroke="#8a6a3a" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M36 66 l6 -2 l0 3 l-6 2 z" fill={STONE} stroke={INK} strokeWidth={0.4} />
      <ellipse cx={27.5} cy={102} rx={3.6} ry={1.3} fill="#5a3a22" />
    </g>
  ),
  8: () => (
    <g>
      {/* the town far off, the post with the six finished coins, the apprentice at his bench with mallet and chisel */}
      <path d="M0 62 h6 v-8 h4 v8 h6 v-5 h4 v5 h8 v-10 h3 v10 h6 v-6 h5 v6 h6 v-4 h4 v4 h48 v40 h-80 z" fill={STONE} opacity={0.35} />
      <path d="M0 62 h60" stroke={INK} strokeWidth={0.4} opacity={0.4} />
      <Ground y={96} fill={STONE} opacity={0.4} />
      <rect x={62} y={10} width={4} height={86} fill="#8a6a3a" stroke={INK} strokeWidth={0.5} />
      <rect x={64} y={10} width={2} height={86} fill="url(#hatch)" opacity={0.5} />
      {[18, 32, 46, 60, 74, 88].map((y) => (
        <g key={y}>
          <path d={`M64 ${y - 9} v4`} stroke={INK} strokeWidth={0.5} />
          <PentSym x={64} y={y} s={5} />
        </g>
      ))}
      <rect x={12} y={84} width={30} height={14} fill="#8a6a3a" stroke={INK} strokeWidth={0.6} />
      <rect x={12} y={84} width={30} height={14} fill="url(#hatch)" opacity={0.4} />
      <path d="M14 98 v8 M40 98 v8" stroke="#5a3a22" strokeWidth={1.6} />
      <Person x={24} y={92} h={42} pose="reach-right" robe={ROBE.pentacles} inner={ROBE_PALE.pentacles} hair="#5a3a22" />
      {(() => { const hd = hands(24, 92, 42, 'reach-right'); return (
        <g>
          <line x1={hd.r.x} y1={hd.r.y} x2={hd.r.x + 5} y2={hd.r.y + 6} stroke={STONE} strokeWidth={1.2} strokeLinecap="round" />
          <line x1={hd.l.x} y1={hd.l.y} x2={hd.l.x + 2} y2={hd.l.y - 10} stroke="#8a6a3a" strokeWidth={1.6} strokeLinecap="round" />
          <rect x={hd.l.x - 2} y={hd.l.y - 14} width={8} height={4} rx={1} fill="#5a3a22" stroke={INK} strokeWidth={0.4} />
        </g>
      ); })()}
      <PentSym x={44} y={86} s={5} />
      <PentSym x={8} y={104} s={5} />
    </g>
  ),
  9: () => (
    <g>
      {/* the manor far behind; her vineyard, the vines trained on posts and hung with coins; a snail in the grass */}
      <Mountains y={60} opacity={0.12} />
      <path d="M50 56 h24 v-14 h-24 z M54 42 h4 v-6 h-4 z M66 42 h4 v-6 h-4 z M48 56 h28" fill={STONE} opacity={0.4} />
      <Ground y={90} fill={GOLD_FLAT} opacity={0.5} />
      {[6, 18, 62, 74].map((x) => (
        <g key={x}>
          <path d={`M${x} 90 v-40 q4 -6 8 0 v40`} fill={GREEN} opacity={0.6} />
          <path d={`M${x + 4} 50 v40`} stroke="#8a6a3a" strokeWidth={1} opacity={0.6} />
          {[56, 66, 76].map((y) => <path key={y} d={`M${x + 4} ${y} q-5 -2 -6 -6 q5 0 6 6 q5 -2 6 -6 q-5 0 -6 6`} fill={LEAF} stroke={INK} strokeWidth={0.3} />)}
        </g>
      ))}
      {[[8, 46], [22, 44], [64, 44], [78, 46]].map(([x, y], i) => (
        <g key={i}>
          {[0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={x + (k % 3) * 1.8 - 1.8} cy={y + Math.floor(k / 3) * 1.8} r={1.1} fill="#7a3fa0" stroke={INK} strokeWidth={0.2} />)}
        </g>
      ))}
      <Row suit="pentacles" xs={[8, 20, 64, 76]} y={60} s={4.5} />
      <Row suit="pentacles" xs={[12, 16, 68, 72]} y={70} s={4.5} />
      <Row suit="pentacles" xs={[40]} y={104} s={4.5} />
      <Person x={40} y={100} h={50} pose="raise-left" robe={ROBE.pentacles} inner="#d9b86a" hair="#5a3a22" belt={GOLD_FLAT} />
      {(() => { const hd = hands(40, 100, 50, 'raise-left'); return (
        <g>
          <path d={`M${hd.l.x - 1} ${hd.l.y - 2} q-2 -6 2 -9 q4 1 4 6 l-1 3 z`} fill="#5a4a3a" stroke={INK} strokeWidth={0.4} />
          <path d={`M${hd.l.x + 1} ${hd.l.y - 11} q2 -2 3 0 l-1 2 z`} fill={BLOOD} stroke={INK} strokeWidth={0.3} />
          <path d={`M${hd.l.x - 1} ${hd.l.y - 4} l-3 2`} stroke={INK} strokeWidth={0.5} />
        </g>
      ); })()}
      <path d="M52 100 a3 3 0 1 1 6 0 z M58 100 q3 -1 4 -3" fill="#c98a3c" stroke={INK} strokeWidth={0.4} />
    </g>
  ),
  10: () => (
    <g>
      {/* the family under the arch of the old house: the elder seated with his dogs, the couple, the child; ten coins in the tree on the arch */}
      <rect x={20} y={36} width={52} height={76} fill={PALE} opacity={0.3} />
      <path d="M26 60 h40 v-16 q-20 -14 -40 0 z M30 44 v-4 h4 v4 M40 42 v-5 h4 v5 M52 42 v-5 h4 v5 M62 44 v-4 h4 v4" fill={STONE} opacity={0.4} />
      <path d="M30 60 v-10 h6 v10 M50 60 v-8 h6 v8" fill={INK} opacity={0.3} />
      <path d="M8 112 V40 q32 -34 64 0 V112" fill="none" stroke={STONE} strokeWidth={5} />
      <path d="M8 112 V40 q32 -34 64 0 V112" fill="none" stroke="url(#hatch)" strokeWidth={5} opacity={0.6} />
      <path d="M8 112 V40 q32 -34 64 0 V112" fill="none" stroke={INK} strokeWidth={0.5} opacity={0.5} />
      <path d="M8 56 h5 M8 72 h5 M8 88 h5 M67 56 h5 M67 72 h5 M67 88 h5" stroke={INK} strokeWidth={0.4} opacity={0.5} />
      <path d="M40 14 l3 4 h-6 z M34 22 h12 v6 h-12 z" fill={BLOOD} opacity={0.8} />
      {[[14, 26], [8, 36], [20, 36], [8, 50], [20, 50], [14, 58], [8, 66], [20, 66], [14, 76], [14, 92]].map(([x, y], i) => <PentSym key={i} x={x} y={y} s={4.2} />)}
      <path d="M14 30 v4 M14 62 v10 M14 80 v8 M10 38 l8 10 M18 38 l-8 10 M10 68 l8 6 M18 68 l-8 6" stroke={GOLD_FLAT} strokeWidth={0.4} opacity={0.6} />
      <Person x={62} y={104} h={40} pose="sit-hold" robe="#7d5aa6" inner="#d9b86a" hair="#9a9088" belt={null} />
      <path d="M58 68 q1 4 4 8 q3 -4 4 -8 q-4 2 -8 0 z" fill="#e8e2d6" stroke={INK} strokeWidth={0.3} />
      {[[50, 78], [56, 82], [62, 88], [50, 94]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.2} fill="#7a3fa0" opacity={0.8} />)}
      <Person x={40} y={106} h={34} pose="hold" robe={ROBE.pentacles} inner={ROBE_PALE.pentacles} hair="#5a3a22" />
      <Person x={30} y={106} h={30} pose="hold" robe={BLOOD} inner="#e9d9b6" hair="#d9a441" belt={null} />
      <Person x={50} y={106} h={16} pose="up" robe="#3f6fa8" hair="#3a2a1e" belt={null} />
      {/* the two dogs, one nosing the elder's hand */}
      <path d="M62 104 q0 -6 5 -6 h6 q3 1 3 4 v2 z" fill={PALE} stroke={INK} strokeWidth={0.5} />
      <circle cx={76} cy={99} r={2.6} fill={PALE} stroke={INK} strokeWidth={0.5} />
      <path d="M74 97 l-1 -2.5 l2 1.5 M78 97 l1 -2.5 l-2 1.5" fill="none" stroke={INK} strokeWidth={0.5} />
      <path d="M66 106 q0 -5 4 -5 h6 q3 1 3 3 v2 z" fill={PALE} stroke={INK} strokeWidth={0.5} />
      <circle cx={65} cy={102} r={2.4} fill={PALE} stroke={INK} strokeWidth={0.5} />
      <path d="M63.5 100 l-1 -2.5 l2 1.5 M66.5 100 l1 -2.5 l-2 1.5" fill="none" stroke={INK} strokeWidth={0.5} />
    </g>
  ),
};

const SCENES: Record<Suit, Record<number, () => ReactElement>> = { wands: WANDS, cups: CUPS, swords: SWORDS, pentacles: PENTACLES };

export function minorArt(suit: Suit, rank: number): ReactElement {
  const Sym = SUIT_SYMBOL[suit];
  if (rank === 1) {
    return (
      <g>
        <AceScene suit={suit} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <line key={i} x1={50 + Math.cos(a) * 22} y1={52 + Math.sin(a) * 22} x2={50 + Math.cos(a) * 26} y2={52 + Math.sin(a) * 26} stroke={GOLD_FLAT} strokeWidth={0.8} strokeLinecap="round" />;
        })}
        {/* yods fall about the gift */}
        {[[26, 26], [74, 30], [70, 74], [30, 86], [66, 14], [20, 40], [76, 52], [38, 10]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q1.2 3 0 5 q-1.2 -2 0 -5`} fill={GOLD_FLAT} opacity={0.85} />
        ))}
        <Cloud x={-10} y={64} w={36} />
        {/* a hand from the cloud, cuffed, gripping the gift: forearm, palm, then the fingers over the stem */}
        <path d="M14 56 q10 -2 20 0 v9 q-10 2 -20 0 z" fill={SKIN} stroke={SKIN_INK} strokeWidth={0.5} />
        <path d="M13 54 h7 v13 h-7 z" fill={PALE} stroke={INK} strokeWidth={0.5} />
        <path d="M13 54 h7 v13 h-7 z" fill="url(#hatch)" opacity={0.5} />
        <path d="M32 55 q7 -4 14 -1 l3 3 v7 l-3 3 q-7 3 -14 -1 z" fill={SKIN} stroke={SKIN_INK} strokeWidth={0.5} />
        <path d="M40 57 q3 -1 5 0 M40 63 q3 1 5 0" fill="none" stroke={SKIN_INK} strokeWidth={0.3} opacity={0.6} />
        <Sym x={50} y={52} s={17} />
        {[54.5, 58, 61.5, 65].map((y, i) => (
          <rect key={i} x={44} y={y} width={9.5 - i * 0.6} height={3} rx={1.5} fill={SKIN} stroke={SKIN_INK} strokeWidth={0.4} />
        ))}
        <path d="M40 55 q5 -6 11 -4 q-1 3 -7 5 z" fill={SKIN} stroke={SKIN_INK} strokeWidth={0.4} />
      </g>
    );
  }
  if (rank <= 10) {
    const Scene = SCENES[suit][rank];
    return <Scene />;
  }
  // Court cards, after the reference deck: each rank does its suit's thing.
  return <Court suit={suit} rank={rank} />;
}

/** Pages study the suit; Knights ride at the suit's pace; Queens sit with its creature; Kings hold it as office. */
function Court({ suit, rank }: { suit: Suit; rank: number }): ReactElement {
  const Sym = SUIT_SYMBOL[suit];
  const Scenery = SUIT_SCENERY[suit];
  const Dressing = COURT_DRESSING[suit];
  const robe = ROBE[suit];
  const pale = ROBE_PALE[suit];
  const hair = COURT_HAIR[suit];
  if (rank === 11) {
    // Page: standing, looking at what they hold; a feathered cap.
    const pose = suit === 'swords' ? 'raise-right' : 'hold';
    return (
      <g>
        <Scenery />
        <Dressing />
        {suit === 'swords' && [10, 24, 56, 70].map((x, i) => <path key={x} d={`M${x} ${40 + i * 6} q6 -2 12 0`} fill="none" stroke={PALE} strokeWidth={0.9} opacity={0.8} />)}
        {suit === 'pentacles' && <Ground y={96} fill={GREEN} opacity={0.5} />}
        <Person x={34} y={98} h={48} pose={pose} robe={robe} inner={pale} hair={hair} belt={GOLD_FLAT} />
        {/* the cap and its feather */}
        <path d="M29 53 q5 -6 10 0 l0.5 1.5 q-5.5 -2 -11 0 z" fill={INK} opacity={0.8} />
        <path d="M38 52 q4 -8 9 -7 q-3 2 -6 7" fill={PALE} stroke={INK} strokeWidth={0.4} />
        {suit === 'wands' && <Sym x={43} y={68} s={9} />}
        {suit === 'cups' && (
          <g>
            <Sym x={34} y={69} s={6.5} />
            <path d="M31 61.5 q3 -5 6 0 q-3 3 -6 0 z" fill={PALE} stroke={INK} strokeWidth={0.4} />
            <circle cx={35.5} cy={61.9} r={0.5} fill={INK} />
          </g>
        )}
        {suit === 'swords' && <g transform="rotate(-20 52 44)"><Sym x={52} y={44} s={11} /></g>}
        {suit === 'pentacles' && <Sym x={34} y={70} s={6} />}
      </g>
    );
  }
  if (rank === 12) {
    // Knight: the pace is the tell. Wands rears, Cups walks, Swords charges, Pentacles stands still.
    const charge = suit === 'swords';
    const rear = suit === 'wands';
    const rx = charge ? 40 : 34;
    const ry = rear ? 80 : 84;
    const pose = suit === 'cups' ? 'hold' : 'raise-right';
    return (
      <g>
        <Scenery />
        <Dressing />
        {suit === 'pentacles' && <Ground y={94} fill="#8a6a3a" opacity={0.7} />}
        {suit === 'pentacles' && [0, 1, 2, 3].map((i) => <path key={i} d={`M0 ${98 + i * 4} q40 -3 80 0`} fill="none" stroke={INK} strokeWidth={0.5} opacity={0.4} />)}
        {suit === 'cups' && <Water y={92} rows={2} />}
        {charge && [6, 14, 60, 70].map((x, i) => <path key={x} d={`M${x} ${20 + i * 12} q10 -3 20 0`} fill="none" stroke={PALE} strokeWidth={1} opacity={0.8} />)}
        <g transform={rear ? 'rotate(-18 40 104)' : charge ? 'skewX(-14)' : undefined}>
          <Horse x={charge ? 52 : 38} y={104} fill={suit === 'swords' ? PALE : suit === 'cups' ? PALE : pale} w={52} />
        </g>
        {/* the rider in mail under the suit's surcoat, a plumed helm */}
        <Person x={rx} y={ry} h={34} pose={pose} robe={robe} inner="#c9cdd4" hair="none" belt={GOLD_FLAT} face />
        {/* a steel helm: the skull over the crown of the head, a visor with its slit, a plume in the suit's colour */}
        <path d={`M${rx - 3.8} ${ry - 30.4} a3.8 3.8 0 0 1 7.6 0 v1.6 h-7.6 z`} fill="#c9cdd4" stroke={INK} strokeWidth={0.4} />
        <path d={`M${rx - 3.8} ${ry - 28.8} h7.6 l-0.6 2.2 h-6.4 z`} fill="#b0b5be" stroke={INK} strokeWidth={0.35} />
        <path d={`M${rx - 2.6} ${ry - 27.8} h5.2`} stroke={INK} strokeWidth={0.5} />
        <path d={`M${rx} ${ry - 34.2} v2.4`} stroke={INK} strokeWidth={0.4} />
        <path d={`M${rx} ${ry - 34.2} q4 -5 8 -2 q-4 0 -7 4`} fill={suit === 'cups' ? PALE : robe} stroke={INK} strokeWidth={0.35} />
        <path d={`M${rx + 1} ${ry - 33.5} q3 -3 6 -2`} fill="none" stroke={INK} strokeWidth={0.25} opacity={0.6} />
        {suit === 'cups' ? <Sym x={34} y={60} s={6} /> : <g transform={charge ? 'rotate(-30 50 46)' : undefined}><Sym x={50} y={charge ? 44 : 52} s={8} /></g>}
      </g>
    );
  }
  if (rank === 13) {
    // Queen: seated, with the suit's companion. Sunflower and cat, a shell by the sea, a raised hand in wind, a rabbit in the grass.
    const pose = suit === 'swords' ? 'raise-right' : 'sit-hold';
    return (
      <g>
        <Scenery />
        <Dressing />
        {suit === 'cups' && <Water y={96} rows={3} />}
        <Throne x={40} y={98} w={32} h={38} fill={pale} back="arch" />
        <path d="M27 60 L20 98 H60 L53 60 Z" fill={pale} stroke={INK} strokeWidth={0.4} opacity={0.9} />
        <Person x={40} y={98} h={50} pose={pose} robe={robe} inner={PALE} hair={hair} crown belt={GOLD_FLAT} />
        {suit === 'wands' && (
          <g>
            <Sym x={40} y={74} s={7} />
            <circle cx={64} cy={60} r={4} fill={GOLD_FLAT} stroke={INK} strokeWidth={0.5} />
            <circle cx={64} cy={60} r={1.6} fill={INK} />
            <line x1={64} y1={64} x2={64} y2={80} stroke={GREEN} strokeWidth={1.2} />
            {/* the black cat sits square, tail curled about its feet, eyes on us */}
            <path d="M12 106 q-1 -8 4 -10 q5 2 4 10 z" fill={INK} />
            <path d="M20 105 q6 -2 4 -7" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
            <circle cx={16} cy={94.5} r={3.2} fill={INK} />
            <path d="M13.2 93 l-0.6 -3.4 l2.4 1.8 M18.8 93 l0.6 -3.4 l-2.4 1.8" fill={INK} />
            <circle cx={14.8} cy={94.2} r={0.5} fill={GOLD_FLAT} />
            <circle cx={17.2} cy={94.2} r={0.5} fill={GOLD_FLAT} />
            <path d="M13 96 l-2.5 -0.4 M13 96.8 l-2.5 0.4 M19 96 l2.5 -0.4 M19 96.8 l2.5 0.4" stroke={PALE} strokeWidth={0.25} opacity={0.7} />
          </g>
        )}
        {suit === 'cups' && (
          <g>
            <Sym x={40} y={74} s={7} />
            <path d="M34 64 q6 -6 12 0" fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} />
            <path d="M8 104 a7 7 0 0 1 14 0 z" fill={PALE} stroke={INK} strokeWidth={0.5} />
            <path d="M10 104 l5 -6 M15 104 v-7 M20 104 l-5 -6" stroke={INK} strokeWidth={0.4} />
          </g>
        )}
        {suit === 'swords' && (
          <g>
            {(() => { const hd = hands(40, 98, 50, 'raise-right'); return <Sym x={hd.r.x - 1} y={hd.r.y + 4} s={12} />; })()}
            {[8, 14, 20].map((y) => <path key={y} d={`M4 ${y} q8 -3 16 0`} fill="none" stroke={PALE} strokeWidth={0.9} opacity={0.8} />)}
          </g>
        )}
        {suit === 'pentacles' && (
          <g>
            <Sym x={40} y={76} s={7} />
            {/* the hare crouched in the grass, ears up */}
            <path d="M60 106 q0 -6 6 -6 q5 0 6 5 v1 z" fill="#8a6a3a" stroke={INK} strokeWidth={0.4} />
            <circle cx={72.5} cy={102.5} r={2.4} fill="#8a6a3a" stroke={INK} strokeWidth={0.4} />
            <path d="M71.5 100.5 q-1.5 -5 0.5 -6 q1.5 2 0.8 6 M73.5 100.3 q0 -5 2 -5.5 q1 2.5 -0.6 5.8" fill="#a98a5a" stroke={INK} strokeWidth={0.35} />
            <circle cx={73.6} cy={102.2} r={0.4} fill={INK} />
            <path d="M74.8 103.4 l1 0.2" stroke={INK} strokeWidth={0.4} />
            <circle cx={61} cy={104} r={1.2} fill={PALE} opacity={0.7} />
            <path d="M8 104 q10 -12 22 -4 M6 96 q8 -8 16 -2" fill="none" stroke={GREEN} strokeWidth={1.2} />
          </g>
        )}
      </g>
    );
  }
  // King: enthroned and bearded, the suit held as office. Salamanders, a fish in the sea, a raised blade, a bull at the foot.
  return (
    <g>
      <Scenery />
      <Dressing />
      {suit === 'cups' && <Water y={90} rows={4} />}
      {suit === 'cups' && <rect x={12} y={84} width={56} height={8} fill={STONE} opacity={0.6} />}
      <Throne x={40} y={98} w={38} h={44} fill={suit === 'wands' ? '#7a3a2a' : suit === 'pentacles' ? '#3a3a2a' : '#4a4a58'} back="square" dais />
      <path d="M26 60 L18 98 H62 L54 60 Z" fill={pale} stroke={INK} strokeWidth={0.4} opacity={0.9} />
      <Person x={40} y={98} h={52} pose="raise-right" robe={robe} inner={PALE} hair={hair} crown belt={GOLD_FLAT} />
      <path d="M35.6 52.5 q1 4 4.4 9 q3.4 -5 4.4 -9 q-4.4 3 -8.8 0 z" fill={hair} stroke={INK} strokeWidth={0.35} />
      {(() => { const hd = hands(40, 98, 52, 'raise-right'); return (
        <g>
          <line x1={hd.l.x} y1={hd.l.y + 2} x2={hd.l.x} y2={hd.l.y - 18} stroke={GOLD_FLAT} strokeWidth={1.3} strokeLinecap="round" />
          <circle cx={hd.l.x} cy={hd.l.y - 20.5} r={2.6} fill={GOLD_FLAT} stroke={INK} strokeWidth={0.5} />
          <path d={`M${hd.l.x - 1.5} ${hd.l.y - 23.5} l1.5 -2.5 l1.5 2.5`} fill="none" stroke={INK} strokeWidth={0.5} />
          {suit === 'swords' ? <Sym x={hd.r.x - 1} y={hd.r.y + 4} s={12} /> : <Sym x={hd.r.x} y={hd.r.y + (suit === 'wands' ? 6 : 2)} s={8} />}
        </g>
      ); })()}
      {suit === 'wands' && [18, 62].map((x) => <path key={x} d={`M${x} 90 q4 -6 8 0 q-4 4 -8 0 z`} fill={GOLD_FLAT} stroke={INK} strokeWidth={0.4} />)}
      {suit === 'cups' && <path d="M8 100 q5 -4 10 0 q-5 4 -10 0 z M18 100 l4 -3 v6 z" fill={PALE} stroke={INK} strokeWidth={0.5} />}
      {suit === 'pentacles' && (
        <g>
          {/* the bull's head carved on the throne's foot, horns curved, a ring in the nose */}
          <path d="M8 104 q0 -6 6 -7 h6 q5 1 6 6 v3 h-18 z" fill={INK} />
          <circle cx={13} cy={98.5} r={3.4} fill={INK} />
          <path d="M10 96.5 q-4 -4 -1.5 -7 q2 2 2.5 5.5 M16 96.5 q4 -4 1.5 -7 q-2 2 -2.5 5.5" fill={PALE} stroke={INK} strokeWidth={0.4} />
          <circle cx={11.8} cy={98.3} r={0.45} fill={PALE} />
          <circle cx={14.2} cy={98.3} r={0.45} fill={PALE} />
          <circle cx={13} cy={101.2} r={0.9} fill="none" stroke={GOLD_FLAT} strokeWidth={0.4} />
          <path d="M60 104 q8 -10 16 -6 M64 100 q6 -2 10 -6" fill="none" stroke={GREEN} strokeWidth={1.2} />
          {[62, 70].map((x) => <circle key={x} cx={x} cy={96} r={1.6} fill="#7a3fa0" />)}
        </g>
      )}
    </g>
  );
}

void GOLD;
void Mountains;
