import { CARDS, type Knowledge } from '../../engine';

const TITLES = ['Unread', 'Novice', 'Reader', 'Adept', 'Seer', 'Oracle'];

/**
 * A ring that grows with every descent: one tick per run, gold for returns,
 * red for deaths. The title comes from how much of the deck is known.
 */
export function ReaderMark({ knowledge: k }: { knowledge: Knowledge }) {
  const runs = k.runs;
  if (runs === 0) return null;
  const known = Object.values(k.cards).filter((c) => c.tier > 0).length;
  const frac = known / CARDS.length;
  const title = TITLES[Math.min(TITLES.length - 1, Math.floor(frac * 5) + (known > 0 ? 1 : 0))];
  const ticks = Math.min(runs, 72);
  const r = 26;
  // Reconstruct a tick sequence: we only know totals, so lay returns first then deaths then unfinished.
  const kinds: ('return' | 'death' | 'other')[] = [];
  for (let i = 0; i < ticks; i++) kinds.push(i < k.ascensions ? 'return' : i < k.ascensions + k.deaths ? 'death' : 'other');
  return (
    <div className="reader" aria-label={`${title}, ${runs} descents`}>
      <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden>
        <circle cx={32} cy={32} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        {kinds.map((kind, i) => {
          const a = (i / Math.max(ticks, 12)) * Math.PI * 2 - Math.PI / 2;
          const inner = r - (kind === 'other' ? 2 : 4);
          const outer = r + (kind === 'other' ? 2 : 4);
          const color = kind === 'return' ? '#f3dc8a' : kind === 'death' ? '#d6605e' : '#8d86a3';
          return <line key={i} x1={32 + Math.cos(a) * inner} y1={32 + Math.sin(a) * inner} x2={32 + Math.cos(a) * outer} y2={32 + Math.sin(a) * outer} stroke={color} strokeWidth={1.4} strokeLinecap="round" />;
        })}
        <circle cx={32} cy={32} r={r * frac} fill="rgba(214,178,94,0.18)" />
        <text x={32} y={36} fontSize={11} textAnchor="middle" fill="#e9e4f2" fontFamily="Georgia, serif">
          {runs}
        </text>
      </svg>
      <div className="reader__text">
        <div>{title}</div>
        <div className="muted small">{known} of {CARDS.length} known · {k.deaths} deaths · {k.ascensions} returns</div>
      </div>
    </div>
  );
}
