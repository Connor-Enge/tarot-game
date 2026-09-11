import { useLayoutEffect, useRef, useState } from 'react';
import { actOfLayer, canCut, currentAct, KIND_GLYPH, visitedNodes } from '../../engine';

const ACT_NAMES = ['', 'The Shallows', 'The Deep', 'The Abyss'];
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
  const cutDeck = useGame((s) => s.cutDeck);
  const [cutAt, setCutAt] = useState<number | null>(null);
  const cuttable = canCut(run);
  const visited = visitedNodes(run);
  const visitedIds = new Set(visited.map((n) => n.id));
  const act = currentAct(run);
  const mapRef = useRef<HTMLElement>(null);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; kind: 'done' | 'open' }[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const center = (id: string) => {
        const n = el.querySelector<HTMLElement>(`[data-node="${id}"]`);
        if (!n) return null;
        const r = n.getBoundingClientRect();
        return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
      };
      const out: typeof lines = [];
      for (let i = 1; i < visited.length; i++) {
        const a = center(visited[i - 1].id);
        const b = center(visited[i].id);
        if (a && b) out.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, kind: 'done' });
      }
      const from = visited.length ? center(visited[visited.length - 1].id) : null;
      if (from) {
        for (const n of run.map[run.layer] ?? []) {
          const b = center(n.id);
          if (b) out.push({ x1: from.x, y1: from.y, x2: b.x, y2: b.y, kind: 'open' });
        }
      }
      setLines(out);
      setSize({ w: box.width, h: box.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [run.layer, run.history.length]);

  return (
    <main className="screen screen--map">
      <header className="topbar">
        <span className="muted small">Act {toRoman(act)}</span>
        <Stats vitality={run.vitality} clarity={run.clarity} />
      </header>

      {cuttable ? (
        <section className="cut" aria-label="cut the deck">
          <p className="scene__prompt center">Cut the deck.</p>
          <div
            className="cut__strip"
            role="slider"
            aria-valuemin={1}
            aria-valuemax={run.deck.draw.length - 1}
            aria-valuenow={cutAt ?? Math.floor(run.deck.draw.length / 2)}
            onPointerDown={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const frac = Math.min(0.98, Math.max(0.02, (e.clientX - r.left) / r.width));
              setCutAt(Math.round(frac * (run.deck.draw.length - 2)) + 1);
            }}
            onPointerMove={(e) => {
              if (e.buttons === 0) return;
              const r = e.currentTarget.getBoundingClientRect();
              const frac = Math.min(0.98, Math.max(0.02, (e.clientX - r.left) / r.width));
              setCutAt(Math.round(frac * (run.deck.draw.length - 2)) + 1);
            }}
          >
            {Array.from({ length: 26 }, (_, i) => (
              <span key={i} className="cut__edge" style={{ '--i': i } as React.CSSProperties} />
            ))}
            {cutAt !== null && <span className="cut__marker" style={{ left: `${((cutAt - 1) / (run.deck.draw.length - 2)) * 100}%` }} />}
          </div>
          <div className="row">
            <button className="btn" onClick={() => setCutAt(null)} disabled={cutAt === null}>
              Leave it
            </button>
            <button className="btn btn--primary" disabled={cutAt === null} onClick={() => cutAt !== null && cutDeck(cutAt)}>
              Cut {cutAt !== null ? `· ${cutAt}` : ''}
            </button>
          </div>
          <p className="muted small center">or choose where the descent begins</p>
        </section>
      ) : (
        <p className="scene__prompt center">{run.layer === 0 ? 'Choose where the descent begins.' : 'Choose the way down.'}</p>
      )}

      <section className="map" aria-label="the descent" ref={mapRef}>
        <svg className="map__lines" width={size.w} height={size.h} aria-hidden>
          {lines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} className={`map__line map__line--${l.kind}`} />
          ))}
        </svg>
        {run.map.map((layer, li) => {
          const isCurrent = li === run.layer;
          const isPast = li < run.layer;
          const actStart = li > 0 && actOfLayer(li) !== actOfLayer(li - 1);
          return (
            <div key={li} className={`map__layer ${isCurrent ? 'map__layer--current' : ''} ${isPast ? 'map__layer--past' : ''} ${actStart ? 'map__layer--act' : ''}`}>
              {(li === 0 || actStart) && <div className="map__act">{ACT_NAMES[actOfLayer(li)]}</div>}
              {layer.map((node, ni) => {
                const wasHere = visitedIds.has(node.id);
                return (
                  <button
                    key={node.id}
                    type="button"
                    data-node={node.id}
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
