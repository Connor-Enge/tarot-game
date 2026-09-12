import { useState } from 'react';
import { placesRead, SCENES, SLOT_IDS, SLOT_POSITION, SLOTS, type Knowledge, type PlaceRead } from '../../engine';
import { useGame } from '../../store';
import { SceneArt } from '../art/scenes';
import { sfx } from '../../audio';
import { Card } from './Card';

const MARK = { calamity: '✖', harm: '▽', neutral: '◇', boon: '△', triumph: '★' } as const;

/**
 * Places: every scene the reader has read at, as a shelf of vignettes.
 * Each opens to what was laid there, seat by seat, and how it went, with
 * a step to the Table. Consequence only; the scene's wants stay its own.
 */
export function Places({ knowledge: k }: { knowledge: Knowledge }) {
  const openTable = useGame((s) => s.openTable);
  const openCodex = useGame((s) => s.openCodex);
  const [pick, setPick] = useState<PlaceRead | null>(null);
  const places = placesRead(k).filter((p) => SCENES[p.scene]);
  if (places.length === 0) return null;
  return (
    <section className="placebook" aria-label="places read">
      <div className="muted small">Places · {places.length} of {Object.keys(SCENES).length}</div>
      <div className="placebook__grid">
        {places.map((p) => {
          const sc = SCENES[p.scene];
          return (
            <button key={p.scene} type="button" className={`placebook__tile tier--${p.best}`} style={{ '--book-hue': sc.hue } as React.CSSProperties} onClick={() => { setPick(p); sfx.page(); }} aria-label={`${sc.place} read ${p.visits} time${p.visits === 1 ? '' : 's'}`}>
              <SceneArt id={p.scene} className="placebook__art" />
              <span className="placebook__name">{sc.place.replace(/\.$/, '')}</span>
              <span className="placebook__meta"><span className="placebook__mark">{MARK[p.best]}</span> ×{p.visits}</span>
            </button>
          );
        })}
      </div>
      {pick && (() => {
        const sc = SCENES[pick.scene];
        const hist = (['triumph', 'boon', 'neutral', 'harm', 'calamity'] as const).filter((t) => pick.tiers[t]).map((t) => `${MARK[t]} ${pick.tiers[t]}`).join(' · ');
        return (
          <div className="sheet" role="dialog" aria-label={sc.place} onClick={() => setPick(null)}>
            <div className="sheet__body" onClick={(ev) => ev.stopPropagation()}>
              <div className="memory__art alive" style={{ '--book-hue': sc.hue } as React.CSSProperties}>
                <SceneArt id={pick.scene} className="scene__art" />
                <span className="memory__where muted small">{sc.place}</span>
              </div>
              <div className="sheet__title">{sc.prompt}</div>
              <p className="muted small center">Read {pick.visits} time{pick.visits === 1 ? '' : 's'} · {hist}</p>
              <div className="placebook__seats">
                {SLOT_IDS.map((sl) => (
                  <div key={sl} className="placebook__seat">
                    <div className="placebook__seathead muted small">
                      <span className="seat__glyph">{SLOTS[sl].glyph}</span> {SLOT_POSITION[sl].n} · {SLOT_POSITION[sl].role}
                    </div>
                    <div className="placebook__cards">
                      {pick.seats[sl].length === 0 && <span className="muted small">—</span>}
                      {pick.seats[sl].slice(-6).reverse().map((c, i) => (
                        <button key={`${c.cardId}-${c.reversed}-${i}`} type="button" className={`placebook__card tier--${c.tier}`} onClick={() => openCodex(c.cardId)} title={`read here, ${c.tier}`}>
                          <Card cardId={c.cardId} reversed={c.reversed} size="xs" />
                          <span className="placebook__cardmark">{MARK[c.tier]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="row">
                <button type="button" className="chip" onClick={() => openTable(pick.scene, {})}>⌗ Lay it on the Table</button>
                <button type="button" className="btn" onClick={() => setPick(null)}>Close</button>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
