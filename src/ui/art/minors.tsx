import type { ReactElement } from 'react';
import type { Suit } from '../../engine';
import { ROBE, ROBE_PALE } from './palette';
import { BLOOD, Cloud, Figure, Flame, GOLD, GOLD_FLAT, Horse, INK, Moon, Mountains, PALE, Star, Sun, SUIT_SYMBOL, Throne, Tree, Water } from './primitives';
import { Person, hands } from './figure';

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
  wands: () => <Mountains y={84} opacity={0.18} />,
  cups: () => <Water y={98} rows={3} />,
  swords: () => (
    <g>
      <Cloud x={-4} y={8} w={20} />
      <Cloud x={60} y={104} w={24} />
    </g>
  ),
  pentacles: () => (
    <g>
      <path d="M0 100 q20 -10 40 0 t40 0 v12 h-80 z" fill={INK} opacity={0.25} />
      {[10, 30, 50, 70].map((x) => (
        <path key={x} d={`M${x} 100 q2 -6 4 0`} fill="none" stroke={INK} strokeWidth={0.8} opacity={0.5} />
      ))}
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

/** A figure lying flat: a long robe, a head at one end. `x` is the head's side. */
function Lying({ x, y, w = 40, fill, head = 'left' }: { x: number; y: number; w?: number; fill: string; head?: 'left' | 'right' }) {
  const hx = head === 'left' ? x + 5 : x + w - 5;
  return (
    <g>
      <path d={`M${x + 4} ${y - 5} h${w - 8} q4 0 4 4 v3 q0 3 -4 3 h${-(w - 8)} q-4 0 -4 -3 v-3 q0 -4 4 -4 z`} fill={fill} />
      <circle cx={hx} cy={y - 6} r={4.6} fill={fill} />
    </g>
  );
}

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
      <Water y={60} rows={2} />
      <Mountains y={62} opacity={0.25} />
      <rect x={0} y={72} width={80} height={40} fill={STONE} />
      {[0, 16, 32, 48, 64].map((x) => <rect key={x} x={x} y={66} width={8} height={7} fill={STONE} />)}
      <Row suit="wands" xs={[70]} y={80} s={11} />
      <Figure x={30} y={100} h={48} arms="left-up" fill={ROBE.wands} />
      <circle cx={14} cy={58} r={4} fill="url(#skySpirit)" stroke={INK} strokeWidth={0.6} />
      <path d="M10 58 h8 M14 54 v8" stroke={INK} strokeWidth={0.4} />
      <Row suit="wands" xs={[44]} y={82} s={11} />
    </g>
  ),
  3: () => (
    <g>
      <Sun x={64} y={16} r={7} rays={10} />
      <Water y={52} rows={3} />
      {[16, 34, 56].map((x, i) => <path key={x} d={`M${x} ${50 + i} l2 -5 l2 5 z`} fill={PALE} stroke={INK} strokeWidth={0.4} />)}
      <Ground y={78} fill="#8a6a3a" />
      <Row suit="wands" xs={[18, 62]} y={86} s={11} />
      <Figure x={40} y={104} h={52} arms="right-up" fill={ROBE.wands} cloak />
      <Row suit="wands" xs={[52]} y={80} s={11} />
    </g>
  ),
  4: () => (
    <g>
      <rect x={0} y={40} width={80} height={72} fill={STONE} opacity={0.25} />
      <Row suit="wands" xs={[14, 30, 50, 66]} y={70} s={12} />
      <path d="M14 46 q26 16 52 0" fill="none" stroke={GREEN} strokeWidth={3} />
      {[20, 32, 44, 56].map((x, i) => <circle key={x} cx={x} cy={52 + Math.sin(i * 1.2) * 2} r={2} fill={BLOOD} stroke={INK} strokeWidth={0.3} />)}
      <Figure x={32} y={104} h={26} arms="up" fill={ROBE_PALE.wands} />
      <Figure x={48} y={104} h={26} arms="up" fill={ROBE.wands} />
      <Ground y={100} fill={GOLD_FLAT} opacity={0.5} />
    </g>
  ),
  5: () => (
    <g>
      <Ground y={92} fill="#9aa27a" />
      {[[12, 100, 'right-up'], [28, 96, 'up'], [44, 102, 'left-up'], [60, 96, 'right-up'], [72, 104, 'up']].map(([x, y, a], i) => (
        <Figure key={i} x={x as number} y={y as number} h={30} arms={a as 'up'} fill={i % 2 ? ROBE.wands : ROBE_PALE.wands} />
      ))}
      <Row suit="wands" xs={[10, 30, 46, 62, 74]} y={62} s={9} angle={-20} />
    </g>
  ),
  6: () => (
    <g>
      <Ground y={96} fill={GOLD_FLAT} opacity={0.5} />
      {[8, 70, 16].map((x, i) => <Figure key={i} x={x} y={104 - i} h={22} arms="up" fill={INK} />)}
      <Row suit="wands" xs={[8, 70, 16, 64]} y={60} s={9} />
      <Horse x={40} y={102} fill={PALE} w={48} />
      <Figure x={36} y={84} h={34} arms="right-up" fill={ROBE.wands} />
      <Row suit="wands" xs={[52]} y={52} s={10} />
      <ellipse cx={52} cy={44} rx={5} ry={3} fill="none" stroke={GREEN} strokeWidth={1.6} />
      <ellipse cx={36} cy={49} rx={5} ry={2.4} fill="none" stroke={GREEN} strokeWidth={1.4} />
    </g>
  ),
  7: () => (
    <g>
      <Row suit="wands" xs={[8, 20, 32, 46, 58, 70]} y={92} s={10} />
      <path d="M0 78 Q40 60 80 78 L80 112 L0 112 Z" fill={GREEN} opacity={0.7} />
      <Figure x={40} y={80} h={40} arms="hold" fill={ROBE.wands} />
      <Row suit="wands" xs={[52]} y={58} s={11} angle={20} />
    </g>
  ),
  8: () => (
    <g>
      <Mountains y={84} opacity={0.25} />
      <Water y={92} rows={2} />
      <Ground y={100} fill={GREEN} opacity={0.6} />
      {[[10, 30], [22, 24], [34, 18], [46, 12], [16, 52], [28, 46], [40, 40], [52, 34]].map(([x, y], i) => (
        <g key={i} transform={`rotate(-35 ${x} ${y})`}>
          <Row suit="wands" xs={[x]} y={y} s={9} />
        </g>
      ))}
    </g>
  ),
  9: () => (
    <g>
      <Row suit="wands" xs={[8, 18, 28, 38, 48, 58, 68, 76]} y={70} s={12} />
      <Ground y={96} fill={STONE} opacity={0.6} />
      <Figure x={30} y={104} h={44} arms="hold" fill={ROBE.wands} />
      <rect x={26} y={62} width={8} height={2.4} fill={PALE} />
      <Row suit="wands" xs={[42]} y={90} s={12} />
    </g>
  ),
  10: () => (
    <g>
      <Ground y={92} fill="#8a6a3a" />
      {[62, 70, 76].map((x, i) => <rect key={x} x={x} y={70 - i * 4} width={6} height={22 + i * 4} fill={STONE} opacity={0.8} />)}
      <g transform="rotate(28 34 96)">
        <Figure x={34} y={100} h={42} arms="raised" fill={ROBE.wands} />
      </g>
      <g transform="rotate(18 34 70)">
        <Row suit="wands" xs={[22, 26, 30, 34, 38, 42, 46, 50, 54, 58]} y={68} s={11} />
      </g>
    </g>
  ),
};

