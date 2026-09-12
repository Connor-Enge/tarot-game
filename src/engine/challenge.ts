import { DESCENTS } from './descents';

/**
 * A challenge: a seed and a descent carried in a link, so two readers can
 * walk the same road. Seeds travel in base 36, as the share text shows them.
 */
export interface Challenge {
  seed: number;
  descent: string;
  depth: number;
}

export function parseChallenge(search: string): Challenge | null {
  const q = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const raw = q.get('seed');
  if (!raw || !/^[0-9a-z]{1,13}$/i.test(raw)) return null;
  const seed = parseInt(raw, 36);
  if (!Number.isFinite(seed) || seed < 0) return null;
  const descent = q.get('descent') ?? 'standard';
  if (!DESCENTS.some((d) => d.id === descent)) return null;
  // Depth belongs to the standard descent alone.
  const depth = descent === 'standard' ? Math.max(0, Math.min(9, parseInt(q.get('depth') ?? '0', 10) || 0)) : 0;
  return { seed, descent, depth };
}

export function challengeLink(base: string, seed: number, descent: string, depth = 0): string {
  const q = new URLSearchParams({ seed: seed.toString(36) });
  if (descent !== 'standard') q.set('descent', descent);
  if (descent === 'standard' && depth > 0) q.set('depth', String(depth));
  return `${base}?${q.toString()}`;
}
