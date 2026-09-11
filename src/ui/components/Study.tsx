import { useEffect } from 'react';
import { getCard, SCENES, SLOT_IDS, SLOTS, STUDY_KEEPSAKE_STREAK } from '../../engine';
import { SceneArt } from '../art/scenes';
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
  if ('kind' in q && q.kind === 'place') {
    const right = picked !== null && q.scenes.includes(picked);
    return (
      <section className="study">
        {filterRow}
        <StudyMeta streak={streak} stats={stats} />
        <div className="study__cardwrap study__seatcard">
          <Card cardId={q.cardId} reversed={q.reversed} size="lg" />
        </div>
        <blockquote className="study__omen" key={q.omen}>
          <span className="study__flourish" aria-hidden>❧</span>
          {q.omen}
          <span className="study__flourish study__flourish--end" aria-hidden>❧</span>
        </blockquote>
        <p className="muted small center">Where did it do this?</p>
        <div className="study__places">
          {q.choices.map((id, i) => {
            const state = picked ? (q.scenes.includes(id) ? 'right' : id === picked ? 'wrong' : 'dim') : '';
            const sc = SCENES[id];
            return (
              <button
                key={`${q.omen}-${id}`}
                type="button"
                className={`study__place study__place--${state} deal`}
                style={{ animationDelay: `${i * 110}ms`, '--book-hue': sc?.hue ?? 260 } as React.CSSProperties}
                onClick={() => answerStudy(id)}
                disabled={picked !== null}
                aria-label={sc?.place ?? id}
              >
                <SceneArt id={id} className="study__place-art" />
                <span className="study__place-name">{sc?.place ?? id}</span>
                {picked && q.scenes.includes(id) && <span className="study__stamp" aria-hidden>✦</span>}
                {picked && id === picked && !q.scenes.includes(id) && <span className="study__stamp study__stamp--wrong" aria-hidden>✖</span>}
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
  if ('kind' in q) {
    const right = picked !== null && q.seats.includes(picked as never);
    return (
      <section className="study">
        {filterRow}
        <StudyMeta streak={streak} stats={stats} />
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
      <StudyMeta streak={streak} stats={stats} />
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

/** The streak line, with a ten-notch ring that fills toward the keepsake. */
function StudyMeta({ streak, stats }: { streak: number; stats?: { correct: number; asked: number; bestStreak: number } }) {
  const lit = Math.min(STUDY_KEEPSAKE_STREAK, streak % STUDY_KEEPSAKE_STREAK === 0 && streak > 0 ? STUDY_KEEPSAKE_STREAK : streak % STUDY_KEEPSAKE_STREAK);
  const toGo = STUDY_KEEPSAKE_STREAK - lit;
  return (
    <div className="study__meta muted small">
      <svg viewBox="0 0 24 24" className="study__ring" aria-label={`${lit} of ${STUDY_KEEPSAKE_STREAK} toward a keepsake`}>
        {Array.from({ length: STUDY_KEEPSAKE_STREAK }, (_, i) => {
          const a = (i / STUDY_KEEPSAKE_STREAK) * Math.PI * 2 - Math.PI / 2;
          const on = i < lit;
          return <line key={i} x1={12 + Math.cos(a) * 7.5} y1={12 + Math.sin(a) * 7.5} x2={12 + Math.cos(a) * 10.5} y2={12 + Math.sin(a) * 10.5} stroke={on ? '#f3dc8a' : 'rgba(214,178,94,0.28)'} strokeWidth={on ? 2 : 1.2} strokeLinecap="round" />;
        })}
        <text x={12} y={13.2} textAnchor="middle" dominantBaseline="middle" fontSize={7} fill={lit === STUDY_KEEPSAKE_STREAK ? '#f3dc8a' : 'rgba(141,134,163,0.9)'} fontFamily="Georgia, serif">
          {lit === STUDY_KEEPSAKE_STREAK ? '✦' : lit}
        </text>
      </svg>
      <StreakFlames n={streak} className="study__flames" /> streak {streak}
      {stats && ` · ${stats.correct} / ${stats.asked} · best ${stats.bestStreak}`}
      {streak > 0 && lit < STUDY_KEEPSAKE_STREAK && <span className="study__togo"> · {toGo} to a keepsake</span>}
    </div>
  );
}
