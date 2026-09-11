import { activeSlotState, currentScene, REDRAW_COST, SLOT_IDS, SLOTS } from '../../engine';
import { useGame } from '../../store';
import { Card } from '../components/Card';
import { Stats } from '../components/Stat';

export function ReadingScreen() {
  const run = useGame((s) => s.run)!;
  const lifted = useGame((s) => s.lifted);
  const lift = useGame((s) => s.lift);
  const confirm = useGame((s) => s.confirm);
  const redraw = useGame((s) => s.redraw);
  const seatsNamed = useGame((s) => s.knowledge.seatsNamed);

  const scene = currentScene(run);
  const active = activeSlotState(run);
  if (!active) return null;
  const canRedraw = run.clarity >= REDRAW_COST;

  return (
    <main className="screen screen--reading">
      <header className="topbar">
        <span className="muted small">
          {run.sceneIndex + 1} / {run.path.length}
        </span>
        <Stats vitality={run.vitality} clarity={run.clarity} />
      </header>

      <section className="scene">
        <p className="scene__place muted">{scene.place}</p>
        <p className="scene__prompt">{scene.prompt}</p>
      </section>

      {/* The spread: four seats, filled left to right. */}
      <section className="spread" aria-label="the spread">
        {SLOT_IDS.map((id, i) => {
          const slot = run.slots[i];
          const chosen = slot && slot.chosen !== null ? slot.candidates[slot.chosen] : undefined;
          const isActive = i === run.activeSlot;
          return (
            <div key={id} className={`seat ${isActive ? 'seat--active' : ''}`}>
              <div className="seat__glyph" title={seatsNamed ? SLOTS[id].role : undefined}>
                {SLOTS[id].glyph}
              </div>
              <Card cardId={chosen?.cardId} reversed={chosen?.reversed} faceDown={!chosen} size="sm" />
              {seatsNamed && <div className="seat__name">{SLOTS[id].name}</div>}
            </div>
          );
        })}
      </section>

      {/* The three candidates for the active seat. */}
      <section className="hand" aria-label="choose one">
        {active.candidates.map((c, i) => (
          <Card
            key={`${c.cardId}-${i}`}
            cardId={c.cardId}
            reversed={c.reversed}
            size="lg"
            lifted={lifted === i}
            dim={lifted !== null && lifted !== i}
            onClick={() => lift(lifted === i ? null : i)}
          />
        ))}
      </section>

      <footer className="actions">
        <button className="btn" disabled={!canRedraw} onClick={redraw}>
          Redraw ◈{REDRAW_COST}
        </button>
        <button className="btn btn--primary" disabled={lifted === null} onClick={confirm}>
          {run.activeSlot === SLOT_IDS.length - 1 ? 'Read' : 'Place'}
        </button>
      </footer>
    </main>
  );
}
