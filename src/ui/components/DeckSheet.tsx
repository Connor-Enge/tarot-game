import { getCard, type RunState } from '../../engine';
import { Card } from './Card';

/** What has gone by this run. Faces only, no meanings. */
export function DeckSheet({ run, onClose }: { run: RunState; onClose: () => void }) {
  const discard = run.deck.discard;
  return (
    <div className="sheet" role="dialog" aria-label="the discard" onClick={onClose}>
      <div className="sheet__body" onClick={(ev) => ev.stopPropagation()}>
        <div className="sheet__title">
          {run.deck.draw.length} to draw · {discard.length} gone by
        </div>
        {discard.length === 0 ? (
          <p className="muted">Nothing has gone by yet.</p>
        ) : (
          <div className="deck-grid">
            {[...discard].reverse().map((id, i) => (
              <div key={`${id}-${i}`} className={`deck-grid__cell ${run.marks[id] ? `deck-grid__cell--${run.marks[id]}` : ''}`} title={getCard(id).name}>
                <Card cardId={id} size="xs" mark={run.marks[id]} />
              </div>
            ))}
          </div>
        )}
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
