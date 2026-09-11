import type { OutcomeTier } from '../../engine';

const WORD: Record<OutcomeTier, string> = { calamity: 'calamity', harm: 'harm', neutral: 'even', boon: 'boon', triumph: 'triumph' };
const MARK: Record<OutcomeTier, string> = { calamity: '✖', harm: '▽', neutral: '◇', boon: '△', triumph: '★' };

/**
 * The verdict seal: a wax stamp pressed on the reading once it is read.
 * Rings, notches, the tier's mark, and its word around the rim. Colour
 * follows the tier; the words are the same the map and the book use.
 */
export function VerdictSeal({ tier, className = '' }: { tier: OutcomeTier; className?: string }) {
  const notches = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const r1 = i % 6 === 0 ? 50 : 53;
    return <line key={i} x1={60 + Math.cos(a) * r1} y1={60 + Math.sin(a) * r1} x2={60 + Math.cos(a) * 57} y2={60 + Math.sin(a) * 57} stroke="currentColor" strokeWidth={i % 6 === 0 ? 1.4 : 0.8} strokeLinecap="round" />;
  });
  const arc = `verdict-arc-${tier}`;
  const arcLow = `verdict-arc-low-${tier}`;
  return (
    <svg viewBox="0 0 120 120" className={`verdict ${className}`} aria-label={`the reading went: ${WORD[tier]}`} role="img">
      <defs>
        <path id={arc} d="M22 60 a38 38 0 0 1 76 0" />
        <path id={arcLow} d="M22 60 a38 38 0 0 0 76 0" />
      </defs>
      <circle cx={60} cy={60} r={58} fill="currentColor" opacity={0.08} />
      <circle cx={60} cy={60} r={58} fill="none" stroke="currentColor" strokeWidth={1.2} />
      <circle cx={60} cy={60} r={47} fill="none" stroke="currentColor" strokeWidth={0.6} opacity={0.7} />
      <circle cx={60} cy={60} r={29} fill="none" stroke="currentColor" strokeWidth={1} strokeDasharray="2 3" opacity={0.8} />
      {notches}
      <text fontSize={8.5} letterSpacing={3.2} fill="currentColor" fontFamily="Georgia, serif" fontVariant="small-caps">
        <textPath href={`#${arc}`} startOffset="50%" textAnchor="middle">
          {WORD[tier]}
        </textPath>
        <textPath href={`#${arcLow}`} startOffset="50%" textAnchor="middle">
          {WORD[tier]}
        </textPath>
      </text>
      <text x={60} y={60} fontSize={26} textAnchor="middle" dominantBaseline="central" fill="currentColor" fontFamily="Georgia, serif">
        {MARK[tier]}
      </text>
    </svg>
  );
}
