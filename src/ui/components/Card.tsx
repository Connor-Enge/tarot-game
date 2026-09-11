import { getCard } from '../../engine';
import { CardArt, CardBack } from '../art/CardArt';

interface Props {
  cardId?: string;
  reversed?: boolean;
  faceDown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  lifted?: boolean;
  dim?: boolean;
  mark?: 'charged' | 'scarred';
  /** A whispered keyword, shown as a ribbon. Never the full meaning. */
  whisper?: string;
  /** Re-runs the enter animation when this changes. */
  animKey?: string | number;
  delay?: number;
  onClick?: () => void;
}

/** Card faces show name and art only. Meaning lives in the Codex. */
export function Card({ cardId, reversed = false, faceDown = false, size = 'md', lifted, dim, mark, whisper, animKey, delay = 0, onClick }: Props) {
  const card = cardId ? getCard(cardId) : undefined;
  const cls = [
    'card',
    `card--${size}`,
    faceDown && 'card--down',
    reversed && 'card--rev',
    lifted && 'card--lifted',
    dim && 'card--dim',
    mark && `card--${mark}`,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button
      type="button"
      className={cls}
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      key={animKey}
      aria-label={card ? `${card.name}${reversed ? ', reversed' : ''}` : 'face-down card'}
    >
      <div className="card__inner">
        {faceDown || !card ? <CardBack className="card__svg" /> : <CardArt cardId={card.id} className="card__svg" />}
        {mark === 'scarred' && <div className="card__scar" aria-hidden />}
      </div>
      {whisper && <div className="card__whisper">{whisper}</div>}
    </button>
  );
}
