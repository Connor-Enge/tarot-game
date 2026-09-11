import { Flame } from './primitives';

/** A little row of flames for a streak. Grows to five, then the fifth burns taller. */
export function StreakFlames({ n, className }: { n: number; className?: string }) {
  if (n <= 0) return null;
  const count = Math.min(5, n);
  return (
    <svg viewBox={`0 0 ${count * 10} 16`} className={className} aria-label={`${n} day streak`} role="img" style={{ width: count * 10, height: 16 }}>
      {Array.from({ length: count }, (_, i) => (
        <g key={i} className="flame" style={{ animationDelay: `${i * 0.35}s` }}>
          <Flame x={5 + i * 10} y={14} s={i === 4 && n > 5 ? 6 : 4.5} />
        </g>
      ))}
    </svg>
  );
}
