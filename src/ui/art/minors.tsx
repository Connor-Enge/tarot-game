import type { ReactElement } from 'react';
import type { Suit } from '../../engine';
import { Cloud, Figure, GOLD_FLAT, Horse, INK, Mountains, PALE, SUIT_SYMBOL, Throne, Tree, Water } from './primitives';

/** Suit-specific ornament behind each Ace. */
function AceFlourish({ suit }: { suit: Suit }) {
  switch (suit) {
    case 'wands':
      return <g>{[30, 44, 58, 72].map((x, i) => <path key={i} d={`M${x} 96 q2 -8 5 -12 q0 8 -5 12`} fill={GOLD_FLAT} stroke={INK} strokeWidth={0.4} />)}</g>;
    case 'cups':
      return <g><path d="M40 70 q8 10 20 6" fill="none" stroke="#6ab7d6" strokeWidth={1.6} /><path d="M62 74 q6 8 4 18" fill="none" stroke="#6ab7d6" strokeWidth={1.2} /></g>;
    case 'swords':
      return <path d="M40 30 l4 -6 l4 4 l4 -6 l4 6 l4 -4 l4 6 v6 h-24 z" fill={GOLD_FLAT} stroke={INK} strokeWidth={0.5} />;
    default:
      return <g><Tree x={14} y={96} h={18} /><Tree x={70} y={98} h={16} /></g>;
  }
}

type Pt = [number, number];

/** Traditional pip arrangements in the 80 x 112 window. */
const PIP_LAYOUT: Record<number, Pt[]> = {
  2: [[40, 30], [40, 82]],
  3: [[40, 26], [22, 82], [58, 82]],
  4: [[24, 30], [56, 30], [24, 82], [56, 82]],
  5: [[24, 28], [56, 28], [40, 56], [24, 84], [56, 84]],
  6: [[24, 24], [56, 24], [24, 56], [56, 56], [24, 88], [56, 88]],
  7: [[26, 22], [54, 22], [20, 54], [40, 54], [60, 54], [26, 86], [54, 86]],
  8: [[22, 22], [40, 22], [58, 22], [30, 56], [50, 56], [22, 90], [40, 90], [58, 90]],
  9: [[22, 22], [40, 22], [58, 22], [22, 56], [40, 56], [58, 56], [22, 90], [40, 90], [58, 90]],
  10: [[20, 20], [60, 20], [20, 44], [60, 44], [20, 68], [60, 68], [20, 92], [60, 92], [40, 32], [40, 80]],
};

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

export function minorArt(suit: Suit, rank: number): ReactElement {
  const Sym = SUIT_SYMBOL[suit];
  const Scenery = SUIT_SCENERY[suit];
  if (rank === 1) {
    return (
      <g>
        <Scenery />
        <Cloud x={-10} y={64} w={36} />
        {/* an open hand from the cloud */}
        <path d="M14 60 q8 -6 18 -2 l6 -3 q2 3 -2 5 l3 -1 q2 3 -3 5 q-4 4 -12 4 q-8 0 -10 -4 z" fill={PALE} stroke={INK} strokeWidth={0.7} strokeLinejoin="round" />
        <AceFlourish suit={suit} />
        <Sym x={50} y={52} s={17} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <line key={i} x1={50 + Math.cos(a) * 22} y1={52 + Math.sin(a) * 22} x2={50 + Math.cos(a) * 26} y2={52 + Math.sin(a) * 26} stroke={GOLD_FLAT} strokeWidth={0.8} strokeLinecap="round" />;
        })}
      </g>
    );
  }
  if (rank <= 10) {
    const pts = PIP_LAYOUT[rank];
    const s = rank <= 4 ? 9 : rank <= 7 ? 7.5 : 6.5;
    return (
      <g>
        <Scenery />
        {pts.map(([x, y], i) => (
          <Sym key={i} x={x} y={y} s={s} />
        ))}
      </g>
    );
  }
  // Court cards
  switch (rank) {
    case 11:
      return (
        <g>
          <Scenery />
          <Figure x={34} y={98} h={48} arms="hold" />
          <Sym x={34} y={70} s={7} />
          <path d="M28 54 q6 2 12 0" fill="none" stroke={PALE} strokeWidth={0.8} />
        </g>
      );
    case 12:
      return (
        <g>
          <Scenery />
          <Horse x={38} y={104} fill={PALE} w={52} />
          <Figure x={34} y={84} h={34} arms="right-up" />
          <Sym x={50} y={52} s={8} />
        </g>
      );
    case 13:
      return (
        <g>
          <Scenery />
          <Throne x={40} y={98} w={32} h={38} fill={PALE} />
          <Figure x={40} y={98} h={50} arms="hold" cloak crown />
          <Sym x={40} y={76} s={7} />
        </g>
      );
    default:
      return (
        <g>
          <Scenery />
          <Throne x={40} y={98} w={38} h={44} fill={INK} />
          <Figure x={40} y={98} h={52} arms="right-up" fill={PALE} crown />
          <Sym x={58} y={58} s={8} />
        </g>
      );
  }
}
