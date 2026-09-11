/**
 * The 78-card deck.
 *
 * Every card carries:
 *  - `tags`: the machine-readable meaning the resolver scores against a scene.
 *  - `meaning` / `keywords`: the human-readable meaning. NEVER shown to the
 *    player until the Codex unlocks it (see knowledge.ts).
 *  - `omen`: a one-line consequence fragment used in resolution narration.
 *    This is how meanings *leak* to the player: not by explanation, but by
 *    watching what the card did.
 *
 * Major Arcana are hand-authored. Minor Arcana are generated from
 * suit x rank templates for now (see docs/DESIGN.md "Content debt").
 */

import { MINOR_TEXT } from './minorText';
import { MINOR_KEYWORDS } from './lore';

export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';

export type Tag =
  | 'fire' | 'water' | 'air' | 'earth'
  | 'beginning' | 'ending' | 'renewal'
  | 'power' | 'loss' | 'wealth' | 'sacrifice'
  | 'love' | 'conflict' | 'binding' | 'freedom'
  | 'wisdom' | 'truth' | 'illusion' | 'chaos' | 'order'
  | 'patience' | 'action' | 'fortune' | 'hope' | 'fear'
  | 'death';

export interface Card {
  id: string;
  name: string;
  arcana: 'major' | 'minor';
  number: number; // 0-21 for major, 1-14 for minor (11 page, 12 knight, 13 queen, 14 king)
  suit?: Suit;
  /** Machine meaning. Upright and reversed tag sets. */
  tags: { upright: Tag[]; reversed: Tag[] };
  /** Hidden human meaning. Unlocked through play. */
  keywords: { upright: string[]; reversed: string[] };
  meaning: { upright: string; reversed: string };
  /** Cryptic consequence fragment, shown in resolution narration. */
  omen: { upright: string; reversed: string };
}

interface MajorDef {
  n: number; name: string;
  up: Tag[]; rev: Tag[];
  kwUp: string[]; kwRev: string[];
  mUp: string; mRev: string;
  oUp: string; oRev: string;
}

