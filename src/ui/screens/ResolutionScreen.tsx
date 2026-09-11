import { currentScene, getCard, getRelic, isPeddlerTrade, SLOT_IDS, SLOTS, tradeText, type Trade } from '../../engine';
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
    const t = window.setTimeout(() => sfx.stranger(), 500 + narrationLen * 400);
    return () => window.clearTimeout(t);
  }, [hasTrade, narrationLen]);
  // The seal's thud lands when the seal does; tapping to reveal all brings it forward.
  const sealTier = run.phase.kind === 'resolved' ? run.phase.resolution.tier : null;
  const sealTerminal = run.phase.kind === 'resolved' && run.node !== null ? currentScene(run).terminal : false;
  const sealPlayed = useRef(false);
  useEffect(() => {
    if (!sealTier || sealPlayed.current) return;
    const paceNow = readingSpeed === 'slow' ? 1.5 : readingSpeed === 'fast' ? 0.45 : 1;
    const delay = revealAll ? 150 : 700 + narrationLen * Math.round((sealTerminal ? 900 : 550) * paceNow);
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
  const pace = readingSpeed === 'slow' ? 1.5 : readingSpeed === 'fast' ? 0.45 : 1;
  const step = Math.round((scene.terminal ? 900 : 550) * pace);
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

      <section className="spread spread--final">
        <TierFlourish tier={resolution.tier} />
        {SLOT_IDS.map((id, i) => (
          <div className="deal laid" style={{ animationDelay: `${i * 80}ms` }} key={id}>
            <Card cardId={last.reading[id].cardId} reversed={last.reading[id].reversed} size="sm" mark={run.marks[last.reading[id].cardId]} />
            <span className="laid__pulse" style={{ animationDelay: `${400 + i * step}ms` }} aria-hidden />
          </div>
        ))}
      </section>

      <section className={`narration ${revealAll ? 'narration--all' : ''}`} onClick={() => setRevealAll(true)} aria-live="polite">
        {resolution.narration.map((line, i) => {
          const last = i === resolution.narration.length - 1;
          const seat = i < SLOT_IDS.length ? SLOTS[SLOT_IDS[i]].glyph : null;
          const named = !last && !seat;
          if (named) {
            return (
              <p key={i} className="narration__named rise" style={{ animationDelay: `${400 + i * step}ms` }}>
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
              style={{ animationDelay: `${400 + i * step}ms` }}
              onClick={seat ? () => openCodex(lastEntry.reading[SLOT_IDS[i]].cardId) : undefined}
            >
              {seat && <span className="narration__seat">{seat}</span>}
              {last && <span className="narration__tier">{TIER_GLYPH[resolution.tier]} </span>}
              {line}
            </p>
          );
        })}
        {dream && (
          <p className="dream rise" style={{ animationDelay: `${300 + resolution.narration.length * step}ms` }} onClick={() => openCodex(dream.cardId)}>
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
          <p className="found rise" style={{ animationDelay: `${400 + resolution.narration.length * step}ms` }}>
            <RelicArt id={found!} className="curse__art" /> You keep it: <strong>{relic.name}</strong>. <span className="muted">{relic.text}</span>
          </p>
        )}
        {curse && (
          <p className="curse rise" style={{ animationDelay: `${400 + resolution.narration.length * step}ms` }}>
            <RelicArt id={cursed!} className="curse__art" /> <strong>{curse.name}</strong> follows you now. <span className="muted">{curse.text}</span>
          </p>
        )}
        {trade && (
          <div className={`trade rise ${isPeddlerTrade(trade) ? 'trade--peddler' : 'trade--stranger'}`} style={{ animationDelay: `${500 + resolution.narration.length * step}ms` }}>
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
          <p className="under rise" style={{ animationDelay: `${300 + resolution.narration.length * step}ms` }}>
            <span className="under__mark" aria-hidden>⨀</span> There is no surface here. The dark opens again beneath you, and you take one breath before it. <span className="stat--vit">♥ +2</span> From here every reading costs <span className="stat--vit">♥ {(run.well ?? 0) + 1}</span> more, however it goes.
          </p>
        )}
        <p className="deltas rise" style={{ animationDelay: `${400 + resolution.narration.length * step}ms` }}>
          {resolution.deltas.vitality !== 0 && <span className="stat--vit">♥ {fmt(resolution.deltas.vitality)}</span>}
          {resolution.deltas.clarity !== 0 && <span className="stat--cla">◈ {fmt(resolution.deltas.clarity)}</span>}
        </p>
        <div className={`verdict-wrap verdict-wrap--${resolution.tier}`} style={{ animationDelay: revealAll ? '0ms' : `${700 + resolution.narration.length * step}ms` }} aria-hidden>
          <VerdictSeal tier={resolution.tier} />
        </div>
      </section>

      {codexOpen && <CodexDetail cardId={codexOpen} onClose={() => openCodex(null)} />}
      <footer className="actions">
        <button
          className="btn btn--primary rise"
          style={{ animationDelay: `${600 + resolution.narration.length * step}ms` }}
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
