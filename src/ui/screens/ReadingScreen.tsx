import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../../settings';
import { activeSlotState, askText, broughtTags, canLamp, canTakeBack, canWhisperHere, kinshipAmong, seatAsk, tagFit, type SlotId, type Tag, KIN_BONUS, lampCost, lampVerdicts, namedWithinReach, currentScene, readingSoFar, reckoningText, RITES, SLOT_POSITION, THRESHOLDS, getCard, hasRelic, redrawCost, sceneNumber, scoreSlot, SLOT_IDS, SLOTS, totalScenes, whisperCost, whisperWords } from '../../engine';

/** Dev only: show the oracle's score on each candidate when the page is opened with ?oracle. */
const ORACLE = import.meta.env.DEV && typeof location !== 'undefined' && location.search.includes('oracle');
import { buzz, useGame } from '../../store';
import { Card } from '../components/Card';
import { Held } from '../components/Held';
import { DeckStack } from '../art/deck';
import { CardBack } from '../art/CardArt';
import { canHold, canTurn, getVow, HOLD_COST, TURN_COST } from '../../engine';
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
  const lightLamp = useGame((s) => s.lightLamp);
  const takeBack = useGame((s) => s.takeBack);
  const turnLifted = useGame((s) => s.turnLifted);
  const holdLifted = useGame((s) => s.holdLifted);
  const hideSeatNames = useSettings((s) => s.hideSeatNames);
  const seatsNamed = useGame((s) => s.knowledge.seatsNamed) && !hideSeatNames;
  const codexOpen = useGame((s) => s.codexOpen);
  const openCodex = useGame((s) => s.openCodex);
  const firstDescent = useGame((s) => s.firstDescent);
  const deckOpen = useGame((s) => s.deckOpen);
  const openDeck = useGame((s) => s.openDeck);
  const calmRoom = useSettings((s) => s.calmRoom);
  const [zoom, setZoom] = useState<{ cardId: string; reversed: boolean } | null>(null);
  // After a card lands, bring the next hand into view on a phone, where the plate pushes it down.
  const handRef = useRef<HTMLElement>(null);
  const activeSlot = run.activeSlot;
  useEffect(() => {
    if (activeSlot === 0 || window.innerWidth >= 700) return;
    const reduce = document.documentElement.classList.contains('reduce-motion') || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = window.setTimeout(() => handRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }), 260);
    return () => window.clearTimeout(t);
  }, [activeSlot]);

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
      else if (key === 'h') st.holdLifted();
      else if (key === 'l') st.lightLamp();
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
  const knownCards = useGame((s) => s.knowledge.cards);
  // A card the Codex knows (tier two or better) whispers its seat word for free.
  const knowsFree = (cardId: string) => (knownCards[cardId]?.tier ?? 0) >= 2;
  const canWhisper = !hushed && lifted !== null && run.clarity >= wCost && !active.whispered.includes(lifted) && !active.candidates[lifted]?.hidden && !knowsFree(active.candidates[lifted]?.cardId ?? '');
  const bell = hasRelic(run, 'bell');
  const lamp = lampVerdicts(run);
  const lampOn = !!active.lit;
  // Re-key the hand when the candidates change so the deal animation replays.
  const handKey = active.candidates.map((c) => c.cardId).join('|');
  // Every placed card answers at once: its score, its omen, and what the seat made of it.
  const soFar = readingSoFar(
    scene,
    run.slots.filter((sl) => sl.chosen !== null).map((sl) => ({ slot: sl.slot, drawn: sl.candidates[sl.chosen!] })),
    run.marks,
    hasRelic(run, 'ring') ? 2 : undefined,
  );
  const lastPlaced = soFar.seats[soFar.seats.length - 1];
  // The motes drifting behind the table take the reading's colour: gold as it rises, red as it falls.
  const readingTier = soFar.placed > 0 && !calmRoom ? soFar.tier : null;
  useEffect(() => {
    const hue = readingTier === 'triumph' ? '48' : readingTier === 'boon' ? '44' : readingTier === 'harm' ? '8' : readingTier === 'calamity' ? '355' : '';
    document.documentElement.style.setProperty('--reading-hue', hue);
    return () => document.documentElement.style.setProperty('--reading-hue', '');
  }, [readingTier]);
  const knownCombos = useGame((s) => s.knowledge.combos);
  const kinSoFar = kinshipAmong(soFar.seats.map((x) => x.card.id), run.kin, run.mods.kinBonus ?? KIN_BONUS);
  const placedIds = soFar.seats.map((x) => x.card.id);
  const kinHere = (cardId: string) => !!run.kin && placedIds.some((p) => run.kin!.includes([p, cardId].sort().join('|')));
  const withinReach = soFar.placed === SLOT_IDS.length - 1
    ? namedWithinReach(Object.fromEntries(soFar.seats.map((x) => [x.slot, { cardId: x.card.id, reversed: x.reckoning.reversed }])), knownCombos ?? [])
    : [];
  const soFarBySlot = Object.fromEntries(soFar.seats.map((x) => [x.slot, x]));
  // The ask: what this seat calls for and cannot bear, said before any card lands.
  const ask = seatAsk(scene, active.slot);
  const knowledge = useGame((s) => s.knowledge);
  // What the Codex has seen each card in hand bring, this way up, and how that sits with the ask.
  const chipsFor = (cardId: string, reversed: boolean) =>
    broughtTags(knowledge, cardId, reversed)
      .map((tag) => ({ tag, fit: tagFit(ask, tag) }))
      .sort((a, b) => ORDER[a.fit] - ORDER[b.fit])
      .slice(0, 5);

  return (
    <main className={`screen screen--reading ${scene.terminal ? 'screen--abyss' : ''} ${soFar.placed > 0 && !calmRoom ? `reading--${soFar.tier}` : ''}`}>
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
      <section className="scene alive">
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

      <section className="spread spread--cross" aria-label="the spread, laid as a mini cross">
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
              className={`seat seat--${id} ${isActive ? 'seat--active' : ''} ${chosen ? 'seat--filled' : ''} ${isActive && dragOver ? 'seat--target' : ''} ${suitClass} ${soFarBySlot[id] ? `seat--${soFarBySlot[id].reckoning.verdict}` : ''}`}
              style={{ '--seat': i } as React.CSSProperties}
              role="group"
              aria-label={`${seatsNamed ? SLOTS[id].name : `seat ${i + 1}`}${isActive ? ', choosing' : chosen ? ', placed' : ', empty'}`}
            >
              <div className="seat__glyph" title={seatsNamed ? SLOTS[id].role : undefined}>
                {SLOTS[id].glyph}
              </div>
              <div className={`seat__card ${chosen ? 'flip-in' : ''}`} key={chosen ? chosen.cardId : 'empty'}>
                <Card cardId={chosen?.cardId} reversed={chosen?.reversed} faceDown={!chosen} size="sm" mark={chosen ? run.marks[chosen.cardId] : undefined} onLongPress={chosen ? () => setZoom({ cardId: chosen.cardId, reversed: chosen.reversed }) : undefined} />
                {chosen && <span className="seat__seal" aria-hidden>{SLOTS[id].glyph}</span>}
              </div>
              <div className="seat__pos" title={SLOT_POSITION[id].gloss}>
                <span className="seat__pos-n">{SLOT_POSITION[id].n}</span> {SLOT_POSITION[id].role}
              </div>
              {soFarBySlot[id] && (
                <span className={`seat__score reckon__score reckon--${soFarBySlot[id].reckoning.verdict}`} key={`score-${soFarBySlot[id].card.id}`}>
                  {soFarBySlot[id].score > 0 ? '+' : soFarBySlot[id].score < 0 ? '−' : ''}{Math.abs(soFarBySlot[id].score) % 1 === 0 ? Math.abs(soFarBySlot[id].score) : Math.abs(soFarBySlot[id].score).toFixed(1)}
                </span>
              )}
              {seatsNamed && <div className="seat__name">{SLOTS[id].name.replace(/^The /, '')}</div>}
              {run.laidBare && slot && !chosen && !isActive && (
                <div className="seat__bare" aria-label={`${slot.candidates.length} cards waiting for this seat`}>
                  {slot.candidates.map((c, j) => (
                    <Card key={`${c.cardId}-${j}`} cardId={c.cardId} reversed={c.reversed} size="xs" />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
      {lastPlaced && (
        <div className={`sofar sofar--${soFar.tier}`} key={`sofar-${lastPlaced.card.id}-${soFar.placed}`} aria-live="polite">
          <p className="sofar__answer">
            <span className="sofar__omen">{lastPlaced.omen}</span>
            <span className={`reckon reckon--${lastPlaced.reckoning.verdict} sofar__reckon`}>
              <span className="reckon__text">{reckoningText(lastPlaced.reckoning, lastPlaced.card.name)}</span>
            </span>
          </p>
          <div className="sofar__meter" role="img" aria-label={`reading so far: ${soFar.total > 0 ? '+' : ''}${soFar.total}, reads as ${soFar.tier}`}>
            {(['calamity', 'harm', 'neutral', 'boon', 'triumph'] as const).map((t) => (
              <span key={t} className={`sofar__band sofar__band--${t} ${soFar.tier === t ? 'sofar__band--on' : ''}`} />
            ))}
            <span className="sofar__pin" style={{ left: `${Math.max(2, Math.min(98, ((soFar.total - (THRESHOLDS.harm - 3)) / ((THRESHOLDS.triumph + 3) - (THRESHOLDS.harm - 3))) * 100))}%` }} aria-hidden />
          </div>
          {run.mods.seatTick && lastPlaced.reckoning.verdict !== 'neither' && (
            <p className={`sofar__tick center small ${lastPlaced.reckoning.verdict === 'hurt' ? 'sofar__tick--hurt' : 'sofar__tick--helped'}`}>
              ◈ {lastPlaced.reckoning.verdict === 'hurt' ? '−1 taken at once' : '+1 given at once'}
            </p>
          )}
          {kinSoFar.pairs.map(([a, b]) => (
            <p key={`${a}|${b}`} className="kin kin--sofar center small">
              <span className="kin__mark" aria-hidden>✶</span> {getCard(a).name} and {getCard(b).name} know each other. <span className="kin__score">+{run.mods.kinBonus ?? KIN_BONUS}</span>
            </p>
          ))}
          {withinReach.length > 0 && (
            <p className="sofar__reach center small">
              {withinReach.slice(0, 2).map((w) => (
                <span key={w.id} className={`reach ${w.score < 0 ? 'reach--ill' : ''}`}>
                  <span className="reach__mark" aria-hidden>♪</span> Within reach: <em>{w.note}</em>
                </span>
              ))}
              {withinReach.length > 2 && <span className="muted"> · and {withinReach.length - 2} more</span>}
            </p>
          )}
          <p className="sofar__tally muted small center">
            {soFar.placed} of 4 placed · {soFar.total > 0 ? '+' : soFar.total < 0 ? '−' : ''}{Math.abs(soFar.total) % 1 === 0 ? Math.abs(soFar.total) : Math.abs(soFar.total).toFixed(1)} so far · reads as <strong>{soFar.tier}</strong>{soFar.placed < 4 ? ' if nothing else moves it' : ''}
          </p>
        </div>
      )}
      {run.held && (
        <p className="held-note muted small center">
          <span className="held-note__glyph" aria-hidden>⌖</span> {getCard(run.held.cardId).name} held for the next seat
        </p>
      )}
      </div>

      <div className="reading__right">
      <p className="ask" key={`ask-${active.slot}`} aria-label={askText(ask)}>
        <span className="hint__pos">{SLOT_POSITION[active.slot].n} · {SLOT_POSITION[active.slot].role}</span>
        <AskLine slot={active.slot} wanted={ask.wanted} feared={ask.feared} />
      </p>
      <section ref={handRef} className={`hand ${active.candidates.length > 3 ? 'hand--four' : ''} ${dragPull ? 'hand--pull' : ''} ${lampOn ? 'hand--lit' : ''}`} aria-label={`candidates for ${seatsNamed ? SLOTS[active.slot].name : `seat ${run.activeSlot + 1}`}: choose one`} key={handKey}>
        {active.candidates.map((c, i) => {
          const card = getCard(c.cardId);
          const whispered = active.whispered.includes(i);
          const kws = c.reversed ? card.keywords.reversed : card.keywords.upright;
          // A mastered card, like a Small Bell, gives two words.
          const kw = whisperWords(kws, active.slot, bell || (knownCards[c.cardId]?.tier ?? 0) >= 3 ? 2 : 1).join(' · ');
          return (
            <div
              className={`deal ${lifted === i ? 'deal--lantern' : ''}`}
              style={{ animationDelay: `${i * 90}ms`, '--lantern': LANTERN[c.hidden ? 'hidden' : card.arcana === 'major' ? 'major' : (card.suit ?? 'major')] } as React.CSSProperties}
              key={`${c.cardId}-${i}`}
            >
              {ORACLE && <span className="oracle-badge">{scoreSlot(scene, active.slot, c, run.marks).score.toFixed(1)}</span>}
              {lampOn && lamp[i] && (
                <span className={`lamp-mark lamp-mark--${lamp[i]}`} style={{ animationDelay: `${i * 120}ms` }} aria-label={lamp[i] === 'helped' ? 'would serve here' : lamp[i] === 'hurt' ? 'would cost here' : 'would change little here'} title={lamp[i] === 'helped' ? 'Would serve here' : lamp[i] === 'hurt' ? 'Would cost here' : 'Would change little here'}>
                  {lamp[i] === 'helped' ? '△' : lamp[i] === 'hurt' ? '▽' : '◇'}
                </span>
              )}
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
                whisper={whispered || (!c.hidden && knowsFree(c.cardId)) ? kw : undefined}
                whisperKnown={!whispered && !c.hidden && knowsFree(c.cardId)}
                yours={c.yours}
                held={c.held}
                kin={!c.hidden && kinHere(c.cardId)}
                tags={c.hidden ? undefined : chipsFor(c.cardId, c.reversed)}
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
      {(canTakeBack(run) || (lifted !== null && (canTurn(run, lifted) || canHold(run, lifted)))) && (
        <div className="takeback-row">
          {lifted !== null && canHold(run, lifted) && (
            <button type="button" className="takeback takeback--hold" onClick={holdLifted} title="Keep the lifted card back; it joins the next seat's deal">
              Hold ◈{HOLD_COST}
            </button>
          )}
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

      {(firstDescent || lifted === null) && (
        <p className="nudge muted small center" key={`${run.activeSlot}-${lifted === null}`}>
          {lifted === null ? (
            <>
              <span className="hint__pos">{SLOT_POSITION[active.slot].n} · {SLOT_POSITION[active.slot].role}</span> {SLOT_POSITION[active.slot].question}
            </>
          ) : run.activeSlot === SLOT_IDS.length - 1 ? (
            'Read.'
          ) : (
            `Place it as the ${SLOT_POSITION[active.slot].role.toLowerCase()}.`
          )}
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
        <button className={`btn ${lampOn ? 'btn--lit' : ''}`} disabled={!canLamp(run)} onClick={lightLamp} title={lampOn ? 'The lamp is lit over this seat' : 'Hold a lamp over this seat: see what each card would do here'}>
          {lampOn ? 'Lit' : `Lamp ◈${lampCost(run)}`}
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

const ORDER = { want: 0, fear: 1, none: 2 } as const;

/** The ask's opener per position, with the tags set as chips so they can be matched against a card at a glance. */
const ASK_PARTS: Record<SlotId, { pre: string; fearPre: string; fearPost: string }> = {
  vessel: { pre: 'The situation calls for ', fearPre: ', and cannot bear ', fearPost: '' },
  threshold: { pre: 'What stands in the way answers to ', fearPre: ', and turns worse with ', fearPost: '' },
  wake: { pre: 'What you might miss here is ', fearPre: '; ', fearPost: ' would blind you' },
  hand: { pre: 'The best course is ', fearPre: ', and the worst ', fearPost: '' },
};

function TagList({ tags, fit }: { tags: readonly Tag[]; fit: 'want' | 'fear' }) {
  return (
    <>
      {tags.map((t, i) => (
        <span key={t}>
          {i > 0 && (i === tags.length - 1 ? ' and ' : ', ')}
          <em className={`ask__tag ask__tag--${fit}`}>{t}</em>
        </span>
      ))}
    </>
  );
}

function AskLine({ slot, wanted, feared }: { slot: SlotId; wanted: readonly Tag[]; feared: readonly Tag[] }) {
  const parts = ASK_PARTS[slot];
  return (
    <span className="ask__text">
      {parts.pre}
      {wanted.length ? <TagList tags={wanted} fit="want" /> : 'nothing in particular'}
      {feared.length > 0 && (
        <>
          {parts.fearPre}
          <TagList tags={feared} fit="fear" />
          {parts.fearPost}
        </>
      )}
      .
    </span>
  );
}

/** Screens can linger for a crossfade after the run ends; render nothing without a run. */
export function ReadingScreen() {
  const run = useGame((s) => s.run);
  return run ? <ReadingScreenInner /> : null;
}
