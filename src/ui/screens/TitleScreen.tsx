import { useMemo } from 'react';
import { CARDS } from '../../engine';
import { useGame } from '../../store';
import { Card } from '../components/Card';

const FAN_IDS = ['major-17', 'major-18', 'major-16', 'major-0', 'major-19'];

export function TitleScreen() {
  const newRun = useGame((s) => s.newRun);
  const newDaily = useGame((s) => s.newDaily);
  const goto = useGame((s) => s.goto);
  const k = useGame((s) => s.knowledge);
  const known = Object.values(k.cards).filter((c) => c.tier > 0).length;
  // A different fan every visit, seeded off the run count so it feels alive but not random-noise.
  const fan = useMemo(() => {
    const pool = k.runs === 0 ? FAN_IDS : CARDS.filter((c) => c.arcana === 'major').map((c) => c.id);
    const start = (k.runs * 7) % pool.length;
    const step = pool.length === FAN_IDS.length ? 1 : 5;
    return Array.from({ length: 5 }, (_, i) => pool[(start + i * step) % pool.length]);
  }, [k.runs]);

  return (
    <main className="screen screen--title">
      <div className="fan" aria-hidden>
        {fan.map((id, i) => (
          <div key={id} className="fan__card" style={{ '--i': i } as React.CSSProperties}>
            <Card cardId={id} size="md" reversed={i === 1} />
          </div>
        ))}
      </div>
      <div className="title">
        <div className="title__glyph">◯ △ ☐ ☾</div>
        <h1>Arcana Descent</h1>
        <p className="muted">Four seats. Three cards each. No one will tell you what they mean.</p>
      </div>
      <div className="stack">
        <button className="btn btn--primary" onClick={() => newRun()}>
          Descend
        </button>
        <button className="btn" onClick={newDaily}>
          Daily descent
        </button>
        <div className="row">
          <button className="btn" onClick={() => goto('codex')}>
            Codex {known > 0 && <span className="pill">{known}</span>}
          </button>
          <button className="btn" onClick={() => goto('settings')} aria-label="Settings">
            ⚙
          </button>
        </div>
      </div>
      <p className="muted small">
        {k.runs === 0 ? 'The deck is unread.' : `${k.runs} descents · ${k.deaths} deaths · ${k.ascensions} returns`}
      </p>
    </main>
  );
}
