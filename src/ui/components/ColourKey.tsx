import { useState } from 'react';
import { CARDS } from '../../engine';
import { majorMood, minorMood, MOOD_SKY, type Mood } from '../art/palette';

const KEY: { mood: Mood; name: string; gloss: string }[] = [
  { mood: 'joy', name: 'Gold', gloss: 'illumination, success, the lit hour' },
  { mood: 'spirit', name: 'Blue', gloss: 'the inner life, calm water, spirit' },
  { mood: 'grey', name: 'Grey', gloss: 'the liminal, difficulty, wisdom won hard' },
  { mood: 'night', name: 'Black', gloss: 'the unknown, fear, what waits unlit' },
  { mood: 'dawn', name: 'Red', gloss: 'vitality, will, appetite' },
  { mood: 'growth', name: 'Green', gloss: 'growth, the body, slow ripening' },
  { mood: 'dusk', name: 'Violet', gloss: 'the veiled, the royal, the between' },
  { mood: 'storm', name: 'Slate', gloss: 'grief in progress, rain' },
];

/**
 * The sky code, stated: which colour hangs over which kind of moment.
 * A rule of the art, so it is told plainly. Tap a swatch to see which
 * Majors wear it; names only, never a meaning.
 */
export function ColourKey() {
  const [pick, setPick] = useState<number | null>(null);
  const picked = pick !== null ? KEY[pick] : null;
  const wearers = picked
    ? {
        majors: CARDS.filter((c) => c.arcana === 'major' && majorMood(c.number) === picked.mood).map((c) => c.name),
        minors: CARDS.filter((c) => c.arcana === 'minor' && minorMood(c.suit!, c.number) === picked.mood).length,
      }
    : null;
  return (
    <section className="skykey" aria-label="the colour of the sky on each card">
      <div className="muted small">The sky says what kind of moment it is.</div>
      <div className="skykey__row">
        {KEY.map((k, i) => (
          <button key={k.mood} type="button" className={`skykey__swatch ${pick === i ? 'skykey__swatch--pick' : ''}`} onClick={() => setPick(pick === i ? null : i)} aria-label={`${k.name}: ${k.gloss}`}>
            <svg viewBox="0 0 20 28" className="skykey__sky" aria-hidden>
              <rect x={0} y={0} width={20} height={28} rx={2} fill={MOOD_SKY[k.mood]} />
              <path d="M0 22 Q10 19 20 22 V28 H0 Z" fill="rgba(10,8,18,0.55)" />
            </svg>
            <span className="skykey__name">{k.name}</span>
          </button>
        ))}
      </div>
      <p className="muted small center skykey__cap">
        {picked && wearers
          ? `${picked.name} · ${picked.gloss}. ${wearers.majors.length ? `Worn by ${wearers.majors.join(', ')}` : 'No Major wears it'}${wearers.minors ? `, and ${wearers.minors} of the Minors` : ''}.`
          : 'Tap a colour.'}
      </p>
    </section>
  );
}
