import type { ReactElement } from 'react';
import { GOLD, GOLD_FLAT, INK, PALE } from './primitives';

/**
 * The illustrated vocabulary: where the first primitives were silhouettes,
 * these are drawn. A Person has hair, hands, feet, a belt, folds in the
 * robe and a hatched shadow down one side, after the woodcut manner of
 * the reference deck. Flowers, wheat and fruit for the gardens.
 */
export const SKIN = '#e9cba3';
export const SKIN_INK = '#8a5a3a';
export const LEAF = '#4e7238';

type P = { x: number; y: number };
export type Pose = 'stand' | 'walk' | 'raise-right' | 'raise-left' | 'out' | 'hold' | 'sit' | 'sit-hold' | 'point-down' | 'reach-right' | 'reach-left' | 'up';

/** Head with hair and a hint of a face. `hair` is a colour, or 'none' for a bare crown. */
export function Head({ x, y, r = 5, hair = '#3a2a1e', face = true, turn = 0 }: P & { r?: number; hair?: string; face?: boolean; turn?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={SKIN} stroke={SKIN_INK} strokeWidth={0.5} />
      {hair !== 'none' && <path d={`M${x - r} ${y} a${r} ${r} 0 0 1 ${r * 2} 0 q${-r * 0.2} ${r * 0.35} ${-r * 0.7} ${r * 0.25} q${-r * 0.6} ${-r * 0.3} ${-r * 1.3} ${r * 0.1} Z`} fill={hair} stroke={INK} strokeWidth={0.35} />}
      {face && (
        <g>
          {/* brows, eyes, the line of the nose, a mouth; a touch of shadow under the jaw */}
          <path d={`M${x - r * 0.55 + turn} ${y - r * 0.2} q${r * 0.2} ${-r * 0.16} ${r * 0.4} 0 M${x + r * 0.15 + turn} ${y - r * 0.2} q${r * 0.2} ${-r * 0.16} ${r * 0.4} 0`} fill="none" stroke={SKIN_INK} strokeWidth={0.3} opacity={0.8} />
          <circle cx={x - r * 0.35 + turn} cy={y + r * 0.05} r={r * 0.09} fill={INK} />
          <circle cx={x + r * 0.35 + turn} cy={y + r * 0.05} r={r * 0.09} fill={INK} />
          <path d={`M${x + turn} ${y} q${r * 0.12} ${r * 0.2} 0 ${r * 0.3}`} fill="none" stroke={SKIN_INK} strokeWidth={0.28} opacity={0.8} />
          <path d={`M${x - r * 0.25 + turn} ${y + r * 0.5} q${r * 0.25} ${r * 0.22} ${r * 0.5} 0`} fill="none" stroke={SKIN_INK} strokeWidth={0.35} />
          <path d={`M${x - r * 0.6} ${y + r * 0.7} q${r * 0.6} ${r * 0.35} ${r * 1.2} 0`} fill="none" stroke={SKIN_INK} strokeWidth={0.25} opacity={0.35} />
        </g>
      )}
    </g>
  );
}

/**
 * A drawn person. Feet at (x, y), height h to the crown. The robe is
 * shaded down its right side with the hatch pattern; folds fall from the
 * belt. Hands are drawn so a thing can be put in them: the returned pose
 * leaves the raised hand at (x ± 0.55h, y − 0.95h) and the low hand at
 * (x ± 0.42h, y − 0.42h).
 */
