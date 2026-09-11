import { useState } from 'react';
import { RITES, ritesWalked, SCENES, type Knowledge, type Rite } from '../../engine';

const ALL = Object.keys(RITES) as Rite[];

/**
 * The rites shelf: every rule a scene can keep, one glyph each. A rite
 * is learned by walking into its scene and read once; unwalked ones are
 * silhouettes. Tap one for its words and the place that keeps it.
 */
export function Rites({ knowledge: k }: { knowledge: Knowledge }) {
  const [pick, setPick] = useState<Rite | null>(null);
  const walked = ritesWalked(k.omenLog);
  if (walked.length === 0) return null;
  const place = pick ? Object.values(SCENES).find((s) => s.rite === pick) : null;
  return (
    <section className="rites" aria-label="rites walked">
      <div className="rites__row">
        {ALL.map((r) => {
          const on = walked.includes(r);
          return (
            <button
              type="button"
              key={r}
              className={`rites__item ${on ? '' : 'rites__item--dim'} ${pick === r ? 'rites__item--pick' : ''}`}
              onClick={() => setPick(pick === r ? null : r)}
              aria-label={on ? RITES[r].name : 'a rite not yet walked'}
            >
              <span className="rites__glyph" aria-hidden>{RITES[r].glyph}</span>
            </button>
          );
        })}
      </div>
      <p className="muted small center rites__cap">
        {pick ? (walked.includes(pick) ? `${RITES[pick].name} · ${RITES[pick].text}${place ? ` Kept at ${place.place.replace(/\.$/, '').toLowerCase()}.` : ''}` : 'A rite you have not walked into.') : `${walked.length} of ${ALL.length} rites walked`}
      </p>
    </section>
  );
}
