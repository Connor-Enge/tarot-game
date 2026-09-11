import type { Tag } from './cards';

/**
 * The four seats of the spread. The player only ever sees the glyph and,
 * once unlocked, the name. The `role` string is for designers.
 *
 *  Vessel    - who you are in this moment
 *  Threshold - the shape of what you face
 *  Hand      - what you do about it
 *  Wake      - what follows
 */
export type SlotId = 'vessel' | 'threshold' | 'hand' | 'wake';
export const SLOT_IDS: readonly SlotId[] = ['vessel', 'threshold', 'hand', 'wake'];

export interface SlotDef {
  id: SlotId;
  glyph: string;
  name: string;
  role: string;
}

export const SLOTS: Record<SlotId, SlotDef> = {
  vessel: { id: 'vessel', glyph: '◯', name: 'The Vessel', role: 'Who you are as you enter this.' },
  threshold: { id: 'threshold', glyph: '△', name: 'The Threshold', role: 'The true shape of what stands before you.' },
  hand: { id: 'hand', glyph: '☐', name: 'The Hand', role: 'What you do.' },
  wake: { id: 'wake', glyph: '☾', name: 'The Wake', role: 'What follows in your wake.' },
};

/** How strongly a scene rewards (or punishes) a tag in a given seat. */
export type Affinity = Partial<Record<Tag, number>>;

export interface Scene {
  id: string;
  /** Intentionally vague. The cards decide what actually happens. */
  prompt: string;
  /** Environmental flavor shown above the spread. */
  place: string;
  /** Per-seat affinities. Positive = this fits, negative = this hurts. */
  affinity: Record<SlotId, Affinity>;
  /** Scales resource deltas. Late scenes have higher stakes. */
  stakes: number;
  /** Outcome narration by tier. */
  outcomes: Record<OutcomeTier, string>;
  /** Scenes tagged `terminal` end the run on success. */
  terminal?: boolean;
}

export type OutcomeTier = 'calamity' | 'harm' | 'neutral' | 'boon' | 'triumph';
export const TIERS: readonly OutcomeTier[] = ['calamity', 'harm', 'neutral', 'boon', 'triumph'];

