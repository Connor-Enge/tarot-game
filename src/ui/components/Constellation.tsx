import { useMemo, useState } from 'react';
import { CARDS, getCard, type Knowledge, BOND_MIN } from '../../engine';
import { renderSkyImage } from '../art/render';

const SUIT_GLYPH = { wands: 'Wands', cups: 'Cups', swords: 'Swords', pentacles: 'Pentacles' } as const;
const SUIT_TINT = { wands: '#e0a068', cups: '#8fc3e0', swords: '#d8d9e8', pentacles: '#a9c98a' } as const;

/**
 * Every card as a star. Majors in the inner ring, each suit an arm of the
 * spiral. Stars light as cards are seen and brighten as they are known.
 * Lines join cards that have sat in the same reading. Your readings, as a sky.
 */
export function Constellation({ knowledge: k, live = [] }: { knowledge: Knowledge; live?: string[] }) {
  const liveSet = new Set(live);
  const [focus, setFocus] = useState<string | null>(null);
  const [pass, setPass] = useState(0); // re-keys the road so it draws again
  const liveIndex = new Map(live.map((id, i) => [id, i]));
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
        {(['wands', 'cups', 'swords', 'pentacles'] as const).map((suit, arm) => {
          const a = arm * (Math.PI / 2) + 1.35 + 0.35 + 0.16;
          const r = 124;
          return (
            <text key={suit} x={150 + Math.cos(a) * r} y={150 + Math.sin(a) * r} textAnchor="middle" dominantBaseline="middle" className="sky__arm" fill="rgba(141,134,163,0.75)" fontSize={6.5} fontFamily="Georgia, serif" letterSpacing="0.14em">
              {SUIT_GLYPH[suit]}
            </text>
          );
        })}
        {links.map(([key, n]) => {
          const [a, b] = key.split('|');
          const pa = pos[a];
          const pb = pos[b];
          if (!pa || !pb) return null;
          const lit = !focus || key.includes(focus);
          const kin = n >= BOND_MIN;
          return <line key={key} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={kin ? '#bfe6f5' : '#d6b25e'} strokeWidth={(kin ? 0.8 : 0.4) + (n / maxLink) * 1.2} opacity={lit ? (kin ? 0.45 : 0.18) + (n / maxLink) * 0.5 : 0.04} />;
        })}
        {live.length > 1 && (
          <path
            key={`road-${pass}`}
            className="sky__road"
            d={live.map((id, i) => `${i === 0 ? 'M' : 'L'}${pos[id]?.x ?? 150} ${pos[id]?.y ?? 150}`).join(' ')}
            fill="none"
            stroke="#8fc3e0"
            strokeWidth={0.7}
            strokeLinejoin="round"
            opacity={0.55}
            pathLength={1}
            style={{ animationDuration: `${Math.min(6, 0.3 * live.length)}s` }}
          />
        )}
        {CARDS.map((c) => {
          const e = k.cards[c.id];
          const tier = e?.tier ?? 0;
          const seen = !!e;
          const p = pos[c.id];
          const r = seen ? 2.2 + tier * 0.7 : 1.1;
          const suitTint = c.arcana === 'major' ? '#f3dc8a' : SUIT_TINT[c.suit!];
          const fill = !seen ? 'rgba(141,134,163,0.35)' : tier >= 2 ? suitTint : tier >= 1 ? '#d6b25e' : '#bfb8d6';
          const dim = focus && focus !== c.id && !focusSet.has(c.id);
          return (
            <g key={c.id} opacity={dim ? 0.25 : 1} onClick={(ev) => { ev.stopPropagation(); setFocus(focus === c.id ? null : c.id); }} style={{ cursor: seen ? 'pointer' : 'default' }}>
              {seen && tier >= 2 && <circle cx={p.x} cy={p.y} r={r * 2.4} fill={suitTint} opacity={0.14} />}
              <circle cx={p.x} cy={p.y} r={r} fill={fill} className={tier >= 3 ? 'sky__star--mastered' : undefined} />
              {focus === c.id && <circle cx={p.x} cy={p.y} r={r + 3} fill="none" stroke="#f3dc8a" strokeWidth={0.8} />}
              {liveSet.has(c.id) && (
                <g key={`live-${pass}`} className="sky__live-in" style={{ animationDelay: `${(liveIndex.get(c.id) ?? 0) * Math.min(300, 6000 / live.length)}ms` }}>
                  <circle cx={p.x} cy={p.y} r={r + 4.5} fill="none" stroke="#8fc3e0" strokeWidth={0.9} className="sky__live" />
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {live.length > 1 && (
        <button type="button" className="chip chip--inline sky__replay" onClick={() => setPass((n) => n + 1)}>
          walk the last road again
        </button>
      )}
      <SkyShare k={k} live={live} />
      <p className="muted small center">
        {focus
          ? `${getCard(focus).name} · read alongside ${focusSet.size - 1} other card${focusSet.size === 2 ? '' : 's'}`
          : links.length === 0
            ? 'Every reading you make joins its four cards here.'
            : `${Object.values(k.cards).filter((c) => c.tier > 0).length} lit · ${links.length} bonds${links.filter(([, n]) => n >= BOND_MIN).length ? ` · ${links.filter(([, n]) => n >= BOND_MIN).length} kin` : ''}${live.length ? ` · ${live.length} on the last road` : ''} · tap a star`}
      </p>
    </div>
  );
}

function SkyShare({ k, live }: { k: Knowledge; live: string[] }) {
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const lit = Object.values(k.cards).filter((c) => c.tier > 0).length;
  const share = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await renderSkyImage(k, `${lit} of ${CARDS.length} lit · ${Object.keys(k.links ?? {}).length} bonds · ${k.runs} descents${live.length ? ` · ${live.length} on the last road` : ''}`, live);
      if (!blob) return;
      const file = new File([blob], 'arcana-sky.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
        return;
      }
      setUrl(URL.createObjectURL(blob));
    } catch {
      /* dismissed */
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <button className="btn" onClick={share} disabled={busy}>
        {busy ? '…' : 'Share the sky'}
      </button>
      {url && (
        <div className="sheet" onClick={() => setUrl(null)} role="dialog" aria-label="sky image">
          <div className="sheet__body" onClick={(ev) => ev.stopPropagation()}>
            <img src={url} alt="Your sky" className="share-img" />
            <div className="row">
              <a className="btn" href={url} download="arcana-sky.png">
                Download
              </a>
              <button className="btn" onClick={() => setUrl(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
