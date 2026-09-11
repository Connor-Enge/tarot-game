import { useMemo, useState } from 'react';
import { CARDS, DESCENTS, getDescent } from '../../engine';
import { useGame } from '../../store';
import { Card } from '../components/Card';

const FAN_IDS = ['major-17', 'major-18', 'major-16', 'major-0', 'major-19'];

export function TitleScreen() {
  const newRun = useGame((s) => s.newRun);
  const newDaily = useGame((s) => s.newDaily);
  const goto = useGame((s) => s.goto);
  const k = useGame((s) => s.knowledge);
  const descent = useGame((s) => s.descent);
  const setDescent = useGame((s) => s.setDescent);
  const [lockedNote, setLockedNote] = useState<string | null>(null);
  const known = Object.values(k.cards).filter((c) => c.tier > 0).length;
  const current = getDescent(descent);
  const anyUnlocked = DESCENTS.some((d, i) => i > 0 && d.unlocked(k));
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
      {anyUnlocked && (
        <div className="descents">
          <div className="descents__row">
            {DESCENTS.map((d) => {
              const open = d.unlocked(k);
              return (
                <button
                  key={d.id}
                  type="button"
                  className={`descent-chip ${d.id === descent ? 'descent-chip--on' : ''} ${open ? '' : 'descent-chip--locked'}`}
                  onClick={() => {
                    if (open) {
                      setDescent(d.id);
                      setLockedNote(null);
                    } else setLockedNote(d.unlockText);
                  }}
                  aria-label={d.name}
                >
                  {open ? d.glyph : '🔒'}
                </button>
              );
            })}
          </div>
          <p className="muted small">{lockedNote ? `Locked · ${lockedNote}` : `${current.name} · ${current.text}`}</p>
        </div>
      )}
      <div className="stack">
        <button className="btn btn--primary" onClick={() => newRun()}>
          {current.id === 'standard' ? 'Descend' : `Descend · ${current.name}`}
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
