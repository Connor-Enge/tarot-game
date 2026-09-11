import { useEffect, useRef } from 'react';
import { reckon, reckoningText, SCENES, SLOT_IDS, SLOT_POSITION, SLOTS, tallyText, type RunState } from '../../engine';
import { SceneArt } from '../art/scenes';
import { Card } from './Card';
import { Road } from './Road';
import { sfx } from '../../audio';

const TIER_MARK = { calamity: '✖', harm: '▽', neutral: '◇', boon: '△', triumph: '★' } as const;

/**
 * One scene remembered: its art, prompt, the four cards laid, and how it
 * went. Pages along the road with the arrows or the keyboard. Shows only what
 * the player already saw at the table; no meanings.
 */
export function MemorySheet({
  run,
  index,
  onClose,
  onStep,
  telling,
}: {
  run: RunState;
  index: number;
  onClose: () => void;
  onStep?: (next: number) => void;
  telling?: boolean;
}) {
  const h = run.history[index];
  const n = run.history.length;
  const step = onStep ? (i: number) => { sfx.page(); onStep(i); } : undefined;
  // A horizontal swipe on the sheet pages along the road.
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (ev: React.PointerEvent) => { swipe.current = { x: ev.clientX, y: ev.clientY }; };
  const onPointerUp = (ev: React.PointerEvent) => {
    const s0 = swipe.current;
    swipe.current = null;
    if (!s0 || !step) return;
    const dx = ev.clientX - s0.x;
    const dy = ev.clientY - s0.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0 && index < n - 1) step(index + 1);
    if (dx > 0 && index > 0) step(index - 1);
  };
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onClose();
      if (!onStep) return;
      if (ev.key === 'ArrowLeft' && index > 0) step?.(index - 1);
      if (ev.key === 'ArrowRight' && index < n - 1) step?.(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, n, onClose, onStep]);
  if (!h) return null;
  const scene = SCENES[h.sceneId];
  const tier = h.resolution.tier;
  return (
    <div className="sheet" role="dialog" aria-label="a scene remembered" onClick={onClose}>
      <div
        className={`sheet__body sheet__body--${tier} ${telling ? 'sheet__body--telling' : ''}`}
        onClick={(ev) => ev.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        key={index}
      >
        <div className="memory__art" style={{ '--book-hue': scene.hue } as React.CSSProperties}>
          <SceneArt id={h.sceneId} className="scene__art" />
          <span className="memory__where muted small">{scene.place}</span>
        </div>
        <div className="sheet__title">
          <span className="muted small">{index + 1} of {n} · </span>
          {scene.prompt}
        </div>
        <div className="journal__cards center-row memory__cards">
          {SLOT_IDS.map((sl, i) => (
            <span key={sl} className="memory__seat" style={{ animationDelay: `${120 + i * 140}ms` }}>
              <Card cardId={h.reading[sl].cardId} reversed={h.reading[sl].reversed} size="xs" />
              <span className="memory__glyph" aria-hidden>{SLOTS[sl].glyph}</span>
            </span>
          ))}
        </div>
        {(() => {
          const rs = reckon(scene, h.resolution, run.marks);
          return (
            <ol className="memory__story">
              {h.resolution.slots
                .map((seat, i) => ({ seat, i }))
                .sort((a, b) => SLOT_POSITION[a.seat.slot].n - SLOT_POSITION[b.seat.slot].n)
                .map(({ seat, i }) => {
                const r = rs[i];
                const sl = seat.slot;
                return (
                  <li key={sl} className={`memory__line reckon--${r.verdict}`} style={{ animationDelay: `${300 + i * 160}ms` }}>
                    <span className="memory__omen">{SLOT_POSITION[sl].n} · {h.resolution.narration[i]}</span>
                    <span className="reckon">
                      <span className="reckon__score">{r.score > 0 ? '+' : r.score < 0 ? '−' : ''}{Math.abs(r.score) % 1 === 0 ? Math.abs(r.score) : Math.abs(r.score).toFixed(1)}</span>
                      <span className="reckon__text">{reckoningText(r, seat.card.name)}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          );
        })()}
        <Road scene={scene} entry={h} marks={run.marks} />
        <p className={`narration__outcome tier--${tier} memory__outcome`}>
          {TIER_MARK[tier]} {h.resolution.narration.at(-1)}
        </p>
        <p className="memory__tally muted small">{tallyText(h.resolution)}</p>
        {h.resolution.comboNotes.length > 0 && (
          <p className="memory__named muted small">{h.resolution.comboNotes.join(' ')}</p>
        )}
        <div className="sheet__nav">
          {onStep ? (
            <button type="button" className="btn btn--small" onClick={() => step?.(index - 1)} disabled={index === 0} aria-label="earlier scene">
              ‹
            </button>
          ) : <span />}
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>
          {onStep ? (
            <button type="button" className="btn btn--small" onClick={() => step?.(index + 1)} disabled={index >= n - 1} aria-label="later scene">
              ›
            </button>
          ) : <span />}
        </div>
      </div>
    </div>
  );
}
