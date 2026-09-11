import { useState } from 'react';
import { getRelic } from '../../engine';

/** Small glyph row of held relics. Tap to read. */
export function RelicStrip({ relics }: { relics: string[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (relics.length === 0) return null;
  const shown = open ? getRelic(open) : null;
  return (
    <div className="relic-strip">
      <div className="relic-strip__row">
        {relics.map((id) => {
          const r = getRelic(id);
          return (
            <button key={id} type="button" className={`relic-chip relic-chip--${r.kind} ${open === id ? 'relic-chip--on' : ''}`} onClick={() => setOpen(open === id ? null : id)} aria-label={r.name}>
              {r.glyph}
            </button>
          );
        })}
      </div>
      {shown && (
        <div className="relic-strip__text rise">
          <strong>{shown.name}</strong> <span className="muted">— {shown.text}</span>
        </div>
      )}
    </div>
  );
}
