import { useState } from 'react';
import { CARDS, COMBO_IDS, comboNote, getCard, SCENES, SIGILS, SLOT_IDS, SLOTS, type Tier } from '../../engine';

type SuitFilter = 'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
type TierFilter = 'all' | 'seen' | 'known' | 'unseen';
const SUIT_LABEL: Record<SuitFilter, string> = { all: 'All', major: '✦', wands: '⚚', cups: '♆', swords: '⚔', pentacles: '⛤' };
import { useGame } from '../../store';
import { Card } from '../components/Card';
import { CodexDetail } from '../components/CodexDetail';
import { Constellation } from '../components/Constellation';
import { Study } from '../components/Study';

/** Everything the player has earned the right to know. Nothing else. */
export function CodexScreen() {
  const goto = useGame((s) => s.goto);
  const run = useGame((s) => s.run);
  const k = useGame((s) => s.knowledge);
  const open = useGame((s) => s.codexOpen);
  const openCodex = useGame((s) => s.openCodex);
  const knownCount = Object.values(k.cards).filter((c) => c.tier > 0).length;
  const combos = k.combos ?? [];
  const sigils = new Set(k.sigils ?? []);
  const [suit, setSuit] = useState<SuitFilter>('all');
  const [tf, setTf] = useState<TierFilter>('all');
  const [view, setView] = useState<'cards' | 'sky' | 'book' | 'study'>('cards');
  const [q, setQ] = useState('');
  const shown = CARDS.filter((c) => {
    if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (suit === 'major' && c.arcana !== 'major') return false;
    if (suit !== 'all' && suit !== 'major' && c.suit !== suit) return false;
    const e = k.cards[c.id];
    if (tf === 'seen' && !e && !k.dealt?.[c.id]) return false;
    if (tf === 'unseen' && (e || k.dealt?.[c.id])) return false;
    if (tf === 'known' && (e?.tier ?? 0) < 2) return false;
    return true;
  });
  const ledger = buildLedger(k);

  return (
    <main className="screen screen--codex">
      <header className="topbar">
        <button className="btn btn--ghost" onClick={() => goto(run ? 'run' : 'title')}>
          ← Back
        </button>
        <span className="muted small">
          {knownCount} / {CARDS.length}
        </span>
      </header>

      <div className="tabs">
        <button className={`tab ${view === 'cards' ? 'tab--on' : ''}`} onClick={() => setView('cards')}>
          The deck
        </button>
        <button className={`tab ${view === 'sky' ? 'tab--on' : ''}`} onClick={() => setView('sky')}>
          The sky
        </button>
        <button className={`tab ${view === 'book' ? 'tab--on' : ''}`} onClick={() => setView('book')}>
          The book
        </button>
        <button className={`tab ${view === 'study' ? 'tab--on' : ''}`} onClick={() => setView('study')}>
          Study
        </button>
      </div>
      {view === 'study' && <Study />}
      {view === 'sky' && <Constellation knowledge={k} />}
      {view === 'book' && <OmenBook onOpen={openCodex} />}
      {view === 'cards' && (<>
      <div className="progress" aria-hidden>
        <div className="progress__bar" style={{ width: `${(100 * knownCount) / CARDS.length}%` }} />
      </div>
      <div className="legend" aria-label="tiers">
        <span><i className="codex__dot--t1" /> glimpsed</span>
        <span><i className="codex__dot--t2" /> known</span>
        <span><i className="codex__dot--t3" /> mastered</span>
      </div>

      {k.seatsNamed && (
        <section className="codex__seats">
          {Object.values(SLOTS).map((s) => (
            <div key={s.id} className="codex__seat">
              <span className="seat__glyph">{s.glyph}</span> <strong>{s.name}</strong>
              <span className="muted"> — {s.role}</span>
            </div>
          ))}
        </section>
      )}

      {combos.length > 0 && (
        <section className="codex__combos">
          <div className="muted small">Named readings · {combos.length} / {COMBO_IDS.length}</div>
          {combos.map((id) => (
            <div key={id} className="codex__combo">
              <em>{comboNote(id)}</em>
            </div>
          ))}
        </section>
      )}

      <section className="sigils">
        <div className="muted small">Sigils · {sigils.size} / {SIGILS.length}</div>
        <div className="sigils__grid">
          {SIGILS.map((sg) => {
            const has = sigils.has(sg.id);
            return (
              <div key={sg.id} className={`sigil ${has ? 'sigil--on' : ''}`} title={`${sg.name} — ${sg.text}`}>
                <span className="sigil__glyph">{has ? sg.glyph : '·'}</span>
                <span className="sigil__name">{has ? sg.name : '???'}</span>
                <span className="sigil__text">{sg.text}</span>
              </div>
            );
          })}
        </div>
      </section>

      {ledger && (
        <section className="ledger">
          <div className="muted small">Ledger</div>
          {ledger.map(([label, value]) => (
            <div key={label} className="ledger__row">
              <span className="muted">{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </section>
      )}

      <div className="filters">
        <input className="input input--search" placeholder="Find a card" value={q} onChange={(e) => setQ(e.target.value)} aria-label="find a card" />
        <div className="filters__row">
          {(Object.keys(SUIT_LABEL) as SuitFilter[]).map((f) => (
            <button key={f} type="button" className={`chip ${suit === f ? 'chip--on' : ''}`} onClick={() => setSuit(f)}>
              {SUIT_LABEL[f]}
            </button>
          ))}
        </div>
        <div className="filters__row">
          {(['all', 'seen', 'known', 'unseen'] as TierFilter[]).map((f) => (
            <button key={f} type="button" className={`chip ${tf === f ? 'chip--on' : ''}`} onClick={() => setTf(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <section className="codex__grid">
        {shown.length === 0 && <p className="muted small">Nothing here yet.</p>}
        {shown.map((c) => {
          const e = k.cards[c.id];
          const tier: Tier = e?.tier ?? 0;
          const seen = !!e || !!k.dealt?.[c.id];
          return (
            <button key={c.id} type="button" className={`codex__cell codex__cell--t${tier} ${!e && seen ? 'codex__cell--dealt' : ''}`} onClick={() => seen && openCodex(c.id)} disabled={!seen} aria-label={seen ? c.name : 'unread card'}>
              <Card cardId={c.id} size="xs" faceDown={!seen} />
              {tier > 0 && <span className={`codex__dot codex__dot--t${tier}`} />}
            </button>
          );
        })}
      </section>

      </>)}
      {open && <CodexDetail cardId={open} onClose={() => openCodex(null)} />}
    </main>
  );
}

/** Aggregate what the player has done. Consequence, never meaning. */
function buildLedger(k: ReturnType<typeof useGame.getState>['knowledge']): [string, string][] | null {
  const entries = Object.entries(k.cards);
  if (entries.length === 0) return null;
  const rows: [string, string][] = [];
  const mostRead = entries.slice().sort((a, b) => b[1].resolved - a[1].resolved)[0];
  if (mostRead && mostRead[1].resolved > 0) rows.push(['Most read', `${getCard(mostRead[0]).name} · ${mostRead[1].resolved}×`]);
  const rated = entries
    .map(([id, e]) => {
      let good = 0;
      let bad = 0;
      for (const s of SLOT_IDS) {
        good += e.seatOutcomes?.[s]?.good ?? 0;
        bad += e.seatOutcomes?.[s]?.bad ?? 0;
      }
      return { id, n: e.resolved, score: good - bad, good, bad };
    })
    .filter((r) => r.n >= 3);
  if (rated.length) {
    const best = rated.slice().sort((a, b) => b.score - a.score)[0];
    const worst = rated.slice().sort((a, b) => a.score - b.score)[0];
    if (best.score > 0) rows.push(['Kindest', `${getCard(best.id).name} · ${best.good} good`]);
    if (worst.score < 0) rows.push(['Cruelest', `${getCard(worst.id).name} · ${worst.bad} bad`]);
  }
  const fatal = entries.slice().sort((a, b) => (b[1].deathsWith ?? 0) - (a[1].deathsWith ?? 0))[0];
  if (fatal && (fatal[1].deathsWith ?? 0) > 0) rows.push(['On the table at death', `${getCard(fatal[0]).name} · ${fatal[1].deathsWith}×`]);
  const seatTotals = SLOT_IDS.map((s) => [s, entries.reduce((a, [, e]) => a + (e.seats[s] ?? 0), 0)] as const);
  const busiest = seatTotals.slice().sort((a, b) => b[1] - a[1])[0];
  if (busiest && busiest[1] > 0 && k.seatsNamed) rows.push(['Busiest seat', `${SLOTS[busiest[0]].glyph} ${SLOTS[busiest[0]].name}`]);
  return rows.length ? rows : null;
}


const TIER_MARK: Record<string, string> = { calamity: '✖', harm: '▽', neutral: '◇', boon: '△', triumph: '★' };

/** Every omen witnessed, newest descent first. Reading it back is how meaning settles. */
function OmenBook({ onOpen }: { onOpen: (id: string) => void }) {
  const k = useGame((s) => s.knowledge);
  const log = k.omenLog ?? [];
  if (log.length === 0) return <p className="muted small center">Nothing witnessed yet. Every reading writes four lines here.</p>;
  const runs = new Map<number, typeof log>();
  for (const e of log) runs.set(e.run, [...(runs.get(e.run) ?? []), e]);
  const ordered = Array.from(runs.entries()).sort((a, b) => b[0] - a[0]);
  return (
    <section className="book">
      {ordered.map(([run, entries]) => (
        <div key={run} className="book__run">
          <div className="book__head muted small">Descent {run}</div>
          {entries.map((e, i) => {
            const card = getCard(e.cardId);
            const omen = e.reversed ? card.omen.reversed : card.omen.upright;
            const newScene = i === 0 || entries[i - 1].scene !== e.scene;
            return (
              <div key={i}>
                {newScene && <div className="book__scene muted small">{SCENES[e.scene]?.prompt ?? e.scene}</div>}
                <button type="button" className={`book__line tier--${e.tier}`} onClick={() => onOpen(e.cardId)}>
                  <Card cardId={e.cardId} reversed={e.reversed} size="xs" />
                  <span className="book__text">
                    <span className="book__seat">{SLOTS[e.seat].glyph}</span> {omen}
                  </span>
                  <span className="book__tier">{TIER_MARK[e.tier]}</span>
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
}
