import { chooseCandidate, chooseNode, startRun } from '../src/engine/run';
import { SLOT_IDS } from '../src/engine/scenes';
const want = { triumph: 0, calamity: 0 };
for (let seed = 1; seed < 5000 && (!want.triumph || !want.calamity); seed++) {
  let run = chooseNode(startRun(seed), 0);
  for (let i = 0; i < SLOT_IDS.length; i++) run = chooseCandidate(run, 0);
  if (run.phase.kind === 'resolved' && run.phase.resolution.tier === 'triumph' && !want.triumph) want.triumph = seed;
  if (run.phase.kind === 'resolved' && run.phase.resolution.tier === 'calamity' && !want.calamity) want.calamity = seed;
}
console.log(JSON.stringify({ triumph: want.triumph.toString(36), calamity: want.calamity.toString(36) }));
