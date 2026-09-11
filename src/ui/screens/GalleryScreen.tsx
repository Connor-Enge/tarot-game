import { CARDS } from '../../engine';
import { Card } from '../components/Card';

/** Dev aid: every card face at once. Open with `?gallery`. */
export function GalleryScreen() {
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
