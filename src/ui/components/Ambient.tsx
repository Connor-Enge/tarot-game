import { useEffect, useRef } from 'react';

/**
 * Drifting motes behind everything. One small canvas, ~40 particles,
 * respects prefers-reduced-motion. Tinted by --scene-hue.
 */
export function Ambient() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const N = 40;
    const motes = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.6, vx: (Math.random() - 0.5) * 0.00015, vy: -0.00005 - Math.random() * 0.00012, p: Math.random() * Math.PI * 2 }));
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    let last = performance.now();
    const frame = (t: number) => {
      const dt = Math.min(t - last, 50);
      last = t;
      const hue = getComputedStyle(document.documentElement).getPropertyValue('--scene-hue') || '260';
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        if (!reduce) {
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          m.p += dt * 0.002;
          if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
          if (m.x < -0.02) m.x = 1.02;
          if (m.x > 1.02) m.x = -0.02;
        }
        const a = 0.25 + 0.2 * Math.sin(m.p);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${hue.trim()}, 60%, 80%, ${a})`;
        ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return <canvas ref={ref} className="ambient" aria-hidden />;
}