// --- Cups: feeling, the water that fills and spills ----------------------

const CUPS: Record<number, () => ReactElement> = {
  2: () => (
    <g>
      <Ground y={94} fill={GREEN} opacity={0.6} />
      <Figure x={26} y={102} h={44} arms="right-up" fill={ROBE.cups} />
      <Figure x={54} y={102} h={44} arms="left-up" fill={ROBE_PALE.cups} />
      <Row suit="cups" xs={[30, 50]} y={70} s={7} />
      <path d="M40 46 v-18 M36 30 q4 -4 8 0 M36 24 q4 -4 8 0" fill="none" stroke={GOLD_FLAT} strokeWidth={1.2} />
      <path d="M34 22 q6 -8 12 0" fill="none" stroke={BLOOD} strokeWidth={1.8} />
    </g>
  ),
  3: () => (
    <g>
      <Ground y={96} fill={GOLD_FLAT} opacity={0.5} />
      {[[22, 'right-up'], [40, 'up'], [58, 'left-up']].map(([x, a], i) => (
        <Figure key={i} x={x as number} y={104} h={42} arms={a as 'up'} fill={[ROBE.cups, ROBE_PALE.cups, '#e9d9b6'][i]} />
      ))}
      <Row suit="cups" xs={[18, 40, 62]} y={52} s={7} />
      {[10, 30, 50, 70].map((x) => <ellipse key={x} cx={x} cy={102} rx={4} ry={2.5} fill="#d98a3c" stroke={INK} strokeWidth={0.4} />)}
    </g>
  ),
  4: () => (
    <g>
      <Ground y={92} fill={GREEN} opacity={0.6} />
      <Tree x={22} y={92} h={56} />
      <Figure x={24} y={98} h={30} arms="hold" fill={ROBE.cups} />
      <Row suit="cups" xs={[40, 54, 68]} y={100} s={6.5} />
      <Cloud x={46} y={54} w={26} />
      <path d="M54 52 q8 -4 16 0 q-6 4 -16 0 z" fill={PALE} stroke={INK} strokeWidth={0.5} />
      <Row suit="cups" xs={[66]} y={44} s={6.5} />
    </g>
  ),
  5: () => (
    <g>
      <Water y={70} rows={2} />
      <path d="M46 70 q10 -10 22 0" fill="none" stroke={STONE} strokeWidth={2.4} />
      <rect x={62} y={40} width={12} height={22} fill={STONE} opacity={0.7} />
      <Ground y={92} fill={STONE} opacity={0.5} />
      <Figure x={30} y={104} h={48} arms="down" fill={INK} cloak />
      <Row suit="cups" xs={[8, 18, 44]} y={104} s={6} angle={70} />
      <Row suit="cups" xs={[56, 68]} y={102} s={6} />
      {[10, 20].map((x) => <path key={x} d={`M${x} 106 q6 2 10 6`} fill="none" stroke={BLOOD} strokeWidth={1} />)}
    </g>
  ),
  6: () => (
    <g>
      <rect x={0} y={44} width={80} height={68} fill={GOLD_FLAT} opacity={0.25} />
      <rect x={54} y={30} width={26} height={40} fill={PALE} stroke={INK} strokeWidth={0.6} />
      <path d="M54 30 l13 -10 l13 10 z" fill={BLOOD} stroke={INK} strokeWidth={0.5} />
      <Figure x={30} y={104} h={34} arms="right-up" fill={ROBE.cups} />
      <Figure x={50} y={104} h={24} arms="left-up" fill={ROBE_PALE.cups} />
      <Row suit="cups" xs={[42]} y={76} s={6} />
      <Row suit="cups" xs={[10, 22, 66, 74, 12]} y={98} s={5.5} />
      {[42, 10, 22, 66, 74, 12].map((x, i) => <path key={i} d={`M${x} ${i === 0 ? 70 : 92} l-2 -3 l2 -1 l2 1 z`} fill={PALE} stroke={INK} strokeWidth={0.3} />)}
    </g>
  ),
  7: () => (
    <g>
      <Cloud x={2} y={50} w={76} />
      <Row suit="cups" xs={[14, 32, 50, 68]} y={30} s={6.5} />
      <Row suit="cups" xs={[22, 40, 58]} y={56} s={6.5} />
      {[[14, 22], [32, 22], [50, 22], [68, 22], [22, 48], [40, 48], [58, 48]].map(([x, y], i) => (
        <g key={i}>
          {i === 0 && <circle cx={x} cy={y} r={2} fill={INK} />}
          {i === 1 && <path d={`M${x - 2} ${y + 1} l2 -4 l2 4 z`} fill={GOLD_FLAT} />}
          {i === 2 && <path d={`M${x - 2} ${y} l2 -2 l2 2 l-2 2 z`} fill={BLOOD} />}
          {i === 3 && <circle cx={x} cy={y} r={1.8} fill="none" stroke={INK} strokeWidth={0.6} />}
          {i === 4 && <path d={`M${x - 2} ${y + 1} h4 v-3 h-4 z`} fill={STONE} />}
          {i === 5 && <Star x={x} y={y} r={2.2} points={5} />}
          {i === 6 && <circle cx={x} cy={y} r={2} fill={GREEN} />}
        </g>
      ))}
      <Ground y={100} fill={INK} opacity={0.7} />
      <Figure x={40} y={104} h={34} arms="raised" fill={INK} />
    </g>
  ),
  8: () => (
    <g>
      <Moon x={62} y={18} r={7} face />
      <Mountains y={60} opacity={0.5} fill="#3b3159" />
      <Water y={82} rows={2} />
      <Ground y={92} fill="#3b3159" opacity={0.8} />
      <Row suit="cups" xs={[12, 22, 32, 42, 52]} y={104} s={5.5} />
      <Row suit="cups" xs={[17, 27, 37]} y={94} s={5.5} />
      <Figure x={64} y={78} h={30} arms="hold" fill={BLOOD} cloak />
      <path d="M64 78 q6 -14 4 -30" fill="none" stroke={GOLD_FLAT} strokeWidth={1} opacity={0.5} />
    </g>
  ),
  9: () => (
    <g>
      <path d="M8 44 q32 -14 64 0 v14 h-64 z" fill={ROBE_PALE.cups} stroke={INK} strokeWidth={0.6} />
      <Row suit="cups" xs={[12, 20, 28, 36, 44, 52, 60, 68, 76]} y={46} s={5} />
      <rect x={28} y={84} width={24} height={14} fill="#8a6a3a" stroke={INK} strokeWidth={0.6} />
      <Figure x={40} y={90} h={40} arms="hold" fill={ROBE.cups} />
      <path d="M31 72 q9 4 18 0" fill="none" stroke={PALE} strokeWidth={1.6} strokeLinecap="round" />
      <Ground y={98} fill={GOLD_FLAT} opacity={0.5} />
    </g>
  ),
  10: () => (
    <g>
      {[0, 1, 2].map((i) => <path key={i} d={`M-6 ${60 + i * 5} Q40 ${-4 + i * 5} 86 ${60 + i * 5}`} fill="none" stroke={[BLOOD, GOLD_FLAT, '#6ab7d6'][i]} strokeWidth={3} opacity={0.7} />)}
      <Row suit="cups" xs={[8, 18, 28, 38, 48, 58, 68, 78, 24, 56]} y={26} s={5} />
      <Ground y={92} fill={GREEN} opacity={0.6} />
      <path d="M52 92 v-14 h16 v14 z M50 78 l10 -8 l10 8 z" fill={PALE} stroke={INK} strokeWidth={0.5} />
      <Figure x={22} y={104} h={40} arms="up" fill={ROBE.cups} />
      <Figure x={36} y={104} h={40} arms="up" fill={ROBE_PALE.cups} />
      <Figure x={54} y={106} h={20} arms="right-up" fill={INK} />
      <Figure x={66} y={106} h={20} arms="left-up" fill={INK} />
    </g>
  ),
};

