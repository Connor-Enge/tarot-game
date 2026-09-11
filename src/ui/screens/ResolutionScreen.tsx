import { currentScene, getCard, getRelic, SLOT_IDS, SLOTS } from '../../engine';

const TIER_GLYPH = { calamity: '✖', harm: '▽', neutral: '◇', boon: '△', triumph: '★' } as const;
import { useState } from 'react';
import { useSettings } from '../../settings';
import { useGame } from '../../store';
import { TierFlourish } from '../art/flourish';
import { RelicArt } from '../art/relics';
import { Card } from '../components/Card';
import { CodexDetail } from '../components/CodexDetail';
import { Stats } from '../components/Stat';

function ResolutionScreenInner() {
  const run = useGame((s) => s.run)!;
  const advance = useGame((s) => s.advance);
  const codexOpen = useGame((s) => s.codexOpen);
  const openCodex = useGame((s) => s.openCodex);
  const omenLog = useGame((s) => s.knowledge.omenLog);
  const readingSpeed = useSettings((s) => s.readingSpeed);
  const [revealAll, setRevealAll] = useState(false);
  if (run.phase.kind !== 'resolved') return null;
  const { resolution, cursed, offer, found } = run.phase;
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
          <div className="deal" style={{ animationDelay: `${i * 80}ms` }} key={id}>
            <Card cardId={last.reading[id].cardId} reversed={last.reading[id].reversed} size="sm" mark={run.marks[last.reading[id].cardId]} />
          </div>
        ))}
      </section>

      <section className={`narration ${revealAll ? 'narration--all' : ''}`} onClick={() => setRevealAll(true)} aria-live="polite">
        {resolution.narration.map((line, i) => {
          const last = i === resolution.narration.length - 1;
          const seat = i < SLOT_IDS.length ? SLOTS[SLOT_IDS[i]].glyph : null;
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
              <Card cardId={dream.cardId} reversed={dream.reversed} size="xs" /> <em>{dream.line}</em>
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
        <p className="deltas rise" style={{ animationDelay: `${400 + resolution.narration.length * step}ms` }}>
          {resolution.deltas.vitality !== 0 && <span className="stat--vit">♥ {fmt(resolution.deltas.vitality)}</span>}
          {resolution.deltas.clarity !== 0 && <span className="stat--cla">◈ {fmt(resolution.deltas.clarity)}</span>}
        </p>
      </section>

      {codexOpen && <CodexDetail cardId={codexOpen} onClose={() => openCodex(null)} />}
      <footer className="actions">
        <button className="btn btn--primary rise" style={{ animationDelay: `${600 + resolution.narration.length * step}ms` }} onClick={advance}>
          {offer ? 'Look closer' : resolution.tier === 'calamity' ? 'Crawl on' : 'Walk on'}
        </button>
      </footer>
    </main>
  );
}

const fmt = (n: number) => (n > 0 ? `+${n}` : `${n}`);

/** Screens can linger for a crossfade after the run ends; render nothing without a run. */
export function ResolutionScreen() {
  const run = useGame((s) => s.run);
  return run ? <ResolutionScreenInner /> : null;
}
