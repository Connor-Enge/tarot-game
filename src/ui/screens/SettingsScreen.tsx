import { useState } from 'react';
import { DESCENTS, exportKnowledge, importKnowledge, parseShare } from '../../engine';
import { useSettings } from '../../settings';
import { useGame } from '../../store';

export function SettingsScreen() {
  const goto = useGame((s) => s.goto);
  const run = useGame((s) => s.run);
  const resetCodex = useGame((s) => s.resetCodex);
  const resetRecordsOnly = useGame((s) => s.resetRecordsOnly);
  const [confirmRoad, setConfirmRoad] = useState(false);
  const importCodex = useGame((s) => s.importCodex);
  const knowledge = useGame((s) => s.knowledge);
  const [pasted, setPasted] = useState('');
  const [note, setNote] = useState<string | null>(null);
  const newRun = useGame((s) => s.newRun);
  const { sound, reduceMotion, haptics, fixedTint, bigCards, readingSpeed, hideSeatNames, set } = useSettings();
  const [confirmReset, setConfirmReset] = useState(false);
  const [seed, setSeed] = useState('');

  return (
    <main className="screen screen--settings">
      <header className="topbar">
        <button className="btn btn--ghost" onClick={() => goto(run ? 'run' : 'title')}>
          ← Back
        </button>
      </header>

      <section className="settings">
        <label className="toggle">
          <span>Sound</span>
          <input type="checkbox" checked={sound} onChange={(e) => set({ sound: e.target.checked })} />
          <span className="toggle__track" />
        </label>
        <label className="toggle">
          <span>Reduce motion</span>
          <input type="checkbox" checked={reduceMotion} onChange={(e) => set({ reduceMotion: e.target.checked })} />
          <span className="toggle__track" />
        </label>
        <label className="toggle">
          <span>Haptics</span>
          <input type="checkbox" checked={haptics} onChange={(e) => set({ haptics: e.target.checked })} />
          <span className="toggle__track" />
        </label>
        <div className="field">
          <span>Reading pace</span>
          <div className="seg">
            {(['slow', 'normal', 'fast'] as const).map((v) => (
              <button key={v} type="button" className={`seg__btn ${readingSpeed === v ? 'seg__btn--on' : ''}`} onClick={() => set({ readingSpeed: v })}>
                {v}
              </button>
            ))}
          </div>
          <p className="muted small">How quickly the omens appear. Tap the narration to show it all at once.</p>
        </div>
        <label className="toggle">
          <span>Larger cards in hand</span>
          <input type="checkbox" checked={bigCards} onChange={(e) => set({ bigCards: e.target.checked })} />
          <span className="toggle__track" />
        </label>
        <label className="toggle">
          <span>Glyphs only, no seat names</span>
          <input type="checkbox" checked={hideSeatNames} onChange={(e) => set({ hideSeatNames: e.target.checked })} />
          <span className="toggle__track" />
        </label>
        <label className="toggle">
          <span>One color, no scene tint</span>
          <input type="checkbox" checked={fixedTint} onChange={(e) => set({ fixedTint: e.target.checked })} />
          <span className="toggle__track" />
        </label>

        <div className="field">
          <span>Descend with a seed</span>
          <div className="row">
            <input className="input" placeholder="a seed, or a pasted share" value={seed} onChange={(e) => setSeed(e.target.value)} inputMode="text" autoCapitalize="off" />
            <button
              className="btn"
              disabled={!parseShare(seed, DESCENTS)}
              onClick={() => {
                const parsed = parseShare(seed, DESCENTS);
                if (parsed) newRun(parsed.seed, { descent: parsed.descent, depth: parsed.depth });
              }}
            >
              Go
            </button>
          </div>
          <p className="muted small">Paste a whole share text and you will walk the same road, on the same descent and depth. The same seed deals the same map and the same cards.</p>
        </div>

        <div className="field">
          <span>Carry the Codex</span>
          <div className="row">
            <button
              className="btn"
              onClick={async () => {
                const text = exportKnowledge(knowledge);
                try {
                  if (navigator.share) await navigator.share({ text });
                  else await navigator.clipboard.writeText(text);
                  setNote('Copied. Paste it on another device.');
                } catch {
                  setNote('Could not copy.');
                }
              }}
            >
              Copy
            </button>
            <button
              className="btn"
              disabled={!pasted.trim()}
              onClick={() => {
                const k = importKnowledge(pasted);
                if (!k) {
                  setNote('That is not a Codex.');
                  return;
                }
                importCodex(k);
                setPasted('');
                setNote(`Brought over: ${Object.keys(k.cards).length} cards, ${k.runs} descents.`);
              }}
            >
              Bring over
            </button>
          </div>
          <textarea className="input input--area" placeholder="Paste a copied Codex here" value={pasted} onChange={(e) => setPasted(e.target.value)} rows={2} />
          {note && <p className="muted small">{note}</p>}
        </div>

        <div className="muted small">
          {(() => {
            try {
              let bytes = 0;
              for (const key of ['arcana-descent.knowledge.v1', 'arcana-descent.run.v1', 'arcana-descent.settings.v1']) bytes += (localStorage.getItem(key) ?? '').length;
              return `On this device: ${(bytes / 1024).toFixed(1)} KB of Codex, run and settings.`;
            } catch {
              return 'Storage is unavailable on this device; nothing will be remembered.';
            }
          })()}
        </div>

        <details className="about">
          <summary>About</summary>
          <p>
            <strong>Arcana Descent.</strong> Four seats, three cards each. No one will tell you what they mean.
          </p>
          <p className="muted small">
            Meaning is earned, never explained. The reading is the action. Death teaches. Knowledge is the only progression.
          </p>
          <p className="muted small">
            Every card face, card back and scene is drawn in code. Every sound is synthesized. Nothing is downloaded but the game itself.
          </p>
        </details>

        <div className="field field--danger">
          <span className="danger__label">Danger</span>
          {!confirmRoad ? (
            <button className="btn" onClick={() => setConfirmRoad(true)}>
              Forget the road, keep the cards
            </button>
          ) : (
            <div className="row">
              <button className="btn" onClick={() => setConfirmRoad(false)}>
                Keep
              </button>
              <button
                className="btn btn--danger"
                onClick={() => {
                  resetRecordsOnly();
                  setConfirmRoad(false);
                }}
              >
                Forget the road
              </button>
            </div>
          )}
          <p className="muted small">Descents, deaths, returns, records, sigils and Study go back to zero. Everything you know about the cards stays.</p>
          {!confirmReset ? (
            <button className="btn" onClick={() => setConfirmReset(true)}>
              Forget everything
            </button>
          ) : (
            <div className="row">
              <button className="btn" onClick={() => setConfirmReset(false)}>
                Keep
              </button>
              <button
                className="btn btn--danger"
                onClick={() => {
                  resetCodex();
                  setConfirmReset(false);
                }}
              >
                Forget
              </button>
            </div>
          )}
          <p className="muted small">Wipes the Codex. Every card goes back to unread. The only progression in this game is what you know.</p>
        </div>
      </section>
    </main>
  );
}
