/**
 * Relics: run-long modifiers. Boons are offered (pick one of two) after a
 * triumph; curses are inflicted after a calamity. Unlike card meanings, relic
 * effects are stated plainly. The mystery is the deck, not the rules.
 */
export type RelicKind = 'boon' | 'curse';

export interface Relic {
  id: string;
  kind: RelicKind;
  name: string;
  glyph: string;
  text: string;
}

export const RELICS: Record<string, Relic> = {
  lens: { id: 'lens', kind: 'boon', name: 'Cracked Lens', glyph: '◐', text: 'The Threshold deals four cards.' },
  shard: { id: 'shard', kind: 'boon', name: 'Mirror Shard', glyph: '◧', text: 'The Wake deals four cards.' },
  salt: { id: 'salt', kind: 'boon', name: 'A Pinch of Salt', glyph: '∴', text: 'Cards dealt to the Hand never land reversed.' },
  coin: { id: 'coin', kind: 'boon', name: 'Second Coin', glyph: '◎', text: 'The first redraw in each scene is free.' },
  bell: { id: 'bell', kind: 'boon', name: 'Small Bell', glyph: '♪', text: 'Whispers tell you two words.' },
  candle: { id: 'candle', kind: 'boon', name: 'Candle Stub', glyph: '🕯', text: 'Gain 1 Clarity each time you walk on.' },
  ring: { id: 'ring', kind: 'boon', name: 'Iron Ring', glyph: '○', text: 'Charged cards score +2 instead of +1.' },
  bread: { id: 'bread', kind: 'boon', name: 'Hard Bread', glyph: '▭', text: 'Rest mends 2 more.' },

  fog: { id: 'fog', kind: 'curse', name: 'Fog', glyph: '≋', text: 'One card in every seat is dealt face down.' },
  splinter: { id: 'splinter', kind: 'curse', name: 'Splinter', glyph: '⟋', text: 'The Vessel always holds a reversed card.' },
  debt: { id: 'debt', kind: 'curse', name: 'Debt', glyph: '⊖', text: 'Clarity never rises above 2.' },
  weight: { id: 'weight', kind: 'curse', name: 'The Weight', glyph: '⏚', text: 'Neutral readings cost one more.' },
  hush: { id: 'hush', kind: 'curse', name: 'Hush', glyph: '⊘', text: 'Whispers cost 2.' },
};

export const BOON_IDS = Object.values(RELICS).filter((r) => r.kind === 'boon').map((r) => r.id);
export const CURSE_IDS = Object.values(RELICS).filter((r) => r.kind === 'curse').map((r) => r.id);

export function getRelic(id: string): Relic {
  const r = RELICS[id];
  if (!r) throw new Error(`Unknown relic ${id}`);
  return r;
}
