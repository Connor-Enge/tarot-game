import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Crossfade between keyed views: the outgoing view lingers, fading, while
 * the incoming one rises. Keeps screen changes from feeling like page loads.
 */
export function Fader({ viewKey, children }: { viewKey: string; children: ReactNode }) {
  const [prev, setPrev] = useState<{ key: string; node: ReactNode } | null>(null);
  const last = useRef<{ key: string; node: ReactNode }>({ key: viewKey, node: children });
  useEffect(() => {
    if (last.current.key !== viewKey) {
      setPrev(last.current);
      const t = setTimeout(() => setPrev(null), 260);
      last.current = { key: viewKey, node: children };
      return () => clearTimeout(t);
    }
    last.current = { key: viewKey, node: children };
  }, [viewKey, children]);
  return (
    <>
      {prev && (
        <div className="view view--out" key={`out-${prev.key}`} aria-hidden>
          {prev.node}
        </div>
      )}
      <div className="view" key={viewKey}>
        {children}
      </div>
    </>
  );
}
