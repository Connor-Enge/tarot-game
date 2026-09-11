import { getRelic } from '../../engine';
import { useGame } from '../../store';

/** After a triumph: take one of two boons. Effects are stated plainly. */
function RelicScreenInner() {
  const run = useGame((s) => s.run)!;
  const chooseRelic = useGame((s) => s.chooseRelic);
  if (run.phase.kind !== 'relic') return null;
  return (
    <main className="screen screen--relic">
      <h2 className="center">Something left behind.</h2>
      <p className="muted center">Take one.</p>
      <section className="relic-offer">
        {run.phase.offer.map((id, i) => {
          const r = getRelic(id);
          return (
            <button key={id} type="button" className="relic rise" style={{ animationDelay: `${200 + i * 200}ms` }} onClick={() => chooseRelic(i)}>
              <span className="relic__glyph">{r.glyph}</span>
              <span className="relic__name">{r.name}</span>
              <span className="relic__text">{r.text}</span>
            </button>
          );
        })}
      </section>
    </main>
  );
}

/** Screens can linger for a crossfade after the run ends; render nothing without a run. */
export function RelicScreen() {
  const run = useGame((s) => s.run);
  return run ? <RelicScreenInner /> : null;
}
