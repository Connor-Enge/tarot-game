import { getCard, SLOT_IDS, SLOTS } from '../../engine';
import { useGame } from '../../store';
import { Card } from '../components/Card';

/**
 * Death or ascension. This is the ONE place meanings are handed to the player
 * unasked: the four cards on the table when it ended.
 */
export function RunEndScreen() {
  const run = useGame((s) => s.run)!;
  const endRun = useGame((s) => s.endRun);
  const goto = useGame((s) => s.goto);
  const knowledge = useGame((s) => s.knowledge);
  if (run.phase.kind !== 'dead' && run.phase.kind !== 'ascended') return null;
  const dead = run.phase.kind === 'dead';
  const last = run.history[run.history.length - 1];

  return (
    <main className={`screen screen--end ${dead ? 'screen--dead' : 'screen--ascended'}`}>
      <h2>{dead ? 'The reading ended you.' : 'You read it true.'}</h2>
      <p className="narration__outcome">{run.phase.resolution.narration.at(-1)}</p>
      <p className="muted small">{dead ? 'What killed you, you now understand.' : 'What carried you, you now understand.'}</p>

      <section className="reveal">
        {SLOT_IDS.map((id, i) => {
          const d = last.reading[id];
          const card = getCard(d.cardId);
          const tier = knowledge.cards[d.cardId]?.tier ?? 0;
          return (
            <article key={id} className="reveal__row rise" style={{ animationDelay: `${300 + i * 350}ms` }}>
              <Card cardId={d.cardId} reversed={d.reversed} size="sm" mark={run.marks[d.cardId]} />
              <div className="reveal__text">
                <div className="reveal__seat">
                  {SLOTS[id].glyph} {SLOTS[id].name}
                </div>
                <div className="reveal__name">
                  {card.name}
                  {d.reversed && <span className="muted"> · reversed</span>}
                </div>
                <p className="reveal__meaning">{d.reversed && tier >= 3 ? card.meaning.reversed : card.meaning.upright}</p>
              </div>
            </article>
          );
        })}
      </section>

      <footer className="actions">
        <button className="btn" onClick={() => goto('codex')}>
          Codex
        </button>
        <button className="btn btn--primary" onClick={endRun}>
          Again
        </button>
      </footer>
    </main>
  );
}
