import { useState } from 'react';
import { dailySeed, getWeather, monthLabels, weekdayOf, type Knowledge } from '../../engine';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function shift(month: string, by: number): string {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + by, 1));
  return d.toISOString().slice(0, 7);
}

/**
 * The almanac: a month of daily descents. Gold where you came back, ember
 * where you did not, deeper color for deeper roads. Nothing about the cards.
 */
export function Almanac({ knowledge: k }: { knowledge: Knowledge }) {
  const today = dailySeed().label;
  const [month, setMonth] = useState(today.slice(0, 7));
  const [pick, setPick] = useState<string | null>(null);
  const alm = k.almanac ?? {};
  const labels = monthLabels(month);
  const lead = weekdayOf(labels[0]);
  const [y, m] = month.split('-').map(Number);
  const played = Object.keys(alm).length;
  const returned = Object.values(alm).filter((e) => e.returned).length;
  const picked = pick ? alm[pick] : null;
  const first = Object.keys(alm).sort()[0];
  const atStart = !!first && month <= first.slice(0, 7);
  return (
    <section className="alm" aria-label="almanac of daily descents">
      <div className="alm__head">
        <button type="button" className="btn btn--small alm__nav" onClick={() => setMonth(shift(month, -1))} disabled={atStart || played === 0} aria-label="earlier month">‹</button>
        <span className="alm__month">{MONTHS[m - 1]} {y}</span>
        <button type="button" className="btn btn--small alm__nav" onClick={() => setMonth(shift(month, 1))} disabled={month >= today.slice(0, 7)} aria-label="later month">›</button>
      </div>
      <div className="alm__grid" role="grid">
        {DAYS.map((d, i) => <span key={`h${i}`} className="alm__dow muted small" aria-hidden>{d}</span>)}
        {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} className="alm__blank" aria-hidden />)}
        {labels.map((label) => {
          const e = alm[label];
          const future = label > today;
          const cls = ['alm__day', e ? (e.returned ? 'alm__day--returned' : 'alm__day--died') : '', label === today ? 'alm__day--today' : '', future ? 'alm__day--future' : '', pick === label ? 'alm__day--pick' : ''].filter(Boolean).join(' ');
          const depthCls = e ? `alm__day--d${Math.min(4, Math.ceil(e.depth / 3))}` : '';
          return (
            <button
              type="button"
              key={label}
              className={`${cls} ${depthCls}`}
              onClick={() => setPick(e ? (pick === label ? null : label) : null)}
              disabled={!e}
              aria-label={e ? `${label}: ${e.returned ? 'returned' : 'fell'} at ${e.depth}` : label}
            >
              <span className="alm__n">{Number(label.slice(-2))}</span>
              {e?.weather && <span className="alm__weather" aria-hidden>{getWeather(e.weather).glyph}</span>}
            </button>
          );
        })}
      </div>
      <p className="muted small center alm__foot">
        {picked && pick
          ? `${MONTHS[Number(pick.slice(5, 7)) - 1]} ${Number(pick.slice(-2))} · ${picked.weather ? `${getWeather(picked.weather).name} · ` : ''}${picked.depth} scene${picked.depth === 1 ? '' : 's'} · ${picked.good} good · ${picked.returned ? 'returned' : 'did not return'}`
          : played === 0
            ? 'No daily descents yet. The almanac fills a day at a time.'
            : `${played} dail${played === 1 ? 'y' : 'ies'} · ${returned} returned${k.daily ? ` · streak ${k.daily.streak} · best ${k.daily.best}` : ''}`}
      </p>
    </section>
  );
}
