import { useMemo, useState } from 'react';
import { CARDS, getCard, type Knowledge } from '../../engine';

/**
 * Every card as a star. Majors in the inner ring, each suit an arm of the
 * spiral. Stars light as cards are seen and brighten as they are known.
 * Lines join cards that have sat in the same reading. Your readings, as a sky.
 */
export function Constellation({ knowledge: k }: { knowledge: Knowledge }) {
  const [focus, setFocus] = useState<string | null>(null);
  const pos = useMemo(() => {
    const out: Record<string, { x: number; y: number }> = {};
    const cx = 150;
    const cy = 150;
    CARDS.forEach((c) => {
      if (c.arcana === 'major') {
        const a = (c.number / 22) * Math.PI * 2 - Math.PI / 2;
        out[c.id] = { x: cx + Math.cos(a) * 46, y: cy + Math.sin(a) * 46 };
      } else {
        const arm = ['wands', 'cups', 'swords', 'pentacles'].indexOf(c.suit!);
        const t = (c.number - 1) / 13; // 0..1 along the arm
        const a = arm * (Math.PI / 2) + t * 1.35 + 0.35;
        const r = 66 + t * 76;
        out[c.id] = { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
      }
    });
    return out;
  }, []);

  const links = Object.entries(k.links ?? {});
  const maxLink = links.reduce((m, [, n]) => Math.max(m, n), 1);
  const focusSet = new Set<string>();
  if (focus) for (const [key] of links) if (key.includes(focus)) key.split('|').forEach((id) => focusSet.add(id));

  return (
    <div className="sky">
      <svg viewBox="0 0 300 300" className="sky__svg" onClick={() => setFocus(null)}>
        <circle cx={150} cy={150} r={46} fill="none" stroke="rgba(214,178,94,0.15)" strokeWidth={0.6} />
        {links.map(([key, n]) => {
          const [a, b] = key.split('|');
          const pa = pos[a];
          const pb = pos[b];
          if (!pa || !pb) return null;
          const lit = !focus || key.includes(focus);
          return <line key={key} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="#d6b25e" strokeWidth={0.4 + (n / maxLink) * 1.2} opacity={lit ? 0.18 + (n / maxLink) * 0.5 : 0.04} />;
        })}
        {CARDS.map((c) => {
          const e = k.cards[c.id];
          const tier = e?.tier ?? 0;
          const seen = !!e;
          const p = pos[c.id];
          const r = seen ? 2.2 + tier * 0.7 : 1.1;
          const fill = !seen ? 'rgba(141,134,163,0.35)' : tier >= 2 ? '#f3dc8a' : tier >= 1 ? '#d6b25e' : '#bfb8d6';
          const dim = focus && focus !== c.id && !focusSet.has(c.id);
          return (
            <g key={c.id} opacity={dim ? 0.25 : 1} onClick={(ev) => { ev.stopPropagation(); setFocus(focus === c.id ? null : c.id); }} style={{ cursor: seen ? 'pointer' : 'default' }}>
              {seen && tier >= 2 && <circle cx={p.x} cy={p.y} r={r * 2.4} fill="#f3dc8a" opacity={0.12} />}
              <circle cx={p.x} cy={p.y} r={r} fill={fill} />
              {focus === c.id && <circle cx={p.x} cy={p.y} r={r + 3} fill="none" stroke="#f3dc8a" strokeWidth={0.8} />}
            </g>
          );
        })}
      </svg>
      <p className="muted small center">
        {focus
          ? `${getCard(focus).name} · read alongside ${focusSet.size - 1} other card${focusSet.size === 2 ? '' : 's'}`
          : links.length === 0
            ? 'Every reading you make joins its four cards here.'
            : `${Object.values(k.cards).filter((c) => c.tier > 0).length} lit · ${links.length} bonds · tap a star`}
      </p>
    </div>
  );
}
