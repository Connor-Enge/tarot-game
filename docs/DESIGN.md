# Arcana Descent — Design Notes

Contents: [Pitch](#the-pitch-in-one-breath) · [Pillars](#pillars) ·
[Core loop](#core-loop) · [Knowledge](#knowledge-the-codex) ·
[Systems, as built](#systems-as-built) · [Daily weather](#daily-weather) ·
[Signature](#signature) · [Turn](#turn) · [The Stranger](#the-strangers-trade) ·
[Vows](#vows) · [Balance](#balance) · [Authoring a scene](#authoring-a-scene) ·
[Content debt](#content-debt) · [Open questions](#open-questions)

Working title. A mobile-first roguelike built on one mechanic: **the four-seat spread**.

## The pitch in one breath

You descend. At every scene you lay a reading of four cards, choosing each from
three dealt to you. The reading *is* what happens. Nobody tells you what the
cards mean. You learn by watching what they do, and by dying with them on the
table.

## Pillars

1. **Meaning is earned, never explained.** No tooltips, no glossary, no tutorial
   text. The Codex only ever shows what you have unlocked through play.
2. **The reading is the action.** There is no separate combat or dialogue
   system. Four cards in four seats, scored against the scene, is the whole
   resolution. Every other system feeds into or out of that.
3. **Death teaches.** The four cards on the table when you die are revealed in
   full. The run you lose is the run you learn the most from.
4. **Knowledge is the only meta-progression.** No stat unlocks, no starting
   bonuses. A veteran and a newcomer draw the same deck; the veteran just
   *understands* it.

## Core loop

```
Title ─► Scene prompt ─► Seat 1: 3 dealt, pick 1 ─► Seat 2 ─► Seat 3 ─► Seat 4
                                                                          │
     ┌────────────────────────────────────────────────────────────────────┘
     ▼
  Resolve: score reading vs scene ─► narration (4 omens + outcome) ─► deltas
     │
     ├─ vitality ≤ 0 ─► DEATH ─► reveal final spread ─► Codex grows ─► Title
     ├─ terminal scene ─► ASCENSION ─► master final spread ─► Title
     └─ otherwise ─► next scene
```

### The four seats

**Laid as a mini cross** (owner's request, matching their guide book):
seat 1, the Situation, sits in the centre; seat 2, the Challenge, above
it; seat 3, the Hidden Insight, to the left; seat 4, the Guidance, to
the right. They are dealt in that order. The Wake (what follows,
unseen) takes the Hidden Insight, and the Hand (what you do) takes the
Guidance, because the scenes' affinities were already written that way:
the Hand asks for courses of action, the Wake for what comes after. So
`SLOT_IDS` deals vessel, threshold, wake, hand. The positions are shown
always (number and role); the seats' own names still wait for
`seatsNamed`. Under the hand, before a card is lifted, the position
asks its question ("What is the situation?", "What stands in the
way?", "What might you be missing?", "What is the best course?"), and
Study's seat question and the Codex's seat memory carry the position
labels too.

**The reckoning** (also the owner's request: the story was too vague):
when a reading resolves, each seat's omen line is followed by plain
sentences in the position's own terms: "The situation called for
patience and wisdom, and could not bear action. The Knight of Wands
brought action, and lay reversed. It cost you." (the Challenge opens
"What stood in the way answered to…", the Hidden Insight "What you
might have missed here was…", the Guidance "The best course was…"),
with the seat's
score in a chip, and the outcome line is followed by the tally: "the
four seats −3, named readings +1: −2 in all, which reads as harm." The
end screen's final spread carries the same lines. This names only the
tags that mattered in that scene, which is the sanctioned post-mortem;
a card's full meaning still waits for the Codex tier.


Seats are shown as glyphs only until the first death names them.

| Seat | Glyph | Role |
|------|-------|------|
| The Vessel | ◯ | Who you are as you enter this. |
| The Threshold | △ | The true shape of what stands before you. |
| The Hand | ☐ | What you do. |
| The Wake | ☾ | What follows in your wake. |

Why these and not Past/Present/Future: the scene prompt is deliberately
underwritten ("A crossing. Something below is breathing."). The *player*
decides what the crossing really is by what they put in the Threshold, and
what they do about it by what they put in the Hand. The reading doesn't
predict the scene; it authors it.

### Every card answers at once

Owner's request: consequences should land on each placement, not only
after all four. So the moment a card lands in a seat it is scored and
reckoned (`readingSoFar`): the seat shows its score chip, a plate under
the spread shows that card's omen line and its reckoning sentence, and
a five-band meter (calamity to triumph) moves a pin to the running
total with "reads as boon if nothing else moves it". Vitality and
Clarity still settle when the fourth card lands, because the tier is a
threshold on the whole, and named readings settle only then too. What
changes is that the fourth card is never a surprise: you watch the
reading tip with each choice, and can redraw, whisper, turn or hold
knowing exactly what the last seat needs.

For readers who want the numbers to bite per card as well, Settings
has "Every seat answers in Clarity" (`seatTick`, off by default, taken
into the run's mods at the start of the next descent): a seat the card
cost takes one Clarity the moment it lands, a seat it served gives one
back, never below zero. The plate under the spread says so. The
balance guard runs with it off. Returning with it on earns the sigil
Answered in Clarity.

### The 3-of-1 choice

Each seat deals three face-up cards. Face-up matters: the player sees the
name and art and must reason from vibes, half-remembered omens, and Codex
scraps. Rejected cards go to discard. Redrawing a seat costs Clarity.

Open question: should the three candidates be dealt all at once (12 cards,
full information, more of a puzzle) or seat by seat (current, more tension,
less analysis paralysis on a phone)? Current choice: seat by seat. Revisit
after playtesting.

### Resolution

`resolveReading(scene, reading)` in `src/engine/resolve.ts`:

1. Each card has upright/reversed **tags** (`fire`, `patience`, `binding`, ...).
2. Each scene has per-seat **affinities**: a weight per tag. The beast rewards
   `power` and `patience` in the Hand and punishes `chaos`; the well rewards
   `sacrifice` in the Hand and `wisdom` in the Wake.
3. Sum of weights across the four seats, minus a small penalty per reversed
   card, plus any **combos** (Tower in the Threshold + Star in the Wake: "After
   the fall, a light."), gives a total.
4. Total maps to a tier: calamity / harm / neutral / boon / triumph.
5. Tier picks the scene's outcome line and the vitality/clarity deltas. Harm is
   scaled by scene stakes.

Narration is four **omens** (one per card, orientation-aware, no meaning
stated) followed by the outcome. This is the main channel through which
meaning leaks: "Where the Tower stood, stone gave way" tells you what the
Tower is without a definition.

### Resources

- **Vitality (♥)** — hit points. Starts at 10. Zero is death.
- **Clarity (◈)** — spent to redraw a seat. Earned by neutral-or-better
  outcomes. Later: spend to peek at a candidate's Codex entry mid-run, or to
  flip a card's orientation.

## Knowledge (the Codex)

**The guide page** (`src/engine/lore.ts`, owner's request: the old
one-line meanings were far too thin): every one of the 78 cards has a
full page in the Codex, in the shape of a printed guidebook: a
description of the picture and what it symbolises, the upright meaning,
how it reads for relationships and for career, and the reversed
meaning, with upright and reversed keywords above. The 56 Minors' keywords
are written per card too (`MINOR_KEYWORDS`), replacing the old
rank templates, so a whisper of the Ten of Cups says "harmony", not
"completion". Pages are shown by
tier: keywords at glimpsed, the page at known, the reversed half at
mastered. Nothing of it ever appears on a card face or in a reading.


`src/engine/knowledge.ts`. Per card, a tier:

| Tier | Name | Unlocks | How |
|------|------|---------|-----|
| 0 | unread | name + art | default |
| 1 | glimpsed | upright keywords | card resolved in 3 readings |
| 2 | known | upright meaning | card was in your final spread at death |
| 3 | mastered | reversed meaning too | reversed in final spread at death, or in final spread at ascension |

Tiers never go down. Persisted to `localStorage`.

Ideas queued:
- **Seat affinity hints**: after a card has been played in a seat N times,
  show a faint "sits well in ☐" note.
- **Scene memory**: after dying in a scene twice, its affinities start to
  show as faint tag glyphs.
- **Whispers**: mid-run, spend Clarity to hear one keyword for one candidate.
- **The Fool's exception**: the very first run could reveal one random card
  in full, so the player has one anchor.

## Systems, as built

Each entry names the file that owns it. Together with *Core loop* and
*Knowledge* above, this is the whole game.

**The map** (above it, once a scene has been read, a story line recalls the last scene's place and its tally, so the road remembers how the last reading went) (art pass: choosable doors are tinted by kind, red for
threat, green for rest, violet for mystery, gold for passage; layers
more than one ahead fade and desaturate, and the deepest blur a touch,
so the road falls away into fog; the Abyss wears a slow-turning vortex
ring that quickens when it is the door in front of you) (`buildMap` in `scenes.ts`): two acts of four layers each, then
the Abyss. Every layer holds 2-3 nodes and every node connects to every node
in the next layer. Nodes show only a *kind* glyph (threat ⚔, passage ⛩,
mystery ✧, rest ♨, abyss ◉), never the scene. Scenes have a `minAct` so the
second act draws from a harder pool. Rest never appears in the first layer.

**Marks** (`run.marks`): a triumph *charges* the four cards you played; a
calamity *scars* them. Charged cards always land upright and score +1.
Scarred cards always land reversed. Marks last the run. The deck remembers
what you did with it.

**Whisper**: spend 1 Clarity to hear one keyword of the lifted candidate
(orientation-aware). Shown as a ribbon on the card. Counts toward glimpsing
that card in the Codex. This is the only mid-run knowledge purchase.

**Daily descent**: one seed per UTC day (`dailySeed`). The end screen's
Share button produces a spoiler-light result string: mode, outcome, a glyph
per scene's tier, and the final spread's card names. Never meanings.

**Journal**: the end screen has a second tab listing every reading of the
run with its outcome line. Reading it back is how you notice patterns.

**Named readings**: combos (`resolve.ts`) are recorded in the Codex once
produced. There are 17. The Codex shows only the ones you have caused.

**Witnessed omens**: the Codex detail sheet shows a card's omen line for any
orientation you have watched resolve, even at tier 0. Omens are the
sanctioned leak, so they are the first thing you get to keep.

**Sound** (the verdict seal lands with a wax thud and a note that
follows the tier: a bright pair for triumph, a low cracked knock for
calamity) (`audio.ts`): all synthesized. A low drone runs during a run;
short stings for lift, place, whisper, node, redraw, and one per outcome
tier. Off switch in Settings, persisted.

**Settings**: sound, reduce motion (also honors the OS preference), descend
by seed, and "Forget everything" (wipes the Codex).

**Offline**: a small service worker caches the app after first load.

**Relics** (`relics.ts`): a triumph in a non-terminal scene offers two boons,
take one. A calamity inflicts a curse. Effects are stated plainly; the
mystery is the deck, not the rules. Boons: Cracked Lens (Threshold deals
four), Mirror Shard (Wake deals four), A Pinch of Salt (Hand never reversed),
Second Coin (first redraw free), Small Bell (whispers give two words), Candle
Stub (+1 Clarity on walking on), Iron Ring (charged +2), Hard Bread (rest
mends more). Curses: Fog (one card per seat face down), Splinter (Vessel
always holds a reversed card), Debt (Clarity capped at 2), The Weight
(neutral costs one more), Hush (whispers cost 2).

**Descents** (`descents.ts`): run variants unlocked by play. The unlock
condition is stated on the title screen (it is a rule, not a meaning).
Arcana Only (22 majors, after one return), The Inverted (60% reversed, after
three deaths), Fogbound (start with Fog and 4 Clarity, after five runs),
Thin Blood (6 vitality, after two returns). Each is a `RunConfig` passed to
`startRun`, so adding one is a data change.

**Consult the Codex mid-reading**: the ☷ button opens the detail sheet for
the lifted candidate. It shows only what the Codex already holds, so it is
a memory aid, never a hint.

**Sigils** (`sigils.ts`): fourteen milestones evaluated when a run ends,
with the knowledge after that run folded in. Conditions are rules, so they
are stated even when locked. Earned sigils show on the end screen and in
the Codex. They change nothing about play.

**Records**: per-descent runs, returns, and deepest scene, shown under the
descent picker on the title screen.

**First descent**: the player's very first run puts twelve shuffled Major
Arcana on top of the deck (`majorsFirst`), so the first scene is read with
the iconic cards, and shows three wordless nudges ("Lift one." / "Place it
in the ◯." / "Read."). Nothing about meaning is said.

**Seat memory** (the Codex grid shows a card's best position as a small numeral on its cell, from `bestSeat`, so a glance across the shelf says where each card has earned its place): the Codex detail sheet shows, per seat, how many times the
card was read there and a good/even/bad bar. This is consequence, not
meaning, and it is the most direct learning tool in the game.

**Deck tracker**: a pill in the reading header shows cards left to draw;
tapping it opens the discard so far. Roguelike deck-tracking, faces only.

**Share image** (each card carries its position number above and its seat score in a chip beneath, gold if it served and red if it cost, and the tally line sits under the cards, so a shared spread tells the same story the screen did) (`ui/art/render.ts`): the end screen renders the final
spread to a 1080×1350 PNG (seat glyphs, card faces, names, the outcome
line, one glyph per scene, descent and seed) and hands it to the OS share
sheet, or shows it with a download button. Card SVGs are serialized with
the shared defs inlined so the foil and paper survive rasterization.

**Magnify**: press and hold any card in hand to see it large. Faces only.

**Card of the day**: the title screen shows one card chosen by the daily
seed. Pure ornament; it never explains itself.

**The Abyss moment**: the terminal scene has its own backdrop (a breathing
weight at the bottom of the screen), a low swell on entry, brighter seat
glyphs, and a slower narration reveal.

**Codex filters and Ledger**: filter cards by suit and by seen/known. The
Ledger aggregates play: most read card, kindest and cruelest (net good minus
bad over at least three reads), most often on the table at death, busiest
seat. All of it is consequence.

**Scene relics** (the alcove after a triumph sets the offered relics on
its shelf in the candle's light, and the one whose card is touched
brightens; the candle licks): eight scenes name a relic (`scene.relic`). A boon there
hands it over if you don't hold it, and the resolution says "You keep it".
The crossing's satchel is the Second Coin; the stranger's gift is the Small
Bell; the library holds the Cracked Lens.

**Cut the deck**: before the first scene the map shows the deck's edge.
Tap or drag to choose a point, then Cut: the top N cards go to the bottom.
It is the only hand the player gets on the shuffle, and it is real.

**Seat-aware whispers**: `whisperWords` rotates a card's keyword list by
the seat being filled, so the same card whispers a different word in the
Hand than in the Wake. With the Small Bell you hear two.

**Codex flip**: tap the big card in the detail sheet to turn it. If you
have not mastered the reversed meaning, it says so and shows nothing.

**Echo**: the Wake card of one scene follows you into the next. It is
dealt as a fourth candidate for the Vessel, marked as an echo, pulled back
out of the discard so nothing is duplicated. "What follows in your wake"
is literal. Balance: majors-only rose from ~78% to ~83%; random unchanged.

**Weekly descent**: one seed per ISO week, a longer map (five layers per
act), twelve vitality. Its own card back, as does every descent.

**Depths** (`DEPTHS` in `descents.ts`): five stacked modifiers for the
standard descent, one unlocked per return: Thinner Blood (8 vitality),
Wrong More Often (35% reversed), The Dark Presses (neutral costs one more),
Short Memory (no echo), The Last Word (the Abyss at stakes 4). Depth N
applies everything up to N. Records track the deepest return.

**The reader's mark**: a ring on the title screen with one tick per run,
gold for returns, red for deaths, and a fill that grows with the share of
the deck known. Titles from Novice to Oracle by that share.

**Settings**: haptics toggle and "one color, no scene tint".

**Scene vignettes** (`ui/art/scenes.tsx`): a 200×60 silhouette per scene
above the prompt, drawn with the card primitives so world and deck share a
hand. Transparent ground, so the scene hue shows through.

**The sky**: a Codex tab that draws all 78 cards as stars (majors in the
inner ring, each suit an arm of a spiral). Stars light when seen and
brighten by tier. Every reading joins its four cards with lines
(`knowledge.links`), weighted by how often they've sat together. Tap a
star to see its bonds. Your readings, as a constellation.

**Suit tones**: placing a card plays a tone by suit (wands bright triangle,
cups soft sine fifth, swords a sharp saw, pentacles low triangle, majors a
two-note chord).

**Memory of the road** (each remembered scene is now told in full: the four omens with their seat scores and reckoning sentences, the outcome, and the tally, so retelling the road reads as the story of the descent): visited map nodes stay tappable and open a sheet
with that scene's vignette, prompt, the four cards, and the outcome line.

**Last reading** (laid on the title as the mini cross, with a small verdict seal pressed over it reading "returned" or "fallen" in the last reading's tier colour; the tier is kept with the last spread in knowledge): the title screen remembers the final spread of the most
recent run and whether it ended you or brought you back.

**Idle spread**: empty seats drift gently; the active seat glyph breathes.

Scenes: eighteen now (orchard, a rest scene in act one; the toll, a passage
in act two).

**Resume** (`persist.ts`): the run in progress is saved after every
transition (it is a plain value, so this is JSON) and offered on the title
screen with "Resume" or "Let it go". Cleared when the run ends.

**Tappable omens**: each omen line on the resolution screen opens the
Codex detail for its card. Still only what you have earned.

**The verdict seal**: once a reading is read, a wax seal presses onto
the resolution screen under the deltas: rings, notches, the tier's mark,
its word around the rim, coloured by tier (gold for triumph, blood for
calamity). The same marks and words the map and the book use. The end
screen presses a smaller one under the outcome, its rim reading
"fallen" or "returned".

**Reversed, marked**: a reversed card in the hand or the zoom carries a
small red ⥯ on its corner, outside the face, so a reversal is never
missed at a glance. The face itself still shows only name and art.

**Larger cards** setting for the hand.

**Robustness**: an error boundary catches any render failure and offers
"Let the run go" (clears only the saved run) or "Try again". The Codex is
never touched. Small card sizes skip the paper-texture filter, which keeps
the Codex grid and journal cheap on phones.

**Seat seal**: when a card lands, its seat glyph stamps over it in gold and
fades. The map's ground hue shifts by act.

**The book** (`knowledge.omenLog`): every omen witnessed, in order,
grouped by descent and scene, with the seat glyph and outcome tier. Capped
at 240 lines. Tap a line to open the card. Reading the book back is where
the meanings settle; it is the Codex's most on-pillar page.

**Study** (`studyQuestion` in `knowledge.ts`): a Codex tab that shows one
omen you have witnessed and three witnessed cards; which card did this?
Never a meaning, only recall of consequence. A right answer counts toward
glimpsing the card, like a whisper. Tracks streak and totals. Two other
questions rotate in: which seat was it read in (`seatQuestion`), and,
once the omen log spans three places, where was it read (`placeQuestion`,
three scene tiles from places you have actually stood). Both only ever ask
you to remember what happened; neither leaks a meaning. A streak of ten
in one sitting earns a keepsake: the card that made the tenth answer is
charged in the next free descent, then spent. The title names it until
it is taken, and the first deal that shows it in that descent wears a
gold "yours" ribbon, so the reward is seen arriving.

**Journal**: each scene shows Clarity spent (redraws, whispers).

**Carry the Codex**: Settings can copy the whole Codex as a prefixed
base64 blob and bring one over on another device. Import replaces.

**Share the sky**: the constellation renders to a square PNG.

**Foretell**: on the map, spend 1 Clarity to read one node's place line
("A rope bridge over a black gorge") before choosing. It reveals a place,
never a meaning, and gives Clarity a use between readings.

**Dreams**: in a rest scene, the resolution surfaces one omen you have
witnessed on some other card ("You dream of something you have seen").
Tap it to open that card. Rest is where the deck comes back to you.

**About** panel in Settings: the pillars, in four sentences. Weekly share
text includes the deepest scene reached this week.

Bundle: ~378 KB JS (~120 KB gzipped); the Codex screen is code-split.

**Install**: an SVG app icon (three fanned cards, the Star on top) with
192 and 512 PNG renders, apple-touch-icon, description meta, and the
service worker precaching them. Cards suppress the iOS touch callout so a
long press magnifies instead of selecting.

**Reading pace**: slow, normal, fast, in Settings. Tapping the narration
shows all of it at once.

Localization was considered and deferred: all authored text already lives
in three data files (`cards.ts`, `minorText.ts`, `scenes.ts`) plus relics
and sigils, so a translation is a data swap when it is wanted.

**Tablet and landscape**: from 700px wide the reading screen becomes two
columns, scene and spread on the left, hand and actions on the right, with
larger cards. Short landscape hides the scene vignette.

**Discard viewer** separates cards read from cards passed over. The title
fan's foil shimmers with device tilt (where no permission prompt is needed)
or the pointer.

**Take back**: once per descent, a placed card can be taken back before
the next seat is touched. The two it beat come out of the discard and the
next seat is dealt again exactly as it was, so it cannot reroll anything.
Seat glyphs take their card's suit color once filled.

**Performance**: card faces are memoized (they never change for an id) and
hand cards are promoted to their own layers. Measured in-page at 6x CPU
throttling: lift 34 ms, place 112 ms, first paint under a second.

**The Short Road**: a descent with three layers an act, always unlocked,
for short sessions. Its own record.

**End vignettes**: death shows the four seat glyphs sinking into the dark
with one candle; return shows a lit doorway with a figure stepping up.

**Low vitality**: at 2 or less the heart pulses, a red edge glows, and a
slow double thump runs under the drone. It stops the moment you mend.

**Finest descent**: each descent remembers its best run (a return beats a
death, then depth, then good readings) and shows that final spread on the
title screen.

**Glyphs only**: a setting hides seat names again after they are earned,
for players who prefer the first-run feel.

**Suit gathering**: when three or more placed seats share a suit, the
screen's hue shifts to that suit's color. No text; the room just changes.

**Read again**: the end screen can replay the final spread's four omens
with the seat seals, slowly, before the meanings.

**Walk a friend's road**: the seed field in Settings accepts a whole pasted
share text and reads the seed, the descent, and the depth out of it.

**Dealt faces**: the Codex shows the face of any card that has passed
through your hands, dimmed until it is read. Faces are never secret; only
meanings are.

**Afterglow**: after a return, the title and map glow warm and the motes
turn gold until the next run ends.

**Dev oracle**: on the dev server, `?oracle` shows the oracle's score on
every candidate. It is compiled out of production builds. Use it with the
sim when authoring a scene's affinities.

**Fog tint**: a card hidden by Fog lets a faint suit color through its
back. The deck sheet shows the run seed and where it was cut.

**Bonds**: the Codex detail names the four cards this one has most often
been read beside, with counts. Tap one to follow the thread.

**Sigils for the Codex itself**: Remembered (ten correct Study answers)
and Bound (a hundred pairs in the sky) are checked after Study, not only at
a run's end. Share text ends with the reader's title and cards known.

Hover titles were reviewed: every `title` attribute is a card name, a seat
role gated by the seats-named flag, a sigil rule, or a UI hint.

**Toast**: a brief banner for things that land outside a run, first used
for sigils earned in Study.

**Forget the road, keep the cards**: a second reset in Settings that clears
descents, deaths, returns, records, sigils and Study but keeps every card,
bond and page of the book. The title notes how many cards have never been
dealt once half the deck has passed through your hands.

**Daily streak**: consecutive daily descents build a streak shown on the
Daily button; it survives a same-day replay and lapses after a missed day.

**Named, the first time**: the first time a reading produces a combo, its
line arrives as a toast. The Codex "unseen" filter lists cards never dealt.

**Study drills**: filter Study to the majors or one suit. The title's Codex
button carries a progress ring of cards known. Daily share text notes a
streak of two days or more.

**Road on the share image**: a row of kind glyphs for the scenes visited
sits above the tier glyphs. Codex sorts: deck order, most read, newest
seen. Settings shows the bytes the game keeps on the device.

**Node size**: map nodes grow with the scene's stakes (42, 48, 54 px; the
Abyss largest). A wordless hint that some doors cost more.

**Updates**: when the service worker installs a newer build behind a live
page, a sticky toast offers a reload.

**Hardening**: a saved run that names a card or scene that no longer
exists is refused (no Resume offered) instead of crashing; the Codex prunes
unknown ids on load. Both cover a deck or scene change between builds.

**Finest**: the end screen says "Your finest descent yet." when a run sets
a new best for its descent (after the first run).

### Pillar sweep: where text reaches the screen

Every surface that can show text about a card, and what gates it:

| Surface | Shows | Gate |
|---------|-------|------|
| Card face | name, art | none (Codex shows faces once dealt) |
| Resolution omens | omen line | none (the sanctioned leak) |
| Whisper ribbon | one keyword (two with the Bell) | costs Clarity |
| Run end reveal | upright meaning; reversed if reversed | death or return with the card on the table |
| Codex keywords | keywords | tier 1 (three reads or whispers) |
| Codex meaning | upright meaning | tier 2 |
| Codex reversed | reversed meaning | tier 3 |
| Witnessed omens, the book, dreams, Study | omen lines | only orientations watched resolve |
| Seat memory, Ledger, best seat | counts and outcomes | consequence, not meaning |
| Foretell | a scene's place line | costs Clarity; not a card |
| Relics, sigils, descents, depths, vows, weather, trades | rules | stated plainly, by design |
| Turn | flips orientation; shows nothing | costs Clarity; the player supplies the suspicion |
| Signature | a card the player chose, sealed on its face | tier 3, the player's own knowledge |
| Wear, places, the road, bonds | how often, where, beside what | consequence and history, never meaning |
| Named-reading ribbon | the combo's note | consequence line, like an omen |
| Dream (rest scenes) | a witnessed omen of another card | only omens already witnessed |

## Daily weather

The title shows the day's weather as a small sky: a gradient tinted by
the weather, a few stars, tonight's moon drawn at its true phase, and the
weather's vignette on the ground line. The three forecast lines sit
under it. The stars in it twinkle. In the Codex grid, known cards glow
by tier: a gold rim at two, a halo at three.

The daily seed also picks the card of the day, shown on the title, and
that card is charged in the Daily: upright when dealt, and a little
stronger. A daily streak of seven charges the week's card as well; the
title counts down to it from three days. The seed also picks one of fourteen named conditions (Clear,
Reversed Winds, Thin Air, Lantern Light, Salted Road, Fog, Heavy Air,
Still Water, The Long Road, The Short Road, Light Winds, Candlelit,
Guttering, Black Tide). Everyone walking today's road walks in the same
weather. The title names it before you commit; share text carries it, and
during the run a veil over the screen shows it: mist for Fog, streaks for
Reversed Winds, a warm flicker for Candlelit, a rising dark for Black
Tide. The Weekly has weather too, from the week's seed, on top of its
longer road and its two extra hearts; road lengths are skipped for it.

## Rites

Five scenes keep a rite: a rule stated the moment you arrive, on a plate
under the prompt, in plain words. The Mirror (the standing pool) reads
every card the other way up, and what is recorded in the Codex is what
was read, not what was dealt. The Hush (the library) allows no whispers.
The Tithe (the toll) takes a drop of vitality at the door, never the
last one, and lights one Clarity for it. Moonlit (the hollow) deals the Wake one more. The Bare Table
(the tomb) deals every seat one fewer. The Ember (the hearth) mends one
even on a neutral reading. The Long Look (the Abyss itself) lays the whole
last hand bare: every seat is dealt at once, one more each, nothing
face down, and the seats still to come show their cards beneath them
while you place in order (`laidBare`; a hold still joins the next seat,
and take-back keeps the laid seats). The last reading is planned with
everything in view. Walking all seven earns the sigil Every Rite. Doors still show only the kind of place; the
rite is learned by walking in, and remembered: the Codex keeps a rites
shelf, one glyph each, silhouettes until walked (`ritesWalked` reads the
omen log, so no new state). Once a rite has been walked, its glyph
sits on any door that keeps it, and a foretold door shows its rite with
its place. Doors you have not learned still show only their kind. None
of them touches a meaning.

## The Abyss deals from what you have read

As you step into the Abyss, the discard pile is shuffled onto the top of
the deck, so the final reading's candidates are cards this run has
already dealt and read. Nothing is lost (the unread cards sit beneath),
but the last spread is the road coming back: a reader who has paid
attention knows what the Abyss can offer. If fewer than twelve cards have
been read, the Abyss deals as any scene does. The reading screen says so
in one line.

## The Chosen

A descent with your own deck. Once you have returned once and know
forty cards, the Codex offers "Choose your deck": tap known cards in and
out (`toggleChosen`, tier 1 or more only, and forgetting a card drops
it from the deck). Thirty or more and The Chosen opens on the title,
with the deck's size on the button. Cards land wrong more often there
(0.35). It has its own back, a quill over the line it has written. It is the one place the game lets the reader stack the deck,
and it is gated behind knowing enough of it to stack it well.

## Known cards whisper for free

A card the Codex knows (tier two, "known", or better) wears its seat word
in the hand without being asked, as a paler ribbon than a paid whisper.
The Codex already shows that card's keywords, so nothing new is said; the
table simply stops charging for what the reader has earned. Whisper stays
for cards not yet known, and the button greys out on a known one. A
mastered card gives two words, as the Small Bell does. While a reading is
in progress the ambient motes behind the table take its colour too, gold
as the tally rises and red as it falls, alongside the room's glow.

## The Lamp

Once per seat, for two Clarity, the player holds a lamp over the seat and
every card in the hand shows what it would do there: a gold triangle if it
would serve, a red one if it would cost, a hollow diamond if it would
change little. Hidden cards stay dark. This is the whisper's opposite: the
whisper gives a word of the card and leaves the seat to be guessed, the
lamp gives the seat's answer and leaves the card unexplained. Nothing new
is said about any card; only what this seat, in this scene, would make of
it. The score is never shown, so a +1 and a +4 look alike under the lamp
and the choice between two served seats is still the player's. One scene
keeps the Dark, a rite where no lamp burns: the hollow under the hill.
Lamplighter marks a return with one scene lit in all four seats. Lamp Oil
brings the cost to one; Soot, a curse, leaves reversed cards dark under it.
Wax Seal, a boon for the named readings, adds half a point to every one
that lifts the total. Engine:
`LAMP_COST`, `canLamp`, `lightLamp`, `lampVerdicts`; `SlotState.lit`.

## Kinship

The sky already remembers which cards have been read together. Once two
cards have shared a table three times, they know each other, and from the
next descent on, whenever both land in one reading, they lift it by half a
point: "The Fool and the Sun know each other. +0.5." The pairs are fixed
when a descent begins (`RunConfig.kin`, from `bondedPairs`), so a run
cannot grow its own kin mid-way; the Table reads with the Codex's current
pairs. The reading plate shows kin the moment both are down. This turns a
record the player already had into a reason to keep old company on the
table. Engine: `KIN_BONUS`, `kinshipAmong`, `Resolution.kinship`; the
tally names it. Study asks about kin too ("Which of these does the Fool
know?"), and Old Friends marks a table where two pairs knew each other.

## The Table

A practice spread in the Codex. The player picks a scene they have read at,
lays cards they have glimpsed into the four seats of the mini cross, turns
any of them reversed, and watches the reckoning land seat by seat: the same
sentences and scores the real table gives, with nothing at stake. Once all
four are down the named readings settle too, but only the ones the player
has already found are named; the rest count and are called "something in
the four together you have not yet named". Nothing new is shown: scenes come
from the omen log, cards from tier one and up, named readings from the
Codex. The point is to make the story legible by experiment: swap the
Situation card, turn the Guidance, see what moves.

Engine: `engine/table.ts` (`tableScenes`, `tableCards`, `layTable`,
`nextEmptySeat`), built on `readingSoFar` and `resolveReading`. The title's
last reading remembers its scene and can be laid on the Table in one tap.
The deck sheet tallies what remains to draw by suit and the majors: the
deck is 78 and the discard is open, so this is counting, not divination.

## The road not taken

Every remembered scene keeps the cards passed over in each seat, as they
would have been read (the Mirror flips them too). At resolution, and on
every page of the memory, one folded line says how the hand was played:
"Every seat took the best card the hand held", or "Two seats held a better
card: +6 left in the hand." Opened, it lays each seat out: the played card
with its score, then the ones left in the hand with the score each would
have made, the best of them lit. Consequence only: these are faces the
player already saw in the hand. From there, "Lay it on the Table" hands the
scene and the played cards to the Table in the Codex, so the rest of the
hand can be tried without cost.

Engine: `HistoryEntry.passed`, `engine/road.ts` (`roadNotTaken`, `roadText`).
The Codex keeps a running record (`knowledge.hand`): seats with a choice,
how often the best card was played, the regret left behind, scenes played
clean. The ledger shows it once eight seats are in. Two sigils hang on it:
Sure Hand (a return with every seat best-played) and Steady Hand (a hundred
best cards played). At the end of a descent the whole hand is graded in a
word (`runHand`, `handGrade`): a sure hand played the best card in nine
seats of ten, a steady hand in seven, a wavering hand in five, and a
reckless hand in fewer. The line under it counts seats, clean scenes and
what was left in the hand; the share text carries the word.

## Challenge links

The share text of a free descent ends with a link carrying its seed and
descent. Opened, the title offers "A road someone sent you" with the seed
shown, and Walk it starts that exact road: the same map, the same deals.
The address is cleaned as soon as the offer is read. Dailies and weeklies
are already shared by date, so they carry no link. Engine:
`engine/challenge.ts` (`parseChallenge`, `challengeLink`).

## Places

The Codex book keeps a shelf of every scene the reader has read at, one
vignette each with how often and how well it went. A place opens to what
was laid in each seat there, most recent first, each card marked with how
that reading ended, and a step to the Table with that scene set. Only
what happened is shown; the scene's wants stay its own. Engine:
`placesRead` in `engine/knowledge.ts`.

## The chronicle

The run-end journal opens with the descent told straight through: one
paragraph a scene, in the scene's own words (its place, then what came of
the reading, then any named reading that sounded, and a note when two
cards that knew each other sat together), ending with how the hand was
played. Nothing in it is new to the player; it is the road gathered up
so it can be read as a story and copied out as text. Under it, the drone
deepens by act: the filter closes a little and the oscillators sink a few
cents as the road goes down. Engine: `engine/chronicle.ts`.

## The Long Night

A descent unlocked by five deaths and one return: every scene is read
under the Moon's dusk, the Wake deals four (you carry the Mirror Shard),
more cards land reversed, and you begin with four Clarity to see by. A
violet veil with a moon's glow hangs over the whole run, and its card
back carries a crescent.

## The Well

An endless descent, unlocked by three returns. The map is the usual two
acts and an Abyss, but surviving the Abyss does not bring you up: a
deeper map is appended under it, you take one breath (+2 vitality), and
every scene from then on reads at stakes one higher than it would and
costs a toll of one vitality per Abyss passed, however the reading went.
The second Abyss adds another of each. Without the toll a strong reader
banked vitality forever (the oracle policy never died); with it the curve
from `scripts/sim-well.ts` at 300 runs is: random passes one Abyss 33% of
the time and never two; majors-only reaches two 26%, five 3%; the oracle
reaches six 85% and seven 23%. There is no return and no ascension record;
the score is depth, kept in the Well's own record. Node ids and layers
continue past the first map so the memory sheet, road strip, and journal
work unchanged. The act banner names each turn of the Well. A sigil marks
passing two Abysses.

## The almanac

Every daily descent writes one line into the almanac, keyed by its date:
depth, whether you returned, how many readings went well, and the day's
weather. A day keeps its best result (a return beats a death, then depth).
The Codex's book tab opens on a month grid: gold where you came back,
ember where you did not, deeper color for longer roads, the weather glyph
in the corner. Tap a day for its line. It carries nothing about the cards,
so it is safe to show in full. Cleared by "forget my records".

## Its road with you

A card's Codex sheet draws every reading it has sat in, oldest to newest,
as a small road: one stop per reading, higher when it went well and lower
when it went badly, each stop wearing the seat's glyph and a red bead when
the card lay reversed. Consequence only, drawn from the omen log; a
player can see at a glance whether a card has been kind to them.

## Signature

Once a card is mastered (tier 3), its Codex page offers to make it your
signature. A signature is dealt, upright, into the first Vessel of every
free descent. One at a time; release it whenever. Daily and Weekly roads
ignore it so everyone walking them holds the same deck. It is the only
meta-progression that changes a run, and it is gated on knowledge alone.

## Turn

Once per scene, for one clarity, the lifted card can be turned over:
upright becomes reversed, reversed becomes upright. Marked cards (charged
or scarred) will not turn, and neither will a card dealt face down. It is
the cheapest way to act on a suspicion about a card without knowing why.

## Hold

A fourth Clarity action. Lift a face-up candidate and hold it (◈1): it
leaves this seat and joins the next seat's deal, wearing a violet
"held" ribbon, with its orientation kept. One held card at a time, never
at the Wake, never the last card of a deal. The Vessel is dealt before
you can see the Threshold's affinities, so a hold is a bet that a card
fits the seat after; the Codex's seat memory is where that bet is
learned. Whispers already made stay on the cards they were made on.

## The Stranger's trade

Once per run, at the first rest scene that goes at least neutrally, someone is
already sitting by the fire with one trade, drawn from what applies: four
clarity for two vitality; a boon you hold for a boon you do not; three vitality to be rid
of a curse; two clarity to bless the card that sat in the Hand tonight (it
is charged: upright from then on, and a little stronger). Take it or walk on.

At the market, once per run, a peddler sets out a cloth instead, with
prices of their own: two vitality for three clarity, or a scar on the card
that sat in the Wake tonight (reversed from then on) in exchange for a boon
you do not hold. The peddler and the Stranger are met separately. Taking one earns the Dealt With sigil. The
trade never kills you and is never offered twice in a scene.

## Vows

Before the first scene the map offers two vows, chosen by seed without
touching the run's rng. A vow is a stated constraint (never redraw, never
rest, never a reversed card in the Hand, every Threshold a Major, never
spend Clarity...). Break
it once and it is gone for the run. Keep it to the Abyss and it pays out as
you step in: 2 to 4 vitality, sometimes clarity. Keeping one earns the
Sworn sigil. Vows are optional and cost nothing to refuse; they exist to
give a run a shape the player chose, and to make some readings harder in a
way the player can see coming.

## Balance

`scripts/sim.ts` runs whole descents under three policies. Run it with
`npx vite-node scripts/sim.ts 2000`.

| Policy | Knows | Survives |
|--------|-------|----------|
| random | nothing | ~26% |
| majors-only | the 22 Major Arcana | ~75% |
| oracle | every affinity | ~100% |

With Depths stacked (`npx vite-node scripts/sim.ts 1200 5`):

| Depth | random | majors-only | oracle |
|-------|--------|-------------|--------|
| 3 | ~1% | ~33% | ~99% |
| 5 | ~1% | ~25% | ~97% |

A master still returns almost always; a half-learned deck is properly
tested. That is the intended veteran curve.

Rites bite, and this is what each costs (1500 random and majors-only
descents apiece, standard descent, rite removed one at a time):

| Rites | random | majors-only |
|-------|--------|-------------|
| all seven | 28.3% | 82.4% |
| none | 32.7% | 85.0% |
| without the Tithe | 32.1% | 83.7% |
| without the Mirror | 30.5% | 84.1% |
| without the Bare Table | 30.1% | 82.4% |
| without Moonlit | 29.1% | 84.1% |

The Tithe was the heaviest, so it now lights a Clarity for the drop it
takes: the same cost to a reader who never spends Clarity, a fair trade
to one who does. The Hush, the Ember and the Long Look cost nothing
measurable.

Across descents (`npx vite-node scripts/sim-all.ts 800`):

| Descent | random | majors-only | oracle |
|---------|--------|-------------|--------|
| The Descent | 29% | 82% | 100% |
| The Short Road | 47% | 87% | 100% |
| Arcana Only | 41% | 100% | 100% |
| The Inverted | 1% | 23% | 99% |
| Fogbound | 28% | 83% | 100% |
| Thin Blood | 8% | 66% | 100% |
| Weekly | 27% | 85% | 100% |

Arcana Only was found at 94% for blind play (the majors are all dense,
well-fitting cards) and tuned with 45% reversed, 8 vitality, and +1 neutral
cost. Majors-only is the oracle on that deck, so 100% there is expected.
The Inverted and Thin Blood are meant to be hard.

The levers that got there: a neutral reading costs 1 vitality times scene
stakes (0 in rest scenes), harm scales with stakes, starting vitality is 10,
and the harm threshold is a total of -1.5. Re-run the sim after any change
to scenes, thresholds, or deltas and keep the three numbers in roughly that
shape: blind play should usually die, a half-learned deck should usually
return, a fully learned deck should never lose.

### Vows and trades

`npx vite-node scripts/sim-vows.ts 1000` compares a policy with and without
swearing the first offered vow and taking every trade. Both are opt-in
lifts paid in clarity or constraint; the random policy overstates them
because it never spends clarity.

| Policy | plain | with vow | vows kept | with trades | both |
|---|---|---|---|---|---|
| random | 30% | 36% | 19% | 37% | 43% |
| majors-only | 81% | 84% | 36% | 87% | 90% |
| oracle | 100% | 100% | 49% | 100% | 100% |

The Stranger appears once per run; the clarity trade asks four for two so
a hoarder's spare clarity is not a free heal.

`npx vite-node scripts/sim-signature.ts 1000 major-19` measures a signature.
It moves survival by a point or less for every policy: a signature is
identity, not power, which is the point.

## Authoring a scene

1. Write `place` (one line of texture) and `prompt` (one line, underwritten
   on purpose). Then five `outcomes`, calamity to triumph, each a single
   consequence the cards could plausibly have caused.
2. Pick `kind` (threat, passage, mystery, rest), `hue`, `minAct`, `stakes`
   (1 in act one, 2 or 3 in act two), and `mend` for rest scenes.
3. Set per-seat `affinity`: three to five tags per seat, weights between -2
   and +2, at least one negative per seat so a wrong card can hurt. Think
   about what the Hand should *do* here and what the Wake should leave.
4. Optionally name a `relic` the scene's boon hands over.
5. Draw a 200×60 vignette in `ui/art/scenes.tsx` with the primitives.
6. Run `npx vite-node scripts/sim-all.ts 800` and check the standard row
   still sits near random 26% / majors-only 82% / oracle 100%.
7. Open the dev server with `?oracle` and read the scene a few times. If
   every candidate scores 0, the affinities are too narrow; if the oracle
   always finds +2 in every seat, they are too generous.

## Content debt

- **Minor Arcana** meanings and omens are hand-authored in
  `engine/minorText.ts` (112 omen lines, 112 meanings). A test asserts every
  omen is distinct.
- **Scenes**: 32 exist (31 plus the Abyss); more are welcome. Latest: the lit street (which keeps a rite of its own: every seat lit, the lamp free), the observatory.
- **Named readings**: 34. Each is a memorable line, never a definition.
- **Relics**: 14 boons, 9 curses. **Vows**: 9. **Weathers**: 16. **Trades**: 6. **Sigils**: 35. **Rites**: 9.
- **Combos**: 47 named readings exist. With three seats down, the reading
  plate says which of the readings the player has already found could still
  be completed by the fourth seat ("Within reach: You reached for the
  light, and it was there."), never which card would do it. Unfound
  readings are never teased. `namedWithinReach` in `engine/resolve.ts`. Two older tone readings were
  retired because they duplicated newer ones: `all-reversed` contradicted
  `four-reversed` on the same hand, and a second `one-suit` fired twice
  for one reading. Ids a Codex still carries from before are simply not
  shown. The Codex filters unknown ids, so old saves are safe. Across five
  simulation seeds the newer set lifts a random reader by about two points;
  the guard's single-seed number can swing seven points on its own, so
  judge drift over several seeds (three of them readings of tone: four upright, four reversed, one suit). Their banners are coloured by what they are: pale gold for four upright, violet for four reversed, the suit's colour for one suit, and a dark red ribbon for any named reading that drags the total down. This is the richest vein for "the
  combined meaning" and should keep growing with named, memorable results.
- **Art**: all 78 faces are procedural SVG (`src/ui/art/`). Majors are
  bespoke compositions, being redrawn one by one as illustrations rather
  than silhouettes: `ui/art/figure.tsx` holds a drawn person (a head with
  hair and a face, neck, a robe with an inner panel, a belt, folds, feet,
  arms posed by name: standing, walking, one hand raised, arms out,
  holding, seated, pointing down) shaded on one side with the `hatch`
  pattern from `ArtDefs`, and a small garden (rose, lily, wheat,
  pomegranate, grass, a cliff edge). `hands()` returns where a pose's
  hands end up so a card can put a wand, a rose or a sceptre in them. The
  every figure on every card, Majors, courts and pip scenes alike, is
  drawn this way, and the old silhouette is no longer used on any face.
  The shared landscape carries the same hand: mountains hatch their
  far slopes and keep a ridge line, ground has a hatched verge under its
  horizon, clouds have a hatched belly, trees a tapered trunk and a
  shaded lobe, horses a shadowed belly, hooves, a bridle and strands in
  the mane, pillars fluting and a shaded side. The frame is a foil rail
  between fine lines with quatrefoils at the corners and lozenges at the
  sides; the window has a gold mat inside its ink line and a vignette
  that darkens toward the edges; the numeral sits in a small cartouche
  between rules, the name on a ribboned plate; the numbered Minors are scenes after the
  Waite-Smith convention (every pip present, and a figure doing the thing:
  the Two of Wands holds the globe on the battlement, the Five of
  Pentacles passes the lit window in snow, the Eight of Cups walks away
  under the moon); courts wear their suit's robe, and each rank has its
  own silhouette so the four read apart at thumbnail size: the Page in a
  feathered cap with a satchel at the hip, the Knight mounted, the Queen
  on a high arched throne, the King on a square-backed throne with
  finials, raised on a dais, a sceptre in the off hand. Colour is meaning
  (`palette.ts`): the sky over a scene says what kind of moment it is
  before a figure is read. Yellow for illumination and success, blue for
  spirit and calm water, grey for the liminal and the difficult, black for
  the unknown, red for vitality and will, green for growth, violet for the
  veiled and the royal, slate for grief in progress. Robes follow the
  same code (the Magician in red, the High Priestess in blue, the Hermit
  in grey; fire red, water blue, air grey-white, earth green for the
  courts), and the small tokens match the reference deck where it
  matters: the Fool's white rose, the white rose on Death's black banner,
  roses and lilies in the Magician's garden. Open `?gallery` in dev to see
  every face at once. Shared gradients/filters live in one `<ArtDefs />`
  block at the app root. Held close (the long-press zoom in a reading,
  the Codex sheet) the art is alive: the Wheel and the World's wreath
  turn, the Sun's rays wheel, stars twinkle, water and clouds drift, the
  Tower's bolt flickers, flames lick, the Hanged Man sways, the Moon's
  crayfish rises. The hand and the seats stay still. The scene vignette
  over a reading is alive too, and so is a remembered scene's art: its
  flames lick, its water drifts, its stars twinkle, its clouds move. The
  same primitives carry the same hooks, so the world breathes the way the
  cards do when held close. A
  reversed face is lit from below: the art runs a little cooler and dimmer
  and a violet shadow sits over what is now its top, so a turned card reads
  as turned at a glance, before the corner mark is found. A mastered card
  is gilt wherever it shows: a fine double gold rule inside its edge with a
  bead at each corner, so the hand, the seats and the Codex all say which
  cards the reader has learned to the end. On the map, a
  place you have read at, or foretold, shows its own scene art inside the
  node as a small round porthole, the kind glyph shrunk to a badge on its
  rim and the verdict mark beside it, so the road so far is a trail of
  places rather than a row of discs. Unread places stay glyphs: the art
  would give away what Foretell sells. An unread node whose scene the
  Codex has read at before wears a small "familiar ground" mark on its rim,
  with the visit count on hover: only that the place is known, never which.
  In the Codex deck grid, a card that knows others wears a small kin count,
  so the Chosen can be built around company. Foretell itself now says one more
  thing: the seat that answers most strongly there, and to what ("◯
  situation answers to hope"). One tag of one seat, so a foretold scene
  can be planned for without being solved. In a reading, the room itself feels
  the tally so far: as seats land the ambient light warms toward gold for a
  boon or triumph, cools to violet for an even reading, and sinks to red
  for harm or calamity, breathing slowly at either extreme. A "calm room"
  setting turns that glow and the motes' colouring off for readers who
  find it distracting; the seat flashes stay. A placed seat can be held
  close with a long press, as a hand card can. The
  hooks are `live-*` classes on the primitives and a few major groups,
  gated by an `.alive` ancestor and switched off by reduce-motion. The
  same two places hold the card in the hand (`Held`): it tilts toward the
  finger and a gold glare slides across the face like foil catching
  light, and left alone it settles and breathes.

## Smoke: a full descent through the UI

`scripts/playthrough.mjs` plays a whole descent through the built app in
headless Chromium: Descend from the title, then map, reading (random
picks, an occasional lamp or whisper), resolution and relic screens until
the run ends, collecting page and console errors, then opens the journal.
Run `npm run build`, serve `npx vite preview --port 4173`, and
`npm run smoke:play`. It needs playwright installed, or `PLAYWRIGHT_PATH`
set to its `index.mjs`. Not part of CI, which has no browser; it is the
check to run after a change that touches several screens.

## Open questions

- Should the player be able to see their whole reading before committing
  the fourth seat, and go back? (Currently no: each placement is final.)
- Is 12 cards per scene too fast a deck cycle? 78 cards / 12 ≈ every 6.5
  scenes. Might be exactly right for a 7-scene run: you see the whole deck
  once. Worth keeping as a feature ("every run reads the whole deck").
- How much should the scene prompt hint at affinities? Currently: almost not
  at all. Probably needs one more sentence of texture per scene.
- Daily seed mode with a shared leaderboard of tiers reached?
