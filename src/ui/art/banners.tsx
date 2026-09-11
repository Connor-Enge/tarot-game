import { GOLD_FLAT, Moon, PALE } from './primitives';

const DARK = 'rgba(10,8,18,0.9)';

/**
 * A banner for the moment a new act opens under you. Drawn wide and low,
 * like a lintel you pass beneath. Act two is stone; act three is the rings.
 */
export function ActBanner({ act, name }: { act: number; name: string }) {
  return (
    <svg viewBox="0 0 300 90" className="act-banner__art" aria-hidden preserveAspectRatio="xMidYMid meet">
      {act === 2 ? (
        <g>
          {[0, 30, 55, 90, 120, 160, 190, 225, 250, 280].map((x, i) => (
            <path key={x} d={`M${x} 0 L${x + 10 + (i % 3) * 4} 0 L${x + 5 + (i % 2) * 3} ${18 + (i % 4) * 9} Z`} fill={DARK} />
          ))}
          <path d="M0 90 L0 70 L40 74 L60 60 L90 66 L120 52 L150 58 L180 48 L210 56 L240 44 L270 52 L300 40 L300 90 Z" fill={DARK} />
          {[150, 165, 180, 195, 210].map((x, i) => (
            <rect key={x} x={x} y={62 + i * 5} width={14} height={2} fill={GOLD_FLAT} opacity={0.5 - i * 0.07} />
          ))}
          <circle cx={150} cy={44} r={2} fill={GOLD_FLAT} opacity={0.8} />
        </g>
      ) : (
        <g>
          <rect x={0} y={0} width={300} height={90} fill="#060410" opacity={0.75} />
          {[110, 80, 50, 24].map((r, i) => (
            <ellipse key={r} cx={150} cy={64} rx={r} ry={r * 0.22} fill="none" stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.25 + i * 0.15} />
          ))}
          <Moon x={150} y={26} r={6} />
        </g>
      )}
      <text x={150} y={act === 2 ? 30 : 52} textAnchor="middle" fontSize={11} letterSpacing={4} fill={PALE} fontFamily="Georgia, serif" opacity={0.95}>
        {name.toUpperCase()}
      </text>
    </svg>
  );
}