export const SCENES: Record<string, Scene> = {
  crossing: {
    id: 'crossing',
    place: 'A rope bridge over a black gorge.',
    prompt: 'A crossing. Something below is breathing.',
    stakes: 1,
    affinity: {
      vessel: { patience: 1, hope: 1, fear: -1, chaos: -1 },
      threshold: { air: 1, illusion: 1, truth: 1, fire: -1 },
      hand: { action: 2, patience: 1, chaos: -2, conflict: -1 },
      wake: { renewal: 1, freedom: 1, ending: -1, loss: -1 },
    },
    outcomes: {
      calamity: 'The ropes part. You fall a long way and stop suddenly.',
      harm: 'The bridge sways and you cross on your knees, bleeding from the rope.',
      neutral: 'You cross. The breathing below does not change.',
      boon: 'You cross lightly, and find a satchel snagged on the far post.',
      triumph: 'The gorge is quiet as you cross, and on the far side, the path is clearer than before.',
    },
  },
  stranger: {
    id: 'stranger',
    place: 'A fire in a ring of stones, and someone already sitting at it.',
    prompt: 'A stranger offers you a seat.',
    stakes: 1,
    affinity: {
      vessel: { love: 1, wisdom: 1, truth: 1, fear: -1 },
      threshold: { illusion: 1, love: 1, binding: 1, conflict: -1 },
      hand: { patience: 2, love: 1, conflict: -2, power: -1 },
      wake: { wisdom: 1, binding: 1, loss: -1, illusion: -1 },
    },
    outcomes: {
      calamity: 'You wake with the fire cold, your pack gone, and a knife you did not own in your hand.',
      harm: 'The stranger talks until dawn. You leave tired, poorer, and unsure what you agreed to.',
      neutral: 'You share the fire and part in the morning without names.',
      boon: 'The stranger tells you a thing about the road ahead, and it turns out to be true.',
      triumph: 'By morning you know their name, and something they left you burns quietly in your pocket.',
    },
  },
  door: {
    id: 'door',
    place: 'A door standing alone in a field, no wall around it.',
    prompt: 'A door. It is locked from your side.',
    stakes: 1,
    affinity: {
      vessel: { wisdom: 1, freedom: 1, order: -1 },
      threshold: { illusion: 2, truth: 1, order: 1 },
      hand: { action: 1, chaos: 1, wisdom: 1, patience: -1 },
      wake: { beginning: 2, renewal: 1, binding: -2 },
    },
    outcomes: {
      calamity: 'The door opens onto the same field, and the door behind you is gone.',
      harm: 'You force the lock and cut your hand on a mechanism that was not there before.',
      neutral: 'The door opens onto the same field. You walk through anyway.',
      boon: 'The door opens onto a road you had not seen, and it is downhill.',
      triumph: 'The door opens onto somewhere else entirely, and it has been waiting for you.',
    },
  },
  beast: {
    id: 'beast',
    place: 'A clearing. The grass is flattened in a wide circle.',
    prompt: 'Something large is watching you from the trees.',
    stakes: 2,
    affinity: {
      vessel: { power: 1, patience: 1, fear: -2 },
      threshold: { fire: 1, conflict: 1, illusion: -1 },
      hand: { power: 2, patience: 1, love: 1, chaos: -2, conflict: 1 },
      wake: { renewal: 1, ending: 1, death: 1, loss: -2 },
    },
    outcomes: {
      calamity: 'It is faster than you. There is not much left to say.',
      harm: 'It takes something from you before it lets you go. You do not look back to see what.',
      neutral: 'You stand very still for a long time. Eventually, it leaves.',
      boon: 'It watches you and does not move. You pass, and find where it has been sleeping, and what it kept there.',
      triumph: 'It lowers its head. You put your hand on it. When you walk on, it walks with you for a while.',
    },
  },
  well: {
    id: 'well',
    place: 'A stone well, its rope frayed, its bucket missing.',
    prompt: 'The well is dark, and something in it is singing.',
    stakes: 1,
    affinity: {
      vessel: { wisdom: 1, hope: 1, illusion: -1 },
      threshold: { water: 2, illusion: 1, truth: 1 },
      hand: { patience: 1, sacrifice: 2, action: -1, power: -1 },
      wake: { wisdom: 2, renewal: 1, hope: 1, binding: -1 },
    },
    outcomes: {
      calamity: 'You lean in to hear better. The singing stops. The well is much deeper than it looked.',
      harm: 'The song stays in your head for days and crowds out something you needed to remember.',
      neutral: 'You listen for a while and move on with the tune half-remembered.',
      boon: 'You drop something in, and the song changes to one you know.',
      triumph: 'You drop something in, and the well gives back something better, still wet.',
    },
  },
  ruin: {
    id: 'ruin',
    place: 'A tower, broken off at the third floor. Stairs go up into nothing.',
    prompt: 'A ruin. Someone built this to last.',
    stakes: 2,
    affinity: {
      vessel: { order: 1, truth: 1, chaos: -1 },
      threshold: { ending: 2, chaos: 1, power: 1, order: -1 },
      hand: { wisdom: 2, patience: 1, action: -1, fire: -1 },
      wake: { wealth: 1, wisdom: 1, truth: 1, ending: -1 },
    },
    outcomes: {
      calamity: 'The third floor finishes falling while you are on the second.',
      harm: 'You climb, and the stairs teach you why they were abandoned.',
      neutral: 'You look at it for a while. It looks back.',
      boon: 'Under the rubble: a thing someone hid before the tower came down.',
      triumph: 'The ruin is a map, if you stand in the right place. You stand in the right place.',
    },
  },
  rest: {
    id: 'rest',
    place: 'A hollow under a hill. Dry. Quiet.',
    prompt: 'A place to rest. If you dare to.',
    stakes: 1,
    affinity: {
      vessel: { patience: 2, order: 1, action: -1 },
      threshold: { earth: 1, order: 1, fear: 1, illusion: -1 },
      hand: { patience: 2, renewal: 1, action: -2, chaos: -1 },
      wake: { renewal: 2, hope: 1, ending: -1 },
    },
    outcomes: {
      calamity: 'You sleep. Something else uses the hollow too, and it does not share.',
      harm: 'You sleep badly and wake with the sense that the hill has moved.',
      neutral: 'You rest. Nothing comes.',
      boon: 'You sleep deeply and wake mended in ways you did not know you were broken.',
      triumph: 'You sleep, and you dream the next stretch of road, and in the morning it is exactly so.',
    },
  },
  abyss: {
    id: 'abyss',
    place: 'The bottom. The dark here has weight.',
    prompt: 'This is where the cards were leading. Read the last of it.',
    stakes: 3,
    terminal: true,
    affinity: {
      vessel: { truth: 2, hope: 1, wisdom: 1, illusion: -2 },
      threshold: { death: 2, ending: 2, chaos: 1, fear: -1 },
      hand: { sacrifice: 2, action: 1, patience: 1, binding: -2 },
      wake: { renewal: 3, beginning: 2, freedom: 1, loss: -2, binding: -2 },
    },
    outcomes: {
      calamity: 'The dark takes the reading and you with it.',
      harm: 'You come back up, but not all of you.',
      neutral: 'The dark considers your reading and lets you go, unchanged.',
      boon: 'The dark accepts the reading. You surface somewhere warm.',
      triumph: 'The reading is true. The dark folds itself away like a cloth, and there is morning underneath.',
    },
  },
};

/** A fixed-shape run: 6 ordinary scenes then the abyss. Replace with a map later. */
export function buildRunPath(pick: <T>(arr: readonly T[]) => T): string[] {
  const pool = Object.values(SCENES).filter((s) => !s.terminal).map((s) => s.id);
  const path: string[] = [];
  let last = '';
  while (path.length < 6) {
    const id = pick(pool);
    if (id === last) continue;
    path.push(id);
    last = id;
  }
  path.push('abyss');
  return path;
}
