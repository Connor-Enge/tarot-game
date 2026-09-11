import { CARDS, SLOTS, type Tier } from '../../engine';
import { useGame } from '../../store';
import { Card } from '../components/Card';

const TIER_LABEL: Record<Tier, string> = { 0: 'unread', 1: 'glimpsed', 2: 'known', 3: 'mastered' };

/** Everything the player has earned the right to know. Nothing else. */
export function CodexScreen() {
  const goto = useGame((s) => s.goto);
  const run = useGame((s) => s.run);
  const k = useGame((s) => s.knowledge);

  return (
    <main className="screen screen--codex">
      <header className="topbar">
        <button className="btn btn--ghost" onClick={() => goto(run ? 'run' : 'title')}>
          ← Back
        </button>
        <span className="muted small">
          {Object.values(k.cards).filter((c) => c.tier > 0).length} / {CARDS.length}
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

      <section className="codex__grid">
        {CARDS.map((c) => {
          const e = k.cards[c.id];
          const tier: Tier = e?.tier ?? 0;
          return (
            <article key={c.id} className={`codex__entry codex__entry--t${tier}`}>
              <Card cardId={c.id} size="sm" faceDown={tier === 0 && !e} />
              <div className="codex__body">
                <div className="codex__name">
                  {tier === 0 && !e ? '???' : c.name} <span className="pill">{TIER_LABEL[tier]}</span>
                </div>
                {tier >= 1 && <div className="codex__kw">{c.keywords.upright.join(' · ')}</div>}
                {tier >= 2 && <p className="codex__meaning">{c.meaning.upright}</p>}
                {tier >= 3 && (
                  <p className="codex__meaning codex__meaning--rev">
                    <em>Reversed:</em> {c.meaning.reversed}
                  </p>
                )}
                {e && tier < 1 && (
                  <div className="muted small">
                    seen {e.resolved} time{e.resolved === 1 ? '' : 's'}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
