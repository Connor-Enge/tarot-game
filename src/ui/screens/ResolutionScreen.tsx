import { currentScene, getRelic, SLOT_IDS, SLOTS } from '../../engine';

const TIER_GLYPH = { calamity: '✖', harm: '▽', neutral: '◇', boon: '△', triumph: '★' } as const;
import { useGame } from '../../store';
import { Card } from '../components/Card';
import { Stats } from '../components/Stat';

export function ResolutionScreen() {
  const run = useGame((s) => s.run)!;
  const advance = useGame((s) => s.advance);
  if (run.phase.kind !== 'resolved') return null;
  const { resolution, cursed, offer } = run.phase;
  const curse = cursed ? getRelic(cursed) : null;
  const scene = currentScene(run);
  const last = run.history[run.history.length - 1];
  const step = scene.terminal ? 900 : 550;

  return (
    <main className={`screen screen--resolution tier--${resolution.tier} ${scene.terminal ? 'screen--abyss' : ''}`}>
      <header className="topbar">
        <span className="muted small">{scene.place}</span>
        <Stats vitality={run.vitality} clarity={run.clarity} />
      </header>

      <section className="spread spread--final">
        {SLOT_IDS.map((id, i) => (
          <div className="deal" style={{ animationDelay: `${i * 80}ms` }} key={id}>
            <Card cardId={last.reading[id].cardId} reversed={last.reading[id].reversed} size="sm" mark={run.marks[last.reading[id].cardId]} />
          </div>
        ))}
      </section>

      <section className="narration">
        {resolution.narration.map((line, i) => {
          const last = i === resolution.narration.length - 1;
          const seat = i < SLOT_IDS.length ? SLOTS[SLOT_IDS[i]].glyph : null;
          return (
            <p key={i} className={`rise ${last ? 'narration__outcome' : 'narration__omen'}`} style={{ animationDelay: `${400 + i * step}ms` }}>
              {seat && <span className="narration__seat">{seat}</span>}
              {last && <span className="narration__tier">{TIER_GLYPH[resolution.tier]} </span>}
              {line}
            </p>
          );
        })}
        {curse && (
          <p className="curse rise" style={{ animationDelay: `${400 + resolution.narration.length * step}ms` }}>
            <span className="curse__glyph">{curse.glyph}</span> <strong>{curse.name}</strong> follows you now. <span className="muted">{curse.text}</span>
          </p>
        )}
        <p className="deltas rise" style={{ animationDelay: `${400 + resolution.narration.length * step}ms` }}>
          {resolution.deltas.vitality !== 0 && <span className="stat--vit">♥ {fmt(resolution.deltas.vitality)}</span>}
          {resolution.deltas.clarity !== 0 && <span className="stat--cla">◈ {fmt(resolution.deltas.clarity)}</span>}
        </p>
      </section>

      <footer className="actions">
        <button className="btn btn--primary rise" style={{ animationDelay: `${600 + resolution.narration.length * step}ms` }} onClick={advance}>
          {offer ? 'Look closer' : resolution.tier === 'calamity' ? 'Crawl on' : 'Walk on'}
        </button>
      </footer>
    </main>
  );
}

const fmt = (n: number) => (n > 0 ? `+${n}` : `${n}`);
