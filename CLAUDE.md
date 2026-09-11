# Arcana Descent

Mobile-first tarot roguelike. Vite + React + TypeScript + zustand. Tests with vitest.

- `npm test` runs engine tests. `npm run build` typechecks and builds. Run both before committing.
- `src/engine/` is pure TS with no React or DOM imports. Keep it that way; all game rules live there and are unit-tested.
- Never surface a card's `meaning` or `keywords` in the UI unless the Codex tier allows it (`knowledge.ts`). Hidden meaning is the core design pillar. `omen` lines are the sanctioned leak.
- Card faces show name and art only.
- Seat names are hidden until `knowledge.seatsNamed` is true.
- Minor Arcana content is templated; authored replacements are welcome but keep the `tags` consistent with suit and rank themes.
- Design rationale and roadmap: `docs/DESIGN.md`.
