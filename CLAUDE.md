# Arcana Descent

Mobile-first tarot roguelike. Vite + React + TypeScript + zustand. Tests with vitest.

- `npm test` runs engine tests. `npm run build` typechecks and builds. Run both before committing.
- `src/engine/` is pure TS with no React or DOM imports. Keep it that way; all game rules live there and are unit-tested.
- Never surface a card's `meaning` or `keywords` in the UI unless the Codex tier allows it (`knowledge.ts`). Hidden meaning is the core design pillar. `omen` lines are the sanctioned leak.
- A card's `tags` are the table's vocabulary, not its meaning: a seat states its ask (the tags it wants and fears) before any card lands, and a card shows in hand only the tags a seat has taken it for or a whisper has said (`visibleTags`), or all of them once the Codex knows it that way up. Keep those rules; do not show a card's full tag set otherwise. See "The ask" in `docs/DESIGN.md`.
- Card faces show name and art only.
- Seat names are hidden until `knowledge.seatsNamed` is true.
- Minor Arcana content is templated; authored replacements are welcome but keep the `tags` consistent with suit and rank themes.
- Design rationale and roadmap: `docs/DESIGN.md`.