export function Person({ x, y, h = 50, pose = 'stand', robe = PALE, inner, hair = '#3a2a1e', belt = GOLD_FLAT, crown = false, halo = false, face = true, shade = true }: P & { h?: number; pose?: Pose; robe?: string; inner?: string; hair?: string; belt?: string | null; crown?: boolean; halo?: boolean; face?: boolean; shade?: boolean }) {
  const r = h * 0.1;
  const headY = y - h + r;
  const neck = headY + r * 1.15;
  const shoulder = neck + r * 0.6;
  const waist = y - h * 0.5;
  const sw = h * 0.19; // half shoulder width
  const ww = h * 0.13; // half waist width
  const seated = pose === 'sit' || pose === 'sit-hold';
  const hemW = seated ? h * 0.38 : h * 0.26;
  const hemY = seated ? y - h * 0.02 : y - h * 0.06;
  const armLen = h * 0.34;
  const hand = r * 0.55;
  // arm endpoints by pose: [leftHand, rightHand] in picture space (left = viewer's left)
  const L = { x: x - sw, y: shoulder + 1 };
  const R = { x: x + sw, y: shoulder + 1 };
  const poses: Record<Pose, { l: P; r: P; lElbow?: P; rElbow?: P }> = {
    stand: { l: { x: L.x - armLen * 0.25, y: L.y + armLen }, r: { x: R.x + armLen * 0.25, y: R.y + armLen } },
    walk: { l: { x: L.x - armLen * 0.45, y: L.y + armLen * 0.8 }, r: { x: R.x + armLen * 0.35, y: R.y + armLen * 0.9 } },
    'raise-right': { l: { x: L.x - armLen * 0.3, y: L.y + armLen * 0.95 }, r: { x: R.x + armLen * 0.55, y: R.y - armLen * 1.05 }, rElbow: { x: R.x + armLen * 0.45, y: R.y - armLen * 0.25 } },
    'raise-left': { l: { x: L.x - armLen * 0.55, y: L.y - armLen * 1.05 }, r: { x: R.x + armLen * 0.3, y: R.y + armLen * 0.95 }, lElbow: { x: L.x - armLen * 0.45, y: L.y - armLen * 0.25 } },
    out: { l: { x: L.x - armLen * 0.95, y: L.y - armLen * 0.15 }, r: { x: R.x + armLen * 0.95, y: R.y - armLen * 0.15 } },
    hold: { l: { x: x - r * 0.9, y: waist - r * 0.6 }, r: { x: x + r * 0.9, y: waist - r * 0.6 }, lElbow: { x: L.x - armLen * 0.2, y: L.y + armLen * 0.55 }, rElbow: { x: R.x + armLen * 0.2, y: R.y + armLen * 0.55 } },
    sit: { l: { x: L.x - armLen * 0.3, y: L.y + armLen * 0.9 }, r: { x: R.x + armLen * 0.3, y: R.y + armLen * 0.9 } },
    'sit-hold': { l: { x: x - r * 1.1, y: waist + r * 0.3 }, r: { x: x + r * 1.1, y: waist + r * 0.3 }, lElbow: { x: L.x - armLen * 0.25, y: L.y + armLen * 0.55 }, rElbow: { x: R.x + armLen * 0.25, y: R.y + armLen * 0.55 } },
    'point-down': { l: { x: L.x - armLen * 0.35, y: L.y + armLen * 1.05 }, r: { x: R.x + armLen * 0.55, y: R.y - armLen * 1.05 }, rElbow: { x: R.x + armLen * 0.45, y: R.y - armLen * 0.25 } },
    'reach-right': { l: { x: x + sw * 0.7, y: waist - r * 0.2 }, r: { x: R.x + armLen * 0.75, y: waist + r * 0.1 }, lElbow: { x: L.x + sw * 0.2, y: L.y + armLen * 0.5 }, rElbow: { x: R.x + armLen * 0.35, y: R.y + armLen * 0.45 } },
    'reach-left': { l: { x: L.x - armLen * 0.75, y: waist + r * 0.1 }, r: { x: x - sw * 0.7, y: waist - r * 0.2 }, lElbow: { x: L.x - armLen * 0.35, y: L.y + armLen * 0.45 }, rElbow: { x: R.x - sw * 0.2, y: R.y + armLen * 0.5 } },
    up: { l: { x: L.x - armLen * 0.5, y: L.y - armLen * 0.95 }, r: { x: R.x + armLen * 0.5, y: R.y - armLen * 0.95 }, lElbow: { x: L.x - armLen * 0.45, y: L.y - armLen * 0.2 }, rElbow: { x: R.x + armLen * 0.45, y: R.y - armLen * 0.2 } },
  };
  const p = poses[pose];
  const arm = (from: P, elbow: P | undefined, to: P) => (elbow ? `M${from.x} ${from.y} Q${elbow.x} ${elbow.y} ${to.x} ${to.y}` : `M${from.x} ${from.y} L${to.x} ${to.y}`);
  const robeD = `M${x - sw} ${shoulder} Q${x} ${shoulder - r * 0.5} ${x + sw} ${shoulder} L${x + ww} ${waist} L${x + hemW} ${hemY} Q${x} ${hemY + r * 0.5} ${x - hemW} ${hemY} L${x - ww} ${waist} Z`;
  const cid = `p${Math.round(x)}-${Math.round(y)}-${Math.round(h)}`;
  return (
    <g>
      {halo && <circle cx={x} cy={headY} r={r * 2.1} fill="none" stroke={GOLD_FLAT} strokeWidth={0.8} opacity={0.9} />}
      {/* far arm, behind the robe */}
      <path d={arm(L, p.lElbow, p.l)} fill="none" stroke={robe} strokeWidth={r * 0.7} strokeLinecap="round" />
      <path d={arm(L, p.lElbow, p.l)} fill="none" stroke={INK} strokeWidth={r * 0.7 + 0.7} strokeLinecap="round" opacity={0.35} />
      <path d={arm(L, p.lElbow, p.l)} fill="none" stroke={robe} strokeWidth={r * 0.7} strokeLinecap="round" />
      {/* neck */}
      <rect x={x - r * 0.35} y={neck - r * 0.4} width={r * 0.7} height={r * 0.9} fill={SKIN} stroke={SKIN_INK} strokeWidth={0.35} />
      {/* feet */}
      {!seated && (
        <g>
          <ellipse cx={x - r * 0.9 - (pose === 'walk' ? r * 0.8 : 0)} cy={y} rx={r * 0.9} ry={r * 0.32} fill={INK} />
          <ellipse cx={x + r * 0.9 + (pose === 'walk' ? r * 0.4 : 0)} cy={y - (pose === 'walk' ? r * 0.25 : 0)} rx={r * 0.9} ry={r * 0.32} fill={INK} />
        </g>
      )}
      {/* robe */}
      <clipPath id={cid}><path d={robeD} /></clipPath>
      <path d={robeD} fill={robe} stroke={INK} strokeWidth={0.6} strokeLinejoin="round" />
      {inner && <path d={`M${x - ww * 0.5} ${shoulder + r * 0.2} L${x + ww * 0.5} ${shoulder + r * 0.2} L${x + ww * 0.9} ${hemY} L${x - ww * 0.9} ${hemY} Z`} fill={inner} opacity={0.95} clipPath={`url(#${cid})`} />}
      {shade && <rect x={x + ww * 0.35} y={shoulder} width={hemW} height={hemY - shoulder + 2} fill="url(#hatch)" clipPath={`url(#${cid})`} />}
      {/* folds from the belt */}
      <g stroke={INK} strokeWidth={0.4} fill="none" opacity={0.55} clipPath={`url(#${cid})`}>
        <path d={`M${x - ww * 0.5} ${waist + 1} q${-hemW * 0.15} ${h * 0.2} ${-hemW * 0.35} ${hemY - waist}`} />
        <path d={`M${x + ww * 0.2} ${waist + 1} q${hemW * 0.05} ${h * 0.2} ${hemW * 0.1} ${hemY - waist}`} />
        <path d={`M${x + ww * 0.75} ${waist + 1} q${hemW * 0.2} ${h * 0.2} ${hemW * 0.45} ${hemY - waist}`} />
      </g>
      {belt && <path d={`M${x - ww - 0.5} ${waist} L${x + ww + 0.5} ${waist}`} stroke={belt} strokeWidth={r * 0.35} />}
      {/* near arm, over the robe */}
      <path d={arm(R, p.rElbow, p.r)} fill="none" stroke={INK} strokeWidth={r * 0.7 + 0.7} strokeLinecap="round" opacity={0.35} />
      <path d={arm(R, p.rElbow, p.r)} fill="none" stroke={robe} strokeWidth={r * 0.7} strokeLinecap="round" />
      {/* hands */}
      <circle cx={p.l.x} cy={p.l.y} r={hand} fill={SKIN} stroke={SKIN_INK} strokeWidth={0.35} />
      <circle cx={p.r.x} cy={p.r.y} r={hand} fill={SKIN} stroke={SKIN_INK} strokeWidth={0.35} />
      <Head x={x} y={headY} r={r} hair={hair} face={face} />
      {crown && <path d={`M${x - r} ${headY - r * 0.55} l0 ${-r * 1.2} l${r * 0.5} ${r * 0.65} l${r * 0.5} ${-r * 1.05} l${r * 0.5} ${r * 1.05} l${r * 0.5} ${-r * 0.65} l0 ${r * 1.2} Z`} fill={GOLD} stroke={INK} strokeWidth={0.4} />}
    </g>
  );
}

