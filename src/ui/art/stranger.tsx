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
