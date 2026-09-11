import { KIND_GLYPH, SCENES, type RunState } from '../../engine';
import { GOLD_FLAT } from './primitives';

const TIER_COLOR = { calamity: '#d6605e', harm: '#e0a39a', neutral: '#8d86a3', boon: '#d6b25e', triumph: '#f3dc8a' } as const;

/**
 * The descent as a small road: one stop per scene, stepping down and
 * wandering left and right, colored by how the reading went there. The
 * road ends where you did.
 */
export function RoadStrip({ run, onPick, active }: { run: RunState; onPick?: (index: number) => void; active?: number | null }) {
  const n = run.history.length;
  if (n === 0) return null;
  const W = 300;
  const H = 48 + n * 4;
  const pts = run.history.map((h, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const wobble = Math.sin(i * 1.9 + run.seed % 7) * 10;
    return { x: 24 + t * (W - 48), y: 18 + t * (H - 36) + wobble, h };
  });
  const d = pts.map((p, i) => (i === 0 ? `M${p.x} ${p.y}` : `Q${(pts[i - 1].x + p.x) / 2} ${pts[i - 1].y + 6} ${p.x} ${p.y}`)).join(' ');
  const ended = run.phase.kind === 'dead';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`road ${onPick ? 'road--pick' : ''}`} aria-label="the road taken">
      <path d={d} fill="none" stroke={GOLD_FLAT} strokeWidth={1.2} opacity={0.5} />
      <path d={d} fill="none" stroke="#1a1408" strokeWidth={0.8} strokeDasharray="1.5 4" opacity={0.6} />
      {pts.map((p, i) => {
        const tier = p.h.resolution.tier;
        const last = i === n - 1;
        const on = active === i;
        return (
          <g
            key={i}
            className={`road__stop ${on ? 'road__stop--on' : ''}`}
            role={onPick ? 'button' : undefined}
            tabIndex={onPick ? 0 : undefined}
            aria-label={onPick ? `remember scene ${i + 1}` : undefined}
            onClick={onPick ? () => onPick(i) : undefined}
            onKeyDown={onPick ? (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onPick(i); } } : undefined}
          >
            {on && <circle cx={p.x} cy={p.y} r={13} fill="none" stroke={TIER_COLOR[tier]} strokeWidth={1} className="road__ring" />}
            {onPick && <circle cx={p.x} cy={p.y} r={12} fill="transparent" />}
            <circle cx={p.x} cy={p.y} r={last ? 8 : 6} fill="#0b0a12" stroke={TIER_COLOR[tier]} strokeWidth={last ? 1.4 : 1} />
            {tier === 'triumph' && <circle cx={p.x} cy={p.y} r={11} fill={TIER_COLOR[tier]} opacity={0.15} />}
            <text x={p.x} y={p.y + 0.5} fontSize={last ? 8 : 6.5} textAnchor="middle" dominantBaseline="middle" fill={TIER_COLOR[tier]} fontFamily="Georgia, serif">
              {KIND_GLYPH[SCENES[p.h.sceneId].kind]}
            </text>
            {last && ended && <text x={p.x} y={p.y - 12} fontSize={7} textAnchor="middle" fill="#d6605e" fontFamily="Georgia, serif">✖</text>}
          </g>
        );
      })}
    </svg>
  );
}
