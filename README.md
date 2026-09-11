# Arcana Descent

A mobile-first roguelike built around a four-seat tarot spread. Three cards
are dealt for each seat; you choose one; the finished reading decides what
happens. No card meaning is ever explained. You learn what the cards mean by
watching what they do and by dying with them on the table.

See [docs/DESIGN.md](docs/DESIGN.md) for the design notes and roadmap.

## Run it

```sh
npm install
npm run dev        # http://localhost:5173, also on your LAN for phone testing
npm test           # engine tests (vitest)
npm run build      # typecheck + production build
npx vite-node scripts/sim.ts 2000   # balance simulator (random vs informed policies)
```

## Layout

```
src/engine/    pure TypeScript game logic, no React, fully tested
  cards.ts       the 78 cards: tags (machine meaning), meaning/omen (hidden human meaning)
  deck.ts        draw / discard / reshuffle
  scenes.ts      the four seats, scene definitions with per-seat tag affinities
  resolve.ts     scores a reading against a scene, combos, tiers, narration
  run.ts         run state machine: deal 3, choose 1, x4, resolve, advance
  knowledge.ts   the Codex: what the player has unlocked, persisted to localStorage
  rng.ts         seeded PRNG
src/store.ts   zustand store wrapping the engine
src/ui/        screens and components (React)
```

The engine is a set of pure functions over plain state. Every transition
takes a `RunState` and returns a new one, so runs are seed-deterministic and
trivially serializable.
