import { comboScore, currentScene, getCard, getRelic, isPeddlerTrade, KIN_BONUS, reckon, reckoningText, SLOT_IDS, SLOT_POSITION, SLOTS, tallyText, tradeText, type Trade } from '../../engine';
import { PeddlerArt, StrangerArt } from '../art/stranger';

const TIER_GLYPH = { calamity: '✖', harm: '▽', neutral: '◇', boon: '△', triumph: '★' } as const;
import { useEffect, useRef, useState } from 'react';
import { sfx } from '../../audio';
import { useSettings } from '../../settings';
import { useGame } from '../../store';
import { TierFlourish } from '../art/flourish';
import { VerdictSeal } from '../art/verdict';
import { RelicArt } from '../art/relics';
import { Card } from '../components/Card';
import { CodexDetail } from '../components/CodexDetail';
import { Stats } from '../components/Stat';
import { Road } from '../components/Road';

function ResolutionScreenInner() {
  const run = useGame((s) => s.run)!;
  const advance = useGame((s) => s.advance);
  const acceptTrade = useGame((s) => s.acceptTrade);
  const codexOpen = useGame((s) => s.codexOpen);
  const openCodex = useGame((s) => s.openCodex);
  const omenLog = useGame((s) => s.knowledge.omenLog);
  const readingSpeed = useSettings((s) => s.readingSpeed);
  const [revealAll, setRevealAll] = useState(false);
  const hasTrade = run.phase.kind === 'resolved' && !!run.phase.trade;
  const narrationLen = run.phase.kind === 'resolved' ? run.phase.resolution.narration.length : 0;
  useEffect(() => {
    if (!hasTrade) return;
    const t = window.setTimeout(() => sfx.stranger(), 500 + Math.max(0, narrationLen - SLOT_IDS.length) * 400);
    return () => window.clearTimeout(t);
  }, [hasTrade, narrationLen]);
  // The seal's thud lands when the seal does; tapping to reveal all brings it forward.
  const sealTier = run.phase.kind === 'resolved' ? run.phase.resolution.tier : null;
  const sealTerminal = run.phase.kind === 'resolved' && run.node !== null ? currentScene(run).terminal : false;
  const sealPlayed = useRef(false);
  useEffect(() => {
    if (!sealTier || sealPlayed.current) return;
    const paceNow = readingSpeed === 'slow' ? 1.5 : readingSpeed === 'fast' ? 0.45 : 1;
    const delay = revealAll ? 150 : 700 + Math.max(0, narrationLen - SLOT_IDS.length) * Math.round((sealTerminal ? 900 : 550) * paceNow);
    const t = window.setTimeout(() => {
      sealPlayed.current = true;
      sfx.seal(sealTier);
    }, delay);
    return () => window.clearTimeout(t);
  }, [sealTier, sealTerminal, narrationLen, revealAll, readingSpeed]);
  if (run.phase.kind !== 'resolved') return null;
  const { resolution, cursed, offer, found, trade, traded } = run.phase;
  const curse = cursed ? getRelic(cursed) : null;
  const relic = found ? getRelic(found) : null;
  const scene = currentScene(run);
  const last = run.history[run.history.length - 1];
  const lastEntry = last;
  const reckoning = reckon(scene, resolution, run.marks);
  const pace = readingSpeed === 'slow' ? 1.5 : readingSpeed === 'fast' ? 0.45 : 1;
  const step = Math.round((scene.terminal ? 900 : 550) * pace);
  // The four seat lines were read as each card landed, so they arrive together; the reveal is spent on what is new.
  const fresh = Math.max(0, resolution.narration.length - SLOT_IDS.length);
  const at = (i: number) => (i < SLOT_IDS.length ? 100 + i * 80 : 400 + (i - SLOT_IDS.length) * step);
  const tail = 400 + fresh * step;
  // In a rest scene, something you have seen before surfaces as a dream.
  const dream = (() => {
    if (scene.kind !== 'rest' || !omenLog || omenLog.length === 0) return null;
    const own = new Set(SLOT_IDS.map((s) => lastEntry.reading[s].cardId));
    const pool = omenLog.filter((e) => !own.has(e.cardId));
    if (pool.length === 0) return null;
    const e = pool[(run.seed + run.layer * 7) % pool.length];
    const card = getCard(e.cardId);
    return { cardId: e.cardId, reversed: e.reversed, line: e.reversed ? card.omen.reversed : card.omen.upright };
  })();

  return (
    <main className={`screen screen--resolution tier--${resolution.tier} ${scene.terminal ? 'screen--abyss' : ''}`}>
      <header className="topbar">
        <span className="muted small">{scene.place}</span>
        <Stats vitality={run.vitality} clarity={run.clarity} />
      </header>

      <section className="spread spread--final spread--cross">
        <TierFlourish tier={resolution.tier} />
        {SLOT_IDS.map((id, i) => (
          <div className="deal laid" style={{ animationDelay: `${i * 80}ms` }} key={id}>
            <Card cardId={last.reading[id].cardId} reversed={last.reading[id].reversed} size="sm" mark={run.marks[last.reading[id].cardId]} />
            <span className="laid__pulse" style={{ animationDelay: `${at(i)}ms` }} aria-hidden />
          </div>
        ))}
      </section>

      <section className={`narration ${revealAll ? 'narration--all' : ''}`} onClick={() => setRevealAll(true)} aria-live="polite">
        {resolution.narration.map((line, i) => {
          const last = i === resolution.narration.length - 1;
          const seat = i < SLOT_IDS.length ? SLOTS[SLOT_IDS[i]].glyph : null;
          const named = !last && !seat;
          if (named) {
            const id = resolution.comboIds[i - SLOT_IDS.length];
            const score = id ? comboScore(id) : 0;
            const suit = id === 'one-suit' ? getCard(lastEntry.reading.vessel.cardId).suit : undefined;
            const tone = id === 'four-upright' ? 'narration__named--upright' : id === 'four-reversed' ? 'narration__named--reversed' : suit ? `narration__named--${suit}` : score < 0 ? 'narration__named--ill' : '';
            return (
              <p key={i} className={`narration__named rise ${tone}`} style={{ animationDelay: `${at(i)}ms` }}>
                <span className="narration__named-mark" aria-hidden>♪</span>
                <span className="narration__named-text">{line}</span>
                <span className="narration__named-mark" aria-hidden>♪</span>
              </p>
            );
          }
          return (
            <p
              key={i}
              className={`rise ${last ? 'narration__outcome' : 'narration__omen'} ${seat ? 'narration__omen--tap' : ''}`}
              style={{ animationDelay: `${at(i)}ms` }}
              onClick={seat ? () => openCodex(resolution.slots[i].card.id) : undefined}
            >
              {seat && <span className="narration__seat" title={SLOT_POSITION[resolution.slots[i].slot].role}>{SLOT_POSITION[resolution.slots[i].slot].n}</span>}
              {last && <span className="narration__tier">{TIER_GLYPH[resolution.tier]} </span>}
              <span className="narration__line">{line}</span>
              {seat && (() => {
                const r = reckoning[i];
                return (
                  <span className={`reckon reckon--${r.verdict}`}>
                    <span className="reckon__score">{r.score > 0 ? '+' : r.score < 0 ? '−' : ''}{Math.abs(r.score) % 1 === 0 ? Math.abs(r.score) : Math.abs(r.score).toFixed(1)}</span>
                    <span className="reckon__text">{SLOT_POSITION[resolution.slots[i].slot].role}: {reckoningText(r, resolution.slots[i].card.name)}</span>
                  </span>
                );
              })()}
              {last && <span className="tally">{tallyText(resolution)}</span>}
            </p>
          );
        })}
        {resolution.kinship && resolution.kinship.pairs.map(([a, b], i) => (
          <p key={`${a}|${b}`} className="kin rise" style={{ animationDelay: `${tail + i * step}ms` }}>
            <span className="kin__mark" aria-hidden>✶</span> {getCard(a).name} and {getCard(b).name} know each other. <span className="kin__score">+{run.mods.kinBonus ?? KIN_BONUS}</span>
          </p>
        ))}
        {dream && (
          <p className="dream rise" style={{ animationDelay: `${tail - 100}ms` }} onClick={() => openCodex(dream.cardId)}>
            <span className="dream__label muted small">You dream of something you have seen.</span>
            <span className="dream__line">
              <span className="dream__ghost" aria-hidden>
                <Card cardId={dream.cardId} reversed={dream.reversed} size="xs" />
                <span className="dream__wisp" />
              </span>
              <em>{dream.line}</em>
            </span>
          </p>
        )}
        {relic && (
          <p className="found rise" style={{ animationDelay: `${tail}ms` }}>
            <RelicArt id={found!} className="curse__art" /> You keep it: <strong>{relic.name}</strong>. <span className="muted">{relic.text}</span>
          </p>
        )}
        {curse && (
          <p className="curse rise" style={{ animationDelay: `${tail}ms` }}>
            <RelicArt id={cursed!} className="curse__art" /> <strong>{curse.name}</strong> follows you now. <span className="muted">{curse.text}</span>
          </p>
        )}
        {trade && (
          <div className={`trade rise alive ${isPeddlerTrade(trade) ? 'trade--peddler' : 'trade--stranger'}`} style={{ animationDelay: `${tail + 100}ms` }}>
            <span className="trade__socket">{isPeddlerTrade(trade) ? <PeddlerArt className="trade__art" /> : <StrangerArt className="trade__art" />}</span>
            <div className="trade__body">
              <p className="trade__lead">{isPeddlerTrade(trade) ? 'A peddler has laid a cloth on the nearest stall. They have a price.' : 'Someone is already sitting by the fire. They have a trade.'}</p>
              <div className="trade__ledger" aria-hidden>
                <span className="trade__chip trade__chip--give">{tradeChips(trade)[0]}</span>
                <span className="trade__arrow">⟶</span>
                <span className="trade__chip trade__chip--get">{tradeChips(trade)[1]}</span>
              </div>
              <p className="trade__text">
                {tradeText(trade)}
                {trade.id === 'swap-boon' && <span className="muted"> {getRelic(trade.give).name} for {getRelic(trade.get).name}: {getRelic(trade.get).text}</span>}
                {trade.id === 'lift-curse' && <span className="muted"> {getRelic(trade.curse).name} would leave you.</span>}
                {trade.id === 'bless-hand' && <span className="muted"> {getCard(trade.cardId).name} would land upright from now on, and read a little stronger.</span>}
                {trade.id === 'scar-for-boon' && <span className="muted"> {getCard(trade.cardId).name} would land reversed from now on. You would take {getRelic(trade.get).name}: {getRelic(trade.get).text}</span>}
              </p>
              <button type="button" className="btn btn--small" onClick={acceptTrade}>Take it</button>
            </div>
          </div>
        )}
        {traded && <p className="trade__done muted small rise">{scene.id === 'market' ? 'You pay. The cloth is rolled before you have turned away.' : 'You shake on it. They do not look up.'}</p>}
        {scene.terminal && run.well !== undefined && (
          <p className="under rise" style={{ animationDelay: `${tail - 100}ms` }}>
            <span className="under__mark" aria-hidden>⨀</span> There is no surface here. The dark opens again beneath you, and you take one breath before it. <span className="stat--vit">♥ +2</span> From here every reading costs <span className="stat--vit">♥ {(run.well ?? 0) + 1}</span> more, however it goes.
          </p>
        )}
        <p className="deltas rise" style={{ animationDelay: `${tail}ms` }}>
          {resolution.deltas.vitality !== 0 && <span className="stat--vit">♥ {fmt(resolution.deltas.vitality)}</span>}
          {resolution.deltas.clarity !== 0 && <span className="stat--cla">◈ {fmt(resolution.deltas.clarity)}</span>}
        </p>
        <Road scene={scene} entry={lastEntry} marks={run.marks} delay={tail + 100} />
        <div className={`verdict-wrap verdict-wrap--${resolution.tier}`} style={{ animationDelay: revealAll ? '0ms' : `${tail + 300}ms` }} aria-hidden>
          <VerdictSeal tier={resolution.tier} />
        </div>
      </section>

      {codexOpen && <CodexDetail cardId={codexOpen} onClose={() => openCodex(null)} />}
      <footer className="actions">
        <button
          className="btn btn--primary rise"
          style={{ animationDelay: `${tail + 200}ms` }}
          onClick={() => {
            if (scene.terminal && run.well !== undefined) sfx.under();
            advance();
          }}
        >
          {offer ? 'Look closer' : scene.terminal && run.well !== undefined ? 'Go under' : resolution.tier === 'calamity' ? 'Crawl on' : 'Walk on'}
        </button>
      </footer>
    </main>
  );
}

const fmt = (n: number) => (n > 0 ? `+${n}` : `${n}`);

/** What goes and what comes, as two short chips. */
function tradeChips(t: Trade): [string, string] {
  switch (t.id) {
    case 'clarity-for-vitality': return [`◈ ${t.give}`, `♥ ${t.get}`];
    case 'swap-boon': return [getRelic(t.give).name, getRelic(t.get).name];
    case 'lift-curse': return [`♥ ${t.give}`, `rid of ${getRelic(t.curse).name}`];
    case 'bless-hand': return [`◈ ${t.give}`, `${getCard(t.cardId).name}, blessed`];
    case 'vitality-for-clarity': return [`♥ ${t.give}`, `◈ ${t.get}`];
    case 'scar-for-boon': return [`${getCard(t.cardId).name}, scarred`, getRelic(t.get).name];
  }
}

/** Screens can linger for a crossfade after the run ends; render nothing without a run. */
export function ResolutionScreen() {
  const run = useGame((s) => s.run);
  return run ? <ResolutionScreenInner /> : null;
}
