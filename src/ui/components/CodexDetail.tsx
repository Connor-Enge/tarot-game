import { useState } from 'react';
import { CARDS, getCard, SCENES, SLOT_IDS, SLOTS, witnessed, type Tier } from '../../engine';
import { SceneArt } from '../art/scenes';
import { useGame } from '../../store';
import { Card } from './Card';

export const TIER_LABEL: Record<Tier, string> = { 0: 'unread', 1: 'glimpsed', 2: 'known', 3: 'mastered' };

/** Bottom sheet: everything the player has earned about one card. */
export function CodexDetail({ cardId, onClose }: { cardId: string; onClose: () => void }) {
  const openCodex = useGame((s) => s.openCodex);
  const setSignature = useGame((s) => s.setSignature);
  const k = useGame((s) => s.knowledge);
  const card = CARDS.find((c) => c.id === cardId)!;
  const e = k.cards[cardId];
  const tier: Tier = e?.tier ?? 0;
  const seatsSeen = SLOT_IDS.filter((s) => (e?.seats[s] ?? 0) > 0);
  const best = (() => {
    if (!e) return null;
    let top: { seat: (typeof SLOT_IDS)[number]; score: number; n: number } | null = null;
    for (const s of SLOT_IDS) {
      const n = e.seats[s] ?? 0;
      const o = e.seatOutcomes?.[s];
      if (n < 2 || !o) continue;
      const score = (o.good - o.bad) / n;
      if (!top || score > top.score) top = { seat: s, score, n };
    }
    return top && top.score > 0 ? top : null;
  })();
  const nothing = !e;
  const [flipped, setFlipped] = useState(false);
  // Where this card has been read: each scene once, with the best it did there.
  const RANK: Record<string, number> = { calamity: 0, harm: 1, neutral: 2, boon: 3, triumph: 4 };
  const MARK: Record<string, string> = { calamity: '✖', harm: '▽', neutral: '◇', boon: '△', triumph: '★' };
  const places = (() => {
    const map = new Map<string, { n: number; best: string }>();
    for (const o of k.omenLog ?? []) {
      if (o.cardId !== cardId || !SCENES[o.scene]) continue;
      const cur = map.get(o.scene);
      if (!cur) map.set(o.scene, { n: 1, best: o.tier });
      else map.set(o.scene, { n: cur.n + 1, best: RANK[o.tier] > RANK[cur.best] ? o.tier : cur.best });
    }
    return Array.from(map.entries()).sort((a, b) => b[1].n - a[1].n).slice(0, 6);
  })();
  const bonds = Object.entries(k.links ?? {})
    .filter(([key]) => key.split('|').includes(cardId))
    .map(([key, n]) => ({ other: key.split('|').find((id) => id !== cardId)!, n }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 4);
  return (
    <div className="sheet" role="dialog" aria-label={card.name} onClick={onClose}>
      <div className="sheet__body" onClick={(ev) => ev.stopPropagation()}>
        <div className={`sheet__card sheet__card--${card.arcana === 'major' ? 'major' : card.suit}`} title="Tap to turn the card">
          <Card cardId={cardId} size="lg" reversed={flipped} onClick={() => setFlipped((f) => !f)} />
        </div>
        <div className="sheet__title">
          {card.name}
        </div>
        <div className={`tierline tierline--${tier}`} aria-label={`${TIER_LABEL[tier]}`}>
          <span className="tierline__rule" aria-hidden />
          <span className="tierline__dots" aria-hidden>
            {[1, 2, 3].map((t) => <i key={t} className={t <= tier ? 'tierline__dot tierline__dot--on' : 'tierline__dot'} />)}
          </span>
          <span className="tierline__label">{TIER_LABEL[tier]}</span>
          <span className="tierline__dots" aria-hidden>
            {[1, 2, 3].map((t) => <i key={t} className={t <= tier ? 'tierline__dot tierline__dot--on' : 'tierline__dot'} />)}
          </span>
          <span className="tierline__rule" aria-hidden />
        </div>
        {nothing && <p className="muted">{k.dealt?.[cardId] ? 'It has passed through your hands. You have not read it.' : 'You have not read this card yet.'}</p>}
        {flipped && tier < 3 && <p className="muted small">Turned. What it means this way, you have not earned.</p>}
        {tier >= 1 && <div className="codex__kw">{card.keywords.upright.join(' · ')}</div>}
        {tier >= 2 && <p className="codex__meaning">{card.meaning.upright}</p>}
        {tier >= 3 && (
          <p className="codex__meaning codex__meaning--rev">
            <em>Reversed:</em> {card.meaning.reversed}
          </p>
        )}
        {tier >= 3 && (
          <button type="button" className={`chip chip--sig ${k.signature === cardId ? 'chip--on' : ''}`} onClick={() => setSignature(k.signature === cardId ? null : cardId)}>
            {k.signature === cardId ? '✦ Your signature · release it' : '✦ Make it your signature'}
          </button>
        )}
        {tier >= 3 && k.signature !== cardId && <p className="muted small center">A signature is dealt, upright, into the first Vessel of every free descent.</p>}
        {(witnessed(k, cardId, false) || witnessed(k, cardId, true)) && (
          <div className="sheet__omens omens">
            <span className="omens__fleuron omens__fleuron--tl" aria-hidden>❧</span>
            <span className="omens__fleuron omens__fleuron--tr" aria-hidden>❧</span>
            <span className="omens__fleuron omens__fleuron--bl" aria-hidden>❧</span>
            <span className="omens__fleuron omens__fleuron--br" aria-hidden>❧</span>
            <div className="omens__head muted small">What you have seen it do</div>
            {witnessed(k, cardId, false) && (
              <p className="omens__line">
                <span className="omens__mark" aria-hidden>↑</span>
                <em>{card.omen.upright}</em>
              </p>
            )}
            {witnessed(k, cardId, true) && (
              <p className="omens__line omens__line--rev">
                <span className="omens__mark" aria-hidden>↓</span>
                <em>{card.omen.reversed}</em>
              </p>
            )}
          </div>
        )}
        {best && (
          <div className="best-seat">
            Sits well in <span className="seat__glyph">{SLOTS[best.seat].glyph}</span>
            {k.seatsNamed ? ` ${SLOTS[best.seat].name}` : ''} <span className="muted small">· {best.n} reads</span>
          </div>
        )}
        {bonds.length > 0 && (
          <div className="bonds">
            <div className="muted small">Read beside</div>
            <div className="bonds__row">
              {bonds.map((b, i) => (
                <button key={b.other} type="button" className={`bond ${i === 0 && b.n > 1 ? 'bond--strong' : ''}`} onClick={() => openCodex(b.other)} aria-label={`${getCard(b.other).name}, read beside this ${b.n} time${b.n === 1 ? '' : 's'}`}>
                  <Card cardId={b.other} size="xs" faceDown={!k.cards[b.other] && !k.dealt?.[b.other]} />
                  <span className="bond__strength" aria-hidden>
                    {Array.from({ length: Math.min(5, b.n) }, (_, j) => <i key={j} />)}
                    {b.n > 5 && <span className="muted small">+</span>}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        {seatsSeen.length > 0 && (
          <div className="seatmap">
            <div className="muted small">Read {e.resolved} time{e.resolved === 1 ? '' : 's'}. How it went, by seat:</div>
            <div className="seatmap__row">
              {SLOT_IDS.map((s) => {
                const n = e.seats[s] ?? 0;
                const o = e.seatOutcomes?.[s] ?? { good: 0, bad: 0 };
                const even = Math.max(0, n - o.good - o.bad);
                return (
                  <div key={s} className={`seatmap__cell ${n === 0 ? 'seatmap__cell--empty' : ''}`} title={k.seatsNamed ? SLOTS[s].name : undefined}>
                    <span className="seat__glyph">{SLOTS[s].glyph}</span>
                    <span className="seatmap__n">{n || '·'}</span>
                    {n > 0 && (
                      <span className="seatmap__bar" aria-hidden>
                        <span className="seatmap__good" style={{ flex: o.good }} />
                        <span className="seatmap__even" style={{ flex: even }} />
                        <span className="seatmap__bad" style={{ flex: o.bad }} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {places.length > 0 && (
          <div className="places">
            <div className="muted small">Where you have read it</div>
            <div className="places__row">
              {places.map(([scene, p]) => (
                <div key={scene} className={`place tier--${p.best}`} title={SCENES[scene].prompt} style={{ '--book-hue': SCENES[scene].hue } as React.CSSProperties}>
                  <SceneArt id={scene} className="place__art" />
                  <span className="place__mark">{MARK[p.best]}{p.n > 1 ? ` ×${p.n}` : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
