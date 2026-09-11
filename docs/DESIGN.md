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

Current: a fixed path of 6 scenes drawn from a pool of 7, then the Abyss
(terminal, high stakes). Seeded, so runs are reproducible and shareable.

Next steps:
- Branching map (pick 1 of 2-3 next scenes, visible as glyph-only nodes).
- Acts with escalating stakes and their own scene pools.
- Deck shaping: cards played in a triumph get "charged" (return to deck
  upright-locked); cards in a calamity get "scarred" (reversed-locked). Deck
  state carries within a run only.
- Boons/curses as persistent seat modifiers for the run ("the Wake always
  deals 4"; "the Threshold is always reversed").

## Content debt

- **Minor Arcana** meanings and omens are templated from suit × rank. Each
  needs an authored pass; the Ace of Cups and Ace of Swords should not share
  an omen.
- **Scenes**: 8 exist. Aim for 30+ across three acts.
- **Combos**: 5 exist. This is the richest vein for "the combined meaning"
  and should be grown deliberately with named, memorable results.
- **Art**: placeholders are glyphs. Even a consistent set of simple
  silhouettes would carry the vibe.

## Open questions

- Should the player be able to see their whole reading before committing
  the fourth seat, and go back? (Currently no: each placement is final.)
- Is 12 cards per scene too fast a deck cycle? 78 cards / 12 ≈ every 6.5
  scenes. Might be exactly right for a 7-scene run: you see the whole deck
  once. Worth keeping as a feature ("every run reads the whole deck").
- How much should the scene prompt hint at affinities? Currently: almost not
  at all. Probably needs one more sentence of texture per scene.
- Daily seed mode with a shared leaderboard of tiers reached?
