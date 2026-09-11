import { CARDS, COMBO_IDS, comboNote, SLOT_IDS, SLOTS, witnessed, type Tier } from '../../engine';
import { useGame } from '../../store';
import { Card } from '../components/Card';

const TIER_LABEL: Record<Tier, string> = { 0: 'unread', 1: 'glimpsed', 2: 'known', 3: 'mastered' };

/** Everything the player has earned the right to know. Nothing else. */
export function CodexScreen() {
  const goto = useGame((s) => s.goto);
  const run = useGame((s) => s.run);
  const k = useGame((s) => s.knowledge);
  const open = useGame((s) => s.codexOpen);
  const openCodex = useGame((s) => s.openCodex);
  const knownCount = Object.values(k.cards).filter((c) => c.tier > 0).length;
  const combos = k.combos ?? [];

  return (
    <main className="screen screen--codex">
      <header className="topbar">
        <button className="btn btn--ghost" onClick={() => goto(run ? 'run' : 'title')}>
          ← Back
        </button>
        <span className="muted small">
          {knownCount} / {CARDS.length}
        </span>
      </header>

      {k.seatsNamed && (
        <section className="codex__seats">
          {Object.values(SLOTS).map((s) => (
            <div key={s.id} className="codex__seat">
              <span className="seat__glyph">{s.glyph}</span> <strong>{s.name}</strong>
              <span className="muted"> — {s.role}</span>
            </div>
          ))}
        </section>
      )}

      {combos.length > 0 && (
        <section className="codex__combos">
          <div className="muted small">Named readings · {combos.length} / {COMBO_IDS.length}</div>
          {combos.map((id) => (
            <div key={id} className="codex__combo">
              <em>{comboNote(id)}</em>
            </div>
          ))}
        </section>
      )}

      <section className="codex__grid">
        {CARDS.map((c) => {
          const e = k.cards[c.id];
          const tier: Tier = e?.tier ?? 0;
          const seen = !!e;
          return (
            <button key={c.id} type="button" className={`codex__cell codex__cell--t${tier}`} onClick={() => seen && openCodex(c.id)} disabled={!seen} aria-label={seen ? c.name : 'unread card'}>
              <Card cardId={c.id} size="xs" faceDown={!seen} />
              {tier > 0 && <span className={`codex__dot codex__dot--t${tier}`} />}
            </button>
          );
        })}
      </section>

      {open && <CodexDetail cardId={open} onClose={() => openCodex(null)} />}
    </main>
  );
}

function CodexDetail({ cardId, onClose }: { cardId: string; onClose: () => void }) {
  const k = useGame((s) => s.knowledge);
  const card = CARDS.find((c) => c.id === cardId)!;
  const e = k.cards[cardId];
  const tier: Tier = e?.tier ?? 0;
  const seatsSeen = SLOT_IDS.filter((s) => (e?.seats[s] ?? 0) > 0);
  return (
    <div className="sheet" role="dialog" aria-label={card.name} onClick={onClose}>
      <div className="sheet__body" onClick={(ev) => ev.stopPropagation()}>
        <div className="sheet__card">
          <Card cardId={cardId} size="lg" />
        </div>
        <div className="sheet__title">
          {card.name} <span className="pill">{TIER_LABEL[tier]}</span>
        </div>
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
