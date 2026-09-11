import { getCard, SLOT_IDS, type RunState } from '../../engine';
import { Card } from './Card';

/** What has gone by this run. Faces only, no meanings. */
export function DeckSheet({ run, onClose }: { run: RunState; onClose: () => void }) {
  const discard = run.deck.discard;
  const played = new Map<string, number>();
  for (const h of run.history) for (const s of SLOT_IDS) played.set(h.reading[s].cardId, (played.get(h.reading[s].cardId) ?? 0) + 1);
  const playedList: string[] = [];
  const rejectedList: string[] = [];
  const seen = new Map<string, number>();
  for (const id of discard) {
    const n = (seen.get(id) ?? 0) + 1;
    seen.set(id, n);
    if ((played.get(id) ?? 0) >= n) playedList.push(id);
    else rejectedList.push(id);
  }
  return (
    <div className="sheet" role="dialog" aria-label="the discard" onClick={onClose}>
      <div className="sheet__body" onClick={(ev) => ev.stopPropagation()}>
        <div className="sheet__title">
          {run.deck.draw.length} to draw · {discard.length} gone by
        </div>
        {discard.length === 0 ? (
          <p className="muted">Nothing has gone by yet.</p>
        ) : (
          <div className="deck-groups">
            {playedList.length > 0 && (
              <div>
                <div className="muted small">Read · {playedList.length}</div>
                <div className="deck-grid">
                  {[...playedList].reverse().map((id, i) => (
                    <div key={`p-${id}-${i}`} className="deck-grid__cell" title={getCard(id).name}>
                      <Card cardId={id} size="xs" mark={run.marks[id]} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {rejectedList.length > 0 && (
              <div>
                <div className="muted small">Passed over · {rejectedList.length}</div>
                <div className="deck-grid deck-grid--dim">
                  {[...rejectedList].reverse().map((id, i) => (
                    <div key={`r-${id}-${i}`} className="deck-grid__cell" title={getCard(id).name}>
                      <Card cardId={id} size="xs" mark={run.marks[id]} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
