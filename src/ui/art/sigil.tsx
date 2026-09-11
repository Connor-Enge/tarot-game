import { GOLD_FLAT } from './primitives';

/**
 * A medallion for a sigil: the glyph inside a ring of notches whose count
 * and turn come from the id, so every sigil's ring is its own. Gold when
 * earned, ink when not.
 */
function hash(id: string): number {
  let h = 7;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export function SigilToken({ id, glyph, earned, className }: { id: string; glyph: string; earned: boolean; className?: string }) {
  const h = hash(id);
  const notches = 8 + (h % 9); // 8..16
  const turn = (h >>> 4) % 360;
  const inner = 11 + ((h >>> 8) % 3);
  const color = earned ? GOLD_FLAT : 'rgba(141,134,163,0.55)';
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      {earned && <circle cx={20} cy={20} r={18} fill={GOLD_FLAT} opacity={0.08} />}
      <circle cx={20} cy={20} r={17} fill="none" stroke={color} strokeWidth={0.9} />
      <g transform={`rotate(${turn} 20 20)`}>
        {Array.from({ length: notches }, (_, i) => {
          const a = (i / notches) * Math.PI * 2;
          const long = i % 2 === 0;
          return <line key={i} x1={20 + Math.cos(a) * 17} y1={20 + Math.sin(a) * 17} x2={20 + Math.cos(a) * (long ? 14.2 : 15.5)} y2={20 + Math.sin(a) * (long ? 14.2 : 15.5)} stroke={color} strokeWidth={0.8} />;
        })}
        <circle cx={20} cy={20} r={inner} fill="none" stroke={color} strokeWidth={0.5} strokeDasharray="1.5 2.5" opacity={0.8} />
      </g>
      <text x={20} y={20.8} textAnchor="middle" dominantBaseline="middle" fontSize={12} fill={earned ? '#f3dc8a' : 'rgba(141,134,163,0.7)'} fontFamily="Georgia, serif">
        {earned ? glyph : '·'}
      </text>
    </svg>
  );
}