/** Where a Person's hands are, for putting things in them. */
export function hands(x: number, y: number, h: number, pose: Pose): { l: P; r: P } {
  const r = h * 0.1;
  const headY = y - h + r;
  const shoulder = headY + r * 1.15 + r * 0.6;
  const waist = y - h * 0.5;
  const sw = h * 0.19;
  const armLen = h * 0.34;
  const L = { x: x - sw, y: shoulder + 1 };
  const R = { x: x + sw, y: shoulder + 1 };
  const table: Record<Pose, { l: P; r: P }> = {
    stand: { l: { x: L.x - armLen * 0.25, y: L.y + armLen }, r: { x: R.x + armLen * 0.25, y: R.y + armLen } },
    walk: { l: { x: L.x - armLen * 0.45, y: L.y + armLen * 0.8 }, r: { x: R.x + armLen * 0.35, y: R.y + armLen * 0.9 } },
    'raise-right': { l: { x: L.x - armLen * 0.3, y: L.y + armLen * 0.95 }, r: { x: R.x + armLen * 0.55, y: R.y - armLen * 1.05 } },
    'raise-left': { l: { x: L.x - armLen * 0.55, y: L.y - armLen * 1.05 }, r: { x: R.x + armLen * 0.3, y: R.y + armLen * 0.95 } },
    out: { l: { x: L.x - armLen * 0.95, y: L.y - armLen * 0.15 }, r: { x: R.x + armLen * 0.95, y: R.y - armLen * 0.15 } },
    hold: { l: { x: x - r * 0.9, y: waist - r * 0.6 }, r: { x: x + r * 0.9, y: waist - r * 0.6 } },
    sit: { l: { x: L.x - armLen * 0.3, y: L.y + armLen * 0.9 }, r: { x: R.x + armLen * 0.3, y: R.y + armLen * 0.9 } },
    'sit-hold': { l: { x: x - r * 1.1, y: waist + r * 0.3 }, r: { x: x + r * 1.1, y: waist + r * 0.3 } },
    'point-down': { l: { x: L.x - armLen * 0.35, y: L.y + armLen * 1.05 }, r: { x: R.x + armLen * 0.55, y: R.y - armLen * 1.05 } },
    'reach-right': { l: { x: x + sw * 0.7, y: waist - r * 0.2 }, r: { x: R.x + armLen * 0.75, y: waist + r * 0.1 } },
    'reach-left': { l: { x: L.x - armLen * 0.75, y: waist + r * 0.1 }, r: { x: x - sw * 0.7, y: waist - r * 0.2 } },
    up: { l: { x: L.x - armLen * 0.5, y: L.y - armLen * 0.95 }, r: { x: R.x + armLen * 0.5, y: R.y - armLen * 0.95 } },
  };
  return table[pose];
}

