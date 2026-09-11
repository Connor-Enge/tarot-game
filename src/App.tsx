import { useGame } from './store';
import { CodexScreen } from './ui/screens/CodexScreen';
import { ReadingScreen } from './ui/screens/ReadingScreen';
import { ResolutionScreen } from './ui/screens/ResolutionScreen';
import { RunEndScreen } from './ui/screens/RunEndScreen';
import { TitleScreen } from './ui/screens/TitleScreen';

export function App() {
  const screen = useGame((s) => s.screen);
  const run = useGame((s) => s.run);

  if (screen === 'codex') return <CodexScreen />;
  if (screen === 'run' && run) {
    switch (run.phase.kind) {
      case 'reading':
        return <ReadingScreen />;
      case 'resolved':
        return <ResolutionScreen />;
      case 'dead':
      case 'ascended':
        return <RunEndScreen />;
    }
  }
  return <TitleScreen />;
}
