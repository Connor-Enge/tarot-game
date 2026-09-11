import { Component, type ReactNode } from 'react';
import { clearRun } from '../../persist';

interface State {
  error: Error | null;
}

/**
 * If anything throws in render, offer a way out that keeps the Codex and
 * drops only the run in progress. Persisted state must never brick the app.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="screen screen--title">
        <div className="title">
          <div className="title__glyph">✖</div>
          <h1>The reading broke.</h1>
          <p className="muted">Something went wrong. Your Codex is safe. The descent in progress may not be.</p>
        </div>
        <div className="stack">
          <button
            className="btn btn--primary"
            onClick={() => {
              clearRun();
              location.reload();
            }}
          >
            Let the run go and start over
          </button>
          <button className="btn" onClick={() => location.reload()}>
            Try again
          </button>
        </div>
        <p className="muted small" style={{ wordBreak: 'break-word' }}>
          {String(this.state.error.message)}
        </p>
      </main>
    );
  }
}
