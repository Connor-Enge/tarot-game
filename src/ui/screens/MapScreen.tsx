import { actOfLayer, currentAct, KIND_GLYPH, visitedNodes } from '../../engine';
import { useGame } from '../../store';
import { Stats } from '../components/Stat';

/**
 * The descent, drawn top-down: you start at the top and the Abyss is at the
 * bottom. Nodes show only their kind glyph. Every node in a layer connects to
 * every node in the next.
 */
export function MapScreen() {
  const run = useGame((s) => s.run)!;
  const chooseNode = useGame((s) => s.chooseNode);
  const visited = visitedNodes(run);
  const visitedIds = new Set(visited.map((n) => n.id));
  const act = currentAct(run);

  return (
    <main className="screen screen--map">
      <header className="topbar">
        <span className="muted small">Act {toRoman(act)}</span>
        <Stats vitality={run.vitality} clarity={run.clarity} />
      </header>

      <p className="scene__prompt center">{run.layer === 0 ? 'Choose where the descent begins.' : 'Choose the way down.'}</p>

      <section className="map" aria-label="the descent">
        {run.map.map((layer, li) => {
          const isCurrent = li === run.layer;
          const isPast = li < run.layer;
          const actStart = li > 0 && actOfLayer(li) !== actOfLayer(li - 1);
          return (
            <div key={li} className={`map__layer ${isCurrent ? 'map__layer--current' : ''} ${isPast ? 'map__layer--past' : ''} ${actStart ? 'map__layer--act' : ''}`}>
              {layer.map((node, ni) => {
                const wasHere = visitedIds.has(node.id);
                return (
                  <button
                    key={node.id}
                    type="button"
                    className={`node node--${node.kind} ${wasHere ? 'node--visited' : ''} ${isCurrent ? 'node--choosable' : ''}`}
                    disabled={!isCurrent}
                    onClick={() => chooseNode(ni)}
                    aria-label={`${node.kind} node`}
                  >
                    <span className="node__glyph">{KIND_GLYPH[node.kind]}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </section>
    </main>
  );
}

function toRoman(n: number): string {
  return ['', 'I', 'II', 'III', 'IV'][n] ?? String(n);
}
