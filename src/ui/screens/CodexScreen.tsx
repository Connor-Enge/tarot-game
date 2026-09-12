import { Fragment, useState } from 'react';
import { bestSeat, bondedPairs, CARDS, CHOSEN_MIN, chosenDeck, COMBO_IDS, KIN_BONUS, comboNote, comboScore, getDescent, SLOT_POSITION, getCard, getVow, KIND_GLYPH, SCENES, SIGILS, SLOT_IDS, SLOTS, type Tier } from '../../engine';
import { SceneArt } from '../art/scenes';
import { SigilToken } from '../art/sigil';

type SuitFilter = 'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
type TierFilter = 'all' | 'seen' | 'known' | 'unseen';
const SUIT_LABEL: Record<SuitFilter, string> = { all: 'All', major: '✦', wands: '⚚', cups: '♆', swords: '⚔', pentacles: '⛤' };
import { useGame } from '../../store';
import { Card } from '../components/Card';
import { CodexDetail } from '../components/CodexDetail';
import { Constellation } from '../components/Constellation';
import { Almanac } from '../components/Almanac';
import { WeekRoad } from '../components/WeekRoad';
import { Backs } from '../components/Backs';
import { ColourKey } from '../components/ColourKey';
import { Rites } from '../components/Rites';
import { Study } from '../components/Study';
import { Table } from '../components/Table';

