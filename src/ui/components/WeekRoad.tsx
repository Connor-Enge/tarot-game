import { dailySeed, weekdayOf, type Knowledge } from '../../engine';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function labelsOfWeek(today: string): string[] {
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - weekdayOf(today));
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(d);
    x.setUTCDate(d.getUTCDate() + i);
    return x.toISOString().slice(0, 10);
  });
}

/**
 * This week as a road: seven stops, Monday to Sunday, gold where the daily
 * came back, ember where it did not, hollow where it was not walked, a ring
 * on today. Depth is the stop's size. Nothing about the cards.
 */
export function WeekRoad({ knowledge: k }: { knowledge: Knowledge }) {
  const today = dailySeed().label;
  const labels = labelsOfWeek(today);
  const alm = k.almanac ?? {};
  const walked = labels.filter((l) => alm[l]).length;
  const returned = labels.filter((l) => alm[l]?.returned).length;
  const xs = labels.map((_, i) => 24 + i * 42);
  return (
    <section className="week" aria-label="this week's daily descents">
      <svg viewBox="0 0 300 64" className="week__road" aria-hidden>
        <path d={`M${xs[0]} 30 ${xs.slice(1).map((x, i) => `Q${(x + xs[i]) / 2} ${i % 2 ? 22 : 38} ${x} 30`).join(' ')}`} fill="none" stroke="rgba(214,178,94,0.45)" strokeWidth={1} strokeDasharray="2 3" />
        {labels.map((label, i) => {
          const e = alm[label];
          const isToday = label === today;
          const future = label > today;
          const r = e ? 4 + Math.min(4, e.depth / 3) : 3;
          const fill = e ? (e.returned ? '#f3dc8a' : '#d6605e') : 'rgba(11,10,18,0.9)';
          const stroke = e ? (e.returned ? '#c9a24a' : '#8a3a3a') : future ? 'rgba(233,228,242,0.18)' : 'rgba(214,178,94,0.4)';
          return (
            <g key={label}>
              {isToday && <circle cx={xs[i]} cy={30} r={r + 5} fill="none" stroke="#f3dc8a" strokeWidth={0.8} className="road__ring" />}
              <circle cx={xs[i]} cy={30} r={r} fill={fill} stroke={stroke} strokeWidth={1} />
              {e?.returned && <circle cx={xs[i]} cy={30} r={1.2} fill="#1a1408" />}
              <text x={xs[i]} y={54} textAnchor="middle" fontSize={7} fill={isToday ? '#f3dc8a' : 'rgba(141,134,163,0.9)'} fontFamily="Georgia, serif" letterSpacing={0.5}>
                {DAYS[i]}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="muted small center week__cap">
        {walked === 0 ? 'This week, no dailies yet.' : `This week · ${walked} walked · ${returned} returned`}
      </p>
    </section>
  );
}
