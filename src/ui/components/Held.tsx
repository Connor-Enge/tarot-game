import { useRef, type ReactNode } from 'react';

/**
 * A card held close: it tilts toward the finger or pointer and a gold
 * glare slides across the face, like foil catching light. Pure CSS
 * variables on the wrapper; the card inside is untouched. Left alone it
 * settles flat and breathes.
 */
export function Held({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (ev: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
    const py = Math.min(1, Math.max(0, (ev.clientY - r.top) / r.height));
    el.style.setProperty('--ry', `${((px - 0.5) * 22).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${((0.5 - py) * 22).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    el.classList.add('held--touched');
  };
  const rest = () => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty('--rx');
    el.style.removeProperty('--ry');
    el.classList.remove('held--touched');
  };
  return (
    <div ref={ref} className={`held ${className}`} onPointerMove={move} onPointerDown={move} onPointerUp={rest} onPointerLeave={rest} onPointerCancel={rest}>
      {children}
    </div>
  );
}
