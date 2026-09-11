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
/** Dealt in this order: 1 the Situation, 2 the Challenge, 3 the Hidden Insight (the Wake), 4 the Guidance (the Hand). */
export const SLOT_IDS: readonly SlotId[] = ['vessel', 'threshold', 'wake', 'hand'];

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

/**
 * The seats as positions in a Mini Cross spread, numbered in the order
 * they are dealt: 1 the Situation (centre), 2 the Challenge (above it),
 * 3 the Hidden Insight (left), 4 the Guidance (right). The Wake, what
 * follows unseen, is the Hidden Insight; the Hand, what you do, is the
 * Guidance. Positions are layout, not meaning, so they are always shown.
 */
export const SLOT_POSITION: Record<SlotId, { n: number; role: string; gloss: string; question: string }> = {
  vessel: { n: 1, role: 'Situation', gloss: 'the main theme', question: 'What is the situation?' },
  threshold: { n: 2, role: 'Challenge', gloss: 'what blocks or influences you', question: 'What stands in the way?' },
  wake: { n: 3, role: 'Hidden insight', gloss: 'what you may not notice: what follows in your wake', question: 'What might you be missing?' },
  hand: { n: 4, role: 'Guidance', gloss: 'the best advice or direction: what you do', question: 'What is the best course?' },
};

/** How strongly a scene rewards (or punishes) a tag in a given seat. */
export type Affinity = Partial<Record<Tag, number>>;

/**
 * Rites: a stated rule a scene carries. Shown the moment you arrive, in
 * plain words, like every other rule. None of them touches a meaning.
 */
export type Rite = 'mirror' | 'hush' | 'tithe' | 'moonlit' | 'bare' | 'ember' | 'look';
export const RITES: Record<Rite, { name: string; glyph: string; text: string }> = {
  mirror: { name: 'The Mirror', glyph: '⧖', text: 'What lands wrong reads right here, and what lands right reads wrong.' },
  hush: { name: 'The Hush', glyph: '…', text: 'No whispers here. Redraw, turn, or trust your eye.' },
  tithe: { name: 'The Tithe', glyph: '⚱', text: 'Stepping in costs a drop of vitality and lights one Clarity.' },
  moonlit: { name: 'Moonlit', glyph: '☾', text: 'The Wake deals one more.' },
  bare: { name: 'The Bare Table', glyph: '▭', text: 'Every seat deals one fewer.' },
  ember: { name: 'The Ember', glyph: '♨', text: 'Even a neutral reading mends one here.' },
  look: { name: 'The Long Look', glyph: '◉', text: 'The whole last hand is laid bare: every seat dealt at once, one more each, nothing face down.' },
};

/** Rites the reader has walked: any scene carrying one that appears in the omen log. */
export function ritesWalked(omenLog: readonly { scene: string }[] | undefined): Rite[] {
  const seen = new Set((omenLog ?? []).map((e) => SCENES[e.scene]?.rite).filter((r): r is Rite => !!r));
  return (Object.keys(RITES) as Rite[]).filter((r) => seen.has(r));
}

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
  kind: SceneKind;
  /** Hue (0-360) that tints the screen while you are here. */
  hue: number;
  /** Earliest act this scene may appear in (1-based). */
  minAct: number;
  /** Multiplier on positive vitality. Rest scenes mend more. */
  mend?: number;
  /** A boon here hands you this relic, if you don't hold it. The outcome text names it. */
  relic?: string;
  /** A stated rule this scene carries. See RITES. */
  rite?: Rite;
}

export type OutcomeTier = 'calamity' | 'harm' | 'neutral' | 'boon' | 'triumph';
export const TIERS: readonly OutcomeTier[] = ['calamity', 'harm', 'neutral', 'boon', 'triumph'];

/** What the map shows before you arrive. The scene itself stays hidden. */
export type SceneKind = 'threat' | 'passage' | 'mystery' | 'rest' | 'abyss';
export const KIND_GLYPH: Record<SceneKind, string> = {
  threat: '⚔',
  passage: '⛩',
  mystery: '✧',
  rest: '♨',
  abyss: '◉',
};

