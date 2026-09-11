import type { ReactElement } from 'react';
import type { Suit } from '../../engine';
import { Cloud, Figure, Horse, INK, Mountains, PALE, SUIT_SYMBOL, Throne, Water } from './primitives';

type Pt = [number, number];

/** Traditional pip arrangements in the 80 x 112 window. */
const PIP_LAYOUT: Record<number, Pt[]> = {
  2: [[40, 30], [40, 82]],
  3: [[40, 26], [22, 82], [58, 82]],
  4: [[24, 30], [56, 30], [24, 82], [56, 82]],
  5: [[24, 28], [56, 28], [40, 56], [24, 84], [56, 84]],
  6: [[24, 24], [56, 24], [24, 56], [56, 56], [24, 88], [56, 88]],
  7: [[24, 24], [56, 24], [24, 56], [56, 56], [24, 88], [56, 88], [40, 40]],
  8: [[24, 20], [56, 20], [24, 44], [56, 44], [24, 68], [56, 68], [24, 92], [56, 92]],
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
        <Cloud x={-8} y={60} w={34} />
        <path d="M18 58 q10 -2 14 4 l-4 2 q-6 -2 -10 -2 z" fill={PALE} stroke={INK} strokeWidth={0.7} />
        <Sym x={46} y={54} s={16} />
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
          <Figure x={34} y={98} h={50} arms="right-up" />
          <Sym x={54} y={54} s={8} />
        </g>
      );
    case 12:
      return (
        <g>
          <Scenery />
          <Horse x={40} y={104} fill={PALE} w={48} />
          <Figure x={38} y={84} h={34} arms="right-up" />
          <Sym x={56} y={54} s={8} />
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