// --- Swords: thought, the blade that cuts both ways -----------------------

const SWORDS: Record<number, () => ReactElement> = {
  2: () => (
    <g>
      <Moon x={66} y={14} r={5} />
      <Water y={60} rows={3} />
      {[12, 30, 50].map((x, i) => <ellipse key={x} cx={x} cy={64 + i * 2} rx={5} ry={2} fill={STONE} />)}
      <rect x={20} y={90} width={40} height={12} fill={STONE} opacity={0.8} />
      <Figure x={40} y={96} h={44} arms="hold" fill={ROBE_PALE.swords} />
      <rect x={35} y={58} width={10} height={2.4} fill={INK} />
      <Row suit="swords" xs={[30]} y={62} s={13} angle={-35} />
      <Row suit="swords" xs={[50]} y={62} s={13} angle={35} />
    </g>
  ),
  3: () => (
    <g>
      <Cloud x={-6} y={22} w={40} />
      <Cloud x={44} y={20} w={42} />
      {Array.from({ length: 14 }, (_, i) => <line key={i} x1={6 + i * 5.5} y1={26 + (i % 3) * 6} x2={4 + i * 5.5} y2={38 + (i % 3) * 6} stroke={PALE} strokeWidth={0.7} opacity={0.8} />)}
      <path d="M40 92 C18 76 14 50 40 58 C66 50 62 76 40 92 Z" fill={BLOOD} stroke={INK} strokeWidth={0.8} />
      <Row suit="swords" xs={[40]} y={64} s={16} />
      <Row suit="swords" xs={[30]} y={62} s={16} angle={-28} />
      <Row suit="swords" xs={[50]} y={62} s={16} angle={28} />
    </g>
  ),
  4: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={STONE} opacity={0.3} />
      <path d="M50 8 h22 v30 h-22 z" fill="#3f6fa8" opacity={0.8} />
      <path d="M52 10 h8 v10 h-8 z M62 10 h8 v10 h-8 z M52 22 h8 v14 h-8 z M62 22 h8 v14 h-8 z" fill={GOLD_FLAT} opacity={0.7} />
      <Row suit="swords" xs={[14, 24, 34]} y={30} s={9} />
      <rect x={10} y={82} width={60} height={20} fill={PALE} stroke={INK} strokeWidth={0.7} />
      <Lying x={14} y={80} w={52} fill={ROBE.swords} head="left" />
      <path d="M36 70 h8 v3 h-8 z" fill={PALE} opacity={0.9} />
      <g transform="rotate(90 40 92)">
        <Row suit="swords" xs={[40]} y={92} s={9} />
      </g>
    </g>
  ),
  5: () => (
    <g>
      <Cloud x={-4} y={20} w={30} />
      <Cloud x={50} y={14} w={34} />
      <Water y={62} rows={2} />
      <Ground y={84} fill={GREEN} opacity={0.5} />
      <Figure x={16} y={74} h={22} arms="down" fill={INK} />
      <Figure x={34} y={72} h={18} arms="down" fill={INK} />
      <Figure x={60} y={104} h={44} arms="left-up" fill={ROBE.swords} />
      <Row suit="swords" xs={[68, 74, 78]} y={66} s={11} angle={-15} />
      <Row suit="swords" xs={[14, 30]} y={104} s={10} angle={80} />
    </g>
  ),
  6: () => (
    <g>
      <Water y={62} rows={5} />
      <Mountains y={48} opacity={0.3} />
      <path d="M6 96 q34 14 68 0 v-8 h-68 z" fill="#8a6a3a" stroke={INK} strokeWidth={0.6} />
      <Row suit="swords" xs={[14, 20, 26, 32, 38, 44]} y={80} s={9} />
      <Figure x={30} y={90} h={22} arms="hold" fill={ROBE_PALE.swords} cloak />
      <Figure x={42} y={90} h={14} arms="hold" fill={ROBE_PALE.swords} />
      <Figure x={64} y={92} h={36} arms="hold" fill={INK} />
      <line x1={70} y1={52} x2={70} y2={104} stroke={INK} strokeWidth={1.2} />
    </g>
  ),
  7: () => (
    <g>
      <Ground y={92} fill={GOLD_FLAT} opacity={0.4} />
      {[8, 30, 56].map((x, i) => <path key={x} d={`M${x} 92 l10 -22 l10 22 z`} fill={[PALE, BLOOD, GOLD_FLAT][i]} stroke={INK} strokeWidth={0.5} opacity={0.85} />)}
      <Row suit="swords" xs={[60, 68]} y={100} s={9} />
      <g transform="rotate(-12 26 104)">
        <Figure x={26} y={104} h={40} arms="hold" fill={ROBE.swords} />
      </g>
      <Row suit="swords" xs={[12, 17, 22, 27, 32]} y={76} s={10} angle={-30} />
    </g>
  ),
  8: () => (
    <g>
      <Water y={90} rows={3} />
      <rect x={58} y={20} width={18} height={30} fill={STONE} opacity={0.6} />
      <Ground y={100} fill={STONE} opacity={0.6} />
      <Row suit="swords" xs={[8, 18, 28, 52, 62, 72, 13, 67]} y={78} s={12} />
      <Figure x={40} y={102} h={44} arms="hold" fill={ROBE.swords} cloak />
      {[70, 76, 82].map((y) => <path key={y} d={`M32 ${y} q8 3 16 0`} fill="none" stroke={PALE} strokeWidth={1.4} />)}
      <rect x={35} y={64} width={10} height={2.4} fill={INK} />
    </g>
  ),
  9: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={INK} opacity={0.85} />
      <Row suit="swords" xs={[40, 40, 40, 40, 40, 40, 40, 40, 40]} y={20} s={0} />
      {[14, 22, 30, 38, 46, 54, 62, 70, 78].map((y) => <rect key={y} x={4} y={y} width={72} height={2} fill={PALE} opacity={0.75} />)}
      <rect x={6} y={84} width={68} height={22} fill={PALE} stroke={INK} strokeWidth={0.6} />
      {[[12, 90], [30, 90], [48, 90], [66, 90], [21, 98], [39, 98], [57, 98]].map(([x, y], i) => <path key={i} d={`M${x} ${y} l3 -3 l3 3 l-3 3 z`} fill={[BLOOD, '#6ab7d6', GOLD_FLAT][i % 3]} />)}
      <Figure x={40} y={86} h={34} arms="raised" fill={PALE} />
      <path d="M33 60 q7 -6 14 0" fill="none" stroke={INK} strokeWidth={1.4} />
    </g>
  ),
  10: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={INK} opacity={0.7} />
      <path d="M0 62 h80 v10 h-80 z" fill={GOLD_FLAT} opacity={0.45} />
      <Water y={74} rows={2} />
      <Ground y={90} fill={INK} opacity={0.8} />
      <Lying x={12} y={102} w={58} fill={BLOOD} head="right" />
      <path d="M12 104 q10 4 22 2" fill="none" stroke={BLOOD} strokeWidth={2} opacity={0.8} />
      <Row suit="swords" xs={[14, 20, 26, 32, 38, 44, 50, 56, 62, 68]} y={90} s={9} />
    </g>
  ),
};