export function Rose({ x, y, r = 3, color = '#b8462f' }: P & { r?: number; color?: string }) {
  return (
    <g>
      <path d={`M${x} ${y + r} q${r * 0.3} ${r * 1.4} ${r * 1.6} ${r * 1.2}`} fill="none" stroke={LEAF} strokeWidth={0.6} />
      <path d={`M${x + r * 0.6} ${y + r * 1.4} q${r * 0.9} ${-r * 0.6} ${r * 1.5} ${r * 0.3} q${-r * 0.8} ${r * 0.5} ${-r * 1.5} ${-r * 0.3} z`} fill={LEAF} stroke={INK} strokeWidth={0.3} />
      <circle cx={x} cy={y} r={r} fill={color} stroke={INK} strokeWidth={0.4} />
      <path d={`M${x - r * 0.55} ${y - r * 0.1} a${r * 0.55} ${r * 0.55} 0 1 1 ${r * 1.1} 0`} fill="none" stroke={INK} strokeWidth={0.35} opacity={0.7} />
      <circle cx={x} cy={y} r={r * 0.28} fill="none" stroke={INK} strokeWidth={0.35} opacity={0.7} />
    </g>
  );
}

export function Lily({ x, y, s = 4 }: P & { s?: number }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + s * 2.2} stroke={LEAF} strokeWidth={0.7} />
      {[-1, 0, 1].map((k) => (
        <path key={k} d={`M${x} ${y} q${k * s * 0.9 - s * 0.15} ${-s * 0.7} ${k * s * 0.8} ${-s * 1.4} q${s * 0.3} ${s * 0.9} ${-k * s * 0.8 + s * 0.02} ${s * 1.4} z`} fill={PALE} stroke={INK} strokeWidth={0.35} />
      ))}
      <circle cx={x} cy={y - s * 0.3} r={s * 0.18} fill={GOLD_FLAT} />
    </g>
  );
}

