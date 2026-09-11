/**
 * Tiny vector vocabulary for the card illustrations. Everything is drawn in an
 * 80 x 112 art window (see CardArt) using three inks: INK (dark), GOLD, and
 * PALE (highlight). Restraint is the style: silhouettes, not rendering.
 */
export const INK = '#2a2118';
export const GOLD = 'url(#goldFoil)';
export const GOLD_FLAT = '#c9a24a';
export const PALE = '#f6efdd';
export const BLOOD = '#a33a2e';

type P = { x: number; y: number };

export function Sun({ x, y, r = 10, rays = 12, face = false }: P & { r?: number; rays?: number; face?: boolean }) {
  const lines = [];
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    const long = i % 2 === 0;
    const r1 = r + 2;
    const r2 = r + (long ? 8 : 5);
    lines.push(<line key={i} x1={x + Math.cos(a) * r1} y1={y + Math.sin(a) * r1} x2={x + Math.cos(a) * r2} y2={y + Math.sin(a) * r2} stroke={GOLD_FLAT} strokeWidth={long ? 1.4 : 0.9} strokeLinecap="round" />);
  }
  return (
    <g>
      {lines}
      <circle cx={x} cy={y} r={r} fill={GOLD} stroke={INK} strokeWidth={0.8} />
      {face && (
        <g stroke={INK} strokeWidth={0.8} fill="none">
          <path d={`M${x - 4} ${y - 2} q1.5 -1.5 3 0 M${x + 1} ${y - 2} q1.5 -1.5 3 0`} />
          <path d={`M${x - 3} ${y + 3} q3 3 6 0`} />
        </g>
      )}
    </g>
  );
}

export function Moon({ x, y, r = 9, face = false }: P & { r?: number; face?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={PALE} stroke={INK} strokeWidth={0.8} />
      <circle cx={x + r * 0.45} cy={y - r * 0.2} r={r * 0.85} fill="url(#skyDeep)" opacity={0.9} />
      {face && <path d={`M${x - r * 0.5} ${y - 1} q1 -1.5 2 0 M${x - r * 0.55} ${y + 3} q1.5 1.5 3 0`} stroke={INK} strokeWidth={0.7} fill="none" />}
    </g>
  );
}

export function Star({ x, y, r = 4, points = 8, fill = GOLD }: P & { r?: number; points?: number; fill?: string }) {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.42;
    pts.push(`${x + Math.cos(a) * rr},${y + Math.sin(a) * rr}`);
  }
  return <polygon points={pts.join(' ')} fill={fill} stroke={INK} strokeWidth={0.4} />;
}

export function Ground({ y = 96, fill = INK, opacity = 1 }: { y?: number; fill?: string; opacity?: number }) {
  return <path d={`M0 ${y} Q20 ${y - 3} 40 ${y} T80 ${y} L80 112 L0 112 Z`} fill={fill} opacity={opacity} />;
}

export function Mountains({ y = 80, fill = INK, opacity = 0.35 }: { y?: number; fill?: string; opacity?: number }) {
  return <path d={`M0 ${y + 14} L14 ${y - 6} L24 ${y + 4} L38 ${y - 16} L52 ${y + 2} L62 ${y - 8} L80 ${y + 12} L80 112 L0 112 Z`} fill={fill} opacity={opacity} />;
}

export function Water({ y = 92, rows = 3 }: { y?: number; rows?: number }) {
  return (
    <g fill="none" stroke={INK} strokeWidth={0.7} opacity={0.7}>
      {Array.from({ length: rows }, (_, i) => (
        <path key={i} d={`M0 ${y + i * 5} q5 -2.5 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0`} />
      ))}
    </g>
  );
}

export function Cloud({ x, y, w = 24 }: P & { w?: number }) {
  const h = w * 0.4;
  return <path d={`M${x} ${y} a${h * 0.5} ${h * 0.5} 0 0 1 ${w * 0.25} ${-h * 0.5} a${h * 0.6} ${h * 0.6} 0 0 1 ${w * 0.35} 0 a${h * 0.5} ${h * 0.5} 0 0 1 ${w * 0.3} ${h * 0.4} a${h * 0.4} ${h * 0.4} 0 0 1 ${-w * 0.05} ${h * 0.5} L${x} ${y + h * 0.4} Z`} fill={PALE} stroke={INK} strokeWidth={0.6} />;
}

export function Pillar({ x, y = 8, h = 80, w = 8, dark = false }: P & { h?: number; w?: number; dark?: boolean }) {
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={h} fill={dark ? INK : PALE} stroke={INK} strokeWidth={0.8} />
      <rect x={x - w / 2 - 2} y={y - 3} width={w + 4} height={4} fill={dark ? INK : PALE} stroke={INK} strokeWidth={0.8} />
      <rect x={x - w / 2 - 2} y={y + h - 1} width={w + 4} height={4} fill={dark ? INK : PALE} stroke={INK} strokeWidth={0.8} />
    </g>
  );
}

