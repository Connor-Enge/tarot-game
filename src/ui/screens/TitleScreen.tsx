import { useEffect, useMemo, useState } from 'react';
import { CARDS, dailySeed, DEPTHS, DESCENTS, getCard, getDescent, maxDepthUnlocked } from '../../engine';
import { ReaderMark } from '../components/ReaderMark';
import { useGame } from '../../store';
import { Card } from '../components/Card';

const FAN_IDS = ['major-17', 'major-18', 'major-16', 'major-0', 'major-19'];

export function TitleScreen() {
  const newRun = useGame((s) => s.newRun);
  const newDaily = useGame((s) => s.newDaily);
  const newWeekly = useGame((s) => s.newWeekly);
  const saved = useGame((s) => s.saved);
  const resume = useGame((s) => s.resume);
  const abandon = useGame((s) => s.abandon);
  const goto = useGame((s) => s.goto);
  const k = useGame((s) => s.knowledge);
  const descent = useGame((s) => s.descent);
  const setDescent = useGame((s) => s.setDescent);
  const depth = useGame((s) => s.depth);
  const setDepth = useGame((s) => s.setDepth);
  const maxDepth = maxDepthUnlocked(k.records?.standard?.returns ?? 0);
  const [lockedNote, setLockedNote] = useState<string | null>(null);
  const [fanDown, setFanDown] = useState(false);
  // Foil shimmer follows device tilt where the browser allows it without a prompt, else the pointer.
  useEffect(() => {
    const root = document.documentElement;
    const set = (x: number) => root.style.setProperty('--shimmer', `${Math.max(0, Math.min(100, x))}%`);
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null) return;
      set(50 + (e.gamma / 45) * 50);
    };
    const onMove = (e: PointerEvent) => set((e.clientX / window.innerWidth) * 100);
    window.addEventListener('deviceorientation', onTilt);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('deviceorientation', onTilt);
      window.removeEventListener('pointermove', onMove);
      root.style.removeProperty('--shimmer');
    };
  }, []);
  const known = Object.values(k.cards).filter((c) => c.tier > 0).length;
  const current = getDescent(descent);
  const anyUnlocked = DESCENTS.some((d, i) => i > 0 && d.unlocked(k));
  const today = useMemo(() => {
    const { seed } = dailySeed();
    return CARDS[seed % CARDS.length].id;
  }, []);
  // A different fan every visit, seeded off the run count so it feels alive but not random-noise.
  const fan = useMemo(() => {
    const pool = k.runs === 0 ? FAN_IDS : CARDS.filter((c) => c.arcana === 'major').map((c) => c.id);
    const start = (k.runs * 7) % pool.length;
    const step = pool.length === FAN_IDS.length ? 1 : 5;
    return Array.from({ length: 5 }, (_, i) => pool[(start + i * step) % pool.length]);
  }, [k.runs]);

  return (
    <main className="screen screen--title">
      <div className={`fan ${today === 'major-0' ? 'fan--fool' : ''}`} aria-hidden onClick={() => setFanDown((d) => !d)}>
        {fan.map((id, i) => (
          <div key={id} className={`fan__card ${fanDown ? 'fan__card--down' : ''}`} style={{ '--i': i } as React.CSSProperties}>
            <div className="flip-in" key={fanDown ? 'down' : 'up'}>
              <Card cardId={id} size="md" reversed={i === 1} faceDown={fanDown} />
            </div>
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
          {!lockedNote && current.id === 'standard' && maxDepth > 0 && (
            <div className="depth">
              <button className="btn btn--icon" onClick={() => setDepth(Math.max(0, depth - 1))} disabled={depth === 0} aria-label="shallower">
                −
              </button>
              <div className="depth__label">
                <div>{depth === 0 ? 'No depth' : `Depth ${depth} · ${DEPTHS[depth - 1].name}`}</div>
                <div className="muted small">{depth === 0 ? 'The usual dark.' : DEPTHS.slice(0, depth).map((d) => d.text).join(' ')}</div>
              </div>
              <button className="btn btn--icon" onClick={() => setDepth(Math.min(maxDepth, depth + 1))} disabled={depth >= maxDepth} aria-label="deeper">
                +
              </button>
            </div>
          )}
          {!lockedNote && k.records?.[current.id] && (
            <p className="muted small record">
              {k.records[current.id].runs} down · {k.records[current.id].returns} back · deepest {k.records[current.id].bestDepth}
            </p>
          )}
          {!lockedNote && k.records?.[current.id]?.best && (
            <div className="best" aria-label="best descent">
              <div className="last__cards">
                {k.records[current.id].best!.cards.map((c, i) => (
                  <Card key={`${c.cardId}-${i}`} cardId={c.cardId} reversed={c.reversed} size="xs" />
                ))}
              </div>
              <span className="muted small">
                Finest · {k.records[current.id].best!.returned ? 'returned' : `scene ${k.records[current.id].best!.depth}`} · {k.records[current.id].best!.good} good
              </span>
            </div>
          )}
        </div>
      )}
      {saved && (
        <div className="resume">
          <div className="muted small">
            A descent waits, {saved.run.history.length} scene{saved.run.history.length === 1 ? '' : 's'} down · ♥ {saved.run.vitality}
          </div>
          <div className="row">
            <button className="btn" onClick={abandon}>
              Let it go
            </button>
            <button className="btn btn--primary" onClick={resume}>
              Resume
            </button>
          </div>
        </div>
      )}
      <div className="stack">
        <button className="btn btn--primary" onClick={() => newRun()}>
          {current.id === 'standard' ? 'Descend' : `Descend · ${current.name}`}
        </button>
        <div className="row">
          <button className="btn" onClick={newDaily}>
            Daily
          </button>
          <button className="btn" onClick={newWeekly} title="A longer road, shared by everyone this week">
            Weekly
          </button>
        </div>
        <div className="row">
          <button className="btn" onClick={() => goto('codex')}>
            Codex {known > 0 && <span className="pill">{known}</span>}
          </button>
          <button className="btn" onClick={() => goto('settings')} aria-label="Settings">
            ⚙
          </button>
        </div>
      </div>
      {k.runs === 0 ? <p className="muted small">The deck is unread.</p> : <ReaderMark knowledge={k} />}
      {k.last && (
        <div className="last" aria-label="your last reading">
          <div className="muted small">{k.last.returned ? 'Last time, you came back.' : 'Last time, this ended you.'}</div>
          <div className="last__cards">
            {k.last.cards.map((c, i) => (
              <Card key={`${c.cardId}-${i}`} cardId={c.cardId} reversed={c.reversed} size="xs" />
            ))}
          </div>
          <div className="muted small last__outcome">{k.last.outcome}</div>
        </div>
      )}
      <div className="today" aria-label="card of the day">
        <Card cardId={today} size="xs" />
        <span className="muted small">Today's card · {getCard(today).name}</span>
      </div>
    </main>
  );
}
