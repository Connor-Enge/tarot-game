import { useEffect, useState } from 'react';
import { useSettings } from '../../settings';
import { activeSlotState, canTakeBack, canWhisperHere, currentScene, RITES, getCard, hasRelic, redrawCost, sceneNumber, scoreSlot, SLOT_IDS, SLOTS, totalScenes, whisperCost, whisperWords } from '../../engine';

/** Dev only: show the oracle's score on each candidate when the page is opened with ?oracle. */
const ORACLE = import.meta.env.DEV && typeof location !== 'undefined' && location.search.includes('oracle');
import { buzz, useGame } from '../../store';
import { Card } from '../components/Card';
import { Held } from '../components/Held';
import { DeckStack } from '../art/deck';
import { CardBack } from '../art/CardArt';
import { canTurn, getVow, TURN_COST } from '../../engine';
import { AbyssRings } from '../art/flourish';
import { VowArt } from '../art/relics';
import { SceneArt } from '../art/scenes';
import { CodexDetail } from '../components/CodexDetail';
import { DeckSheet } from '../components/DeckSheet';
import { RelicStrip } from '../components/RelicStrip';
import { Stats } from '../components/Stat';

/** The lantern that follows the lifted card, in its suit's light. */
const LANTERN: Record<string, string> = { wands: 'rgba(224,160,104,0.45)', cups: 'rgba(143,195,224,0.4)', swords: 'rgba(216,217,232,0.35)', pentacles: 'rgba(169,201,138,0.4)', major: 'rgba(243,220,138,0.45)', hidden: 'rgba(141,134,163,0.3)' };
/** How far up (px) a card must be dragged to land in the seat. */
const DRAG_TO_SEAT = 90;
/** How far down (px) a card must be pulled to sweep the hand into a redraw. */
const DRAG_TO_REDRAW = 70;

