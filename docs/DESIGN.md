# Arcana Descent — Design Notes

Contents: [Pitch](#the-pitch-in-one-breath) · [Pillars](#pillars) ·
[Core loop](#core-loop) · [Knowledge](#knowledge-the-codex) ·
[Systems, as built](#systems-as-built) · [Balance](#balance) ·
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

**The map** (`buildMap` in `scenes.ts`): two acts of four layers each, then
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

**Sound** (`audio.ts`): all synthesized. A low drone runs during a run;
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

**Seat memory**: the Codex detail sheet shows, per seat, how many times the
card was read there and a good/even/bad bar. This is consequence, not
meaning, and it is the most direct learning tool in the game.

**Deck tracker**: a pill in the reading header shows cards left to draw;
tapping it opens the discard so far. Roguelike deck-tracking, faces only.

**Share image** (`ui/art/render.ts`): the end screen renders the final
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

**Scene relics**: eight scenes name a relic (`scene.relic`). A boon there
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

**Memory of the road**: visited map nodes stay tappable and open a sheet
with that scene's vignette, prompt, the four cards, and the outcome line.

**Last reading**: the title screen remembers the final spread of the most
recent run and whether it ended you or brought you back.

**Idle spread**: empty seats drift gently; the active seat glyph breathes.

Scenes: eighteen now (orchard, a rest scene in act one; the toll, a passage
in act two).

**Resume** (`persist.ts`): the run in progress is saved after every
transition (it is a plain value, so this is JSON) and offered on the title
screen with "Resume" or "Let it go". Cleared when the run ends.

**Tappable omens**: each omen line on the resolution screen opens the
Codex detail for its card. Still only what you have earned.

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
glimpsing the card, like a whisper. Tracks streak and totals.

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
| Relics, sigils, descents, depths | rules | stated plainly, by design |

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

Across descents (`npx vite-node scripts/sim-all.ts 800`):

| Descent | random | majors-only | oracle |
|---------|--------|-------------|--------|
| The Descent | 26% | 82% | 100% |
| The Short Road | 41% | 84% | 100% |
| Arcana Only | 36% | 100% | 100% |
| The Inverted | 2% | 21% | 99% |
| Fogbound | 27% | 83% | 100% |
| Thin Blood | 7% | 66% | 100% |
| Weekly | 30% | 84% | 100% |

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

## Content debt

- **Minor Arcana** meanings and omens are hand-authored in
  `engine/minorText.ts` (112 omen lines, 112 meanings). A test asserts every
  omen is distinct.
- **Scenes**: 8 exist. Aim for 30+ across three acts.
- **Combos**: 5 exist. This is the richest vein for "the combined meaning"
  and should be grown deliberately with named, memorable results.
- **Art**: all 78 faces are procedural SVG (`src/ui/art/`). Majors are
  bespoke compositions; Minors use traditional pip layouts and court
  silhouettes. Open `?gallery` in dev to see every face at once. Shared
  gradients/filters live in one `<ArtDefs />` block at the app root.

## Open questions

- Should the player be able to see their whole reading before committing
  the fourth seat, and go back? (Currently no: each placement is final.)
- Is 12 cards per scene too fast a deck cycle? 78 cards / 12 ≈ every 6.5
  scenes. Might be exactly right for a 7-scene run: you see the whole deck
  once. Worth keeping as a feature ("every run reads the whole deck").
- How much should the scene prompt hint at affinities? Currently: almost not
  at all. Probably needs one more sentence of texture per scene.
- Daily seed mode with a shared leaderboard of tiers reached?
