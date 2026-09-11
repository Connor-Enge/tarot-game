# Arcana Descent — Design Notes

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

## Roguelike structure

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

## Balance

`scripts/sim.ts` runs whole descents under three policies. Run it with
`npx vite-node scripts/sim.ts 2000`.

| Policy | Knows | Survives |
|--------|-------|----------|
| random | nothing | ~26% |
| majors-only | the 22 Major Arcana | ~75% |
| oracle | every affinity | ~100% |

The levers that got there: a neutral reading costs 1 vitality times scene
stakes (0 in rest scenes), harm scales with stakes, starting vitality is 10,
and the harm threshold is a total of -1.5. Re-run the sim after any change
to scenes, thresholds, or deltas and keep the three numbers in roughly that
shape: blind play should usually die, a half-learned deck should usually
return, a fully learned deck should never lose.

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

Queued:
- A "the reader" avatar that gathers marks over many runs.
- Difficulty ascension tiers after returning.

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
