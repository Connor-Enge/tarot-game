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
  return (
    <div className="sheet" role="dialog" aria-label={card.name} onClick={onClose}>
      <div className="sheet__body" onClick={(ev) => ev.stopPropagation()}>
        <div className="sheet__card">
          <Card cardId={cardId} size="lg" />
        </div>
        <div className="sheet__title">
          {card.name} <span className="pill">{TIER_LABEL[tier]}</span>
        </div>
        {nothing && <p className="muted">You have not read this card yet.</p>}
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
          <div className="muted small">
            Read {e.resolved} time{e.resolved === 1 ? '' : 's'} · in {seatsSeen.map((s) => `${SLOTS[s].glyph}×${e.seats[s]}`).join(' ')}
          </div>
        )}
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
