import { describe, expect, it } from 'vitest';
import { challengeLink, parseChallenge } from '../challenge';

describe('challenge links', () => {
  it('round-trips a seed and descent, and refuses nonsense', () => {
    const link = challengeLink('https://x.test/tarot/', 123456789, 'arcana', 2);
    expect(link).toBe('https://x.test/tarot/?seed=21i3v9&descent=arcana');
    const c = parseChallenge(new URL(link).search)!;
    expect(c).toEqual({ seed: 123456789, descent: 'arcana', depth: 0 });
    expect(challengeLink('https://x.test/', 7, 'standard', 3)).toBe('https://x.test/?seed=7&depth=3');
    expect(parseChallenge('?seed=7&depth=3')).toEqual({ seed: 7, descent: 'standard', depth: 3 });
    expect(parseChallenge('?seed=7&descent=arcana&depth=3')!.depth).toBe(0);
    expect(parseChallenge('?seed=zz')).toEqual({ seed: 1295, descent: 'standard', depth: 0 });
    expect(parseChallenge('?seed=zz&descent=nope')).toBeNull();
    expect(parseChallenge('?seed=!!')).toBeNull();
    expect(parseChallenge('')).toBeNull();
    expect(challengeLink('https://x.test/', 35, 'standard')).toBe('https://x.test/?seed=z');
  });
});
