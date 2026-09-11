import { useMemo, useState } from 'react';
import { CARDS, getCard, layTable, nextEmptySeat, reckoningText, SLOT_IDS, SLOT_POSITION, SLOTS, tableCards, tableScenes, THRESHOLDS, type SlotId, type TableLay } from '../../engine';
import { useGame } from '../../store';
import { SceneArt } from '../art/scenes';
import { VerdictSeal } from '../art/verdict';
import { sfx } from '../../audio';
import { Card } from './Card';

type Suit = 'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
const SUITS: [Suit, string][] = [['all', 'All'], ['major', '✦'], ['wands', '⚚'], ['cups', '♆'], ['swords', '⚔'], ['pentacles', '⛤']];
const fmt = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n) % 1 === 0 ? Math.abs(n) : Math.abs(n).toFixed(1)}`;

/**
 * The Table: lay cards you have read into a scene you have read at, and
 * watch the reckoning land seat by seat. Nothing at stake, nothing new
 * shown: the cards, scenes and named readings are all ones already earned.
 */
export function Table() {
  const k = useGame((s) => s.knowledge);
  const openCodex = useGame((s) => s.openCodex);
  const scenes = useMemo(() => tableScenes(k), [k]);
  const pool = useMemo(() => new Set(tableCards(k)), [k]);
  const [sceneId, setSceneId] = useState<string | null>(null);
  const [lay, setLay] = useState<TableLay>({});
  const [picking, setPicking] = useState<SlotId | null>('vessel');
  const [suit, setSuit] = useState<Suit>('all');
  const scene = (sceneId && scenes.find((s) => s.id === sceneId)) || scenes[0] || null;

  if (!scene) {
    return (
      <section className="table">
        <p className="muted small center">The table remembers where you have been. Read at a scene first, and it will be laid here.</p>
      </section>
    );
  }
  if (pool.size === 0) {
    return (
      <section className="table">
        <p className="muted small center">Nothing to lay yet. Glimpse a card in a reading and it will come to the table.</p>
      </section>
    );
  }

  const reading = layTable(scene, lay, k);
  const bySlot = Object.fromEntries(reading.seats.map((s) => [s.slot, s])) as Partial<Record<SlotId, (typeof reading.seats)[number]>>;
  const laid = new Set(SLOT_IDS.map((s) => lay[s]?.cardId).filter(Boolean) as string[]);
  const choices = CARDS.filter((c) => pool.has(c.id) && !laid.has(c.id) && (suit === 'all' || (suit === 'major' ? c.arcana === 'major' : c.suit === suit)));
  const total = reading.full ? reading.full.total : reading.total;
  const tier = reading.full ? reading.full.tier : reading.tier;

  const place = (cardId: string) => {
    const slot = picking ?? nextEmptySeat(lay);
    if (!slot) return;
    const next = { ...lay, [slot]: { cardId, reversed: false } };
    setLay(next);
    setPicking(nextEmptySeat(next));
    sfx.place();
  };
  const turn = (slot: SlotId) => {
    const cur = lay[slot];
    if (!cur) return;
    setLay({ ...lay, [slot]: { ...cur, reversed: !cur.reversed } });
    sfx.page();
  };
  const clear = (slot: SlotId) => {
    const next = { ...lay };
    delete next[slot];
    setLay(next);
    setPicking(slot);
  };
  const sweep = () => { setLay({}); setPicking('vessel'); sfx.page(); };

  return (
    <section className="table">
      <p className="muted small center table__intro">Lay what you have read where you have been. Nothing is risked here, and nothing new is shown.</p>
      <div className="table__scenes" role="tablist" aria-label="a scene you have read at">
        {scenes.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={s.id === scene.id}
            className={`table__scene ${s.id === scene.id ? 'table__scene--on' : ''}`}
            style={{ '--book-hue': s.hue } as React.CSSProperties}
            onClick={() => { setSceneId(s.id); sfx.page(); }}
            aria-label={s.place}
          >
            <SceneArt id={s.id} className="table__scene-art" />
            <span className="table__scene-name">{s.place}</span>
          </button>
        ))}
      </div>
      <p className="table__prompt">{scene.prompt}</p>

      <div className="spread spread--cross table__spread" aria-label="the practice spread">
        {SLOT_IDS.map((id, i) => {
          const cur = lay[id];
          const card = cur ? getCard(cur.cardId) : null;
          const suitClass = card ? `seat--${card.arcana === 'major' ? 'major' : card.suit}` : '';
          const r = bySlot[id];
          return (
            <div key={id} className={`seat seat--${id} ${picking === id ? 'seat--active' : ''} ${cur ? 'seat--filled' : ''} ${suitClass} ${r ? `seat--${r.reckoning.verdict}` : ''}`} style={{ '--seat': i } as React.CSSProperties}>
              <div className="seat__glyph">{SLOTS[id].glyph}</div>
              <div className={`seat__card ${cur ? 'flip-in' : ''}`} key={cur ? `${cur.cardId}-${cur.reversed}` : 'empty'}>
                <Card cardId={cur?.cardId} reversed={cur?.reversed} faceDown={!cur} size="sm" onClick={() => setPicking(id)} />
                {cur && <span className="seat__seal" aria-hidden>{SLOTS[id].glyph}</span>}
              </div>
              <div className="seat__pos" title={SLOT_POSITION[id].gloss}>
                <span className="seat__pos-n">{SLOT_POSITION[id].n}</span> {SLOT_POSITION[id].role}
              </div>
              {r && (
                <span className={`seat__score reckon__score reckon--${r.reckoning.verdict}`} key={`score-${r.card.id}-${cur?.reversed}`}>{fmt(r.score)}</span>
              )}
              {cur && (
                <div className="table__seatbtns">
                  <button type="button" className="chip chip--tiny" onClick={() => turn(id)} aria-label={cur.reversed ? 'set upright' : 'turn reversed'}>{cur.reversed ? '↑ upright' : '⥯ turn'}</button>
                  <button type="button" className="chip chip--tiny" onClick={() => clear(id)} aria-label="take the card back">× take</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {reading.placed > 0 && (
        <div className={`sofar sofar--${tier} table__sofar`}>
          <div className="sofar__meter" role="img" aria-label={`the table so far: ${fmt(total)}, reads as ${tier}`}>
            {(['calamity', 'harm', 'neutral', 'boon', 'triumph'] as const).map((t) => (
              <span key={t} className={`sofar__band sofar__band--${t} ${tier === t ? 'sofar__band--on' : ''}`} />
            ))}
            <span className="sofar__pin" style={{ left: `${Math.max(2, Math.min(98, ((total - (THRESHOLDS.harm - 3)) / ((THRESHOLDS.triumph + 3) - (THRESHOLDS.harm - 3))) * 100))}%` }} aria-hidden />
          </div>
          {reading.seats
            .slice()
            .sort((a, b) => SLOT_POSITION[a.slot].n - SLOT_POSITION[b.slot].n)
            .map((s) => (
              <p key={s.slot} className={`reckon reckon--${s.reckoning.verdict} table__reckon`}>
                <span className="reckon__score">{fmt(s.score)}</span>
                <span className="reckon__text"><span className="seat__pos-n table__posn">{SLOT_POSITION[s.slot].n}</span> {reckoningText(s.reckoning, s.card.name)}</span>
              </p>
            ))}
          {reading.full && (
            <div className="table__tally">
              {reading.full.named.map((n) => (
                <p key={n.id} className={`reckon table__named ${n.score < 0 ? 'reckon--hurt' : 'reckon--helped'}`}>
                  <span className="reckon__score">{fmt(n.score)}</span>
                  <em className="reckon__text">{n.note}</em>
                </p>
              ))}
              {reading.full.unnamed.count > 0 && (
                <p className={`reckon table__named ${reading.full.unnamed.score < 0 ? 'reckon--hurt' : 'reckon--helped'}`}>
                  <span className="reckon__score">{fmt(reading.full.unnamed.score)}</span>
                  <span className="reckon__text muted">Something in the four together you have not yet named{reading.full.unnamed.count > 1 ? `, ${reading.full.unnamed.count} things` : ''}.</span>
                </p>
              )}
              <div className="table__verdict">
                <VerdictSeal tier={tier} className="table__seal" />
                <span className="table__total">{fmt(total)} in all · reads as <strong>{tier}</strong></span>
              </div>
            </div>
          )}
          <button type="button" className="chip" onClick={sweep}>Sweep the table</button>
        </div>
      )}

      {picking && (
        <div className="table__picker">
          <div className="muted small center">
            For <span className="seat__glyph">{SLOTS[picking].glyph}</span> {SLOT_POSITION[picking].n} · {SLOT_POSITION[picking].role} — <em>{SLOT_POSITION[picking].question}</em>
          </div>
          <div className="filters__row">
            {SUITS.map(([f, label]) => (
              <button key={f} type="button" className={`chip ${suit === f ? 'chip--on' : ''}`} onClick={() => setSuit(f)}>{label}</button>
            ))}
          </div>
          <div className="codex__grid table__grid">
            {choices.length === 0 && <p className="muted small">Nothing of this kind is yours to lay.</p>}
            {choices.map((c) => (
              <button key={c.id} type="button" className="codex__cell" onClick={() => place(c.id)} onContextMenu={(e) => { e.preventDefault(); openCodex(c.id); }} aria-label={`lay ${c.name}`}>
                <Card cardId={c.id} size="xs" />
              </button>
            ))}
          </div>
        </div>
      )}
      {!picking && reading.placed === SLOT_IDS.length && <p className="muted small center">Tap a seat to lay another card there.</p>}
    </section>
  );
}
