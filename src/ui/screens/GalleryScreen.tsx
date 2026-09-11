import { CARDS, SCENES } from '../../engine';
import { SceneArt } from '../art/scenes';
import { Card } from '../components/Card';

/** Dev aid: every card face at once. Open with `?gallery`; `?gallery=scenes` shows every vignette instead. */
export function GalleryScreen() {
  const scenes = location.search.includes('gallery=scenes');
  if (scenes) {
    return (
      <main className="screen" style={{ maxWidth: 'none' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          {Object.values(SCENES).map((s) => (
            <figure key={s.id} data-scene={s.id} style={{ margin: 0, width: 200, background: `hsl(${s.hue} 30% 14%)`, borderRadius: 10, padding: '8px 0 4px' }}>
              <SceneArt id={s.id} className="scene__art" />
              <figcaption className="muted small center">{s.id}</figcaption>
            </figure>
          ))}
        </div>
      </main>
    );
  }
  return (
    <main className="screen" style={{ maxWidth: 'none' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {CARDS.map((c) => (
          <Card key={c.id} cardId={c.id} size="md" />
        ))}
        <Card faceDown size="md" />
      </div>
    </main>
  );
}
