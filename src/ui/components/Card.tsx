import { useRef, useState } from 'react';
import { getCard } from '../../engine';
import { useGame } from '../../store';
import { CardArt, CardBack, type BackVariant } from '../art/CardArt';

interface Props {
  cardId?: string;
  reversed?: boolean;
  faceDown?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  lifted?: boolean;
  dim?: boolean;
  mark?: 'charged' | 'scarred';
  /** A whispered keyword, shown as a ribbon. Never the full meaning. */
  whisper?: string;
  /** Re-runs the enter animation when this changes. */
  animKey?: string | number;
  delay?: number;
  onClick?: () => void;
  /** Press and hold. Used to magnify a card in hand. */
  onLongPress?: () => void;
  /** The last scene's Wake, following you. */
  echo?: boolean;
  /** A Fog-hidden card lets its suit's color through. */
  hiddenSuit?: string;
  /** Drag: called as the card moves (dx, dy from the press) and once more when released. Cancels the long press. */
  onDragMove?: (dx: number, dy: number) => void;
  onDragEnd?: (dx: number, dy: number) => void;
}

/** Card faces show name and art only. Meaning lives in the Codex. */
export function Card({ cardId, reversed = false, faceDown = false, size = 'md', lifted, dim, mark, whisper, animKey, delay = 0, onClick, onLongPress, echo, hiddenSuit, onDragMove, onDragEnd }: Props) {
  const mode = useGame((s) => s.mode);
  const variant: BackVariant = mode.kind === 'weekly' ? 'weekly' : mode.kind === 'free' && mode.descent !== 'standard' && mode.descent !== 'short' ? (mode.descent as BackVariant) : 'standard';
  const timer = useRef<number | null>(null);
  const fired = useRef(false);
  const press = useRef<{ x: number; y: number; id: number } | null>(null);
  const [drag, setDrag] = useState<{ dx: number; dy: number } | null>(null);
  const draggable = !!(onDragMove || onDragEnd);
  const start = (e: React.PointerEvent) => {
    fired.current = false;
    if (draggable) press.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    if (!onLongPress) return;
    timer.current = window.setTimeout(() => {
      fired.current = true;
      onLongPress();
    }, 380);
  };
  const cancel = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };
  const move = (e: React.PointerEvent) => {
    const p = press.current;
    if (!p || p.id !== e.pointerId) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (!drag && Math.hypot(dx, dy) < 8) return;
    if (!drag) {
      cancel();
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    }
    setDrag({ dx, dy });
    onDragMove?.(dx, dy);
  };
  const release = (e: React.PointerEvent) => {
    cancel();
    const p = press.current;
    press.current = null;
    if (!p || !drag) return;
    fired.current = true; // swallow the click that follows a drag
    setDrag(null);
    onDragEnd?.(e.clientX - p.x, e.clientY - p.y);
  };
  const card = cardId ? getCard(cardId) : undefined;
  // The deck ages with you: cards read many times pick up wear.
  const resolved = useGame((s) => (cardId ? s.knowledge.cards[cardId]?.resolved ?? 0 : 0));
  const isSignature = useGame((s) => !!cardId && s.knowledge.signature === cardId);
  const wear = faceDown || !card ? 0 : resolved >= 25 ? 3 : resolved >= 12 ? 2 : resolved >= 5 ? 1 : 0;
  const cls = [
    'card',
    `card--${size}`,
    faceDown && 'card--down',
    reversed && 'card--rev',
    lifted && 'card--lifted',
    dim && 'card--dim',
    mark && `card--${mark}`,
    echo && 'card--echo',
    hiddenSuit && `card--fog-${hiddenSuit}`,
    card && !faceDown && `card--suit-${card.arcana === 'major' ? 'major' : card.suit}`,
    wear > 0 && `card--worn card--worn-${wear}`,
    drag && 'card--dragging',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button
      type="button"
      className={cls}
      onClick={() => {
        if (fired.current) {
          fired.current = false;
          return;
        }
        onClick?.();
      }}
      onPointerDown={start}
      onPointerMove={draggable ? move : undefined}
      onPointerUp={release}
      onPointerLeave={draggable ? undefined : cancel}
      onPointerCancel={release}
      onContextMenu={(e) => onLongPress && e.preventDefault()}
      style={{ animationDelay: `${delay}ms`, ...(drag ? ({ '--dx': `${drag.dx}px`, '--dy': `${drag.dy}px` } as React.CSSProperties) : {}) }}
      key={animKey}
      aria-label={card ? `${card.name}${reversed ? ', reversed' : ''}${echo ? ', echo' : ''}` : 'face-down card'}
      aria-pressed={lifted === undefined ? undefined : !!lifted}
    >
      <div className="card__inner">
        {faceDown || !card ? <CardBack className="card__svg" variant={variant} /> : <CardArt cardId={card.id} className="card__svg" texture={size === 'lg' || size === 'md'} />}
        {mark === 'scarred' && <div className="card__scar" aria-hidden />}
        {wear > 0 && <div className="card__wear" aria-hidden />}
        {isSignature && !faceDown && <span className="card__sig" aria-hidden>✦</span>}
      </div>
      {whisper && <div className="card__whisper">{whisper}</div>}
      {echo && !whisper && <div className="card__whisper card__whisper--echo">echo</div>}
    </button>
  );
}