const MAJORS: MajorDef[] = [
  { n: 0, name: 'The Fool', up: ['beginning', 'freedom', 'chaos', 'hope'], rev: ['chaos', 'fear', 'loss'],
    kwUp: ['beginnings', 'leap', 'innocence'], kwRev: ['recklessness', 'folly', 'hesitation'],
    mUp: 'A step off the edge, taken without knowing what lies below. New beginnings, faith, freedom.',
    mRev: 'The leap taken badly: carelessness, or the refusal to leap at all.',
    oUp: 'You went before you thought, and the ground rose to meet you.', oRev: 'You stumbled where you should have leapt.' },
  { n: 1, name: 'The Magician', up: ['power', 'action', 'order', 'fire'], rev: ['illusion', 'power', 'chaos'],
    kwUp: ['will', 'skill', 'manifestation'], kwRev: ['trickery', 'manipulation', 'untapped talent'],
    mUp: 'Every tool laid on the table, and the will to use them. Resourcefulness made real.',
    mRev: 'Sleight of hand. Power turned to deception, or talent left idle.',
    oUp: 'Your hands knew the work before you did.', oRev: 'The trick turned in your own palm.' },
  { n: 2, name: 'The High Priestess', up: ['wisdom', 'patience', 'illusion', 'water'], rev: ['illusion', 'fear', 'binding'],
    kwUp: ['intuition', 'mystery', 'the unseen'], kwRev: ['secrets', 'withdrawal', 'surface'],
    mUp: 'Knowledge that cannot be spoken, only sensed. Stillness before the veil.',
    mRev: 'A secret kept too long, or a truth ignored for comfort.',
    oUp: 'You waited, and the silence told you something.', oRev: 'Something was hidden from you, and you let it be.' },
  { n: 3, name: 'The Empress', up: ['love', 'wealth', 'renewal', 'earth'], rev: ['binding', 'loss', 'patience'],
    kwUp: ['abundance', 'nurture', 'growth'], kwRev: ['smothering', 'neglect', 'barrenness'],
    mUp: 'The world in bloom. Nourishment, fertility, creation without effort.',
    mRev: 'Care that clings, or a field left to weeds.',
    oUp: 'Green things grew where you stood.', oRev: 'What you tended did not take root.' },
  { n: 4, name: 'The Emperor', up: ['order', 'power', 'binding', 'fire'], rev: ['binding', 'conflict', 'fear'],
    kwUp: ['authority', 'structure', 'control'], kwRev: ['tyranny', 'rigidity', 'weakness'],
    mUp: 'Stone walls and a throne. Structure, discipline, protection by rule.',
    mRev: 'Rule without wisdom. Domination, or a throne with no one on it.',
    oUp: 'You held the line, and the line held.', oRev: 'You commanded, and nothing obeyed.' },
  { n: 5, name: 'The Hierophant', up: ['order', 'wisdom', 'binding', 'patience'], rev: ['freedom', 'chaos', 'truth'],
    kwUp: ['tradition', 'teaching', 'belief'], kwRev: ['rebellion', 'dogma', 'unorthodoxy'],
    mUp: 'The old way, kept because it works. Ritual, mentorship, shared belief.',
    mRev: 'Breaking from the old way, for better or worse.',
    oUp: 'You did what has always been done here.', oRev: 'You broke the rite, and something noticed.' },
  { n: 6, name: 'The Lovers', up: ['love', 'binding', 'truth', 'air'], rev: ['conflict', 'illusion', 'loss'],
    kwUp: ['union', 'choice', 'harmony'], kwRev: ['disharmony', 'temptation', 'misalignment'],
    mUp: 'Two made one by a choice. Union, alignment, values decided.',
    mRev: 'A choice made wrongly, or a bond that pulls apart.',
    oUp: 'You chose, and were chosen back.', oRev: 'You reached for one thing and lost another.' },
  { n: 7, name: 'The Chariot', up: ['action', 'power', 'order', 'fire'], rev: ['chaos', 'conflict', 'loss'],
    kwUp: ['drive', 'victory', 'control'], kwRev: ['aggression', 'lack of direction', 'crash'],
    mUp: 'Two forces yoked and driven forward. Willpower, momentum, triumph by focus.',
    mRev: 'Momentum without a hand on the reins.',
    oUp: 'You drove through, and did not slow.', oRev: 'The reins slipped and the wheels went their own way.' },
  { n: 8, name: 'Strength', up: ['power', 'patience', 'love', 'fire'], rev: ['fear', 'conflict', 'loss'],
    kwUp: ['courage', 'gentleness', 'inner strength'], kwRev: ['self-doubt', 'raw force', 'weakness'],
    mUp: 'The lion\'s jaw closed by a soft hand. Courage that does not need to shout.',
    mRev: 'Force without composure, or courage that fails at the moment it is needed.',
    oUp: 'You did not flinch, and the thing before you softened.', oRev: 'You bared your teeth, and it bared more.' },
  { n: 9, name: 'The Hermit', up: ['wisdom', 'patience', 'truth', 'earth'], rev: ['loss', 'fear', 'binding'],
    kwUp: ['solitude', 'searching', 'guidance'], kwRev: ['isolation', 'loneliness', 'withdrawal'],
    mUp: 'A single lamp on a dark road. Introspection, the search for truth, wisdom earned alone.',
    mRev: 'Alone too long. Withdrawal that becomes a cage.',
    oUp: 'You stepped away, and saw the shape of it.', oRev: 'You went alone, and alone is where it found you.' },
  { n: 10, name: 'Wheel of Fortune', up: ['fortune', 'chaos', 'renewal', 'beginning'], rev: ['fortune', 'loss', 'binding'],
    kwUp: ['cycles', 'luck', 'turning point'], kwRev: ['bad luck', 'resistance', 'a cycle stuck'],
    mUp: 'The wheel turns. Fate, chance, the moment things change.',
    mRev: 'The wheel turns against you, or refuses to turn at all.',
    oUp: 'The wheel turned, and it turned your way.', oRev: 'The wheel turned, and it was not your turn.' },
  { n: 11, name: 'Justice', up: ['truth', 'order', 'air', 'binding'], rev: ['illusion', 'conflict', 'loss'],
    kwUp: ['fairness', 'consequence', 'clarity'], kwRev: ['injustice', 'dishonesty', 'imbalance'],
    mUp: 'The scales and the sword. Cause meets effect. Truth weighed.',
    mRev: 'A judgment corrupted, or a truth avoided.',
    oUp: 'You were weighed, and the scales did not tip.', oRev: 'The scales were tipped before you arrived.' },
  { n: 12, name: 'The Hanged Man', up: ['sacrifice', 'patience', 'wisdom', 'water'], rev: ['binding', 'loss', 'fear'],
    kwUp: ['surrender', 'suspension', 'new perspective'], kwRev: ['stalling', 'resistance', 'needless sacrifice'],
    mUp: 'Hung by one foot and at peace. Letting go, waiting, seeing the world upside down.',
    mRev: 'Sacrifice for nothing. Delay that costs more than it saves.',
    oUp: 'You gave something up, and the world turned to show you why.', oRev: 'You hung there, and nothing came of it.' },
  { n: 13, name: 'Death', up: ['death', 'ending', 'renewal', 'water'], rev: ['binding', 'fear', 'patience'],
    kwUp: ['endings', 'transformation', 'transition'], kwRev: ['resistance to change', 'stagnation', 'decay'],
    mUp: 'Not the end of you, but the end of something. Transformation by loss.',
    mRev: 'Refusing the ending, and rotting in place.',
    oUp: 'Something ended here, and you were not it.', oRev: 'You held on, and what you held began to rot.' },
  { n: 14, name: 'Temperance', up: ['patience', 'order', 'renewal', 'water'], rev: ['chaos', 'conflict', 'loss'],
    kwUp: ['balance', 'moderation', 'alchemy'], kwRev: ['excess', 'imbalance', 'discord'],
    mUp: 'Water poured between two cups without spilling. Balance, patience, blending.',
    mRev: 'Too much of one thing. The mixture curdles.',
    oUp: 'You measured, and the measure was right.', oRev: 'You poured too fast, and it spilled.' },
  { n: 15, name: 'The Devil', up: ['binding', 'power', 'illusion', 'fear'], rev: ['freedom', 'truth', 'renewal'],
    kwUp: ['bondage', 'temptation', 'materialism'], kwRev: ['release', 'breaking chains', 'clarity'],
    mUp: 'Chains you could slip if you looked down. Addiction, obsession, the comfortable trap.',
    mRev: 'The chain noticed, and slipped. Freedom from what held you.',
    oUp: 'You took the offered thing, and the offering took you.', oRev: 'You looked down at the chain, and it was loose.' },
  { n: 16, name: 'The Tower', up: ['chaos', 'ending', 'truth', 'fire'], rev: ['fear', 'loss', 'binding'],
    kwUp: ['upheaval', 'revelation', 'collapse'], kwRev: ['disaster averted', 'fear of change', 'slow collapse'],
    mUp: 'Lightning strikes the crown. Sudden ruin that reveals what was false.',
    mRev: 'Collapse delayed, or a collapse that happens inside instead.',
    oUp: 'The ground opened, and what stood on it fell.', oRev: 'The cracks spread, quietly, out of sight.' },
  { n: 17, name: 'The Star', up: ['hope', 'renewal', 'truth', 'air'], rev: ['fear', 'loss', 'illusion'],
    kwUp: ['hope', 'healing', 'guidance'], kwRev: ['despair', 'faithlessness', 'disconnection'],
    mUp: 'One light in the dark after the storm. Hope, renewal, faith restored.',
    mRev: 'The light went out, or you stopped looking for it.',
    oUp: 'A light held, and you followed it.', oRev: 'You looked up, and the sky was empty.' },
  { n: 18, name: 'The Moon', up: ['illusion', 'fear', 'water', 'wisdom'], rev: ['truth', 'renewal', 'fear'],
    kwUp: ['illusion', 'anxiety', 'the subconscious'], kwRev: ['confusion lifting', 'repressed fear', 'clarity'],
    mUp: 'A path between two towers under a lying light. Illusion, dread, dreams that bite.',
    mRev: 'The fog thins. Fear faced, or fear buried deeper.',
    oUp: 'Nothing was what it seemed, and you walked into it anyway.', oRev: 'The fog thinned, and you saw what had been walking beside you.' },
  { n: 19, name: 'The Sun', up: ['hope', 'power', 'truth', 'fire'], rev: ['illusion', 'loss', 'hope'],
    kwUp: ['joy', 'success', 'vitality'], kwRev: ['overconfidence', 'dimmed joy', 'delay'],
    mUp: 'Full daylight. Nothing hidden, nothing feared. Warmth and plain success.',
    mRev: 'Light too bright to see by, or a day that never quite dawns.',
    oUp: 'The light was plain, and so was the way.', oRev: 'You squinted into a glare and missed the path.' },
  { n: 20, name: 'Judgement', up: ['renewal', 'truth', 'ending', 'fire'], rev: ['fear', 'binding', 'loss'],
    kwUp: ['reckoning', 'awakening', 'absolution'], kwRev: ['self-doubt', 'refusal of the call', 'harsh judgment'],
    mUp: 'The horn sounds and the graves open. A reckoning, a rising, a second chance.',
    mRev: 'The call heard and ignored. Judgment turned inward.',
    oUp: 'You were called, and you rose.', oRev: 'You heard the horn, and pretended you had not.' },
  { n: 21, name: 'The World', up: ['ending', 'order', 'wealth', 'wisdom'], rev: ['binding', 'loss', 'patience'],
    kwUp: ['completion', 'wholeness', 'fulfillment'], kwRev: ['incompletion', 'shortcuts', 'delay'],
    mUp: 'The dance inside the wreath. Completion, integration, the journey ended and begun again.',
    mRev: 'A circle not closed. Something left undone.',
    oUp: 'The circle closed, and you were inside it.', oRev: 'You reached the end and found a piece missing.' },
];

