import { useState } from 'react';
import { getCard, roadNotTaken, roadText, SLOT_IDS, SLOT_POSITION, SLOTS, type HistoryEntry, type Marks, type Scene, type TableLay } from '../../engine';
import { useGame } from '../../store';
import { sfx } from '../../audio';
import { Card } from './Card';

const fmt = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n) % 1 === 0 ? Math.abs(n) : Math.abs(n).toFixed(1)}`;

/**
 * The road not taken: the cards left in the hand at each seat, scored as
 * they would have been. Folded by default; one line says how the hand was
 * played. From here the scene can be laid on the Table to try the rest.
 */
export function Road({ scene, entry, marks, delay = 0 }: { scene: Scene; entry: HistoryEntry; marks: Marks; delay?: number }) {
  const openTable = useGame((s) => s.openTable);
  const openCodex = useGame((s) => s.openCodex);
  const [open, setOpen] = useState(false);
  const road = roadNotTaken(scene, entry, marks);
  if (!road) return null;
  const lay: TableLay = Object.fromEntries(SLOT_IDS.map((s) => [s, { cardId: entry.reading[s].cardId, reversed: entry.reading[s].reversed }])) as TableLay;
  return (
    <div className={`road rise ${open ? 'road--open' : ''} ${road.regret === 0 ? 'road--clean' : ''}`} style={{ animationDelay: `${delay}ms` }}>
      <button type="button" className="road__head" onClick={() => { setOpen((o) => !o); sfx.page(); }} aria-expanded={open}>
        <span className="road__mark" aria-hidden>{road.regret === 0 ? '✦' : '⇢'}</span>
        <span className="road__text">{roadText(road)}</span>
        <span className="road__chev" aria-hidden>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="road__body">
          {road.seats
            .slice()
            .sort((a, b) => SLOT_POSITION[a.slot].n - SLOT_POSITION[b.slot].n)
            .map((s) => (
              <div key={s.slot} className="road__seat">
                <span className="road__pos">
                  <span className="seat__pos-n">{SLOT_POSITION[s.slot].n}</span>
                  <span className="seat__glyph">{SLOTS[s.slot].glyph}</span>
                </span>
                <span className="road__played" title={`${getCard(s.chosen.drawn.cardId).name}, played`}>
                  <Card cardId={s.chosen.drawn.cardId} reversed={s.chosen.drawn.reversed} size="xs" onClick={() => openCodex(s.chosen.drawn.cardId)} />
                  <span className={`road__score ${s.chosen.score > 0 ? 'road__score--up' : s.chosen.score < 0 ? 'road__score--down' : ''}`}>{fmt(s.chosen.score)}</span>
                </span>
                <span className="road__sep" aria-hidden>·</span>
                {s.passed.map((p, j) => (
                  <span key={`${p.drawn.cardId}-${j}`} className={`road__passed ${s.better && p.drawn.cardId === s.better.drawn.cardId ? 'road__passed--better' : ''}`} title={`${getCard(p.drawn.cardId).name}, left in the hand`}>
                    <Card cardId={p.drawn.cardId} reversed={p.drawn.reversed} size="xs" onClick={() => openCodex(p.drawn.cardId)} />
                    <span className={`road__score ${p.delta > 0 ? 'road__score--up' : p.delta < 0 ? 'road__score--down' : ''}`}>{fmt(p.score)}</span>
                  </span>
                ))}
              </div>
            ))}
          <button type="button" className="chip" onClick={() => openTable(scene.id, lay)}>⌗ Lay it on the Table</button>
        </div>
      )}
    </div>
  );
}