// --- Pentacles: the body, the coin, the slow work -------------------------

const PENTACLES: Record<number, () => ReactElement> = {
  2: () => (
    <g>
      <Water y={70} rows={3} />
      {[12, 60].map((x, i) => <path key={x} d={`M${x} ${70 + i * 4} l6 -8 l6 8 z M${x - 2} ${70 + i * 4} h16 l-3 4 h-10 z`} fill={PALE} stroke={INK} strokeWidth={0.4} />)}
      <Ground y={96} fill={GOLD_FLAT} opacity={0.5} />
      <Figure x={40} y={104} h={48} arms="out" fill={ROBE.pentacles} />
      <path d="M26 72 c0 -14 28 -14 28 0 c0 14 -28 14 -28 0" fill="none" stroke={GREEN} strokeWidth={2.2} />
      <Row suit="pentacles" xs={[26, 54]} y={72} s={6} />
    </g>
  ),
  3: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={STONE} opacity={0.35} />
      <path d="M14 112 V46 q26 -30 52 0 V112" fill="none" stroke={INK} strokeWidth={2} />
      <Row suit="pentacles" xs={[40, 30, 50]} y={30} s={6} />
      <rect x={20} y={88} width={14} height={16} fill="#8a6a3a" stroke={INK} strokeWidth={0.6} />
      <Figure x={27} y={92} h={34} arms="right-up" fill={ROBE.pentacles} />
      <Figure x={56} y={106} h={38} arms="hold" fill={INK} cloak />
      <Figure x={68} y={106} h={36} arms="hold" fill={PALE} cloak />
      <rect x={52} y={80} width={14} height={8} fill={PALE} stroke={INK} strokeWidth={0.5} />
    </g>
  ),
  4: () => (
    <g>
      {[4, 18, 32, 50, 64].map((x, i) => <rect key={x} x={x} y={40 - (i % 2) * 8} width={10} height={40} fill={STONE} opacity={0.5} />)}
      <Ground y={88} fill={STONE} opacity={0.5} />
      <rect x={26} y={86} width={28} height={12} fill="#8a6a3a" stroke={INK} strokeWidth={0.6} />
      <Figure x={40} y={92} h={44} arms="hold" fill={ROBE.pentacles} crown />
      <Row suit="pentacles" xs={[40]} y={74} s={7} />
      <Row suit="pentacles" xs={[40]} y={44} s={5} />
      <Row suit="pentacles" xs={[30, 50]} y={100} s={5.5} />
    </g>
  ),
  5: () => (
    <g>
      <rect x={0} y={0} width={80} height={112} fill={INK} opacity={0.6} />
      <path d="M40 8 h34 v56 h-34 z" fill="#3f6fa8" opacity={0.9} />
      <Row suit="pentacles" xs={[57, 48, 66, 52, 62]} y={20} s={4.5} />
      <path d="M48 42 h18 v18 h-18 z" fill={GOLD_FLAT} opacity={0.75} />
      {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={(i * 13) % 80} cy={(i * 29) % 100} r={0.9} fill={SNOW} opacity={0.8} />)}
      <Ground y={96} fill={SNOW} opacity={0.85} />
      <Figure x={14} y={104} h={38} arms="hold" fill={INK} cloak />
      <line x1={22} y1={104} x2={22} y2={76} stroke={INK} strokeWidth={1.4} />
      <Figure x={30} y={104} h={30} arms="down" fill={BLOOD} cloak />
    </g>
  ),
  6: () => (
    <g>
      <Ground y={96} fill={GOLD_FLAT} opacity={0.5} />
      <Figure x={40} y={100} h={50} arms="out" fill={ROBE.pentacles} />
      <path d="M26 66 l-3 0 l0 6 M26 66 l3 0 l0 6 M22 72 h8" fill="none" stroke={GOLD_FLAT} strokeWidth={1} />
      <Figure x={12} y={106} h={22} arms="raised" fill={INK} cloak />
      <Figure x={68} y={106} h={22} arms="raised" fill={INK} cloak />
      <Row suit="pentacles" xs={[10, 24, 40, 56, 70, 40]} y={22} s={5} />
      <path d="M52 68 q6 6 10 14" fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} strokeDasharray="1 2" />
    </g>
  ),
  7: () => (
    <g>
      <Ground y={92} fill={GREEN} opacity={0.65} />
      <path d="M52 92 q4 -30 -2 -60 M50 40 q10 4 16 -4 M50 56 q10 6 18 0 M50 74 q10 6 16 -2" fill="none" stroke={GREEN} strokeWidth={1.6} />
      <Row suit="pentacles" xs={[62, 56, 68, 60, 66, 54, 64]} y={34} s={5} />
      <Figure x={24} y={102} h={46} arms="hold" fill={ROBE.pentacles} />
      <line x1={34} y1={102} x2={34} y2={62} stroke="#8a6a3a" strokeWidth={1.6} />
    </g>
  ),
  8: () => (
    <g>
      <Ground y={96} fill={STONE} opacity={0.4} />
      <line x1={64} y1={10} x2={64} y2={96} stroke="#8a6a3a" strokeWidth={2} />
      <Row suit="pentacles" xs={[64, 64, 64, 64, 64, 64]} y={20} s={0} />
      {[18, 32, 46, 60, 74, 88].map((y) => <Row key={y} suit="pentacles" xs={[64]} y={y} s={5} />)}
      <rect x={14} y={84} width={26} height={14} fill="#8a6a3a" stroke={INK} strokeWidth={0.6} />
      <Figure x={22} y={92} h={40} arms="right-up" fill={ROBE.pentacles} />
      <Row suit="pentacles" xs={[36]} y={82} s={5} />
      <Row suit="pentacles" xs={[10]} y={104} s={5} />
    </g>
  ),
  9: () => (
    <g>
      <Ground y={90} fill={GOLD_FLAT} opacity={0.5} />
      {[6, 18, 62, 74].map((x) => <path key={x} d={`M${x} 90 v-40 q4 -6 8 0 v40`} fill={GREEN} opacity={0.6} />)}
      <Row suit="pentacles" xs={[8, 20, 64, 76, 10, 18, 66, 74, 40]} y={58} s={4.5} />
      {[12, 24, 60, 72].map((x, i) => <circle key={x} cx={x} cy={44 + (i % 2) * 8} r={2.4} fill="#7a3fa0" opacity={0.8} />)}
      <Figure x={40} y={100} h={50} arms="left-up" fill={ROBE.pentacles} cloak />
      <path d="M22 54 l-4 -4 l6 1 l1 5 z" fill={INK} />
    </g>
  ),
  10: () => (
    <g>
      <path d="M8 112 V40 q32 -34 64 0 V112" fill="none" stroke={STONE} strokeWidth={4} />
      <rect x={20} y={40} width={40} height={72} fill={PALE} opacity={0.3} />
      <Row suit="pentacles" xs={[14, 14, 14, 14]} y={20} s={0} />
      {[[14, 30], [26, 24], [14, 46], [26, 40], [14, 62], [26, 56], [14, 78], [26, 72], [20, 92], [20, 104]].map(([x, y], i) => <Row key={i} suit="pentacles" xs={[x]} y={y} s={4.4} />)}
      <Figure x={62} y={104} h={40} arms="hold" fill={ROBE_PALE.pentacles} cloak />
      <Figure x={44} y={106} h={34} arms="hold" fill={ROBE.pentacles} />
      <Figure x={54} y={106} h={16} arms="up" fill={INK} />
      <ellipse cx={68} cy={104} rx={6} ry={2.6} fill={INK} />
      <ellipse cx={40} cy={106} rx={5} ry={2.2} fill={PALE} stroke={INK} strokeWidth={0.5} />
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
        <Cloud x={-10} y={64} w={36} />
        {/* an open hand from the cloud */}
        <path d="M14 60 q8 -6 18 -2 l6 -3 q2 3 -2 5 l3 -1 q2 3 -3 5 q-4 4 -12 4 q-8 0 -10 -4 z" fill={PALE} stroke={INK} strokeWidth={0.7} strokeLinejoin="round" />
        <Sym x={50} y={52} s={17} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <line key={i} x1={50 + Math.cos(a) * 22} y1={52 + Math.sin(a) * 22} x2={50 + Math.cos(a) * 26} y2={52 + Math.sin(a) * 26} stroke={GOLD_FLAT} strokeWidth={0.8} strokeLinecap="round" />;
        })}
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
        <path d={`M${rx - 3.6} ${ry - 30.6} a3.6 3.6 0 0 1 7.2 0 v1.4 h-7.2 z`} fill="#c9cdd4" stroke={INK} strokeWidth={0.4} />
        <path d={`M${rx} ${ry - 34} q4 -4 7 -1 q-4 0 -6 3`} fill={suit === 'cups' ? PALE : robe} stroke={INK} strokeWidth={0.35} />
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
            <ellipse cx={20} cy={104} rx={7} ry={3.5} fill={INK} />
            <circle cx={14} cy={100} r={2.4} fill={INK} />
            <path d="M12 98 l-1 -3 l2 1 M16 98 l1 -3 l-2 1" fill="none" stroke={INK} strokeWidth={0.8} />
            <circle cx={13.2} cy={100} r={0.4} fill={GOLD_FLAT} />
            <circle cx={14.8} cy={100} r={0.4} fill={GOLD_FLAT} />
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
            <ellipse cx={66} cy={104} rx={5} ry={3} fill="#8a6a3a" />
            <circle cx={70} cy={101} r={2} fill="#8a6a3a" />
            <path d="M69 99 l-1 -4 M71 99 l1 -4" stroke="#8a6a3a" strokeWidth={1} strokeLinecap="round" />
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
          <ellipse cx={20} cy={104} rx={8} ry={4} fill={INK} />
          <circle cx={13} cy={100} r={3} fill={INK} />
          <path d="M11 98 q-3 -4 0 -6 M15 98 q3 -4 0 -6" fill="none" stroke={INK} strokeWidth={1} />
          <path d="M60 104 q8 -10 16 -6 M64 100 q6 -2 10 -6" fill="none" stroke={GREEN} strokeWidth={1.2} />
          {[62, 70].map((x) => <circle key={x} cx={x} cy={96} r={1.6} fill="#7a3fa0" />)}
        </g>
      )}
    </g>
  );
}

void GOLD;
void Mountains;
