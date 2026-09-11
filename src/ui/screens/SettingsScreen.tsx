import { useState } from 'react';
import { useSettings } from '../../settings';
import { useGame } from '../../store';

export function SettingsScreen() {
  const goto = useGame((s) => s.goto);
  const run = useGame((s) => s.run);
  const resetCodex = useGame((s) => s.resetCodex);
  const newRun = useGame((s) => s.newRun);
  const { sound, reduceMotion, haptics, fixedTint, bigCards, set } = useSettings();
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
        <label className="toggle">
          <span>Larger cards in hand</span>
          <input type="checkbox" checked={bigCards} onChange={(e) => set({ bigCards: e.target.checked })} />
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
            <input className="input" placeholder="e.g. 1k2j9z" value={seed} onChange={(e) => setSeed(e.target.value)} inputMode="text" autoCapitalize="off" />
            <button
              className="btn"
              disabled={!seed.trim()}
              onClick={() => {
                const n = parseInt(seed.trim(), 36);
                if (!Number.isNaN(n)) newRun(n >>> 0);
              }}
            >
              Go
            </button>
          </div>
          <p className="muted small">Seeds appear in a finished run's share text. The same seed deals the same map and the same cards.</p>
        </div>

        <div className="field field--danger">
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