export const SCENES: Record<string, Scene> = {
  crossing: {
    id: 'crossing',
    relic: 'coin',
    kind: 'passage',
    hue: 210,
    minAct: 1,
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
      neutral: 'You cross on the balls of your feet. Below, the breathing keeps its own time.',
      boon: 'You cross lightly, and find a satchel snagged on the far post.',
      triumph: 'The gorge is quiet as you cross, and on the far side, the path is clearer than before.',
    },
  },
  stranger: {
    id: 'stranger',
    relic: 'bell',
    kind: 'mystery',
    hue: 30,
    minAct: 1,
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
      neutral: 'You share the fire. In the morning the stranger is gone, and the ash is still warm.',
      boon: 'The stranger tells you a thing about the road ahead, and it turns out to be true.',
      triumph: 'By morning you know their name, and something they left you burns quietly in your pocket.',
    },
  },
  door: {
    id: 'door',
    kind: 'passage',
    hue: 270,
    minAct: 1,
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
      harm: 'You force the lock. Something inside it forces back, and you leave a little of your hand in the keyhole.',
      neutral: 'The door opens onto the same field. You walk through anyway.',
      boon: 'The door opens onto a road you had not seen, and it is downhill.',
      triumph: 'The door opens onto somewhere else entirely, and it has been waiting for you.',
    },
  },
  beast: {
    id: 'beast',
    kind: 'threat',
    hue: 0,
    minAct: 1,
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
    relic: 'bread',
    kind: 'mystery',
    hue: 190,
    minAct: 1,
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
      neutral: 'You listen until the song loops, then walk on humming the wrong half of it.',
      boon: 'You drop something in, and the song changes to one you know.',
      triumph: 'You drop something in, and the well gives back something better, still wet.',
    },
  },
  ruin: {
    id: 'ruin',
    relic: 'ring',
    kind: 'threat',
    hue: 40,
    minAct: 1,
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
      neutral: 'You climb as far as the stairs go and sit where the third floor used to be.',
      boon: 'Under the rubble: a thing someone hid before the tower came down.',
      triumph: 'The ruin is a map, if you stand in the right place. You stand in the right place.',
    },
  },
  rest: {
    id: 'rest',
    kind: 'rest',
    hue: 120,
    minAct: 1,
    mend: 3,
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
      harm: 'You sleep badly, and wake certain the hill has turned over in the night with you inside it.',
      neutral: 'You rest. Nothing comes.',
      boon: 'You sleep deeply and wake mended in ways you did not know you were broken.',
      triumph: 'You sleep, and you dream the next stretch of road, and in the morning it is exactly so.',
    },
  },
  market: {
    id: 'market',
    relic: 'salt',
    kind: 'mystery',
    hue: 45,
    minAct: 1,
    place: 'Stalls in a dead town. Every one of them is open, and no one is behind them.',
    prompt: 'A market. The prices are written in a hand you almost recognize.',
    stakes: 1,
    affinity: {
      vessel: { wealth: 1, wisdom: 1, illusion: -1 },
      threshold: { illusion: 2, wealth: 1, binding: 1 },
      hand: { truth: 1, patience: 1, sacrifice: 1, power: -1, chaos: -1 },
      wake: { wealth: 2, freedom: 1, binding: -2 },
    },
    outcomes: {
      calamity: 'You buy something. The price was not written in coin.',
      harm: 'You leave with less than you came with and cannot say what you bought.',
      neutral: 'You walk the whole market with your hands in your pockets, and the prices watch you go.',
      boon: 'One stall has exactly what you needed, and takes only what you can spare.',
      triumph: 'You leave a thing you did not need and take a thing you did, and the town lets you.',
    },
  },
  mirror: {
    id: 'mirror',
    rite: 'mirror',
    relic: 'shard',
    kind: 'mystery',
    hue: 300,
    minAct: 1,
    place: 'A standing pool so still it has an edge.',
    prompt: 'Your reflection is a moment behind you.',
    stakes: 1,
    affinity: {
      vessel: { truth: 2, illusion: 1, fear: -2 },
      threshold: { illusion: 2, water: 1, wisdom: 1 },
      hand: { patience: 2, wisdom: 1, action: -2 },
      wake: { truth: 2, renewal: 1, illusion: -2 },
    },
    outcomes: {
      calamity: 'You look too long. When you turn away, it does not.',
      harm: 'You see something in your face you did not want confirmed.',
      neutral: 'You wait for it to catch up. When it does, you both pretend it never lagged.',
      boon: 'It shows you a card you have not drawn yet.',
      triumph: 'You look, and it looks back, and for once you both agree.',
    },
  },
  gallows: {
    id: 'gallows',
    kind: 'threat',
    hue: 20,
    minAct: 1,
    place: 'A crossroads with a post. Rope, but no one in it.',
    prompt: 'A place where something was decided.',
    stakes: 2,
    affinity: {
      vessel: { truth: 1, order: 1, fear: -1 },
      threshold: { death: 1, ending: 1, truth: 1, order: 1 },
      hand: { sacrifice: 2, truth: 1, illusion: -2, binding: -1 },
      wake: { freedom: 2, renewal: 1, binding: -2, death: -1 },
    },
    outcomes: {
      calamity: 'The rope was for someone. It turns out to be you.',
      harm: 'You pass beneath it, and it brushes your neck as if remembering.',
      neutral: 'You take the road that leads away from it.',
      boon: 'Cut into the post: a name, and beneath it, a direction.',
      triumph: 'You cut the rope down, and the crossroads becomes a road.',
    },
  },
  procession: {
    id: 'procession',
    kind: 'passage',
    hue: 330,
    minAct: 1,
    place: 'A line of hooded figures on the road ahead, walking your way.',
    prompt: 'A procession. There is room for one more.',
    stakes: 1,
    affinity: {
      vessel: { patience: 1, order: 1, freedom: 1, chaos: -1 },
      threshold: { binding: 1, order: 2, death: 1 },
      hand: { patience: 2, order: 1, conflict: -2, action: -1 },
      wake: { freedom: 2, wisdom: 1, binding: -2 },
    },
    outcomes: {
      calamity: 'You join. The hood is comfortable. You do not remember why you were walking the other way.',
      harm: 'They pass, and one of them takes your hand on the way by, and keeps it a while.',
      neutral: 'You stand aside and let them pass.',
      boon: 'One of them presses something into your palm without breaking step.',
      triumph: 'They part around you like water, and when they are gone, the road is shorter.',
    },
  },
  storm: {
    id: 'storm',
    kind: 'threat',
    hue: 220,
    minAct: 2,
    place: 'Open moor. The sky is the wrong color and getting closer.',
    prompt: 'A storm. Nothing to shelter under for miles.',
    stakes: 2,
    affinity: {
      vessel: { patience: 1, power: 1, hope: 1, fear: -1 },
      threshold: { chaos: 2, air: 1, fire: 1, order: -1 },
      hand: { patience: 2, sacrifice: 1, action: -1, chaos: -2 },
      wake: { renewal: 2, truth: 1, loss: -1 },
    },
    outcomes: {
      calamity: 'Lightning finds you. It was looking.',
      harm: 'You are struck sideways by wind and wake in a ditch, wet and lighter.',
      neutral: 'It passes over. You are soaked and alive.',
      boon: 'The storm scours the moor and uncovers a road beneath the heather.',
      triumph: 'You stand in it, and it bends around you, and the sky remembers your shape.',
    },
  },
  library: {
    id: 'library',
    rite: 'hush',
    relic: 'lens',
    kind: 'mystery',
    hue: 60,
    minAct: 2,
    place: 'Shelves in a cave, dry as bone. Books that were never printed.',
    prompt: 'A library. One book is open, and the page is turning by itself.',
    stakes: 1,
    affinity: {
      vessel: { wisdom: 2, patience: 1, action: -1 },
      threshold: { wisdom: 1, truth: 1, illusion: 1, order: 1 },
      hand: { patience: 2, wisdom: 2, fire: -2, chaos: -1 },
      wake: { wisdom: 2, truth: 1, freedom: 1, binding: -1 },
    },
    outcomes: {
      calamity: 'You read. The book reads you back, and it is a faster reader.',
      harm: 'You lose a day in the pages and come out knowing something you would rather not.',
      neutral: 'You close the book. The page stops turning.',
      boon: 'The open page is about you, and it ends well.',
      triumph: 'You find the book that describes this room, and in it, the way out.',
    },
  },
  siege: {
    id: 'siege',
    kind: 'threat',
    hue: 10,
    minAct: 2,
    place: 'A wall with a gate. Something is trying to come through from the other side.',
    prompt: 'A gate holding. Barely.',
    stakes: 3,
    affinity: {
      vessel: { power: 1, order: 1, hope: 1, fear: -2 },
      threshold: { conflict: 2, fire: 1, chaos: 1 },
      hand: { power: 2, order: 1, action: 1, patience: -1, illusion: -2 },
      wake: { order: 1, renewal: 1, freedom: 1, loss: -2, ending: -1 },
    },
    outcomes: {
      calamity: 'The gate gives, and so do you.',
      harm: 'You hold the gate until dawn. It costs you, and the wall does not thank you.',
      neutral: 'Whatever it was stops trying, eventually.',
      boon: 'You brace the gate, and something on the far side goes quiet and does not return.',
      triumph: 'You open the gate. Whatever was pushing falls through, and it is smaller than it sounded.',
    },
  },
  shrine: {
    id: 'shrine',
    relic: 'candle',
    kind: 'rest',
    hue: 160,
    minAct: 2,
    mend: 2,
    place: 'A small shrine, candles lit, no one to have lit them.',
    prompt: 'An altar. It wants something, or it wants nothing. Hard to say.',
    stakes: 1,
    affinity: {
      vessel: { hope: 1, wisdom: 1, patience: 1, power: -1 },
      threshold: { order: 1, illusion: 1, love: 1 },
      hand: { sacrifice: 2, patience: 1, love: 1, action: -2, wealth: -1 },
      wake: { renewal: 2, hope: 2, loss: -1 },
    },
    outcomes: {
      calamity: 'You take a candle for the road. The shrine takes something for the road too.',
      harm: 'You leave nothing and the candles go out as you walk away, one by one, behind you.',
      neutral: 'You sit a while in the candlelight, and then go.',
      boon: 'You leave a small thing, and the ache you have carried for miles lifts.',
      triumph: 'You leave something that mattered, and the candles burn brighter, and so do you.',
    },
  },
  orchard: {
    id: 'orchard',
    kind: 'rest',
    hue: 95,
    minAct: 1,
    mend: 2,
    place: 'Rows of trees gone wild. Fruit on the ground, and more on the branches.',
    prompt: 'An orchard. Nobody has picked here in years.',
    stakes: 1,
    affinity: {
      vessel: { patience: 1, love: 1, wealth: 1, conflict: -1 },
      threshold: { earth: 1, renewal: 1, illusion: 1 },
      hand: { patience: 2, love: 1, wealth: 1, action: -1, power: -1 },
      wake: { renewal: 2, wealth: 1, hope: 1, loss: -1 },
    },
    outcomes: {
      calamity: 'The fruit is sweet. You are asleep before you finish it, and you do not wake for a long time.',
      harm: 'You eat too much of the wrong tree and walk on hollow.',
      neutral: 'You rest under the branches. The fruit stays where it is.',
      boon: 'You eat a little and fill your pockets, and the road ahead seems shorter for it.',
      triumph: 'You eat, and sleep, and wake to find the trees have leaned in to shade you.',
    },
  },
  toll: {
    id: 'toll',
    rite: 'tithe',
    kind: 'passage',
    hue: 35,
    minAct: 2,
    place: 'A narrow pass. A figure at a chain, and a bowl on the ground.',
    prompt: 'A toll. The keeper does not say what it costs.',
    stakes: 2,
    affinity: {
      vessel: { wealth: 1, truth: 1, patience: 1, power: -1 },
      threshold: { binding: 2, order: 1, illusion: 1 },
      hand: { sacrifice: 2, wisdom: 1, truth: 1, conflict: -2, chaos: -1 },
      wake: { freedom: 2, wealth: -1, binding: -2 },
    },
    outcomes: {
      calamity: 'You pay what is asked. It turns out to be more than you had, and the keeper takes the rest from you directly.',
      harm: 'You pay, and the chain drops, and you are lighter than you meant to be.',
      neutral: 'You put something in the bowl. The chain lowers. Neither of you speaks.',
      boon: 'You give the keeper something they did not expect, and they wave you on and keep the bowl.',
      triumph: 'You ask the keeper what it costs. They tell you. It is nothing you need.',
    },
  },
  ferry: {
    id: 'ferry',
    kind: 'passage',
    hue: 195,
    minAct: 1,
    place: 'A flat black river. A boat, a pole, and someone holding it.',
    prompt: 'A ferry. The far bank is there, and then it is not.',
    stakes: 1,
    affinity: {
      vessel: { patience: 1, truth: 1, water: 1, wisdom: 1, chaos: -1 },
      threshold: { water: 2, death: 1, illusion: 1, fire: -1 },
      hand: { sacrifice: 1, patience: 2, wisdom: 1, action: -1, conflict: -2 },
      wake: { freedom: 1, renewal: 1, ending: 1, hope: 1, fear: -1 },
    },
    outcomes: {
      calamity: 'Halfway over, the ferryman stops poling and looks at you, and you understand that the fare was never coin.',
      harm: 'You reach the bank soaked to the ribs. The boat is already gone when you look back.',
      neutral: 'The pole goes in, the pole comes out. The far bank arrives on its own time.',
      boon: 'You sit still and say nothing, and the ferryman tells you a thing about the road that saves you a day.',
      triumph: 'You take the pole. The ferryman lets you. The river is shallower than it looked, and you are across before you notice.',
    },
  },
  hollow: {
    id: 'hollow',
    rite: 'moonlit',
    relic: 'bell',
    kind: 'mystery',
    hue: 120,
    minAct: 1,
    place: 'A tree wide as a house, split open. Something inside it is humming.',
    prompt: 'A hollow. The humming stops when you get close.',
    stakes: 1,
    affinity: {
      vessel: { wisdom: 1, patience: 1, fear: 1, power: -1 },
      threshold: { earth: 2, illusion: 1, binding: 1, order: -1 },
      hand: { truth: 2, love: 1, patience: 1, fire: -2, conflict: -1 },
      wake: { renewal: 2, wisdom: 1, freedom: 1, chaos: -1, loss: -1 },
    },
    outcomes: {
      calamity: 'You reach in. Something reaches back, and it has been waiting to be reached for.',
      harm: 'You put your ear to the bark and it hums a note that stays in your teeth for miles.',
      neutral: 'You circle the tree once. The humming starts again when you are far enough away.',
      boon: 'You answer the hum with one of your own, badly, and the tree drops something at your feet.',
      triumph: 'You climb inside and the humming closes over you like water, and you come out knowing the road ahead by heart.',
    },
  },
  feast: {
    id: 'feast',
    kind: 'threat',
    hue: 340,
    minAct: 2,
    place: 'A hall with no roof. A long table, laid for a wedding, and every chair full.',
    prompt: 'A feast. They turn to look at you together, and then they smile together.',
    stakes: 2,
    affinity: {
      vessel: { truth: 1, wisdom: 1, freedom: 1, love: -1 },
      threshold: { illusion: 2, binding: 2, love: 1, death: 1, truth: -1 },
      hand: { wisdom: 2, freedom: 1, patience: 1, love: -2, wealth: -1 },
      wake: { freedom: 2, truth: 1, ending: 1, binding: -2, loss: -1 },
    },
    outcomes: {
      calamity: 'You sit. You eat. There is a chair with your name on it, and there always has been.',
      harm: 'You drink the toast and the hall spins and you wake on the road with your pockets turned out.',
      neutral: 'You raise a hand to them and walk the length of the hall and out the other side. Nobody stops smiling.',
      boon: 'You tell the bride the truth about the groom, and the whole table blinks out like a candle, and leaves the food.',
      triumph: 'You refuse the chair, kindly, and the guests go grey and thin, and one of them thanks you.',
    },
  },
  wolves: {
    id: 'wolves',
    kind: 'threat',
    hue: 220,
    minAct: 1,
    place: 'Snow between black trunks. Prints, many, all going one way.',
    prompt: 'Wolves. You cannot see them. That is not the same as being alone.',
    stakes: 1,
    affinity: {
      vessel: { patience: 1, wisdom: 1, fear: 1, chaos: -1 },
      threshold: { conflict: 2, fear: 1, earth: 1, love: -1 },
      hand: { power: 2, order: 1, patience: 1, fear: -2, action: 1 },
      wake: { freedom: 2, ending: 1, order: 1, loss: -2 },
    },
    outcomes: {
      calamity: 'You run. Everything that has ever run from wolves knows how this ends.',
      harm: 'They test you once, at the ankle, and decide you are not worth the rest.',
      neutral: 'You walk the whole way with your back straight and never see one. That was the point.',
      boon: 'You stand your ground at the tree line, and one of them, the grey one, sits down.',
      triumph: 'You walk between them and they fall in beside you, and for a mile you have an escort.',
    },
  },
  lighthouse: {
    id: 'lighthouse',
    kind: 'passage',
    hue: 50,
    minAct: 2,
    place: 'A tower on a spit of rock. The lamp turns. There is no sea.',
    prompt: 'A light. It sweeps over something out there, and back.',
    stakes: 2,
    affinity: {
      vessel: { hope: 1, truth: 1, patience: 1, illusion: -1 },
      threshold: { illusion: 2, fire: 1, order: 1, water: -1 },
      hand: { wisdom: 2, truth: 1, action: 1, fear: -2, chaos: -1 },
      wake: { hope: 2, beginning: 1, wisdom: 1, loss: -1, fear: -1 },
    },
    outcomes: {
      calamity: 'You follow the beam out onto the rock, and out, and the rock is not there under the beam.',
      harm: 'You climb to the lamp and it turns to face you, and for a while you cannot see anything else.',
      neutral: 'You keep to the shadow between sweeps and pass beneath it.',
      boon: 'You wait for the beam and look where it looks, and there, far out, is the way down.',
      triumph: 'You climb, and turn the lamp yourself, and put its light on the thing that was waiting for you.',
    },
  },
  tomb: {
    id: 'tomb',
    rite: 'bare',
    kind: 'mystery',
    hue: 290,
    minAct: 2,
    place: 'A low door in a hill. Cold air moves out of it, steady as breath.',
    prompt: 'A tomb. The name over the door is yours, misspelled.',
    stakes: 2,
    affinity: {
      vessel: { death: 1, wisdom: 1, patience: 1, hope: -1 },
      threshold: { death: 2, ending: 1, earth: 1, renewal: -1 },
      hand: { truth: 2, patience: 1, sacrifice: 1, wisdom: 1, fear: -1, action: -1 },
      wake: { renewal: 2, beginning: 1, freedom: 1, hope: 1, binding: -1 },
    },
    outcomes: {
      calamity: 'You go in to correct the spelling. The door does not so much close as stop having been open.',
      harm: 'You read the name aloud and something in the hill repeats it back, closer to right.',
      neutral: 'You touch the letters once and go on. It is not your name yet.',
      boon: 'You leave a stone on the sill, as one does, and the cold air turns and goes back in.',
      triumph: 'You go in, and sit a while with whoever it is, and come out lighter than you went.',
    },
  },
  bell: {
    id: 'bell',
    kind: 'passage',
    hue: 45,
    minAct: 1,
    place: 'A bell tower with no bell. The rope still hangs, and it is warm.',
    prompt: 'A tower. Someone has to ring it, or nobody does.',
    stakes: 1,
    affinity: {
      vessel: { hope: 1, action: 1, order: 1, fear: -1 },
      threshold: { air: 2, truth: 1, illusion: 1, earth: -1 },
      hand: { action: 2, truth: 1, freedom: 1, patience: -1, illusion: -1 },
      wake: { beginning: 2, hope: 1, order: 1, chaos: -1 },
    },
    outcomes: {
      calamity: 'You pull the rope. Far below, something that had been waiting for exactly that sound begins to climb.',
      harm: 'You pull, and the tower rings with no bell in it, and your teeth ache for the rest of the day.',
      neutral: 'You hold the rope a while and let it go. The warmth stays in your palm a little way down the road.',
      boon: 'You ring it. Across the valley another tower answers, and the road between you is suddenly plain.',
      triumph: 'You ring it, and the bell that was never there rings back, and every door for a mile stands open.',
    },
  },
  hearth: {
    id: 'hearth',
    rite: 'ember',
    kind: 'rest',
    hue: 20,
    minAct: 2,
    mend: 3,
    place: 'A house with its door open and a fire lit inside. No one is home.',
    prompt: 'A hearth, still burning. Whose?',
    stakes: 1,
    affinity: {
      vessel: { patience: 2, hope: 1, love: 1, conflict: -1 },
      threshold: { fire: 1, illusion: 1, binding: 1, chaos: -1 },
      hand: { patience: 2, order: 1, love: 1, action: -1, wealth: -2 },
      wake: { renewal: 2, love: 1, freedom: 1, binding: -1 },
    },
    outcomes: {
      calamity: 'You sleep by the fire. In the night the house remembers whose it is, and you are not on the list.',
      harm: 'You warm yourself and take something small from the mantel, and the fire goes out at once, and stays out.',
      neutral: 'You sit by the fire until it is low, and leave it as you found it, and no one comes.',
      boon: 'You feed the fire and sleep. In the morning there is bread on the table, still warm, and the door is wider.',
      triumph: 'You sleep, and someone sits with you through the night and mends what you carry, and is gone by dawn.',
    },
  },
  ice: {
    id: 'ice',
    kind: 'threat',
    hue: 195,
    minAct: 2,
    place: 'A frozen river, wide and white. Something long is moving under it.',
    prompt: 'The ice. It will hold you, or it will decide not to.',
    stakes: 2,
    affinity: {
      vessel: { patience: 2, fear: 1, order: 1, chaos: -1, fire: -1 },
      threshold: { water: 2, illusion: 1, death: 1, earth: -1 },
      hand: { patience: 2, wisdom: 1, truth: 1, action: -2, power: -1 },
      wake: { freedom: 2, renewal: 1, hope: 1, loss: -1 },
    },
    outcomes: {
      calamity: 'You run. The ice waits until the middle, and the long thing under it has been waiting longer.',
      harm: 'You cross, and the ice speaks the whole way, and at the far bank your boots are full of the river.',
      neutral: 'You cross slowly, one foot listening to the other. The thing beneath keeps pace and does not surface.',
      boon: 'You cross so lightly the river forgets you are there, and on the far bank the thaw has already begun.',
      triumph: 'You stop in the middle and look down, and what is under the ice looks back and lets you pass, and follows no further.',
    },
  },
  mill: {
    id: 'mill',
    kind: 'mystery',
    hue: 60,
    minAct: 1,
    place: 'A windmill turning with no wind. Flour dust in the air, and no grain.',
    prompt: 'A mill. Something is being ground.',
    stakes: 1,
    affinity: {
      vessel: { wisdom: 1, patience: 1, fear: 1, action: -1 },
      threshold: { order: 2, illusion: 1, air: 1, chaos: -1 },
      hand: { truth: 2, patience: 1, wisdom: 1, power: -1, action: -1 },
      wake: { wealth: 1, renewal: 1, hope: 1, loss: -2 },
    },
    outcomes: {
      calamity: 'You go in to see what it grinds. The stones are patient, and you are the answer.',
      harm: 'You climb to the sails to stop them, and they stop, and every mill for a day around begins to turn instead.',
      neutral: 'You watch the sails a while. They turn. Nothing you can name is being milled.',
      boon: 'You leave a handful of what you carry on the stone, and the mill gives back flour, and the flour is bread by dusk.',
      triumph: 'You put your hand to the stone and it stops, and in the quiet you understand what was being ground, and it was never you.',
    },
  },
  chapel: {
    id: 'chapel',
    kind: 'passage',
    hue: 270,
    minAct: 2,
    place: 'A chapel sunk to its windows in the marsh. The candles inside are lit.',
    prompt: 'A drowned chapel. A service is in progress.',
    stakes: 2,
    affinity: {
      vessel: { hope: 1, wisdom: 1, sacrifice: 1, power: -1 },
      threshold: { water: 2, death: 1, binding: 1, fire: -1 },
      hand: { patience: 2, love: 1, truth: 1, conflict: -1, chaos: -1 },
      wake: { renewal: 2, freedom: 1, hope: 1, binding: -2 },
    },
    outcomes: {
      calamity: 'You wade in and take a pew. The service is very long, and the water does not mind waiting.',
      harm: 'You wade in and the congregation turns, all at once, and for a week you cannot get the hymn out of your head.',
      neutral: 'You stand at the door and listen. The words are yours to almost recognize. You go on.',
      boon: 'You wade in and say the one line you remember, and the water lets you cross where the aisle used to be.',
      triumph: 'You take a candle from the altar and carry it out, and it burns all the way to the far side of the marsh, and it burns under water.',
    },
  },
  hunt: {
    id: 'hunt',
    kind: 'threat',
    hue: 0,
    minAct: 1,
    place: 'Horns behind you, and hooves. The road ahead has no cover.',
    prompt: 'A hunt. You are not sure yet which side of it you are on.',
    stakes: 2,
    affinity: {
      vessel: { action: 2, freedom: 1, fear: 1, patience: -1 },
      threshold: { conflict: 2, power: 1, chaos: 1, love: -1 },
      hand: { action: 2, wisdom: 1, illusion: 1, patience: -2, hope: -1 },
      wake: { freedom: 2, fortune: 1, renewal: 1, binding: -1 },
    },
    outcomes: {
      calamity: 'You run, and it is what they hoped you would do. The horns come round in front of you.',
      harm: 'You run until the horns fade, and find you have run the wrong way, and lost the whole morning to it.',
      neutral: 'You step off the road and stand still in the ditch, and the hunt goes by you like weather.',
      boon: 'You turn and walk toward the horns, and the riders slow, and one of them nods, and the hunt goes on without you.',
      triumph: 'You whistle, and the hounds come to you, and the riders find they have been hunting on your behalf all along.',
    },
  },
  abyss: {
    id: 'abyss',
    rite: 'look',
    kind: 'abyss',
    hue: 260,
    minAct: 3,
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

// --- the map ---------------------------------------------------------------

export interface MapNode {
  id: string;
  sceneId: string;
  kind: SceneKind;
  act: number;
  layer: number;
}

/** Layers per act. The last act is the Abyss alone. */
export const ACT_LAYERS = [4, 4];
export const TOTAL_LAYERS = ACT_LAYERS.reduce((a, b) => a + b, 0) + 1;

/**
 * A layered map: every node in layer N connects to every node in layer N+1.
 * Cheap to render on a phone, still gives a real choice each step.
 */
export function buildMap(rng: { pick<T>(arr: readonly T[]): T; int(max: number): number }, actLayers: readonly number[] = ACT_LAYERS): MapNode[][] {
  const layers: MapNode[][] = [];
  const used = new Set<string>();
  let layerIndex = 0;
  actLayers.forEach((count, actIdx) => {
    const act = actIdx + 1;
    const pool = Object.values(SCENES).filter((s) => !s.terminal && s.minAct <= act);
    for (let l = 0; l < count; l++) {
      const width = 2 + rng.int(2); // 2-3 nodes
      const layer: MapNode[] = [];
      const kindsHere = new Set<SceneKind>();
      for (let n = 0; n < width; n++) {
        // Prefer unused scenes and kinds not already in this layer.
        let candidates = pool.filter((s) => !used.has(s.id) && !kindsHere.has(s.kind));
        if (candidates.length === 0) candidates = pool.filter((s) => !used.has(s.id));
        if (candidates.length === 0) candidates = pool;
        // Rest scenes only from the second layer of an act onward.
        if (l === 0) candidates = candidates.filter((s) => s.kind !== 'rest').length ? candidates.filter((s) => s.kind !== 'rest') : candidates;
        const scene = rng.pick(candidates);
        used.add(scene.id);
        kindsHere.add(scene.kind);
        layer.push({ id: `${layerIndex}-${n}`, sceneId: scene.id, kind: scene.kind, act, layer: layerIndex });
      }
      layers.push(layer);
      layerIndex++;
    }
  });
  layers.push([{ id: `${layerIndex}-0`, sceneId: 'abyss', kind: 'abyss', act: actLayers.length + 1, layer: layerIndex }]);
  return layers;
}

export function actOfLayer(layer: number, actLayers: readonly number[] = ACT_LAYERS): number {
  let acc = 0;
  for (let i = 0; i < actLayers.length; i++) {
    acc += actLayers[i];
    if (layer < acc) return i + 1;
  }
  return actLayers.length + 1;
}
