import { useState } from 'react';
import { CARDS, SLOT_IDS, SLOTS, witnessed, type Tier } from '../../engine';
import { useGame } from '../../store';
import { Card } from './Card';

export const TIER_LABEL: Record<Tier, string> = { 0: 'unread', 1: 'glimpsed', 2: 'known', 3: 'mastered' };

/** Bottom sheet: everything the player has earned about one card. */
export function CodexDetail({ cardId, onClose }: { cardId: string; onClose: () => void }) {
  const k = useGame((s) => s.knowledge);
  const card = CARDS.find((c) => c.id === cardId)!;
  const e = k.cards[cardId];
  const tier: Tier = e?.tier ?? 0;
  const seatsSeen = SLOT_IDS.filter((s) => (e?.seats[s] ?? 0) > 0);
  const nothing = !e;
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="sheet" role="dialog" aria-label={card.name} onClick={onClose}>
      <div className="sheet__body" onClick={(ev) => ev.stopPropagation()}>
        <div className="sheet__card" title="Tap to turn the card">
          <Card cardId={cardId} size="lg" reversed={flipped} onClick={() => setFlipped((f) => !f)} />
        </div>
        <div className="sheet__title">
          {card.name} <span className="pill">{TIER_LABEL[tier]}</span>
        </div>
        {nothing && <p className="muted">You have not read this card yet.</p>}
        {flipped && tier < 3 && <p className="muted small">Turned. What it means this way, you have not earned.</p>}
        {tier >= 1 && <div className="codex__kw">{card.keywords.upright.join(' · ')}</div>}
        {tier >= 2 && <p className="codex__meaning">{card.meaning.upright}</p>}
        {tier >= 3 && (
          <p className="codex__meaning codex__meaning--rev">
            <em>Reversed:</em> {card.meaning.reversed}
          </p>
        )}
        {(witnessed(k, cardId, false) || witnessed(k, cardId, true)) && (
          <div className="sheet__omens">
            <div className="muted small">What you have seen it do</div>
            {witnessed(k, cardId, false) && <p className="narration__omen">{card.omen.upright}</p>}
            {witnessed(k, cardId, true) && <p className="narration__omen">{card.omen.reversed}</p>}
          </div>
        )}
        {seatsSeen.length > 0 && (
          <div className="seatmap">
            <div className="muted small">Read {e.resolved} time{e.resolved === 1 ? '' : 's'}. How it went, by seat:</div>
            <div className="seatmap__row">
              {SLOT_IDS.map((s) => {
                const n = e.seats[s] ?? 0;
                const o = e.seatOutcomes?.[s] ?? { good: 0, bad: 0 };
                const even = Math.max(0, n - o.good - o.bad);
                return (
                  <div key={s} className={`seatmap__cell ${n === 0 ? 'seatmap__cell--empty' : ''}`} title={k.seatsNamed ? SLOTS[s].name : undefined}>
                    <span className="seat__glyph">{SLOTS[s].glyph}</span>
                    <span className="seatmap__n">{n || '·'}</span>
                    {n > 0 && (
                      <span className="seatmap__bar" aria-hidden>
                        <span className="seatmap__good" style={{ flex: o.good }} />
                        <span className="seatmap__even" style={{ flex: even }} />
                        <span className="seatmap__bad" style={{ flex: o.bad }} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
