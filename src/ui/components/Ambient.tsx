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
    const touch = { x: -1, y: -1, t: 0 };
    const onPointer = (e: PointerEvent) => {
      touch.x = e.clientX / w;
      touch.y = e.clientY / h;
      touch.t = performance.now();
    };
    window.addEventListener('pointerdown', onPointer, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    let last = performance.now();
    const frame = (t: number) => {
      const dt = Math.min(t - last, 50);
      last = t;
      const rootStyle = getComputedStyle(document.documentElement);
      // A reading in progress colours the motes by how it is going; otherwise afterglow, then the scene.
      const hue = rootStyle.getPropertyValue('--reading-hue').trim() || rootStyle.getPropertyValue('--mote-hue').trim() || rootStyle.getPropertyValue('--scene-hue') || '260';
      // The scene's kind changes what drifts: embers, leaves, sparks, or the usual dust.
      const kind = rootStyle.getPropertyValue('--mote-kind').trim().replace(/"/g, '');
      const ember = kind === 'threat';
      const leaf = kind === 'rest';
      const spark = kind === 'mystery';
      const deep = kind === 'abyss';
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        if (!reduce) {
          // drift away from a recent touch
          const age = t - touch.t;
          if (age < 900 && touch.x >= 0) {
            const dx = m.x - touch.x;
            const dy = (m.y - touch.y) * (h / w);
            const d2 = dx * dx + dy * dy;
            if (d2 < 0.04) {
              const f = ((0.04 - d2) / 0.04) * 0.00035 * (1 - age / 900);
              const len = Math.sqrt(d2) || 0.001;
              m.x += (dx / len) * f * dt;
              m.y += (dy / len) * f * dt * (w / h);
            }
          }
          const sway = leaf ? Math.sin(m.p * 0.7) * 0.00012 : 0;
          m.x += (m.vx + sway) * dt;
          m.y += m.vy * (ember ? 2.2 : leaf ? -0.9 : deep ? 0.4 : 1) * dt;
          m.p += dt * (spark ? 0.005 : 0.002);
          if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
          if (m.y > 1.02) { m.y = -0.02; m.x = Math.random(); }
          if (m.x < -0.02) m.x = 1.02;
          if (m.x > 1.02) m.x = -0.02;
        }
        const a = 0.25 + 0.2 * Math.sin(m.p);
        ctx.beginPath();
        if (ember) {
          const flick = 0.5 + 0.5 * Math.sin(m.p * 3 + m.r);
          ctx.fillStyle = `hsla(${22 + m.r * 8}, 95%, ${55 + flick * 15}%, ${0.35 + 0.4 * flick})`;
          ctx.arc(m.x * w, m.y * h, m.r * 0.9, 0, Math.PI * 2);
        } else if (leaf) {
          ctx.fillStyle = `hsla(${88 + m.r * 10}, 45%, 62%, ${0.3 + 0.25 * Math.sin(m.p)})`;
          ctx.ellipse(m.x * w, m.y * h, m.r * 2.2, m.r * 1.1, m.p, 0, Math.PI * 2);
        } else if (spark) {
          const tw = Math.max(0, Math.sin(m.p));
          ctx.fillStyle = `hsla(268, 80%, 82%, ${0.15 + 0.7 * tw})`;
          ctx.arc(m.x * w, m.y * h, m.r * (0.7 + tw), 0, Math.PI * 2);
        } else if (deep) {
          ctx.fillStyle = `hsla(45, 70%, 75%, ${a * 0.9})`;
          ctx.arc(m.x * w, m.y * h, m.r * 1.2, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = `hsla(${hue.trim()}, 60%, 80%, ${a})`;
          ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);
  return <canvas ref={ref} className="ambient" aria-hidden />;
}
