import type { RunState } from './engine';
import type { RunMode } from './store';

/**
 * The run in progress. RunState is a plain value, so this is JSON.
 * Saved after every transition; cleared when the run ends.
 */
const KEY = 'arcana-descent.run.v1';

export interface SavedRun {
  version: 1;
  run: RunState;
  mode: RunMode;
  firstDescent: boolean;
  savedAt: number;
}

export function saveRun(run: RunState | null, mode: RunMode, firstDescent: boolean, storage: Pick<Storage, 'setItem' | 'removeItem'> | undefined = globalThis.localStorage): void {
  try {
    if (!run || run.phase.kind === 'dead' || run.phase.kind === 'ascended') {
      storage?.removeItem(KEY);
      return;
    }
    const saved: SavedRun = { version: 1, run, mode, firstDescent, savedAt: Date.now() };
    storage?.setItem(KEY, JSON.stringify(saved));
  } catch {
    /* ignore */
  }
}

export function loadRun(storage: Pick<Storage, 'getItem'> | undefined = globalThis.localStorage): SavedRun | null {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedRun;
    if (parsed.version !== 1 || !parsed.run || !parsed.run.map) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearRun(storage: Pick<Storage, 'removeItem'> | undefined = globalThis.localStorage): void {
  try {
    storage?.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
