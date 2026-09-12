import { handGrade, runHand } from './road';
import type { RunState } from './run';
import { SCENES } from './scenes';

/**
 * The chronicle: the whole descent told straight through, one paragraph a
 * scene, in the words the scenes themselves used. Place, then what came of
 * the reading, then any named reading that sounded. It ends with how the
 * hand was played. Nothing here is new to the player; it is the road,
 * gathered up.
 */
export function chronicle(run: RunState): string[] {
  const lines = run.history.map((h) => {
    const sc = SCENES[h.sceneId];
    const named = h.resolution.comboNotes.length ? ` ${h.resolution.comboNotes.join(' ')}` : '';
    const kin = h.resolution.kinship?.pairs.length ? ' Two cards that knew each other sat at that table.' : '';
    return `${sc.place} ${h.resolution.narration.at(-1) ?? ''}${named}${kin}`.trim();
  });
  const grade = handGrade(runHand(run.history, run.marks));
  if (grade) lines.push(`${grade.name}: ${grade.line}.`);
  return lines;
}

export function chronicleText(run: RunState, title: string): string {
  return [title, '', ...chronicle(run).map((l, i) => (i < run.history.length ? `${i + 1}. ${l}` : l))].join('\n');
}
