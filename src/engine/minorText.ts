import type { Suit } from './cards';

/**
 * Hand-authored text for the 56 Minor Arcana.
 *  m: hidden meaning (upright / reversed)
 *  o: omen line shown in resolution narration (upright / reversed)
 * Omens never define the card; they show what it did.
 */
export interface MinorText {
  m: [string, string];
  o: [string, string];
}

export const MINOR_TEXT: Record<Suit, Record<number, MinorText>> = {
  wands: {
    1: { m: ['A spark in the hand. The first push of a new will.', 'A spark that will not catch. False starts, wasted heat.'], o: ['Something caught fire in your hands.', 'You struck, and struck, and got only smoke.'] },
    2: { m: ['The world held like a globe. Planning, choosing a direction.', 'Fear of the far road. Plans made and not left.'], o: ['You looked at the whole of it, and chose.', 'You looked at the whole of it, and stayed.'] },
    3: { m: ['Ships sent out. Expansion, foresight, waiting for return.', 'Ships that do not come back. Delay, obstacles.'], o: ['What you sent ahead came back with more.', 'What you sent ahead did not come back.'] },
    4: { m: ['A garland over the gate. Celebration, home, welcome.', 'A feast with the doors shut. Transience, a home unsettled.'], o: ['There was a welcome waiting.', 'The gate was hung with flowers, and shut.'] },
    5: { m: ['Five sticks in a scrum. Competition, friction, sport.', 'Conflict avoided, or conflict turned inward.'], o: ['Everyone wanted the same thing at once.', 'The fight went out of it, and so did the point.'] },
    6: { m: ['A rider crowned in laurel. Victory, recognition.', 'A crown too heavy. Fall from favor, pride.'], o: ['They saw what you did, and said so.', 'The praise was for someone else.'] },
    7: { m: ['Holding the high ground. Defiance, perseverance.', 'Overwhelmed. Giving up the high ground.'], o: ['You held the slope.', 'You lost the slope by inches.'] },
    8: { m: ['Eight wands in flight. Speed, news, movement.', 'Arrows falling short. Delay, haste without arrival.'], o: ['It all happened very fast.', 'It all happened very fast, and in the wrong order.'] },
    9: { m: ['Bandaged and still standing. Resilience, the last watch.', 'Paranoia. Fatigue. The wall guarded too long.'], o: ['You were tired, and you did not sit down.', 'You guarded a wall no one was coming for.'] },
    10: { m: ['Ten wands carried alone. Burden, the cost of success.', 'Setting the load down. Or being crushed by it.'], o: ['You carried all of it.', 'You put it down, and it was heavier than you knew.'] },
    11: { m: ['A young one with a new staff. Enthusiasm, a message of fire.', 'Hasty, unfocused, all spark and no plan.'], o: ['You were eager, and the eagerness opened a door.', 'You were eager, and the eagerness tripped you.'] },
    12: { m: ['A rider at full charge. Passion, impulse, adventure.', 'Recklessness. The charge with no one behind it.'], o: ['You went at it hard and fast.', 'You went at it hard and fast, and alone.'] },
    13: { m: ['A warm throne, a black cat. Confidence, charisma, warmth.', 'Jealousy, a warmth turned demanding.'], o: ['You made the room yours.', 'You made the room yours, and it resented you.'] },
    14: { m: ['A king in flame. Leadership, vision, bold command.', 'A tyrant in flame. Impulsive, ruthless, loud.'], o: ['You led, and they followed.', 'You led, and you did not look back to see if they followed.'] },
  },
  cups: {
    1: { m: ['The cup overflows. Love beginning, a heart opened.', 'A cup spilled. Blocked feeling, emptiness.'], o: ['Something in you opened.', 'Something in you stayed shut.'] },
    2: { m: ['Two cups raised together. Partnership, attraction, accord.', 'A toast unanswered. Imbalance, a bond strained.'], o: ['You and another agreed without speaking.', 'You reached across, and no one reached back.'] },
    3: { m: ['Three cups lifted. Friendship, celebration, community.', 'Too much wine. Gossip, isolation from the group.'], o: ['You were not alone in it.', 'The company turned on you, or you on it.'] },
    4: { m: ['A cup offered, unnoticed. Apathy, contemplation, missed gifts.', 'Waking up. Noticing the cup at last.'], o: ['Something was offered, and you did not see it.', 'You looked up, finally.'] },
    5: { m: ['Three cups spilled, two standing. Grief, loss, what remains.', 'Acceptance. Turning to the two cups.'], o: ['You mourned what spilled.', 'You turned, and saw what still stood.'] },
    6: { m: ['Flowers given in a garden. Nostalgia, innocence, kindness.', 'Stuck in the past. A childhood that will not let go.'], o: ['Something old and kind came back to you.', 'You went looking for a garden that was gone.'] },
    7: { m: ['Seven cups in the clouds. Choices, illusion, wishful thinking.', 'Clarity. Choosing one cup and leaving the rest.'], o: ['Every choice looked like the right one.', 'You picked, and the clouds emptied.'] },
    8: { m: ['Walking away from eight cups. Leaving, seeking, letting go.', 'Staying too long. Fear of the walk.'], o: ['You left something behind on purpose.', 'You stayed with what no longer held water.'] },
    9: { m: ['A satisfied host. Wishes granted, contentment.', 'Smugness. A wish granted and found hollow.'], o: ['You got what you wanted.', 'You got what you wanted, and it was not enough.'] },
    10: { m: ['A rainbow of cups. Harmony, family, lasting joy.', 'A home broken. Harmony performed, not felt.'], o: ['It was, for a while, whole.', 'It looked whole from the road.'] },
    11: { m: ['A fish in the cup. A message of the heart, imagination.', 'Emotional immaturity. Dreams that mislead.'], o: ['Something small and strange spoke to you.', 'You believed the fish.'] },
    12: { m: ['A knight bearing a cup. Romance, invitation, charm.', 'Moodiness. A charm that manipulates.'], o: ['An invitation came, and you accepted.', 'The invitation was not what it seemed.'] },
    13: { m: ['A throne by the sea. Compassion, intuition, calm depth.', 'Dependence. Feelings that flood.'], o: ['You felt it before it arrived, and made room.', 'It flooded you.'] },
    14: { m: ['A king on the water. Balance of heart and head, diplomacy.', 'Manipulation. A heart that steers by hidden currents.'], o: ['You kept your footing on the water.', 'You steered by a current you would not admit to.'] },
  },
  swords: {
    1: { m: ['A blade through a crown. Clarity, breakthrough, truth cut clean.', 'Confusion. A blade with no edge, or turned on you.'], o: ['You saw it plainly.', 'You could not think straight.'] },
    2: { m: ['Blindfolded, swords crossed. Stalemate, a decision refused.', 'Information withheld. The blindfold slipping.'], o: ['You held two things apart and chose neither.', 'The blindfold slipped, and you wished it had not.'] },
    3: { m: ['A heart pierced thrice. Heartbreak, grief, painful truth.', 'Recovery. The swords drawn out one at a time.'], o: ['It hurt, and it was true.', 'The hurt began to leave you.'] },
    4: { m: ['A knight resting on a tomb. Rest, recovery, retreat.', 'Restlessness. Rest refused or rest forced.'], o: ['You lay still.', 'You could not lie still.'] },
    5: { m: ['A grin over dropped swords. Hollow victory, conflict at any cost.', 'Reconciliation, or a defeat admitted.'], o: ['You won, and it cost more than losing.', 'You laid the sword down.'] },
    6: { m: ['A ferry across still water. Transition, moving on, quiet passage.', 'Baggage that will not stay behind. A crossing resisted.'], o: ['You were carried across.', 'You dragged the past into the boat.'] },
    7: { m: ['A thief with five swords. Deception, strategy, getting away with it.', 'Conscience. A secret slipping out.'], o: ['You took what you could carry and did not look back.', 'What you took was noticed.'] },
    8: { m: ['Bound among swords. Restriction, a trap of the mind.', 'Release. The bonds were never tight.'], o: ['You could not see the way out.', 'The bonds loosened when you moved.'] },
    9: { m: ['Awake at night, nine swords on the wall. Anxiety, dread, nightmares.', 'The dread easing. Or the nightmare made real.'], o: ['You did not sleep.', 'You slept, and wished you had not.'] },
    10: { m: ['Ten swords in a back. An ending, rock bottom, betrayal.', 'Survival. Getting up with the swords still in.'], o: ['It ended badly, and it ended.', 'You got up anyway.'] },
    11: { m: ['A young one with a raised sword. Curiosity, vigilance, a sharp message.', 'Gossip, cruelty, a mind used carelessly.'], o: ['You noticed something no one else did.', 'You said something you could not take back.'] },
    12: { m: ['A knight charging into wind. Directness, speed, ambition.', 'Rashness. Words as weapons.'], o: ['You cut straight through.', 'You cut, and you were not careful where.'] },
    13: { m: ['A stern throne in the clouds. Clear judgment, independence, honesty.', 'Coldness, bitterness, a truth used to wound.'], o: ['You saw clearly and said so.', 'You saw clearly, and it made you cruel.'] },
    14: { m: ['A king with a sword upright. Authority of mind, law, discipline.', 'Tyranny of the mind. Manipulation, cold rule.'], o: ['You judged, and the judgment held.', 'You judged, and no one thanked you.'] },
  },
  pentacles: {
    1: { m: ['A coin held out from a cloud. Opportunity, prosperity, a seed.', 'A chance missed. Money lost, a seed unplanted.'], o: ['You were given something you could hold.', 'The coin rolled away.'] },
    2: { m: ['Two coins juggled. Balance, adaptability, priorities.', 'Overwhelm. Too many coins, all dropped.'], o: ['You kept both in the air.', 'You dropped one, then the other.'] },
    3: { m: ['A mason and two patrons. Craft, teamwork, work recognized.', 'Shoddy work. A team that does not listen.'], o: ['The work was good, and others saw it.', 'The work was rushed, and it showed.'] },
    4: { m: ['A figure clutching four coins. Security, control, holding on.', 'Greed loosened, or greed at its worst.'], o: ['You held what you had.', 'You held what you had until your hands hurt.'] },
    5: { m: ['Two beggars past a lit window. Hardship, exclusion, cold.', 'Recovery. A door opening.'], o: ['You were outside, and it was cold.', 'Someone opened the door.'] },
    6: { m: ['Coins given, coins weighed. Generosity, charity, fair exchange.', 'Debt. Charity with strings.'], o: ['Something was given, and it was enough.', 'What was given came with a ledger.'] },
    7: { m: ['A farmer leaning on a hoe. Patience, assessment, slow return.', 'Impatience. A crop that failed.'], o: ['You waited, and it grew.', 'You waited, and it did not.'] },
    8: { m: ['A craftsman at his bench. Diligence, mastery through repetition.', 'Perfectionism. Work without purpose.'], o: ['You did the work again, better.', 'You did the work again, and again, for no one.'] },
    9: { m: ['A woman in a vineyard. Abundance, self-sufficiency, luxury.', 'Living beyond means. Isolation in comfort.'], o: ['You had enough, and it was yours.', 'You had enough, and no one to show it to.'] },
    10: { m: ['Three generations under an arch. Legacy, wealth, family.', 'Family strife. A legacy squandered.'], o: ['It would outlast you.', 'It would not outlast you.'] },
    11: { m: ['A student holding a coin. Study, a practical message, a new skill.', 'Laziness. A lesson not learned.'], o: ['You learned by handling it.', 'You handled it and learned nothing.'] },
    12: { m: ['A knight on a still horse. Reliability, routine, slow progress.', 'Stagnation. Boredom. A horse that will not move.'], o: ['You went slowly, and you got there.', 'You went slowly, and you stopped.'] },
    13: { m: ['A throne in a garden. Nurture, practicality, comfort provided.', 'Smothering. Self-neglect. A garden gone to weeds.'], o: ['You made it comfortable for others.', 'You made it comfortable for others and forgot yourself.'] },
    14: { m: ['A king among vines. Wealth, security, mastery of the material.', 'Greed, stubbornness, wealth as a wall.'], o: ['You had what you needed, and more, and knew it.', 'You had more than you needed, and wanted more.'] },
  },
};
