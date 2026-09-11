import { useEffect } from 'react';
import { getCard, SLOT_IDS, SLOTS } from '../../engine';
import { useGame } from '../../store';
import { StreakFlames } from '../art/flames';
import { Card } from './Card';

/**
 * Study: an omen you have witnessed, three cards you have witnessed.
 * Which card did this? Never a meaning, only recall of consequence.
 * A right answer counts toward glimpsing the card, like a whisper.
 */
export function Study() {
  const study = useGame((s) => s.study);
  const askStudy = useGame((s) => s.askStudy);
  const answerStudy = useGame((s) => s.answerStudy);
  const k = useGame((s) => s.knowledge);
  const studyFilter = useGame((s) => s.studyFilter);
  const setStudyFilter = useGame((s) => s.setStudyFilter);
  const FILTERS: [string, string][] = [['all', 'All'], ['major', '✦'], ['wands', '⚚'], ['cups', '♆'], ['swords', '⚔'], ['pentacles', '⛤']];
  const filterRow = (
    <div className="filters__row">
      {FILTERS.map(([f, label]) => (
        <button key={f} type="button" className={`chip ${studyFilter === f ? 'chip--on' : ''}`} onClick={() => setStudyFilter(f)}>
          {label}
        </button>
      ))}
    </div>
  );
  useEffect(() => {
    if (!study) askStudy();
  }, [study, askStudy]);
  if (!study) return null;
  if (!study.q) {
    return (
      <section className="study">
        {filterRow}
        <p className="muted small center">Witness three cards of this kind first. Study needs something to remember.</p>
      </section>
    );
  }
  const { q, picked, streak } = study;
  const stats = k.study;
  if ('kind' in q) {
    const right = picked !== null && q.seats.includes(picked as never);
    return (
      <section className="study">
        {filterRow}
        <div className="study__meta muted small">
          <StreakFlames n={streak} className="study__flames" /> streak {streak}
          {stats && ` · ${stats.correct} / ${stats.asked} · best ${stats.bestStreak}`}
        </div>
        <div className="study__cardwrap study__seatcard">
          <Card cardId={q.cardId} reversed={q.reversed} size="lg" />
        </div>
        <blockquote className="study__omen" key={q.omen}>
          <span className="study__flourish" aria-hidden>❧</span>
          {q.omen}
          <span className="study__flourish study__flourish--end" aria-hidden>❧</span>
        </blockquote>
        <p className="muted small center">In which seat did it do this?</p>
        <div className="study__seats">
          {SLOT_IDS.map((id) => {
            const state = picked ? (q.seats.includes(id) ? 'right' : id === picked ? 'wrong' : 'dim') : '';
            return (
              <button key={id} type="button" className={`study__seat study__seat--${state}`} onClick={() => answerStudy(id)} disabled={picked !== null} aria-label={k.seatsNamed ? SLOTS[id].name : `seat ${SLOT_IDS.indexOf(id) + 1}`}>
                <span className="seat__glyph">{SLOTS[id].glyph}</span>
                {k.seatsNamed && <span className="study__seatname">{SLOTS[id].name.replace(/^The /, '')}</span>}
              </button>
            );
          })}
        </div>
        {picked && (
          <button className="btn btn--primary" onClick={askStudy}>
            {right ? 'Again' : 'Another'}
          </button>
        )}
      </section>
    );
  }
  const cq = q;
  return (
    <section className="study">
      {filterRow}
      <div className="study__meta muted small">
        <StreakFlames n={streak} className="study__flames" /> streak {streak}
        {stats && ` · ${stats.correct} / ${stats.asked} · best ${stats.bestStreak}`}
      </div>
      <blockquote className="study__omen" key={cq.omen}>
        <span className="study__flourish" aria-hidden>❧</span>
        {cq.omen}
        <span className="study__flourish study__flourish--end" aria-hidden>❧</span>
      </blockquote>
      <p className="muted small center">Which card did this{cq.reversed ? ', reversed' : ''}?</p>
      <div className="study__choices">
        {cq.choices.map((id, i) => {
          const state = picked ? (id === cq.answer ? 'right' : id === picked ? 'wrong' : 'dim') : '';
          return (
            <div key={`${cq.omen}-${id}`} className={`study__choice study__choice--${state} deal`} style={{ animationDelay: `${i * 110}ms` }}>
              <div className="study__cardwrap">
                <Card cardId={id} size="lg" reversed={picked !== null && id === cq.answer && cq.reversed} onClick={() => answerStudy(id)} />
                {picked && id === cq.answer && <span className="study__stamp" aria-hidden>✦</span>}
                {picked && id === picked && id !== cq.answer && <span className="study__stamp study__stamp--wrong" aria-hidden>✖</span>}
              </div>
              {picked && id === cq.answer && <div className="study__label">{getCard(id).name}</div>}
            </div>
          );
        })}
      </div>
      {picked && (
        <button className="btn btn--primary" onClick={askStudy}>
          {picked === cq.answer ? 'Again' : 'Another'}
        </button>
      )}
    </section>
  );
}
