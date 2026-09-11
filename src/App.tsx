import { lazy, Suspense, useEffect } from 'react';
import { currentAct, currentNode, getCard, SCENES, currentScene } from './engine';
import { setHeartbeat } from './audio';
import { useSettings } from './settings';
import { useGame } from './store';
import { ArtDefs } from './ui/art/CardArt';
import { Ambient } from './ui/components/Ambient';
import { WellRings } from './ui/art/well';
import { Fader } from './ui/components/Fader';
const CodexScreen = lazy(() => import('./ui/screens/CodexScreen').then((m) => ({ default: m.CodexScreen })));
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
  const fixedTint = useSettings((s) => s.fixedTint);
  useEffect(() => {
    let hue = 260;
    if (!fixedTint && screen === 'run' && run) {
      const node = currentNode(run);
      if (node) hue = SCENES[node.sceneId].hue;
      else hue = [250, 230, 300, 270][currentAct(run)] ?? 260;
      // When a suit gathers in the spread, the room takes its color.
      if (run.phase.kind === 'reading') {
        const suits = run.slots.filter((s) => s.chosen !== null).map((s) => getCard(s.candidates[s.chosen!].cardId).suit);
        const counts = new Map<string, number>();
        for (const su of suits) if (su) counts.set(su, (counts.get(su) ?? 0) + 1);
        const SUIT_HUE: Record<string, number> = { wands: 25, cups: 200, swords: 245, pentacles: 110 };
        for (const [su, n] of counts) if (n >= 3) hue = SUIT_HUE[su];
      }
      if (run.phase.kind === 'dead') hue = 0;
      if (run.phase.kind === 'ascended') hue = 45;
    }
    document.documentElement.style.setProperty('--scene-hue', String(hue));
    const inScene = screen === 'run' && run && run.node !== null && (run.phase.kind === 'reading' || run.phase.kind === 'resolved' || run.phase.kind === 'relic');
    document.documentElement.style.setProperty('--mote-kind', inScene ? currentScene(run).kind : '');
  }, [run, screen, fixedTint]);
}

export function App() {
  const screen = useGame((s) => s.screen);
  const run = useGame((s) => s.run);
  const reduceMotion = useSettings((s) => s.reduceMotion);
  const bigCards = useSettings((s) => s.bigCards);
  useSceneHue();
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
    document.documentElement.classList.toggle('big-cards', bigCards);
  }, [reduceMotion, bigCards]);
  const afterglow = useGame((s) => s.afterglow);
  const mode = useGame((s) => s.mode);
  useEffect(() => {
    const warm = afterglow && (screen === 'title' || (screen === 'run' && run?.phase.kind === 'map'));
    document.documentElement.style.setProperty('--mote-hue', warm ? '45' : '');
    document.documentElement.classList.toggle('afterglow', warm);
  }, [afterglow, screen, run]);
  const weather = screen === 'run' && (mode.kind === 'daily' || mode.kind === 'weekly') && mode.weather && mode.weather !== 'clear' ? mode.weather : null;
  const low = screen === 'run' && !!run && run.vitality > 0 && run.vitality <= 2 && run.phase.kind !== 'dead' && run.phase.kind !== 'ascended';
  useEffect(() => {
    document.documentElement.classList.toggle('low-vitality', low);
    setHeartbeat(low);
    return () => setHeartbeat(false);
  }, [low]);

  let view = <TitleScreen />;
  let key = 'title';
  if (import.meta.env.DEV && location.search.includes('gallery')) {
    view = <GalleryScreen />;
    key = 'gallery';
  } else if (screen === 'codex') {
    view = (
      <Suspense fallback={<main className="screen"><p className="muted small center">Opening the Codex…</p></main>}>
        <CodexScreen />
      </Suspense>
    );
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
  const toast = useGame((s) => s.toast);
  return (
    <>
      <ArtDefs />
      <Ambient />
      {weather && <div className={`weather-layer weather-layer--${weather}`} aria-hidden />}
      {screen === 'run' && run && run.well !== undefined && <WellRings turn={run.well + 1} />}
      {toast && (
        <div
          className={`toast ${toast.sticky ? 'toast--sticky' : ''}`}
          key={toast.id}
          role="status"
          onClick={() => {
            toast.onTap?.();
            useGame.getState().dismissToast();
          }}
        >
          <span className="sigil__glyph">{toast.glyph}</span> {toast.text}
        </div>
      )}
      <Fader viewKey={key}>{view}</Fader>
    </>
  );
}