export type Arms = 'down' | 'up' | 'raised' | 'out' | 'left-up' | 'right-up' | 'hold';

/** A robed silhouette. `y` is the hem; `h` is the height to the crown. */
export function Figure({ x, y, h = 36, arms = 'down', fill = INK, cloak = false, halo = false, crown = false }: P & { h?: number; arms?: Arms; fill?: string; cloak?: boolean; halo?: boolean; crown?: boolean }) {
  const r = h * 0.11;
  const top = y - h;
  const headY = top + r;
  const shoulder = top + r * 2.4;
  const w = h * (cloak ? 0.42 : 0.3);
  const hem = h * (cloak ? 0.7 : 0.5);
  const armLen = h * 0.32;
  const stroke = { stroke: fill, strokeWidth: h * 0.06, strokeLinecap: 'round' as const, fill: 'none' };
  const armPaths: Record<Arms, string> = {
    down: `M${x - w * 0.9} ${shoulder + 2} l${-armLen * 0.25} ${armLen} M${x + w * 0.9} ${shoulder + 2} l${armLen * 0.25} ${armLen}`,
    up: `M${x - w * 0.9} ${shoulder + 2} l${-armLen * 0.4} ${-armLen} M${x + w * 0.9} ${shoulder + 2} l${armLen * 0.4} ${-armLen}`,
    raised: `M${x - w * 0.9} ${shoulder + 2} l${-armLen * 0.15} ${-armLen * 1.1} M${x + w * 0.9} ${shoulder + 2} l${armLen * 0.15} ${-armLen * 1.1}`,
    out: `M${x - w * 0.9} ${shoulder + 2} l${-armLen} ${-armLen * 0.1} M${x + w * 0.9} ${shoulder + 2} l${armLen} ${-armLen * 0.1}`,
    'left-up': `M${x - w * 0.9} ${shoulder + 2} l${-armLen * 0.3} ${-armLen * 1.1} M${x + w * 0.9} ${shoulder + 2} l${armLen * 0.3} ${armLen}`,
    'right-up': `M${x - w * 0.9} ${shoulder + 2} l${-armLen * 0.3} ${armLen} M${x + w * 0.9} ${shoulder + 2} l${armLen * 0.3} ${-armLen * 1.1}`,
    hold: `M${x - w * 0.9} ${shoulder + 2} l${-armLen * 0.2} ${armLen * 0.6} M${x + w * 0.9} ${shoulder + 2} l${armLen * 0.2} ${armLen * 0.6}`,
  };
  return (
    <g>
      {halo && <circle cx={x} cy={headY} r={r * 2} fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} />}
      <path d={armPaths[arms]} {...stroke} />
      <path d={`M${x - w} ${shoulder} L${x + w} ${shoulder} L${x + hem} ${y} L${x - hem} ${y} Z`} fill={fill} />
      <circle cx={x} cy={headY} r={r} fill={fill} />
      {crown && <path d={`M${x - r} ${headY - r * 0.6} l0 ${-r * 1.1} l${r * 0.5} ${r * 0.6} l${r * 0.5} ${-r * 1} l${r * 0.5} ${r * 1} l${r * 0.5} ${-r * 0.6} l0 ${r * 1.1} Z`} fill={GOLD} stroke={INK} strokeWidth={0.4} />}
    </g>
  );
}

export function Throne({ x, y, w = 30, h = 34, fill = PALE }: P & { w?: number; h?: number; fill?: string }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={fill} stroke={INK} strokeWidth={0.8} />
      <rect x={x - w / 2 - 3} y={y - h * 0.5} width={3} height={h * 0.5} fill={fill} stroke={INK} strokeWidth={0.8} />
      <rect x={x + w / 2} y={y - h * 0.5} width={3} height={h * 0.5} fill={fill} stroke={INK} strokeWidth={0.8} />
    </g>
  );
}

