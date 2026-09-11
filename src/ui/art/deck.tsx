import { GOLD_FLAT } from './primitives';

/**
 * A small stacked deck for the reading screen's counter: three to one
 * card edges depending on how much of the draw pile is left.
 */
export function DeckStack({ remaining, total, className }: { remaining: number; total: number; className?: string }) {
  const frac = total > 0 ? remaining / total : 0;
  const layers = frac > 0.66 ? 3 : frac > 0.33 ? 2 : 1;
  return (
    <svg viewBox="0 0 22 18" className={className} aria-hidden>
      {Array.from({ length: layers }, (_, i) => {
        const off = (layers - 1 - i) * 2.2;
        return (
          <g key={i} transform={`translate(${3 + off} ${9 - off})`}>
            <rect x={0} y={0} width={12} height={8} rx={1.3} fill="#2b2555" stroke={GOLD_FLAT} strokeWidth={0.7} />
            <rect x={2} y={1.6} width={8} height={4.8} rx={0.8} fill="none" stroke={GOLD_FLAT} strokeWidth={0.35} opacity={0.6} />
          </g>
        );
      })}
    </svg>
  );
}
