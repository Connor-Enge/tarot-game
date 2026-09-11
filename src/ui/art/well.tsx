/**
 * The Well closing in: one ring of dark water per Abyss passed, drawn at the
 * bottom of the screen and tightening as the turns climb. Fixed behind the
 * screen; purely atmosphere.
 */
export function WellRings({ turn }: { turn: number }) {
  const n = Math.min(8, turn);
  return (
    <svg className="well-layer" viewBox="0 0 400 800" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <radialGradient id="wellDeep" cx="0.5" cy="1" r="0.8">
          <stop offset="0" stopColor="#05050c" stopOpacity={0.9} />
          <stop offset="1" stopColor="#05050c" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={400} width={400} height={400} fill="url(#wellDeep)" opacity={Math.min(0.9, 0.25 + turn * 0.12)} />
      {Array.from({ length: n }, (_, i) => {
        const ry = 26 + i * 22;
        const rx = 120 + i * 48;
        return (
          <ellipse
            key={i}
            cx={200}
            cy={780}
            rx={rx}
            ry={ry}
            fill="none"
            stroke="#8fa0c0"
            strokeWidth={0.8}
            opacity={0.08 + (n - i) * 0.05}
            className="well-layer__ring"
            style={{ animationDelay: `${i * 700}ms` }}
          />
        );
      })}
    </svg>
  );
}