export function Horse({ x, y, fill = PALE, w = 34 }: P & { fill?: string; w?: number }) {
  const h = w * 0.55;
  const bx = x; const by = y - h * 0.5; // body center
  return (
    <g fill={fill} stroke={INK} strokeWidth={0.8} strokeLinejoin="round" strokeLinecap="round">
      {/* legs */}
      <path d={`M${bx - w * 0.3} ${by + h * 0.1} l${-w * 0.06} ${h * 0.42} M${bx - w * 0.18} ${by + h * 0.15} l${w * 0.02} ${h * 0.38} M${bx + w * 0.16} ${by + h * 0.15} l${-w * 0.02} ${h * 0.38} M${bx + w * 0.3} ${by + h * 0.1} l${w * 0.07} ${h * 0.42}`} fill="none" strokeWidth={w * 0.06} />
      {/* body */}
      <ellipse cx={bx} cy={by} rx={w * 0.4} ry={h * 0.3} />
      {/* neck + head */}
      <path d={`M${bx + w * 0.28} ${by - h * 0.15} q${w * 0.1} ${-h * 0.5} ${w * 0.26} ${-h * 0.6} l${w * 0.14} ${h * 0.12} q${-w * 0.02} ${h * 0.16} ${-w * 0.16} ${h * 0.14} q${-w * 0.08} ${h * 0.2} ${-w * 0.14} ${h * 0.3} Z`} />
      {/* ear, eye, mane, tail */}
      <path d={`M${bx + w * 0.5} ${by - h * 0.72} l${w * 0.03} ${-h * 0.14} l${w * 0.05} ${h * 0.1}`} fill="none" />
      <circle cx={bx + w * 0.58} cy={by - h * 0.62} r={w * 0.02} fill={INK} stroke="none" />
      <path d={`M${bx + w * 0.3} ${by - h * 0.2} q${w * 0.06} ${-h * 0.3} ${w * 0.2} ${-h * 0.5}`} fill="none" strokeWidth={1.4} />
      <path d={`M${bx - w * 0.4} ${by - h * 0.05} q${-w * 0.14} ${h * 0.15} ${-w * 0.08} ${h * 0.5}`} fill="none" strokeWidth={1.4} />
    </g>
  );
}

export function Lightning({ x, y, len = 40 }: P & { len?: number }) {
  return <path d={`M${x} ${y} l${-len * 0.18} ${len * 0.33} l${len * 0.16} ${-len * 0.02} l${-len * 0.22} ${len * 0.4} l${len * 0.3} ${-len * 0.45} l${-len * 0.14} ${0.01 * len} l${len * 0.12} ${-len * 0.27} Z`} fill={GOLD} stroke={INK} strokeWidth={0.5} />;
}

export function Flame({ x, y, s = 6 }: P & { s?: number }) {
  return <path d={`M${x} ${y} q${-s * 0.9} ${-s * 0.9} ${-s * 0.2} ${-s * 2} q${s * 0.2} ${s * 0.8} ${s * 0.5} ${s * 0.5} q${s * 0.1} ${-s * 0.9} ${s * 0.6} ${-s * 1.3} q${s * 0.7} ${s * 1.6} ${-s * 0.9} ${s * 2.8} Z`} fill={GOLD} stroke={BLOOD} strokeWidth={0.5} />;
}

export function Infinity({ x, y, s = 6 }: P & { s?: number }) {
  return <path d={`M${x} ${y} c${-s * 0.6} ${-s} ${-s * 2} ${-s * 0.4} ${-s * 1.2} ${s * 0.4} c${s * 0.6} ${s * 0.8} ${s * 1.4} ${-s * 0.4} ${s * 1.2} ${-s * 0.4} c${s * 0.6} ${-s} ${s * 2} ${-s * 0.4} ${s * 1.2} ${s * 0.4} c${-s * 0.6} ${s * 0.8} ${-s * 1.4} ${-s * 0.4} ${-s * 1.2} ${-s * 0.4}`} fill="none" stroke={GOLD_FLAT} strokeWidth={1} />;
}

export function Tree({ x, y, h = 26, fill = INK }: P & { h?: number; fill?: string }) {
  return (
    <g>
      <path d={`M${x - 1.2} ${y} l0 ${-h * 0.5} M${x} ${y - h * 0.5} l${-h * 0.2} ${-h * 0.2} M${x} ${y - h * 0.45} l${h * 0.22} ${-h * 0.25}`} stroke={fill} strokeWidth={1.4} fill="none" />
      <circle cx={x} cy={y - h * 0.7} r={h * 0.3} fill={fill} />
      <circle cx={x - h * 0.22} cy={y - h * 0.55} r={h * 0.2} fill={fill} />
      <circle cx={x + h * 0.24} cy={y - h * 0.58} r={h * 0.22} fill={fill} />
    </g>
  );
}

export function Chain({ x, y, len = 14, angle = 0 }: P & { len?: number; angle?: number }) {
  const links = Math.max(2, Math.round(len / 3));
  return (
    <g transform={`rotate(${angle} ${x} ${y})`} fill="none" stroke={INK} strokeWidth={0.7}>
      {Array.from({ length: links }, (_, i) => (
        <ellipse key={i} cx={x + i * 3} cy={y} rx={1.8} ry={1.1} />
      ))}
    </g>
  );
}

