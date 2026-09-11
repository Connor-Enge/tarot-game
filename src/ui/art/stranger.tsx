import { Figure, Flame, GOLD_FLAT } from './primitives';

/** The one who is always already sitting by the fire. */
export function StrangerArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <ellipse cx={30} cy={54} rx={22} ry={3} fill={GOLD_FLAT} opacity={0.12} />
      <Figure x={22} y={52} h={30} arms="down" fill="rgba(10,8,18,0.95)" cloak />
      <Flame x={42} y={50} s={6} />
      {[36, 42, 48].map((x) => <ellipse key={x} cx={x} cy={52} rx={3} ry={1.4} fill="rgba(10,8,18,0.9)" />)}
      <circle cx={42} cy={44} r={10} fill={GOLD_FLAT} opacity={0.1} />
    </svg>
  );
}

/** The peddler at the market: a pack on their back, a cloth laid out with small things on it. */
export function PeddlerArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <ellipse cx={30} cy={54} rx={22} ry={3} fill={GOLD_FLAT} opacity={0.12} />
      <path d="M8 52 L34 48 L38 54 L10 56 Z" fill={GOLD_FLAT} opacity={0.28} />
      <path d="M8 52 L34 48" stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.6} />
      {[[15, 51], [21, 50], [27, 49]].map(([x, y], i) => (
        <g key={i}>
          {i === 0 && <circle cx={x} cy={y} r={1.6} fill="none" stroke={GOLD_FLAT} strokeWidth={0.7} />}
          {i === 1 && <path d={`M${x - 1.5} ${y + 1} h3 l-1.5 -3 Z`} fill={GOLD_FLAT} opacity={0.9} />}
          {i === 2 && <rect x={x - 1.5} y={y - 1} width={3} height={2} fill={GOLD_FLAT} opacity={0.8} />}
        </g>
      ))}
      <Figure x={44} y={52} h={28} arms="hold" fill="rgba(10,8,18,0.95)" cloak />
      <path d="M48 30 q8 2 6 14 q-3 -2 -6 -1 Z" fill="rgba(10,8,18,0.95)" />
      <path d="M50 33 q4 1 3 8" fill="none" stroke={GOLD_FLAT} strokeWidth={0.5} opacity={0.6} />
    </svg>
  );
}
