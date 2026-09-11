# Arcana Descent

A mobile-first roguelike built around a four-seat tarot spread. Three cards
are dealt for each seat; you choose one; the finished reading decides what
happens. No card meaning is ever explained. You learn what the cards mean by
watching what they do and by dying with them on the table.

See [docs/DESIGN.md](docs/DESIGN.md) for the design notes, every system, and
the balance targets.

## Run it

```sh
npm install
npm run dev        # http://localhost:5173, also on your LAN for phone testing
npm test           # engine tests (vitest)
npm run build      # typecheck + production build
npx vite-node scripts/sim.ts 2000   # balance simulator (random vs informed policies)
```

Open `?gallery` on the dev server to see all 78 card faces at once.

## What's in the box

- **The reading.** Four seats (Vessel, Threshold, Hand, Wake), three cards
  dealt per seat, one chosen. Scored against the scene's hidden affinities
  plus named combos. Narration is four omens and an outcome, never a
  definition.
- **The descent.** A layered map with two acts and the Abyss, eighteen
  scenes with illustrated vignettes, relics found and inflicted, marks that
  charge or scar cards, an echo that follows you, and a deck you can cut.
- **The Codex.** Meanings unlock by play and by death. Seat memory, witnessed
  omens, the Book of Omens, a constellation of every reading, Study mode,
  sigils, a Ledger, and search. Export it to another device.
- **Ways down.** Standard, Daily, Weekly, four unlockable descents, and five
  stacked Depths for veterans.
- **Feel.** Procedural SVG art for all 78 cards, synthesized sound, haptics,
  a share image of your final spread or your sky, resume after closing the
  app, offline support, reduce-motion and fixed-tint options.

## Layout

```
src/engine/    pure TypeScript game logic, no React, fully tested
  cards.ts       the 78 cards: tags (machine meaning), meaning/omen (hidden human meaning)
  minorText.ts   authored text for the 56 Minor Arcana
  deck.ts        draw / discard / reshuffle
  scenes.ts      the four seats, scenes with per-seat affinities, the map builder
  resolve.ts     scores a reading against a scene, combos, tiers, narration
  relics.ts      boons and curses
  descents.ts    run variants, Depths, weekly config
  run.ts         run state machine: map, deal, choose, resolve, relics, echo, cut
  knowledge.ts   the Codex: tiers, memory, links, omen log, study, transfer
  sigils.ts      milestones
  sim.ts         headless policies for balance
src/store.ts   zustand store wrapping the engine
src/persist.ts run save/resume
src/audio.ts   synthesized sound
src/ui/        screens, components, and SVG art (cards, card backs, scenes)
```

The engine is a set of pure functions over plain state. Every transition
takes a `RunState` and returns a new one, so runs are seed-deterministic,
trivially serializable, and resumable.