interface SuitDef {
  suit: Suit; element: Tag; domain: string; noun: string;
  tags: Tag[];
}
const SUITS: SuitDef[] = [
  { suit: 'wands', element: 'fire', domain: 'will and ambition', noun: 'wand', tags: ['action'] },
  { suit: 'cups', element: 'water', domain: 'feeling and bonds', noun: 'cup', tags: ['love'] },
  { suit: 'swords', element: 'air', domain: 'thought and conflict', noun: 'sword', tags: ['conflict'] },
  { suit: 'pentacles', element: 'earth', domain: 'body and means', noun: 'coin', tags: ['wealth'] },
];

interface RankDef {
  n: number; name: string; up: Tag[]; rev: Tag[]; kwUp: string[]; kwRev: string[]; theme: string; themeRev: string;
  oUp: string; oRev: string;
}
const RANKS: RankDef[] = [
  { n: 1, name: 'Ace', up: ['beginning', 'power'], rev: ['loss', 'illusion'], kwUp: ['spark', 'potential'], kwRev: ['missed chance', 'false start'],
    theme: 'a raw beginning', themeRev: 'a beginning that misfires', oUp: 'Something started.', oRev: 'Something almost started.' },
  { n: 2, name: 'Two', up: ['binding', 'patience'], rev: ['conflict', 'chaos'], kwUp: ['balance', 'choice', 'partnership'], kwRev: ['indecision', 'imbalance'],
    theme: 'a choice between two', themeRev: 'a choice refused', oUp: 'Two things held in balance.', oRev: 'Two things pulled apart.' },
  { n: 3, name: 'Three', up: ['renewal', 'love'], rev: ['loss', 'conflict'], kwUp: ['growth', 'collaboration'], kwRev: ['delay', 'discord'],
    theme: 'growth through others', themeRev: 'growth that stalls', oUp: 'Hands joined and the work moved.', oRev: 'Hands joined, and pulled the wrong way.' },
  { n: 4, name: 'Four', up: ['order', 'patience'], rev: ['binding', 'fear'], kwUp: ['stability', 'rest'], kwRev: ['stagnation', 'clinging'],
    theme: 'stillness and structure', themeRev: 'a stillness that traps', oUp: 'You stood on solid ground.', oRev: 'The ground held you too tightly.' },
  { n: 5, name: 'Five', up: ['conflict', 'loss'], rev: ['renewal', 'hope'], kwUp: ['strife', 'hardship'], kwRev: ['recovery', 'forgiveness'],
    theme: 'strife and loss', themeRev: 'strife that ends', oUp: 'Something was lost in the struggle.', oRev: 'The struggle ended, and less was lost than feared.' },
  { n: 6, name: 'Six', up: ['renewal', 'love', 'hope'], rev: ['binding', 'loss'], kwUp: ['harmony', 'passage'], kwRev: ['nostalgia', 'unfair trade'],
    theme: 'a passage to calmer water', themeRev: 'a passage that leads back', oUp: 'You were carried past it.', oRev: 'You were carried back to where you started.' },
  { n: 7, name: 'Seven', up: ['patience', 'action', 'wisdom'], rev: ['fear', 'illusion'], kwUp: ['perseverance', 'assessment'], kwRev: ['doubt', 'giving up'],
    theme: 'holding ground under pressure', themeRev: 'ground surrendered', oUp: 'You held, and it passed.', oRev: 'You gave ground you did not have.' },
  { n: 8, name: 'Eight', up: ['action', 'freedom', 'order'], rev: ['binding', 'chaos'], kwUp: ['movement', 'mastery'], kwRev: ['restriction', 'haste'],
    theme: 'swift movement and skill', themeRev: 'movement blocked', oUp: 'It moved fast, and so did you.', oRev: 'You moved, and something held you back.' },
  { n: 9, name: 'Nine', up: ['wealth', 'wisdom', 'fear'], rev: ['loss', 'fear'], kwUp: ['fruition', 'near completion'], kwRev: ['anxiety', 'greed'],
    theme: 'the harvest before the end', themeRev: 'a harvest spoiled', oUp: 'What you sowed came up.', oRev: 'What you sowed came up wrong.' },
  { n: 10, name: 'Ten', up: ['ending', 'wealth', 'sacrifice'], rev: ['loss', 'binding'], kwUp: ['completion', 'burden'], kwRev: ['collapse', 'release from burden'],
    theme: 'the full weight of an ending', themeRev: 'an ending dropped', oUp: 'It ended, heavy in your arms.', oRev: 'It ended, and you let it fall.' },
  { n: 11, name: 'Page', up: ['beginning', 'hope', 'wisdom'], rev: ['illusion', 'chaos'], kwUp: ['curiosity', 'message', 'study'], kwRev: ['bad news', 'immaturity'],
    theme: 'a message and a curiosity', themeRev: 'a message misread', oUp: 'Word came, and you listened.', oRev: 'Word came, and you heard it wrong.' },
  { n: 12, name: 'Knight', up: ['action', 'power', 'freedom'], rev: ['chaos', 'conflict'], kwUp: ['pursuit', 'charge'], kwRev: ['recklessness', 'delay'],
    theme: 'a charge toward the goal', themeRev: 'a charge off the road', oUp: 'You rode straight at it.', oRev: 'You rode hard in the wrong direction.' },
  { n: 13, name: 'Queen', up: ['wisdom', 'love', 'patience'], rev: ['binding', 'illusion'], kwUp: ['nurture', 'mastery', 'intuition'], kwRev: ['smothering', 'coldness'],
    theme: 'a quiet mastery', themeRev: 'a mastery turned inward', oUp: 'You knew it before it happened.', oRev: 'You knew, and kept it to yourself.' },
  { n: 14, name: 'King', up: ['order', 'power', 'wisdom'], rev: ['binding', 'conflict'], kwUp: ['authority', 'command'], kwRev: ['tyranny', 'rigidity'],
    theme: 'command and rule', themeRev: 'command that curdles', oUp: 'You spoke, and it was done.', oRev: 'You spoke, and were not obeyed.' },
];

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function buildMajor(d: MajorDef): Card {
  return {
    id: `major-${d.n}`,
    name: d.name,
    arcana: 'major',
    number: d.n,
    tags: { upright: d.up, reversed: d.rev },
    keywords: { upright: d.kwUp, reversed: d.kwRev },
    meaning: { upright: d.mUp, reversed: d.mRev },
    omen: { upright: d.oUp, reversed: d.oRev },
  };
}

