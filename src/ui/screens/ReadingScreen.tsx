import { activeSlotState, currentScene, getCard, hasRelic, redrawCost, sceneNumber, SLOT_IDS, SLOTS, totalScenes, whisperCost } from '../../engine';
import { useGame } from '../../store';
import { Card } from '../components/Card';
import { RelicStrip } from '../components/RelicStrip';
import { Stats } from '../components/Stat';

export function ReadingScreen() {
  const run = useGame((s) => s.run)!;
  const lifted = useGame((s) => s.lifted);
  const lift = useGame((s) => s.lift);
  const confirm = useGame((s) => s.confirm);
  const redraw = useGame((s) => s.redraw);
  const whisperLifted = useGame((s) => s.whisperLifted);
  const seatsNamed = useGame((s) => s.knowledge.seatsNamed);

  const scene = currentScene(run);
  const active = activeSlotState(run);
  if (!active) return null;
  const rCost = redrawCost(run);
  const wCost = whisperCost(run);
  const canRedraw = run.clarity >= rCost;
  const canWhisper = lifted !== null && run.clarity >= wCost && !active.whispered.includes(lifted) && !active.candidates[lifted]?.hidden;
  const bell = hasRelic(run, 'bell');
  // Re-key the hand when the candidates change so the deal animation replays.
  const handKey = active.candidates.map((c) => c.cardId).join('|');

  return (
    <main className="screen screen--reading">
      <header className="topbar">
        <span className="muted small">
          {sceneNumber(run)} / {totalScenes(run)}
        </span>
        <Stats vitality={run.vitality} clarity={run.clarity} />
      </header>

      <section className="scene">
        <p className="scene__place muted">{scene.place}</p>
        <p className="scene__prompt">{scene.prompt}</p>
      </section>
      <RelicStrip relics={run.relics} />

      <section className="spread" aria-label="the spread">
        {SLOT_IDS.map((id, i) => {
          const slot = run.slots[i];
          const chosen = slot && slot.chosen !== null ? slot.candidates[slot.chosen] : undefined;
          const isActive = i === run.activeSlot;
          return (
            <div key={id} className={`seat ${isActive ? 'seat--active' : ''} ${chosen ? 'seat--filled' : ''}`}>
              <div className="seat__glyph" title={seatsNamed ? SLOTS[id].role : undefined}>
                {SLOTS[id].glyph}
              </div>
              <div className={chosen ? 'flip-in' : undefined} key={chosen ? chosen.cardId : 'empty'}>
                <Card cardId={chosen?.cardId} reversed={chosen?.reversed} faceDown={!chosen} size="sm" mark={chosen ? run.marks[chosen.cardId] : undefined} />
              </div>
              {seatsNamed && <div className="seat__name">{SLOTS[id].name}</div>}
            </div>
          );
        })}
      </section>

      <section className={`hand ${active.candidates.length > 3 ? 'hand--four' : ''}`} aria-label="choose one" key={handKey}>
        {active.candidates.map((c, i) => {
          const card = getCard(c.cardId);
          const whispered = active.whispered.includes(i);
          const kws = c.reversed ? card.keywords.reversed : card.keywords.upright;
          const kw = bell ? kws.slice(0, 2).join(' · ') : kws[0];
          return (
            <div className="deal" style={{ animationDelay: `${i * 90}ms` }} key={`${c.cardId}-${i}`}>
              <Card
                cardId={c.cardId}
                reversed={c.reversed}
                faceDown={c.hidden}
                size="lg"
                lifted={lifted === i}
                dim={lifted !== null && lifted !== i}
                mark={run.marks[c.cardId]}
                whisper={whispered ? kw : undefined}
                onClick={() => lift(lifted === i ? null : i)}
              />
            </div>
          );
        })}
      </section>

      <footer className="actions">
        <button className="btn" disabled={!canRedraw} onClick={redraw} title="Deal three new cards for this seat">
          Redraw {rCost === 0 ? '· free' : `◈${rCost}`}
        </button>
        <button className="btn" disabled={!canWhisper} onClick={whisperLifted} title="Hear one word of the lifted card">
          Whisper ◈{wCost}
        </button>
        <button className="btn btn--primary" disabled={lifted === null} onClick={confirm}>
          {run.activeSlot === SLOT_IDS.length - 1 ? 'Read' : 'Place'}
        </button>
      </footer>
    </main>
  );
}
