import { useEffect } from 'react';
import { getCard } from '../../engine';
import { useGame } from '../../store';
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
  useEffect(() => {
    if (!study) askStudy();
  }, [study, askStudy]);
  if (!study) return null;
  if (!study.q) {
    return <p className="muted small center">Witness three cards first. Study needs something to remember.</p>;
  }
  const { q, picked, streak } = study;
  const stats = k.study;
  return (
    <section className="study">
      <div className="study__meta muted small">
        streak {streak}
        {stats && ` · ${stats.correct} / ${stats.asked} · best ${stats.bestStreak}`}
      </div>
      <p className="study__omen">“{q.omen}”</p>
      <p className="muted small center">Which card did this{q.reversed ? ', reversed' : ''}?</p>
      <div className="study__choices">
        {q.choices.map((id) => {
          const state = picked ? (id === q.answer ? 'right' : id === picked ? 'wrong' : 'dim') : '';
          return (
            <div key={id} className={`study__choice study__choice--${state}`}>
              <Card cardId={id} size="lg" reversed={picked !== null && id === q.answer && q.reversed} onClick={() => answerStudy(id)} />
              {picked && id === q.answer && <div className="study__label">{getCard(id).name}</div>}
            </div>
          );
        })}
      </div>
      {picked && (
        <button className="btn btn--primary" onClick={askStudy}>
          {picked === q.answer ? 'Again' : 'Another'}
        </button>
      )}
    </section>
  );
}
