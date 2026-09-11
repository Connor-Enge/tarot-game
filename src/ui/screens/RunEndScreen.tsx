import { useState } from 'react';
import { getCard, getDescent, getRelic, SCENES, SIGILS, SLOT_IDS, SLOTS } from '../../engine';
import { shareText, useGame } from '../../store';
import { Card } from '../components/Card';

const TIER_MARK = { calamity: '✖', harm: '▽', neutral: '◇', boon: '△', triumph: '★' } as const;

/**
 * Death or ascension. This is the ONE place meanings are handed to the player
 * unasked: the four cards on the table when it ended.
 */
export function RunEndScreen() {
  const run = useGame((s) => s.run)!;
  const mode = useGame((s) => s.mode);
  const endRun = useGame((s) => s.endRun);
  const goto = useGame((s) => s.goto);
  const knowledge = useGame((s) => s.knowledge);
  const earned = useGame((s) => s.earned);
  const [tab, setTab] = useState<'reveal' | 'journal'>('reveal');
  const [copied, setCopied] = useState(false);
  if (run.phase.kind !== 'dead' && run.phase.kind !== 'ascended') return null;
  const dead = run.phase.kind === 'dead';
  const last = run.history[run.history.length - 1];

  const share = async () => {
    const text = shareText(run, mode);
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* dismissed */
    }
  };

  return (
    <main className={`screen screen--end ${dead ? 'screen--dead' : 'screen--ascended'}`}>
      <h2>{dead ? 'The reading ended you.' : 'You read it true.'}</h2>
      <p className="narration__outcome">{run.phase.resolution.narration.at(-1)}</p>
      {mode.kind === 'daily' && <p className="muted small center">Daily descent · {mode.label}</p>}
      {earned.length > 0 && (
        <div className="sigil-banner rise" style={{ animationDelay: '900ms' }}>
          {earned.map((id) => {
            const sg = SIGILS.find((x) => x.id === id)!;
            return (
              <div key={id} className="sigil-banner__item">
                <span className="sigil__glyph">{sg.glyph}</span>
                <span>
                  <strong>{sg.name}</strong> <span className="muted">· {sg.text}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="tabs">
        <button className={`tab ${tab === 'reveal' ? 'tab--on' : ''}`} onClick={() => setTab('reveal')}>
          The final spread
        </button>
        <button className={`tab ${tab === 'journal' ? 'tab--on' : ''}`} onClick={() => setTab('journal')}>
          The descent
        </button>
      </div>

      {tab === 'reveal' ? (
        <section className="reveal">
          <p className="muted small">{dead ? 'What killed you, you now understand.' : 'What carried you, you now understand.'}</p>
          {SLOT_IDS.map((id, i) => {
            const d = last.reading[id];
            const card = getCard(d.cardId);
            const tier = knowledge.cards[d.cardId]?.tier ?? 0;
            return (
              <article key={id} className="reveal__row rise" style={{ animationDelay: `${200 + i * 300}ms` }}>
                <Card cardId={d.cardId} reversed={d.reversed} size="sm" mark={run.marks[d.cardId]} />
                <div className="reveal__text">
                  <div className="reveal__seat">
                    {SLOTS[id].glyph} {SLOTS[id].name}
                  </div>
                  <div className="reveal__name">
                    {card.name}
                    {d.reversed && <span className="muted"> · reversed</span>}
                  </div>
                  <p className="reveal__meaning">{d.reversed && tier >= 3 ? card.meaning.reversed : card.meaning.upright}</p>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="journal">
          <div className="summary rise">
            <div className="summary__cell"><span className="summary__n">{run.history.length}</span><span className="muted small">scenes</span></div>
            <div className="summary__cell"><span className="summary__n">{run.history.filter((h) => h.resolution.tier === 'triumph' || h.resolution.tier === 'boon').length}</span><span className="muted small">good</span></div>
            <div className="summary__cell"><span className="summary__n">{run.history.filter((h) => h.resolution.tier === 'harm' || h.resolution.tier === 'calamity').length}</span><span className="muted small">bad</span></div>
            <div className="summary__cell"><span className="summary__n">{Object.values(run.marks).filter((m) => m === 'charged').length}</span><span className="muted small">charged</span></div>
            <div className="summary__cell"><span className="summary__n">{run.relics.length ? run.relics.map((r) => getRelic(r).glyph).join(' ') : '—'}</span><span className="muted small">relics</span></div>
          </div>
          <p className="muted small center">
            {mode.kind === 'daily' ? `Daily ${mode.label}` : getDescent(mode.descent).name} · seed {run.seed.toString(36)}
          </p>
          {run.history.map((h, i) => (
            <article key={i} className={`journal__row tier--${h.resolution.tier} rise`} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="journal__head">
                <span className="journal__n">{i + 1}</span>
                <span className="journal__place">{SCENES[h.sceneId].prompt}</span>
                <span className="journal__tier">{TIER_MARK[h.resolution.tier]}</span>
              </div>
              <div className="journal__cards">
                {SLOT_IDS.map((s) => (
                  <Card key={s} cardId={h.reading[s].cardId} reversed={h.reading[s].reversed} size="xs" />
                ))}
              </div>
              <p className="journal__outcome">{h.resolution.narration.at(-1)}</p>
            </article>
          ))}
        </section>
      )}

      <footer className="actions">
        <button className="btn" onClick={share}>
          {copied ? 'Copied' : 'Share'}
        </button>
        <button className="btn" onClick={() => goto('codex')}>
          Codex
        </button>
        <button className="btn btn--primary" onClick={endRun}>
          Again
        </button>
      </footer>
    </main>
  );
}