export function Lantern({ x, y }: P) {
  return (
    <g>
      <rect x={x - 3} y={y - 4} width={6} height={8} fill={PALE} stroke={INK} strokeWidth={0.7} />
      <Star x={x} y={y} r={2.4} points={6} />
      <path d={`M${x - 2} ${y - 4} l2 -2 l2 2`} fill="none" stroke={INK} strokeWidth={0.7} />
    </g>
  );
}

export function Wings({ x, y, span = 30 }: P & { span?: number }) {
  return (
    <g fill={PALE} stroke={INK} strokeWidth={0.7}>
      <path d={`M${x - 2} ${y} q${-span * 0.4} ${-span * 0.4} ${-span * 0.5} ${-span * 0.05} q${span * 0.2} ${-span * 0.05} ${span * 0.15} ${span * 0.15} q${span * 0.15} ${-span * 0.05} ${span * 0.12} ${span * 0.12} q${span * 0.1} 0 ${span * 0.2} ${span * 0.02} Z`} />
      <path d={`M${x + 2} ${y} q${span * 0.4} ${-span * 0.4} ${span * 0.5} ${-span * 0.05} q${-span * 0.2} ${-span * 0.05} ${-span * 0.15} ${span * 0.15} q${-span * 0.15} ${-span * 0.05} ${-span * 0.12} ${span * 0.12} q${-span * 0.1} 0 ${-span * 0.2} ${span * 0.02} Z`} />
    </g>
  );
}

// --- suit symbols --------------------------------------------------------

export function Wand({ x, y, s = 10 }: P & { s?: number }) {
  return (
    <g>
      <line x1={x} y1={y - s} x2={x} y2={y + s} stroke={INK} strokeWidth={s * 0.22} strokeLinecap="round" />
      <path d={`M${x} ${y - s * 0.4} q${-s * 0.5} ${-s * 0.3} ${-s * 0.35} ${-s * 0.8} q${s * 0.4} ${s * 0.2} ${s * 0.35} ${s * 0.8} M${x} ${y + s * 0.1} q${s * 0.5} ${-s * 0.3} ${s * 0.35} ${-s * 0.8} q${-s * 0.4} ${s * 0.2} ${-s * 0.35} ${s * 0.8}`} fill={GOLD} stroke={INK} strokeWidth={0.4} />
      <Flame x={x} y={y - s} s={s * 0.28} />
    </g>
  );
}

export function Cup({ x, y, s = 10 }: P & { s?: number }) {
  return (
    <g stroke={INK} strokeWidth={0.6}>
      <path d={`M${x - s * 0.7} ${y - s * 0.7} h${s * 1.4} q0 ${s * 1.1} ${-s * 0.7} ${s * 1.1} q${-s * 0.7} 0 ${-s * 0.7} ${-s * 1.1} Z`} fill={GOLD} />
      <rect x={x - s * 0.1} y={y + s * 0.4} width={s * 0.2} height={s * 0.35} fill={INK} />
      <path d={`M${x - s * 0.55} ${y + s * 0.95} q${s * 0.55} ${-s * 0.35} ${s * 1.1} 0 Z`} fill={GOLD} />
      <ellipse cx={x} cy={y - s * 0.7} rx={s * 0.7} ry={s * 0.18} fill={PALE} />
    </g>
  );
}

export function Sword({ x, y, s = 10, angle = 0 }: P & { s?: number; angle?: number }) {
  return (
    <g transform={`rotate(${angle} ${x} ${y})`} stroke={INK} strokeWidth={0.5}>
      <path d={`M${x} ${y - s} l${s * 0.18} ${s * 0.25} v${s * 1.15} h${-s * 0.36} v${-s * 1.15} Z`} fill={PALE} />
      <rect x={x - s * 0.5} y={y + s * 0.38} width={s} height={s * 0.14} fill={GOLD} />
      <rect x={x - s * 0.09} y={y + s * 0.52} width={s * 0.18} height={s * 0.4} fill={INK} />
      <circle cx={x} cy={y + s} r={s * 0.14} fill={GOLD} />
    </g>
  );
}

export function Pentacle({ x, y, s = 10 }: P & { s?: number }) {
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return [x + Math.cos(a) * s * 0.72, y + Math.sin(a) * s * 0.72];
  });
  const star = [0, 2, 4, 1, 3, 0].map((i) => pts[i].join(',')).join(' ');
  return (
    <g stroke={INK} strokeWidth={0.6}>
      <circle cx={x} cy={y} r={s * 0.9} fill={GOLD} />
      <circle cx={x} cy={y} r={s * 0.78} fill="none" strokeWidth={0.4} />
      <polyline points={star} fill="none" strokeWidth={0.8} />
    </g>
  );
}

export const SUIT_SYMBOL = { wands: Wand, cups: Cup, swords: Sword, pentacles: Pentacle } as const;