export function Wheat({ x, y, h = 12 }: P & { h?: number }) {
  return (
    <g>
      <path d={`M${x} ${y} q${h * 0.1} ${-h * 0.5} ${h * 0.05} ${-h}`} fill="none" stroke={GOLD_FLAT} strokeWidth={0.7} />
      {[0.35, 0.5, 0.65, 0.8, 0.95].map((t, i) => (
        <g key={i}>
          <ellipse cx={x + h * 0.05 * t - h * 0.12} cy={y - h * t} rx={h * 0.06} ry={h * 0.11} fill={GOLD} stroke={INK} strokeWidth={0.25} transform={`rotate(-25 ${x - h * 0.12} ${y - h * t})`} />
          <ellipse cx={x + h * 0.05 * t + h * 0.12} cy={y - h * t + h * 0.04} rx={h * 0.06} ry={h * 0.11} fill={GOLD} stroke={INK} strokeWidth={0.25} transform={`rotate(25 ${x + h * 0.12} ${y - h * t})`} />
        </g>
      ))}
    </g>
  );
}

export function Pomegranate({ x, y, r = 2.4 }: P & { r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#b8462f" stroke={INK} strokeWidth={0.35} />
      <path d={`M${x - r * 0.4} ${y - r * 0.9} l${r * 0.2} ${-r * 0.5} l${r * 0.2} ${r * 0.35} l${r * 0.2} ${-r * 0.35} l${r * 0.2} ${r * 0.5}`} fill="none" stroke={INK} strokeWidth={0.35} />
      {[[-0.3, 0.1], [0.25, -0.2], [0, 0.4]].map(([dx, dy], i) => <circle key={i} cx={x + dx * r} cy={y + dy * r} r={r * 0.16} fill={PALE} opacity={0.8} />)}
    </g>
  );
}

