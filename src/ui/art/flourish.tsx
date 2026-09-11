import type { OutcomeTier } from '../../engine';
import { GOLD_FLAT } from './primitives';

const RED = '#d6605e';

/**
 * A slow-moving sigil behind the laid spread. It says what the cards said,
 * without a word: rays for triumph, a halo for a boon, nothing for a
 * neutral reading, cracks for harm, and shards falling for calamity.
 */
export function TierFlourish({ tier }: { tier: OutcomeTier }) {
  if (tier === 'neutral') return null;
  return (
    <svg className={`flourish flourish--${tier}`} viewBox="-100 -60 200 120" aria-hidden preserveAspectRatio="xMidYMid meet">
      {tier === 'triumph' && (
        <g className="flourish__spin">
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const len = i % 2 ? 60 : 96;
            return <line key={i} x1={Math.cos(a) * 18} y1={Math.sin(a) * 18} x2={Math.cos(a) * len} y2={Math.sin(a) * len} stroke={GOLD_FLAT} strokeWidth={i % 2 ? 0.4 : 0.8} opacity={i % 2 ? 0.35 : 0.6} />;
          })}
          <circle r={14} fill="none" stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.6} />
          <circle r={46} fill="none" stroke={GOLD_FLAT} strokeWidth={0.4} opacity={0.3} strokeDasharray="2 5" />
        </g>
      )}
      {tier === 'boon' && (
        <g className="flourish__spin">
          <circle r={44} fill="none" stroke={GOLD_FLAT} strokeWidth={0.6} opacity={0.5} />
          <circle r={52} fill="none" stroke={GOLD_FLAT} strokeWidth={0.4} opacity={0.3} strokeDasharray="1 4" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <circle key={i} cx={Math.cos(a) * 44} cy={Math.sin(a) * 44} r={1.6} fill={GOLD_FLAT} opacity={0.8} />;
          })}
        </g>
      )}
      {tier === 'harm' && (
        <g>
          <path d="M0 -58 L-6 -36 L4 -14 L-3 8 L5 30 L-2 56" fill="none" stroke={RED} strokeWidth={0.7} opacity={0.32} />
          <path d="M-96 -22 L-70 -14 L-44 -18 L-20 -8" fill="none" stroke={RED} strokeWidth={0.5} opacity={0.26} />
          <path d="M96 12 L70 4 L46 10 L22 2" fill="none" stroke={RED} strokeWidth={0.5} opacity={0.26} />
        </g>
      )}
      {tier === 'calamity' && (
        <g>
          {[
            [-76, -44, 5, -18], [-34, -56, 3.5, -30], [22, -58, 6, -20], [66, -40, 4, -28],
            [-88, 12, 5, 18], [84, 8, 3.5, 26], [-56, 42, 4, 22], [44, 46, 5, 18], [-10, 50, 3, -12], [90, -18, 4, 8],
          ].map(([x, y, w, r], i) => (
            <polygon
              key={i}
              className="flourish__shard"
              style={{ animationDelay: `${i * 260}ms` }}
              points={`${x},${y} ${x + w},${y + 4} ${x + w * 0.4},${y + w * 1.6}`}
              fill={RED}
              opacity={0.45}
              transform={`rotate(${r} ${x} ${y})`}
            />
          ))}
          <path d="M-100 -10 L-60 -4 L-20 -14 L20 -2 L60 -12 L100 -6" fill="none" stroke={RED} strokeWidth={0.5} opacity={0.22} />
        </g>
      )}
    </svg>
  );
}