/** Everything the player has earned the right to know. Nothing else. */
export function CodexScreen() {
  const goto = useGame((s) => s.goto);
  const run = useGame((s) => s.run);
  const k = useGame((s) => s.knowledge);
  const open = useGame((s) => s.codexOpen);
  const openCodex = useGame((s) => s.openCodex);
  const knownCount = Object.values(k.cards).filter((c) => c.tier > 0).length;
  const combos = (k.combos ?? []).filter((id) => comboNote(id));
  const sigils = new Set(k.sigils ?? []);
  const [suit, setSuit] = useState<SuitFilter>('all');
  const [tf, setTf] = useState<TierFilter>('all');
  const [view, setView] = useState<'cards' | 'sky' | 'book' | 'study' | 'table'>(useGame.getState().tableSeed ? 'table' : 'cards');
  const [q, setQ] = useState('');
  const [building, setBuilding] = useState(false);
  const toggleChosen = useGame((s) => s.toggleChosen);
  const chosenSet = new Set(chosenDeck(k));
  const [sort, setSort] = useState<'deck' | 'read' | 'seen'>('deck');
  const lastSeen = new Map<string, number>();
  (k.omenLog ?? []).forEach((e, i) => lastSeen.set(e.cardId, i));
  const shownUnsorted = CARDS.filter((c) => {
    if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (suit === 'major' && c.arcana !== 'major') return false;
    if (suit !== 'all' && suit !== 'major' && c.suit !== suit) return false;
    const e = k.cards[c.id];
    if (tf === 'seen' && !e && !k.dealt?.[c.id]) return false;
    if (tf === 'unseen' && (e || k.dealt?.[c.id])) return false;
    if (tf === 'known' && (e?.tier ?? 0) < 2) return false;
    return true;
  });
  const shown =
    sort === 'deck'
      ? shownUnsorted
      : sort === 'read'
        ? shownUnsorted.slice().sort((a, b) => (k.cards[b.id]?.resolved ?? 0) - (k.cards[a.id]?.resolved ?? 0))
        : shownUnsorted.slice().sort((a, b) => (lastSeen.get(b.id) ?? -1) - (lastSeen.get(a.id) ?? -1));
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
        <button className={`tab ${view === 'table' ? 'tab--on' : ''}`} onClick={() => setView('table')}>
          Table
        </button>
      </div>
      {view === 'study' && <Study />}
      {view === 'table' && <Table />}
      {view === 'sky' && (
        <Constellation
          knowledge={k}
          live={run ? Array.from(new Set(run.history.flatMap((h) => SLOT_IDS.map((sl) => h.reading[sl].cardId)))) : []}
        />
      )}
      {view === 'book' && (<>
        <WeekRoad knowledge={k} />
        <Almanac knowledge={k} />
        <OmenBook onOpen={openCodex} />
      </>)}
      {view === 'cards' && (<>
      <div className="suits" aria-label="known cards by suit">
        {([['major', 'Majors'], ['wands', 'Wands'], ['cups', 'Cups'], ['swords', 'Swords'], ['pentacles', 'Pentacles']] as const).map(([suit, label]) => {
          const all = CARDS.filter((c) => (suit === 'major' ? c.arcana === 'major' : c.suit === suit));
          const known = all.filter((c) => (k.cards[c.id]?.tier ?? 0) > 0).length;
          const mastered = all.filter((c) => (k.cards[c.id]?.tier ?? 0) >= 3).length;
          return (
            <div key={suit} className={`suits__row suits__row--${suit}`}>
              <span className="suits__label">{label}</span>
              <div className="progress">
                <div className="progress__bar" style={{ width: `${(100 * known) / all.length}%` }} />
                <div className="progress__bar progress__bar--deep" style={{ width: `${(100 * mastered) / all.length}%` }} />
              </div>
              <span className="suits__count">{known}/{all.length}</span>
            </div>
          );
        })}
      </div>
      <Backs knowledge={k} />
      <Rites knowledge={k} />
      <ColourKey />
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
          <div className="codex__pips" aria-hidden>
            {COMBO_IDS.map((id) => <i key={id} className={combos.includes(id) ? 'codex__pip codex__pip--on' : 'codex__pip'} />)}
          </div>
          {combos.map((id, i) => (
            <div key={id} className={`codex__combo ${comboScore(id) < 0 ? 'codex__combo--ill' : ''}`} style={{ '--i': i } as React.CSSProperties}>
              <SigilToken id={`combo-${id}`} glyph="♪" earned className="codex__combo-token" />
              <span className="codex__combo-n muted small">{i + 1}</span>
              <em>{comboNote(id)}</em>
              <span className={`codex__combo-score ${comboScore(id) < 0 ? 'codex__combo-score--ill' : ''}`}>{comboScore(id) > 0 ? '+' : comboScore(id) < 0 ? '−' : ''}{Math.abs(comboScore(id)) % 1 === 0 ? Math.abs(comboScore(id)) : Math.abs(comboScore(id)).toFixed(1)}</span>
            </div>
          ))}
        </section>
      )}

      <section className="sigils">
        <div className="muted small">Sigils · {sigils.size} / {SIGILS.length}</div>
        <div className="progress progress--sigils" aria-hidden>
          <div className="progress__bar" style={{ width: `${(sigils.size / SIGILS.length) * 100}%` }} />
        </div>
        <div className="sigils__grid">
          {SIGILS.map((sg, i) => {
            const has = sigils.has(sg.id);
            return (
              <div key={sg.id} className={`sigil ${has ? 'sigil--on' : ''}`} title={`${sg.name} — ${sg.text}`} style={{ '--i': i } as React.CSSProperties}>
                <SigilToken id={sg.id} glyph={sg.glyph} earned={has} className="sigil__token" />
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

      {getDescent('chosen').unlocked(k) && (
        <div className={`chosen ${building ? 'chosen--on' : ''}`}>
          <button type="button" className={`chip ${building ? 'chip--on' : ''}`} onClick={() => setBuilding((b) => !b)}>
            ✎ {building ? 'Done choosing' : 'Choose your deck'}
          </button>
          <span className="muted small">
            {chosenDeck(k).length} chosen · {chosenDeck(k).length >= CHOSEN_MIN ? 'ready for The Chosen' : `${CHOSEN_MIN - chosenDeck(k).length} more to descend`}
          </span>
        </div>
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
          {([['deck', 'deck order'], ['read', 'most read'], ['seen', 'newest']] as const).map(([v, label]) => (
            <button key={v} type="button" className={`chip ${sort === v ? 'chip--on' : ''}`} onClick={() => setSort(v)}>
              {label}
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
        {(() => {
          const cell = (c: (typeof shown)[number]) => {
            const e = k.cards[c.id];
            const tier: Tier = e?.tier ?? 0;
            const seen = !!e || !!k.dealt?.[c.id];
            const inDeck = chosenSet.has(c.id);
            const pickable = building && tier >= 1;
            return (
              <button
                key={c.id}
                type="button"
                className={`codex__cell codex__cell--t${tier} ${!e && seen ? 'codex__cell--dealt' : ''} ${building ? (inDeck ? 'codex__cell--chosen' : pickable ? 'codex__cell--pickable' : 'codex__cell--unpickable') : ''}`}
                onClick={() => (pickable ? toggleChosen(c.id) : seen && !building && openCodex(c.id))}
                disabled={building ? !pickable : !seen}
                aria-label={building ? `${c.name}${inDeck ? ', in your deck' : ''}` : seen ? c.name : 'unread card'}
              >
                <Card cardId={c.id} size="xs" faceDown={!seen} />
                {tier > 0 && !building && <span className={`codex__dot codex__dot--t${tier}`} />}
                {!building && (() => {
                  const b = bestSeat(e);
                  return b ? <span className="codex__best" title={`sits best as ${SLOT_POSITION[b.seat].n} · ${SLOT_POSITION[b.seat].role}`}>{SLOT_POSITION[b.seat].n}</span> : null;
                })()}
                {building && inDeck && <span className="codex__pick" aria-hidden>✓</span>}
              </button>
            );
          };
          // In deck order with no filter, the grid reads as a catalogue: five groups, each under a ruled header.
          if (sort !== 'deck' || suit !== 'all' || q) return shown.map(cell);
          const GROUPS: { key: string; name: string; glyph: string; of: (c: (typeof shown)[number]) => boolean }[] = [
            { key: 'major', name: 'Major Arcana', glyph: '✦', of: (c) => c.arcana === 'major' },
            { key: 'wands', name: 'Wands', glyph: '⚚', of: (c) => c.suit === 'wands' },
            { key: 'cups', name: 'Cups', glyph: '♆', of: (c) => c.suit === 'cups' },
            { key: 'swords', name: 'Swords', glyph: '⚔', of: (c) => c.suit === 'swords' },
            { key: 'pentacles', name: 'Pentacles', glyph: '⛤', of: (c) => c.suit === 'pentacles' },
          ];
          return GROUPS.map((g) => {
            const cards = shown.filter(g.of);
            if (cards.length === 0) return null;
            const read = cards.filter((c) => k.cards[c.id]).length;
            return (
              <Fragment key={g.key}>
                <div className={`codex__group codex__group--${g.key}`} role="heading" aria-level={3}>
                  <span className="codex__group-glyph" aria-hidden>{g.glyph}</span>
                  <span>{g.name}</span>
                  <span className="codex__group-count">{read} / {cards.length}</span>
                  {read === cards.length && <span className="codex__group-seal" title="read through">✦ read through</span>}
                </div>
                {cards.map(cell)}
              </Fragment>
            );
          });
        })()}
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
  // The longest run of good readings in a row, counted along the omen log.
  const streak = (() => {
    let best = 0;
    let cur = 0;
    let lastKey = '';
    for (const o of k.omenLog ?? []) {
      const key = `${o.run}:${o.scene}`;
      if (key === lastKey) continue;
      lastKey = key;
      if (o.tier === 'boon' || o.tier === 'triumph') {
        cur++;
        best = Math.max(best, cur);
      } else cur = 0;
    }
    return best;
  })();
  if (streak >= 2) rows.push(['Longest run of luck', `${streak} good readings in a row`]);
  if (k.hand && k.hand.seats >= 8) {
    const pct = Math.round((100 * k.hand.best) / k.hand.seats);
    rows.push(['The hand', `best card ${pct}% of seats · ${k.hand.clean} scene${k.hand.clean === 1 ? '' : 's'} played clean`]);
  }
  const kin = bondedPairs(k);
  if (kin.length) rows.push(['Kin', `${kin.length} pair${kin.length === 1 ? '' : 's'} know each other · +${KIN_BONUS} when both sit`]);
  const vows = Object.entries(k.vows ?? {});
  if (vows.length) {
    const kept = vows.reduce((a, [, v]) => a + v.kept, 0);
    const broken = vows.reduce((a, [, v]) => a + v.broken, 0);
    const truest = vows.filter(([, v]) => v.kept > 0).sort((a, b) => b[1].kept - a[1].kept)[0];
    rows.push(['Vows', `${kept} kept · ${broken} broken${truest ? ` · truest ${getVow(truest[0]).name}` : ''}`]);
  }
  const well = k.records?.well;
  if (well && well.runs > 0) {
    const abysses = (well.best?.road?.match(/◉/g) ?? []).length;
    rows.push(['The Well', `${well.bestDepth} scenes down · ${abysses} ${abysses === 1 ? 'Abyss' : 'Abysses'} passed · ${well.runs} descent${well.runs === 1 ? '' : 's'}`]);
  }
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
      {ordered.map(([run, entries]) => {
        const road = entries.filter((e, i) => i === 0 || entries[i - 1].scene !== e.scene).map((e) => KIND_GLYPH[SCENES[e.scene]?.kind ?? 'mystery']).join('');
        return (
        <div key={run} className="book__run">
          <div className="book__head muted small">
            Descent {run} <span className="book__road">{road}</span>
          </div>
          {entries.map((e, i) => {
            const card = getCard(e.cardId);
            const omen = e.reversed ? card.omen.reversed : card.omen.upright;
            const newScene = i === 0 || entries[i - 1].scene !== e.scene;
            const scene = SCENES[e.scene];
            return (
              <div key={i}>
                {newScene && (
                  <div className="book__scene muted small" style={scene ? ({ '--book-hue': scene.hue } as React.CSSProperties) : undefined}>
                    {scene && <SceneArt id={e.scene} className="book__art" />}
                    <span>{scene?.prompt ?? e.scene}</span>
                  </div>
                )}
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
        );
      })}
    </section>
  );
}
