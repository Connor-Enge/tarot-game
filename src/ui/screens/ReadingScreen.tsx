import { useState } from 'react';
import { activeSlotState, currentScene, getCard, hasRelic, redrawCost, sceneNumber, SLOT_IDS, SLOTS, totalScenes, whisperCost, whisperWords } from '../../engine';
import { useGame } from '../../store';
import { Card } from '../components/Card';
import { SceneArt } from '../art/scenes';
import { CodexDetail } from '../components/CodexDetail';
import { DeckSheet } from '../components/DeckSheet';
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
  const codexOpen = useGame((s) => s.codexOpen);
  const openCodex = useGame((s) => s.openCodex);
  const firstDescent = useGame((s) => s.firstDescent);
  const deckOpen = useGame((s) => s.deckOpen);
  const openDeck = useGame((s) => s.openDeck);
  const [zoom, setZoom] = useState<{ cardId: string; reversed: boolean } | null>(null);

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
    <main className={`screen screen--reading ${scene.terminal ? 'screen--abyss' : ''}`}>
      <header className="topbar">
        <span className="muted small">
          {sceneNumber(run)} / {totalScenes(run)}
          <button type="button" className="deck-pill" onClick={() => openDeck(true)} aria-label="deck and discard" title="What has gone by">
            ▤ {run.deck.draw.length}
          </button>
        </span>
        <Stats vitality={run.vitality} clarity={run.clarity} />
      </header>

      <section className="scene">
        <SceneArt id={scene.id} className="scene__art" />
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
              {seatsNamed && <div className="seat__name">{SLOTS[id].name.replace(/^The /, '')}</div>}
            </div>
          );
        })}
      </section>

      <section className={`hand ${active.candidates.length > 3 ? 'hand--four' : ''}`} aria-label="choose one" key={handKey}>
        {active.candidates.map((c, i) => {
          const card = getCard(c.cardId);
          const whispered = active.whispered.includes(i);
          const kws = c.reversed ? card.keywords.reversed : card.keywords.upright;
          const kw = whisperWords(kws, active.slot, bell ? 2 : 1).join(' · ');
          return (
            <div className="deal" style={{ animationDelay: `${i * 90}ms` }} key={`${c.cardId}-${i}`}>
              <Card
                cardId={c.cardId}
                reversed={c.reversed}
                faceDown={c.hidden}
                echo={c.echo}
                size="lg"
                lifted={lifted === i}
                dim={lifted !== null && lifted !== i}
                mark={run.marks[c.cardId]}
                whisper={whispered ? kw : undefined}
                onClick={() => lift(lifted === i ? null : i)}
                onLongPress={c.hidden ? undefined : () => setZoom({ cardId: c.cardId, reversed: c.reversed })}
              />
            </div>
          );
        })}
      </section>

      {firstDescent && run.layer === 0 && (
        <p className="nudge muted small center" key={`${run.activeSlot}-${lifted === null}`}>
          {lifted === null ? 'Lift one.' : run.activeSlot === SLOT_IDS.length - 1 ? 'Read.' : `Place it in the ${SLOTS[SLOT_IDS[run.activeSlot]].glyph}.`}
        </p>
      )}

      <footer className="actions">
        <button
          className="btn btn--icon"
          disabled={lifted === null || !!active.candidates[lifted]?.hidden}
          onClick={() => lifted !== null && openCodex(active.candidates[lifted].cardId)}
          aria-label="Consult the Codex"
          title="What you know of the lifted card"
        >
          ☷
        </button>
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
      {codexOpen && <CodexDetail cardId={codexOpen} onClose={() => openCodex(null)} />}
      {deckOpen && <DeckSheet run={run} onClose={() => openDeck(false)} />}
      {zoom && (
        <div className="zoom" onClick={() => setZoom(null)} role="dialog" aria-label="magnified card">
          <div className="zoom__card">
            <Card cardId={zoom.cardId} reversed={zoom.reversed} size="lg" />
          </div>
          <p className="muted small">{getCard(zoom.cardId).name}{zoom.reversed ? ' · reversed' : ''}</p>
        </div>
      )}
    </main>
  );
}
