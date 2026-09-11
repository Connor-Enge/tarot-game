import { useState } from 'react';
import { DESCENTS, type Knowledge } from '../../engine';
import { CardBack, type BackVariant } from '../art/CardArt';

const BACKS: { variant: BackVariant; name: string; text: string; walked: (k: Knowledge) => boolean }[] = [
  { variant: 'standard', name: 'The Descent', text: 'The plain back. Every reader starts here.', walked: (k) => (k.records?.standard?.runs ?? 0) + (k.records?.short?.runs ?? 0) > 0 },
  ...(['arcana', 'inverted', 'fogbound', 'thin', 'night', 'well', 'chosen'] as const).map((id) => {
    const d = DESCENTS.find((x) => x.id === id)!;
    return { variant: id as BackVariant, name: d.name, text: d.text, walked: (k: Knowledge) => (k.records?.[id]?.runs ?? 0) > 0 };
  }),
  { variant: 'weekly', name: 'The Weekly', text: 'A longer road, shared by everyone this week.', walked: (k) => (k.records?.weekly?.runs ?? 0) > 0 },
];

/**
 * The backs: one for each way down, shown once that road has been walked
 * at least once. Unwalked backs are silhouettes. Tap one for its name.
 */
export function Backs({ knowledge: k }: { knowledge: Knowledge }) {
  const [pick, setPick] = useState<number | null>(null);
  const walked = BACKS.filter((b) => b.walked(k)).length;
  if (walked === 0) return null;
  const picked = pick !== null ? BACKS[pick] : null;
  return (
    <section className="backs" aria-label="card backs of the ways down">
      <div className="backs__row">
        {BACKS.map((b, i) => {
          const on = b.walked(k);
          return (
            <button
              type="button"
              key={b.variant}
              className={`backs__item ${on ? '' : 'backs__item--dim'} ${pick === i ? 'backs__item--pick' : ''}`}
              onClick={() => setPick(pick === i ? null : i)}
              aria-label={on ? b.name : 'a way not yet walked'}
            >
              <CardBack variant={b.variant} className="backs__back" />
            </button>
          );
        })}
      </div>
      <p className="muted small center backs__cap">
        {picked ? (picked.walked(k) ? `${picked.name} · ${picked.text}` : 'A way down you have not walked.') : `${walked} of ${BACKS.length} backs walked`}
      </p>
    </section>
  );
}