function buildMinor(s: SuitDef, r: RankDef): Card {
  const name = `${r.name} of ${s.suit[0].toUpperCase()}${s.suit.slice(1)}`;
  const text = MINOR_TEXT[s.suit]?.[r.n];
  return {
    id: `${s.suit}-${r.n}`,
    name,
    arcana: 'minor',
    number: r.n,
    suit: s.suit,
    tags: { upright: uniq([s.element, ...s.tags, ...r.up]), reversed: uniq([s.element, ...r.rev]) },
    keywords: MINOR_KEYWORDS[`${s.suit}-${r.n}`] ?? { upright: r.kwUp, reversed: r.kwRev },
    meaning: text
      ? { upright: text.m[0], reversed: text.m[1] }
      : { upright: `In the realm of ${s.domain}: ${r.theme}.`, reversed: `In the realm of ${s.domain}: ${r.themeRev}.` },
    omen: text ? { upright: text.o[0], reversed: text.o[1] } : { upright: r.oUp, reversed: r.oRev },
  };
}

export const CARDS: readonly Card[] = [
  ...MAJORS.map(buildMajor),
  ...SUITS.flatMap((s) => RANKS.map((r) => buildMinor(s, r))),
];

const BY_ID = new Map(CARDS.map((c) => [c.id, c]));

export function getCard(id: string): Card {
  const c = BY_ID.get(id);
  if (!c) throw new Error(`Unknown card id: ${id}`);
  return c;
}

export function cardTags(card: Card, reversed: boolean): Tag[] {
  return reversed ? card.tags.reversed : card.tags.upright;
}