export function Grass({ x, y, w = 20, n = 7, color = LEAF }: P & { w?: number; n?: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth={0.6} fill="none" strokeLinecap="round">
      {Array.from({ length: n }, (_, i) => {
        const gx = x + (i / (n - 1)) * w;
        const lean = ((i * 5) % 3) - 1;
        return <path key={i} d={`M${gx} ${y} q${lean * 1.2} -3 ${lean * 2} -6`} />;
      })}
    </g>
  );
}

/** A rocky edge falling away to the left, hatched on its face. */
export function Cliff({ x = 0, y = 78, w = 40, drop = 34 }: { x?: number; y?: number; w?: number; drop?: number }): ReactElement {
  const d = `M${x} ${y} L${x + w * 0.85} ${y} q${w * 0.15} ${drop * 0.1} ${w * 0.15} ${drop * 0.3} L${x + w} ${y + drop} L${x} ${y + drop} Z`;
  return (
    <g>
      <path d={d} fill={INK} />
      <path d={`M${x + w * 0.3} ${y + 4} q${w * 0.2} ${drop * 0.3} ${w * 0.45} ${drop * 0.6}`} fill="none" stroke={PALE} strokeWidth={0.5} opacity={0.35} />
      <path d={`M${x + w * 0.1} ${y + drop * 0.5} q${w * 0.25} ${drop * 0.1} ${w * 0.55} ${drop * 0.35}`} fill="none" stroke={PALE} strokeWidth={0.4} opacity={0.25} />
    </g>
  );
}

/**
 * A couchant sphinx: lion body with the forelegs out, a human face under a
 * striped nemes. Rests on the baseline `y`, its back at `x`, and faces right
 * unless told otherwise. About 24 wide and 18 tall.
 */
export function Sphinx({ x, y, fill = INK, face = '#4a4a58', feature = PALE, facing = 'right' }: P & { fill?: string; face?: string; feature?: string; facing?: 'right' | 'left' }) {
  const flip = facing === 'left' ? `translate(${x} ${y}) scale(-1 1)` : `translate(${x} ${y})`;
  const line = fill === INK ? feature : INK;
  return (
    <g transform={flip}>
      <path d="M0 -6 q-4 -2 -3 -8" fill="none" stroke={fill} strokeWidth={1.2} strokeLinecap="round" />
      <path d="M0 0 v-7 q0 -6 5 -7 l4 -1 h7 q3 0 4 3 l1 5 h3 v7 z" fill={fill} stroke={line} strokeWidth={0.5} strokeLinejoin="round" />
      <path d="M3 -7 q3 -4 6 -2" fill="none" stroke={line} strokeWidth={0.4} opacity={0.6} />
      <path d="M14 0 v-4 q0 -2 2 -2 h6 q2 0 2 2 v4 z" fill={fill} stroke={line} strokeWidth={0.5} />
      <path d="M16.5 -0.5 v-1.5 M19 -0.5 v-1.5 M21.5 -0.5 v-1.5" stroke={line} strokeWidth={0.35} opacity={0.7} />
      {fill !== INK && <path d="M5 -10 h10 v9 h-10 z" fill="url(#hatch)" opacity={0.5} />}
      <circle cx={19} cy={-13.5} r={3.4} fill={face} stroke={line} strokeWidth={0.4} />
      <path d="M15 -16 q4 -5 8 0 l1.5 7.5 h-11 z" fill={fill} stroke={line} strokeWidth={0.4} />
      <path d="M15.5 -13 h8 M15 -10.5 h9" stroke={GOLD_FLAT} strokeWidth={0.4} opacity={0.9} />
      <circle cx={17.8} cy={-13.8} r={0.5} fill={feature} />
      <circle cx={20.2} cy={-13.8} r={0.5} fill={feature} />
      <path d="M18 -11.6 q1 0.7 2 0" fill="none" stroke={feature} strokeWidth={0.35} />
    </g>
  );
}
