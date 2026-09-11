import { useRef } from 'react';
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
}

/** Card faces show name and art only. Meaning lives in the Codex. */
export function Card({ cardId, reversed = false, faceDown = false, size = 'md', lifted, dim, mark, whisper, animKey, delay = 0, onClick, onLongPress, echo, hiddenSuit }: Props) {
  const mode = useGame((s) => s.mode);
  const variant: BackVariant = mode.kind === 'weekly' ? 'weekly' : mode.kind === 'free' && mode.descent !== 'standard' && mode.descent !== 'short' ? (mode.descent as BackVariant) : 'standard';
  const timer = useRef<number | null>(null);
  const fired = useRef(false);
  const start = () => {
    if (!onLongPress) return;
    fired.current = false;
    timer.current = window.setTimeout(() => {
      fired.current = true;
      onLongPress();
    }, 380);
  };
  const cancel = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
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
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => onLongPress && e.preventDefault()}
      style={{ animationDelay: `${delay}ms` }}
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
