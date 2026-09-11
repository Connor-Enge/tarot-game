import { useGame } from '../../store';

export function TitleScreen() {
  const newRun = useGame((s) => s.newRun);
  const goto = useGame((s) => s.goto);
  const k = useGame((s) => s.knowledge);
  const known = Object.values(k.cards).filter((c) => c.tier > 0).length;

  return (
    <main className="screen screen--title">
      <div className="title">
        <div className="title__glyph">☾ ◯ △ ☐</div>
        <h1>Arcana Descent</h1>
        <p className="muted">Four seats. Three cards each. No one will tell you what they mean.</p>
      </div>
      <div className="stack">
        <button className="btn btn--primary" onClick={() => newRun()}>
          Descend
        </button>
        <button className="btn" onClick={() => goto('codex')}>
          Codex {known > 0 && <span className="pill">{known}</span>}
        </button>
      </div>
      <p className="muted small">
        {k.runs === 0 ? 'The deck is unread.' : `${k.runs} descents · ${k.deaths} deaths · ${k.ascensions} returns`}
      </p>
    </main>
  );
}
