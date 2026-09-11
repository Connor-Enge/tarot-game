import { chooseCandidate, chooseNode, startRun } from '../src/engine/run';
import { SCENES, SLOT_IDS } from '../src/engine/scenes';
for (let seed = 1; seed < 3000; seed++) {
  let run = startRun(seed);
  if (!SCENES[run.map[0][0].sceneId].relic) continue;
  run = chooseNode(run, 0);
  for (let i = 0; i < SLOT_IDS.length; i++) run = chooseCandidate(run, 0);
  if (run.phase.kind === 'resolved' && run.phase.found) {
    console.log(JSON.stringify({ seed: seed.toString(36), scene: run.map[0][0].sceneId, found: run.phase.found }));
    break;
  }
}
