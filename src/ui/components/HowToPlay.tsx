import { useEffect } from 'react';
import { KIND_GLYPH, SLOT_IDS, SLOTS } from '../../engine';
import { CardBack } from '../art/CardArt';

/**
 * The rules, in five short steps. Rules are stated; meanings never are.
 * Reachable from the title, so a new reader can learn how the table works
 * without being told what any card is for.
 */
export function HowToPlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="sheet" role="dialog" aria-label="how it goes" onClick={onClose}>
      <div className="sheet__body howto" onClick={(ev) => ev.stopPropagation()}>
        <div className="sheet__title">How it goes</div>
        <ol className="howto__steps">
          <li className="howto__step">
            <span className="howto__art howto__art--map" aria-hidden>
              <span>{KIND_GLYPH.threat}</span>
              <span>{KIND_GLYPH.passage}</span>
              <span>{KIND_GLYPH.rest}</span>
            </span>
            <span>
              <strong>Choose a door.</strong> Each layer of the map offers two or three. Their marks say what kind of place waits, not what happens there.
            </span>
          </li>
          <li className="howto__step">
            <span className="howto__art howto__art--seats" aria-hidden>
              {SLOT_IDS.map((s) => (
                <span key={s}>{SLOTS[s].glyph}</span>
              ))}
            </span>
            <span>
              <strong>Fill four seats.</strong> Each seat says what it calls for and what it cannot bear. For each, you are dealt three cards. Lift one and place it, or drag it up into the seat. Nobody tells you what a card brings; the Codex remembers what seats have taken it for before, and shows it on the card.
            </span>
          </li>
          <li className="howto__step">
            <span className="howto__art howto__art--cards" aria-hidden>
              <CardBack className="howto__back" />
              <CardBack className="howto__back" />
              <CardBack className="howto__back" />
            </span>
            <span>
              <strong>Spend Clarity ◈ to see more.</strong> Redraw a seat, whisper one thing a card brings here (the Codex keeps it), turn it over, hold it back for the next seat, or hold a lamp over the seat to see what each card in the hand would do there. Pull a card down to redraw.
            </span>
          </li>
          <li>
            <span className="how__glyph" aria-hidden>⧖</span>
            <span>
              <strong>The four seats are a mini cross.</strong> 1 the Situation in the centre, 2 the Challenge above it, 3 the Hidden Insight on the left, 4 the Guidance on the right. They are dealt in that order. When a reading resolves, each seat says what it wanted and what your card brought, and the tally shows how it added up.
            </span>
          </li>
          <li>
            <span className="how__glyph" aria-hidden>⧖</span>
            <span>
              <strong>Some scenes keep a rite.</strong> A rule stated as you arrive: the Mirror reads every card the other way up, the Hush allows no whispers, the Tithe takes a drop at the door.
            </span>
          </li>
          <li>
            <span className="how__glyph" aria-hidden>✶</span>
            <span>
              <strong>Cards keep company.</strong> Two cards read together three times know each other, and from then on both at one table lift the reading. After a scene, the road not taken shows what the cards you passed over would have done, and the Table in the Codex lets you lay any scene again for nothing.
            </span>
          </li>
          <li className="howto__step">
            <span className="howto__art howto__art--tiers" aria-hidden>
              <span className="tier--calamity">✖</span>
              <span className="tier--neutral">◇</span>
              <span className="tier--triumph">★</span>
            </span>
            <span>
              <strong>The reading resolves.</strong> The scene answers with a line for each seat and an outcome. Vitality ♥ rises or falls. At zero, the descent ends.
            </span>
          </li>
          <li className="howto__step">
            <span className="howto__art howto__art--abyss" aria-hidden>
              <span>{KIND_GLYPH.abyss}</span>
            </span>
            <span>
              <strong>Reach the Abyss and read your way back.</strong> Every card you have laid, however it went, is remembered in the Codex. That is how you learn.
            </span>
          </li>
        </ol>
        <button type="button" className="btn btn--primary" onClick={onClose}>
          Understood
        </button>
      </div>
    </div>
  );
}