function ReadingScreenInner() {
  const run = useGame((s) => s.run)!;
  const lifted = useGame((s) => s.lifted);
  const [dragOver, setDragOver] = useState(false);
  const [dragPull, setDragPull] = useState(false); // pulled down toward a redraw
  const lift = useGame((s) => s.lift);
  const confirm = useGame((s) => s.confirm);
  const redraw = useGame((s) => s.redraw);
  const whisperLifted = useGame((s) => s.whisperLifted);
  const takeBack = useGame((s) => s.takeBack);
  const turnLifted = useGame((s) => s.turnLifted);
  const hideSeatNames = useSettings((s) => s.hideSeatNames);
  const seatsNamed = useGame((s) => s.knowledge.seatsNamed) && !hideSeatNames;
  const codexOpen = useGame((s) => s.codexOpen);
  const openCodex = useGame((s) => s.openCodex);
  const firstDescent = useGame((s) => s.firstDescent);
  const deckOpen = useGame((s) => s.deckOpen);
  const openDeck = useGame((s) => s.openDeck);
  const [zoom, setZoom] = useState<{ cardId: string; reversed: boolean } | null>(null);

  // Keys: 1-4 lift a candidate, Enter places it, R redraws, W whispers, T turns.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const st = useGame.getState();
      const r = st.run;
      if (!r || r.phase.kind !== 'reading' || st.codexOpen !== null) return;
      const slot = r.slots[r.activeSlot];
      if (!slot) return;
      const key = e.key.toLowerCase();
      if (/^[1-4]$/.test(key)) {
        const i = Number(key) - 1;
        if (i < slot.candidates.length) {
          st.lift(st.lifted === i ? null : i);
          e.preventDefault();
        }
      } else if (key === 'enter' && st.lifted !== null && !(t && t.tagName === 'BUTTON')) {
        st.confirm();
        e.preventDefault();
      } else if (key === 'r') st.redraw();
      else if (key === 'w') st.whisperLifted();
      else if (key === 't') st.turnLifted();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const scene = currentScene(run);
  const active = activeSlotState(run);
  if (!active) return null;
  const rCost = redrawCost(run);
  const wCost = whisperCost(run);
  const canRedraw = run.clarity >= rCost;
  const hushed = !canWhisperHere(run);
  const canWhisper = !hushed && lifted !== null && run.clarity >= wCost && !active.whispered.includes(lifted) && !active.candidates[lifted]?.hidden;
  const bell = hasRelic(run, 'bell');
  // Re-key the hand when the candidates change so the deal animation replays.
  const handKey = active.candidates.map((c) => c.cardId).join('|');

  return (
    <main className={`screen screen--reading ${scene.terminal ? 'screen--abyss' : ''}`}>
      <header className="topbar">
        <span className="muted small">
          {sceneNumber(run)} / {totalScenes(run)}
          <button type="button" className="deck-pill" onClick={() => openDeck(true)} aria-label="deck and discard" title="What has gone by">
            <DeckStack remaining={run.deck.draw.length} total={run.deck.draw.length + run.deck.discard.length} className="deck-pill__stack" />
            {run.deck.draw.length}
          </button>
        </span>
        <Stats vitality={run.vitality} clarity={run.clarity} />
      </header>

      <div className="reading__left">
      <section className="scene">
        <SceneArt id={scene.id} className="scene__art" />
        <p className="scene__place muted">{scene.place}</p>
        <p className="scene__prompt">{scene.prompt}</p>
        {scene.rite && (
          <p className={`scene__rite scene__rite--${scene.rite}`}>
            <span className="scene__rite-glyph" aria-hidden>{RITES[scene.rite].glyph}</span>
            <strong>{RITES[scene.rite].name}.</strong> {RITES[scene.rite].text}
          </p>
        )}
        {scene.terminal && run.abyssRemade && <p className="scene__remade muted small">It deals from what you have already read.</p>}
      </section>
      <RelicStrip relics={run.relics} />
      {run.vow && (
        <p className={`vow-line center small ${run.vow.broken ? 'vow-line--broken' : run.vow.kept ? 'vow-line--kept' : ''}`} title={getVow(run.vow.id).text}>
          <VowArt id={run.vow.id} className="vow-line__art" /> {getVow(run.vow.id).name}{run.vow.kept ? ' · kept' : run.vow.broken ? ' · broken' : ''}
        </p>
      )}

      <section className="spread" aria-label="the spread">
        {scene.terminal && <AbyssRings />}
        {scene.terminal && run.abyssRemade && run.activeSlot === 0 && run.slots[0]?.chosen === null && (
          <div className="abyss-rise" aria-hidden key={`rise-${run.history.length}`}>
            {Array.from({ length: 9 }, (_, i) => (
              <CardBack key={i} className="abyss-rise__card" variant="well" />
            ))}
          </div>
        )}
        {SLOT_IDS.map((id, i) => {
          const slot = run.slots[i];
          const chosen = slot && slot.chosen !== null ? slot.candidates[slot.chosen] : undefined;
          const isActive = i === run.activeSlot;
          const chosenCard = chosen ? getCard(chosen.cardId) : null;
          const suitClass = chosenCard ? `seat--${chosenCard.arcana === 'major' ? 'major' : chosenCard.suit}` : '';
          return (
            <div
              key={id}
              className={`seat ${isActive ? 'seat--active' : ''} ${chosen ? 'seat--filled' : ''} ${isActive && dragOver ? 'seat--target' : ''} ${suitClass}`}
              style={{ '--seat': i } as React.CSSProperties}
              role="group"
              aria-label={`${seatsNamed ? SLOTS[id].name : `seat ${i + 1}`}${isActive ? ', choosing' : chosen ? ', placed' : ', empty'}`}
            >
              <div className="seat__glyph" title={seatsNamed ? SLOTS[id].role : undefined}>
                {SLOTS[id].glyph}
              </div>
              <div className={`seat__card ${chosen ? 'flip-in' : ''}`} key={chosen ? chosen.cardId : 'empty'}>
                <Card cardId={chosen?.cardId} reversed={chosen?.reversed} faceDown={!chosen} size="sm" mark={chosen ? run.marks[chosen.cardId] : undefined} />
                {chosen && <span className="seat__seal" aria-hidden>{SLOTS[id].glyph}</span>}
              </div>
              {seatsNamed && <div className="seat__name">{SLOTS[id].name.replace(/^The /, '')}</div>}
            </div>
          );
        })}
      </section>
      </div>

      <div className="reading__right">
      <section className={`hand ${active.candidates.length > 3 ? 'hand--four' : ''} ${dragPull ? 'hand--pull' : ''}`} aria-label={`candidates for ${seatsNamed ? SLOTS[active.slot].name : `seat ${run.activeSlot + 1}`}: choose one`} key={handKey}>
        {active.candidates.map((c, i) => {
          const card = getCard(c.cardId);
          const whispered = active.whispered.includes(i);
          const kws = c.reversed ? card.keywords.reversed : card.keywords.upright;
          const kw = whisperWords(kws, active.slot, bell ? 2 : 1).join(' · ');
          return (
            <div
              className={`deal ${lifted === i ? 'deal--lantern' : ''}`}
              style={{ animationDelay: `${i * 90}ms`, '--lantern': LANTERN[c.hidden ? 'hidden' : card.arcana === 'major' ? 'major' : (card.suit ?? 'major')] } as React.CSSProperties}
              key={`${c.cardId}-${i}`}
            >
              {ORACLE && <span className="oracle-badge">{scoreSlot(scene, active.slot, c, run.marks).score.toFixed(1)}</span>}
              <Card
                cardId={c.cardId}
                reversed={c.reversed}
                faceDown={c.hidden}
                hiddenSuit={c.hidden ? (card.arcana === 'major' ? 'major' : card.suit) : undefined}
                echo={c.echo}
                size="lg"
                lifted={lifted === i}
                dim={lifted !== null && lifted !== i}
                mark={run.marks[c.cardId]}
                whisper={whispered ? kw : undefined}
                yours={c.yours}
                onClick={() => lift(lifted === i ? null : i)}
                onLongPress={c.hidden ? undefined : () => setZoom({ cardId: c.cardId, reversed: c.reversed })}
                onDragMove={(_dx, dy) => {
                  if (lifted !== i) lift(i);
                  const over = dy < -DRAG_TO_SEAT;
                  if (over !== dragOver) {
                    setDragOver(over);
                    if (over) buzz(8);
                  }
                  const pull = canRedraw && dy > DRAG_TO_REDRAW;
                  if (pull !== dragPull) {
                    setDragPull(pull);
                    if (pull) buzz([6, 40, 6]);
                  }
                }}
                onDragEnd={(_dx, dy) => {
                  setDragOver(false);
                  setDragPull(false);
                  if (dy < -DRAG_TO_SEAT) {
                    lift(i);
                    confirm();
                  } else if (canRedraw && dy > DRAG_TO_REDRAW) {
                    redraw();
                  }
                }}
              />
            </div>
          );
        })}
      </section>
      {(canTakeBack(run) || (lifted !== null && canTurn(run, lifted))) && (
        <div className="takeback-row">
          {lifted !== null && canTurn(run, lifted) && (
            <button type="button" className="takeback takeback--turn" onClick={turnLifted} title="Turn the lifted card over, once per scene">
              ↻ turn ◈{TURN_COST}
            </button>
          )}
          {canTakeBack(run) && (
            <button type="button" className="takeback" onClick={takeBack} title="Take back the last card, once per descent">
              ↶ take back
            </button>
          )}
        </div>
      )}

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
        <button className={`btn ${dragPull ? 'btn--pull' : ''}`} disabled={!canRedraw} onClick={redraw} title="Deal three new cards for this seat">
          Redraw {rCost === 0 ? '· free' : `◈${rCost}`}
        </button>
        <button className="btn" disabled={!canWhisper} onClick={whisperLifted} title={hushed ? 'No whispers in this scene' : 'Hear one word of the lifted card'}>
          Whisper ◈{wCost}
        </button>
        <button className="btn btn--primary" disabled={lifted === null} onClick={confirm}>
          {run.activeSlot === SLOT_IDS.length - 1 ? 'Read' : 'Place'}
        </button>
      </footer>
      </div>
      {codexOpen && <CodexDetail cardId={codexOpen} onClose={() => openCodex(null)} />}
      {deckOpen && <DeckSheet run={run} onClose={() => openDeck(false)} />}
      {zoom && (
        <div className="zoom" onClick={() => setZoom(null)} role="dialog" aria-label="magnified card">
          <Held className="zoom__card alive">
            <Card cardId={zoom.cardId} reversed={zoom.reversed} size="lg" />
          </Held>
          <p className="muted small">{getCard(zoom.cardId).name}{zoom.reversed ? ' · reversed' : ''}</p>
        </div>
      )}
    </main>
  );
}

/** Screens can linger for a crossfade after the run ends; render nothing without a run. */
export function ReadingScreen() {
  const run = useGame((s) => s.run);
  return run ? <ReadingScreenInner /> : null;
}
