import { CARDS, COMBO_IDS, comboNote, SIGILS, SLOTS, type Tier } from '../../engine';
import { useGame } from '../../store';
import { Card } from '../components/Card';
import { CodexDetail } from '../components/CodexDetail';

/** Everything the player has earned the right to know. Nothing else. */
export function CodexScreen() {
  const goto = useGame((s) => s.goto);
  const run = useGame((s) => s.run);
  const k = useGame((s) => s.knowledge);
  const open = useGame((s) => s.codexOpen);
  const openCodex = useGame((s) => s.openCodex);
  const knownCount = Object.values(k.cards).filter((c) => c.tier > 0).length;
  const combos = k.combos ?? [];
  const sigils = new Set(k.sigils ?? []);

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

      <div className="progress" aria-hidden>
        <div className="progress__bar" style={{ width: `${(100 * knownCount) / CARDS.length}%` }} />
      </div>

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

      <section className="sigils">
        <div className="muted small">Sigils · {sigils.size} / {SIGILS.length}</div>
        <div className="sigils__grid">
          {SIGILS.map((sg) => {
            const has = sigils.has(sg.id);
            return (
              <div key={sg.id} className={`sigil ${has ? 'sigil--on' : ''}`} title={`${sg.name} — ${sg.text}`}>
                <span className="sigil__glyph">{has ? sg.glyph : '·'}</span>
                <span className="sigil__name">{has ? sg.name : '???'}</span>
                <span className="sigil__text">{sg.text}</span>
              </div>
            );
          })}
        </div>
      </section>

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

