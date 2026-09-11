import { getCard, type Card as CardData } from '../../engine';

interface Props {
  cardId?: string;
  reversed?: boolean;
  faceDown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  lifted?: boolean;
  dim?: boolean;
  onClick?: () => void;
}

/**
 * Placeholder card art: a glyph + roman numeral for majors, suit sigil + rank for minors.
 * Deliberately no meaning text anywhere on the card face.
 */
export function Card({ cardId, reversed = false, faceDown = false, size = 'md', lifted, dim, onClick }: Props) {
  const card = cardId ? getCard(cardId) : undefined;
  const cls = ['card', `card--${size}`, faceDown && 'card--down', reversed && 'card--rev', lifted && 'card--lifted', dim && 'card--dim']
    .filter(Boolean)
    .join(' ');
  return (
    <button type="button" className={cls} onClick={onClick} aria-label={card ? `${card.name}${reversed ? ', reversed' : ''}` : 'face-down card'}>
      {faceDown || !card ? <div className="card__back" /> : <CardFace card={card} />}
    </button>
  );
}

const SUIT_SIGIL: Record<string, string> = { wands: '⚚', cups: '♆', swords: '⚔', pentacles: '⛤' };
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
const RANK = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'P', 'Kn', 'Q', 'K'];

function CardFace({ card }: { card: CardData }) {
  const major = card.arcana === 'major';
  return (
    <div className={`card__face ${major ? 'card__face--major' : `card__face--${card.suit}`}`}>
      <div className="card__corner">{major ? ROMAN[card.number] : RANK[card.number]}</div>
      <div className="card__art" aria-hidden>
        {major ? MAJOR_GLYPH[card.number] : SUIT_SIGIL[card.suit!]}
      </div>
      <div className="card__name">{card.name}</div>
    </div>
  );
}

const MAJOR_GLYPH = ['✦', '∴', '☽', '❀', '♜', '⚶', '☍', '⛨', '∞', '🜍', '⟳', '⚖', '⥯', '⚰', '⚗', '⛧', '⚡', '✧', '☾', '☉', '♪', '◎'];
