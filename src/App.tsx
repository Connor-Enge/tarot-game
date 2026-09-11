import { useEffect } from 'react';
import { currentNode, SCENES } from './engine';
import { useSettings } from './settings';
import { useGame } from './store';
import { ArtDefs } from './ui/art/CardArt';
import { Ambient } from './ui/components/Ambient';
import { Fader } from './ui/components/Fader';
import { CodexScreen } from './ui/screens/CodexScreen';
import { GalleryScreen } from './ui/screens/GalleryScreen';
import { MapScreen } from './ui/screens/MapScreen';
import { ReadingScreen } from './ui/screens/ReadingScreen';
import { RelicScreen } from './ui/screens/RelicScreen';
import { ResolutionScreen } from './ui/screens/ResolutionScreen';
import { SettingsScreen } from './ui/screens/SettingsScreen';
import { RunEndScreen } from './ui/screens/RunEndScreen';
import { TitleScreen } from './ui/screens/TitleScreen';

function useSceneHue() {
  const run = useGame((s) => s.run);
  const screen = useGame((s) => s.screen);
  useEffect(() => {
    let hue = 260;
    if (screen === 'run' && run) {
      const node = currentNode(run);
      if (node) hue = SCENES[node.sceneId].hue;
      if (run.phase.kind === 'dead') hue = 0;
      if (run.phase.kind === 'ascended') hue = 45;
    }
    document.documentElement.style.setProperty('--scene-hue', String(hue));
  }, [run, screen]);
}

export function App() {
  const screen = useGame((s) => s.screen);
  const run = useGame((s) => s.run);
  const reduceMotion = useSettings((s) => s.reduceMotion);
  useSceneHue();
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
  }, [reduceMotion]);

  let view = <TitleScreen />;
  let key = 'title';
  if (import.meta.env.DEV && location.search.includes('gallery')) {
    view = <GalleryScreen />;
    key = 'gallery';
  } else if (screen === 'codex') {
    view = <CodexScreen />;
    key = 'codex';
  } else if (screen === 'settings') {
    view = <SettingsScreen />;
    key = 'settings';
  } else if (screen === 'run' && run) {
    switch (run.phase.kind) {
      case 'map':
        view = <MapScreen />;
        key = `map-${run.layer}`;
        break;
      case 'reading':
        view = <ReadingScreen />;
        key = `reading-${run.layer}`;
        break;
      case 'resolved':
        view = <ResolutionScreen />;
        key = `resolved-${run.layer}`;
        break;
      case 'relic':
        view = <RelicScreen />;
        key = `relic-${run.layer}`;
        break;
      case 'dead':
      case 'ascended':
        view = <RunEndScreen />;
        key = 'end';
        break;
    }
  }
  return (
    <>
      <ArtDefs />
      <Ambient />
      <Fader viewKey={key}>{view}</Fader>
    </>
  );
}
