import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { actOfLayer, canCut, canTakeVow, currentAct, cycleLength, foretellCost, getVow, KIND_GLYPH, RITES, ritesWalked, SCENES, visitedNodes, vowOffer, wellTurn } from '../../engine';
import { ActBanner, ActMark } from '../art/banners';
import { RoadStrip } from '../art/road';
import { VowArt } from '../art/relics';
import { MemorySheet } from '../components/Memory';
import { HowToPlay } from '../components/HowToPlay';

const TIER_MARK = { calamity: '✖', harm: '▽', neutral: '◇', boon: '△', triumph: '★' } as const;

const ACT_NAMES = ['', 'The Shallows', 'The Deep', 'The Abyss'];
import { sfx } from '../../audio';
import { useGame } from '../../store';
import { Stats } from '../components/Stat';

/**
 * The descent, drawn top-down: you start at the top and the Abyss is at the
 * bottom. Nodes show only their kind glyph. Every node in a layer connects to
 * every node in the next.
 */
function MapScreenInner() {
  const run = useGame((s) => s.run)!;
  const chooseNode = useGame((s) => s.chooseNode);
  const cutDeck = useGame((s) => s.cutDeck);
  const takeVow = useGame((s) => s.takeVow);
  const vowRecord = useGame((s) => s.knowledge.vows);
  const omenLog = useGame((s) => s.knowledge.omenLog);
  const ritesKnown = ritesWalked(omenLog);
  const [cutAt, setCutAtRaw] = useState<number | null>(null);
  const setCutAt = (v: number | null) => {
    setCutAtRaw((prev) => {
      if (v !== null && prev !== null && v !== prev) sfx.cutTick();
      return v;
    });
  };
  const [peek, setPeek] = useState<number | null>(null); // history index
  const [howTo, setHowTo] = useState(false);
  const foretell = useGame((s) => s.foretell);
  const [foretelling, setForetelling] = useState(false);
  const canForetell = run.clarity >= foretellCost(run);
  const firstDescent = useGame((s) => s.firstDescent);
  // The first descent shows only the map: no cut, no vows. Those come once the shape of a run is known.
  const cuttable = canCut(run) && !firstDescent;
  const visited = visitedNodes(run);
  const visitedIds = new Set(visited.map((n) => n.id));
  const act = currentAct(run);
  const mapRef = useRef<HTMLElement>(null);
  const inWell = run.well !== undefined;
  const cycle = cycleLength(run);
  const cycleLayer = inWell ? run.layer % cycle : run.layer;
  const turn = wellTurn(run);
  // A banner when a new act opens under you: the first map of act two or later, before choosing.
  // In the Well, also when a deeper map opens after an Abyss.
  const actStart = run.actLayers.slice(0, act - 1).reduce((a, b) => a + b, 0);
  const newWell = inWell && turn > 1 && cycleLayer === 0 && run.node === null;
  // Also when a run opens, once the player has seen a descent through.
  const newRun = !firstDescent && run.layer === 0 && run.node === null && run.history.length === 0;
  const newAct = (act > 1 && cycleLayer === actStart && run.node === null) || newWell || newRun;
  const bannerName = newWell ? `The Well · ${toRoman(turn)}` : ACT_NAMES[act] ?? `Act ${act}`;
  const [banner, setBanner] = useState<number | null>(newAct ? act : null);
  // Keys: 1-3 choose a door (or foretell it while foretelling), arrows move between doors.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.getAttribute('role') === 'slider')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const st = useGame.getState();
      const r = st.run;
      if (!r || r.phase.kind !== 'map') return;
      const doors = Array.from(document.querySelectorAll<HTMLButtonElement>('.node--choosable'));
      if (!doors.length) return;
      if (/^[1-3]$/.test(e.key)) {
        const i = Number(e.key) - 1;
        if (i < doors.length) {
          doors[i].click();
          e.preventDefault();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const cur = doors.findIndex((d) => d === document.activeElement);
        const next = cur < 0 ? 0 : (cur + (e.key === 'ArrowRight' ? 1 : doors.length - 1)) % doors.length;
        doors[next].focus();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    if (!newAct) return;
    setBanner(act);
    sfx.banner();
    const t = window.setTimeout(() => setBanner(null), 2600);
    return () => window.clearTimeout(t);
  }, [newAct, act]);
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
      {banner !== null && (
        <div className="act-banner" role="status" onClick={() => setBanner(null)}>
          <div className="act-banner__plate">
            <ActBanner act={banner} name={bannerName} />
            {run.history.length > 0 && (
              <div className="act-banner__road">
                <RoadStrip run={run} />
                <span className="muted small">the road so far</span>
              </div>
            )}
          </div>
        </div>
      )}
      <header className="topbar">
        <span className="muted small">{inWell ? `Well ${toRoman(turn)} · ` : ''}Act {toRoman(act)}</span>
        <Stats vitality={run.vitality} clarity={run.clarity} />
      </header>

      {cuttable ? (
        <section className="cut" aria-label="cut the deck">
          <p className="scene__prompt center">Cut the deck.</p>
          <div
            className="cut__strip"
            role="slider"
            aria-label="where to cut the deck"
            tabIndex={0}
            onKeyDown={(e) => {
              const max = run.deck.draw.length - 1;
              const cur = cutAt ?? Math.floor(run.deck.draw.length / 2);
              if (e.key === 'ArrowLeft') setCutAt(Math.max(1, cur - 1));
              if (e.key === 'ArrowRight') setCutAt(Math.min(max, cur + 1));
            }}
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
            {Array.from({ length: 26 }, (_, i) => {
              const frac = cutAt !== null ? (cutAt - 1) / (run.deck.draw.length - 2) : null;
              const lifted = frac !== null && i / 26 < frac;
              return <span key={i} className={`cut__edge ${lifted ? 'cut__edge--lifted' : ''}`} style={{ '--i': i } as React.CSSProperties} />;
            })}
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
        <div className="map__prompt">
          {firstDescent && run.layer === 0 && run.node === null && (
            <p className="welcome muted small center rise">
              Your first descent. The marks say what kind of place waits, not what happens there.
              <button type="button" className="chip chip--inline" onClick={() => setHowTo(true)}>how it goes</button>
            </p>
          )}
          <p className="scene__prompt center">{foretelling ? 'Which door?' : run.layer === 0 ? 'Choose where the descent begins.' : 'Choose the way down.'}</p>
          <button className={`btn btn--small ${foretelling ? 'btn--on' : ''}`} disabled={!canForetell && !foretelling} onClick={() => setForetelling((f) => !f)} title="Learn what waits behind one door">
            {foretelling ? 'Never mind' : foretellCost(run) === 0 ? 'Foretell · free' : `Foretell ◈${foretellCost(run)}`}
          </button>
        </div>
      )}

      {canTakeVow(run) && !firstDescent && (
        <section className="vows" aria-label="take a vow">
          <p className="muted small center">Or swear something first. Keep it to the Abyss and it pays.</p>
          <div className="vows__row">
            {vowOffer(run.seed).map((id) => {
              const v = getVow(id);
              return (
                <button key={id} type="button" className="vow" onClick={() => takeVow(id)}>
                  <span className="vow__glyph"><VowArt id={id} className="vow__art" /></span>
                  <span className="vow__name">{v.name}</span>
                  {vowRecord?.[id] && (vowRecord[id].kept > 0 || vowRecord[id].broken > 0) && (
                    <span className="vow__record muted small">kept {vowRecord[id].kept} · broken {vowRecord[id].broken}</span>
                  )}
                  <span className="vow__text">{v.text}</span>
                  <span className="vow__reward">{[v.reward.vitality && `♥ +${v.reward.vitality}`, v.reward.clarity && `◈ +${v.reward.clarity}`].filter(Boolean).join(' · ')} at the Abyss</span>
                </button>
              );
            })}
          </div>
        </section>
      )}
      {run.vow && (
        <p className={`vow-line center small ${run.vow.broken ? 'vow-line--broken' : run.vow.kept ? 'vow-line--kept' : ''}`}>
          <VowArt id={run.vow.id} className="vow-line__art" /> {getVow(run.vow.id).name} · {run.vow.kept ? 'kept' : run.vow.broken ? 'broken' : getVow(run.vow.id).text}
        </p>
      )}

      <section className="map" aria-label="the descent" ref={mapRef}>
        <svg className="map__lines" width={size.w} height={size.h} aria-hidden>
          {lines.map((l, i) => {
            if (l.kind === 'open') return <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} className="map__line map__line--open" />;
            // The walked road bends a little, like a path worn by feet rather than drawn by a rule.
            const mx = (l.x1 + l.x2) / 2;
            const my = (l.y1 + l.y2) / 2;
            const dx = l.x2 - l.x1;
            const dy = l.y2 - l.y1;
            const len = Math.hypot(dx, dy) || 1;
            const bend = ((i % 3) - 1) * Math.min(14, len * 0.18) + ((run.seed + i) % 5) - 2;
            const cx = mx + (-dy / len) * bend;
            const cy = my + (dx / len) * bend;
            const d = `M${l.x1} ${l.y1} Q${cx} ${cy} ${l.x2} ${l.y2}`;
            return (
              <g key={i}>
                <path d={d} className="map__line map__line--done" />
                <path d={d} className="map__line map__line--steps" />
              </g>
            );
          })}
        </svg>
        {run.map.map((layer, li) => {
          const isCurrent = li === run.layer;
          const isPast = li < run.layer;
          const cl = inWell ? li % cycle : li;
          const actHere = actOfLayer(cl, run.actLayers);
          const actStart = li > 0 && (cl === 0 || actHere !== actOfLayer(cl - 1, run.actLayers));
          const label = inWell && cl === 0 ? `The Well · ${toRoman(Math.floor(li / cycle) + 1)}` : ACT_NAMES[actHere] ?? `Act ${actHere}`;
          return (
            <div key={li} className={`map__layer ${isCurrent ? 'map__layer--current' : ''} ${isPast ? 'map__layer--past' : ''} ${actStart ? 'map__layer--act' : ''}`}>
              {(li === 0 || actStart) && (
                <div className="map__act">
                  <ActMark act={actHere} well={inWell && cl === 0} className="map__act-mark" />
                  <span>{label}</span>
                  <ActMark act={actHere} well={inWell && cl === 0} className="map__act-mark map__act-mark--end" />
                </div>
              )}
              {layer.map((node, ni) => {
                const wasHere = visitedIds.has(node.id);
                const historyIndex = wasHere ? visited.findIndex((v) => v.id === node.id) : -1;
                const tierHere = historyIndex >= 0 ? run.history[historyIndex]?.resolution.tier : undefined;
                const passed = isPast && !wasHere;
                return (
                  <button
                    key={node.id}
                    type="button"
                    data-node={node.id}
                    className={`node node--${node.kind} node--stakes-${SCENES[node.sceneId].stakes} ${wasHere ? 'node--visited' : ''} ${isCurrent ? 'node--choosable' : ''} ${passed ? 'node--passed' : ''}`}
                    disabled={!isCurrent && !wasHere}
                    onClick={() => {
                      if (isCurrent && foretelling) {
                        foretell(ni);
                        setForetelling(false);
                      } else if (isCurrent) chooseNode(ni);
                      else setPeek(historyIndex);
                    }}
                    aria-label={wasHere ? `remember scene ${historyIndex + 1}` : `${node.kind} node`}
                  >
                    <span className="node__glyph">{KIND_GLYPH[node.kind]}</span>
                    {tierHere && <span className={`node__tier node__tier--${tierHere}`} aria-hidden>{TIER_MARK[tierHere]}</span>}
                    {run.foretold.includes(node.id) && <span className="node__place">{SCENES[node.sceneId].place}</span>}
                    {(() => {
                      const rite = SCENES[node.sceneId].rite;
                      const known = rite && !wasHere && (ritesKnown.includes(rite) || run.foretold.includes(node.id));
                      return known ? <span className={`node__rite node__rite--${rite}`} title={RITES[rite].name} aria-label={`keeps ${RITES[rite].name}`}>{RITES[rite].glyph}</span> : null;
                    })()}
                  </button>
                );
              })}
            </div>
          );
        })}
      </section>

      {howTo && <HowToPlay onClose={() => setHowTo(false)} />}
      {peek !== null && run.history[peek] && (
        <MemorySheet run={run} index={peek} onClose={() => setPeek(null)} onStep={(i) => setPeek(Math.max(0, Math.min(run.history.length - 1, i)))} />
      )}
    </main>
  );
}

function toRoman(n: number): string {
  return ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n] ?? String(n);
}

/** Screens can linger for a crossfade after the run ends; render nothing without a run. */
export function MapScreen() {
  const run = useGame((s) => s.run);
  return run ? <MapScreenInner /> : null;
}
