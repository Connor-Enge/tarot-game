import { currentScene, SLOT_IDS } from '../../engine';
import { useGame } from '../../store';
import { Card } from '../components/Card';
import { Stats } from '../components/Stat';

export function ResolutionScreen() {
  const run = useGame((s) => s.run)!;
  const advance = useGame((s) => s.advance);
  if (run.phase.kind !== 'resolved') return null;
  const { resolution } = run.phase;
  const scene = currentScene(run);
  const last = run.history[run.history.length - 1];

  return (
    <main className={`screen screen--resolution tier--${resolution.tier}`}>
      <header className="topbar">
        <span className="muted small">{scene.place}</span>
        <Stats vitality={run.vitality} clarity={run.clarity} />
      </header>

      <section className="spread spread--final">
        {SLOT_IDS.map((id) => (
          <Card key={id} cardId={last.reading[id].cardId} reversed={last.reading[id].reversed} size="sm" />
        ))}
      </section>

      <section className="narration">
        {resolution.narration.map((line, i) => (
          <p key={i} className={i === resolution.narration.length - 1 ? 'narration__outcome' : 'narration__omen'}>
            {line}
          </p>
        ))}
        <p className="deltas">
          {resolution.deltas.vitality !== 0 && <span className="stat--vit">♥ {fmt(resolution.deltas.vitality)}</span>}
          {resolution.deltas.clarity !== 0 && <span className="stat--cla">◈ {fmt(resolution.deltas.clarity)}</span>}
        </p>
      </section>

      <footer className="actions">
        <button className="btn btn--primary" onClick={advance}>
          Walk on
        </button>
      </footer>
    </main>
  );
}

const fmt = (n: number) => (n > 0 ? `+${n}` : `${n}`);
