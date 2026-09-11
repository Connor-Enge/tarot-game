import { useEffect } from 'react';
import { SCENES, SLOT_IDS, SLOTS, type RunState } from '../../engine';
import { SceneArt } from '../art/scenes';
import { Card } from './Card';

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
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onClose();
      if (!onStep) return;
      if (ev.key === 'ArrowLeft' && index > 0) onStep(index - 1);
      if (ev.key === 'ArrowRight' && index < n - 1) onStep(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, n, onClose, onStep]);
  if (!h) return null;
  const scene = SCENES[h.sceneId];
  const tier = h.resolution.tier;
  return (
    <div className="sheet" role="dialog" aria-label="a scene remembered" onClick={onClose}>
      <div className={`sheet__body sheet__body--${tier} ${telling ? 'sheet__body--telling' : ''}`} onClick={(ev) => ev.stopPropagation()} key={index}>
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
        <p className={`narration__outcome tier--${tier} memory__outcome`}>
          {TIER_MARK[tier]} {h.resolution.narration.at(-1)}
        </p>
        {h.resolution.comboNotes.length > 0 && (
          <p className="memory__named muted small">{h.resolution.comboNotes.join(' ')}</p>
        )}
        <div className="sheet__nav">
          {onStep ? (
            <button type="button" className="btn btn--small" onClick={() => onStep(index - 1)} disabled={index === 0} aria-label="earlier scene">
              ‹
            </button>
          ) : <span />}
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>
          {onStep ? (
            <button type="button" className="btn btn--small" onClick={() => onStep(index + 1)} disabled={index >= n - 1} aria-label="later scene">
              ›
            </button>
          ) : <span />}
        </div>
      </div>
    </div>
  );
}
