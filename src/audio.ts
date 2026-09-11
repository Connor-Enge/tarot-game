/**
 * Synthesized sound. No assets: everything is oscillators and noise through
 * a shared AudioContext, created lazily on the first user gesture (mobile
 * browsers require it). Volume is deliberately low; this is texture.
 */
import type { OutcomeTier } from './engine';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let drone: { stop: () => void } | null = null;
let enabled = true;

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (!on) stopDrone();
  if (master) master.gain.setTargetAtTime(on ? 0.6 : 0, now(), 0.05);
}

function now() {
  return ctx ? ctx.currentTime : 0;
}

function ensure(): AudioContext | null {
  if (!enabled) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.6;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', gain = 0.12, when = 0, detune = 0) {
  const c = ensure();
  if (!c || !master) return;
  const t0 = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.detune.value = detune;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(master);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

function noise(dur: number, gain = 0.08, when = 0, lp = 1200) {
  const c = ensure();
  if (!c || !master) return;
  const t0 = c.currentTime + when;
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = lp;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(f).connect(g).connect(master);
  src.start(t0);
}

export const sfx = {
  /** A card lifted from the hand: paper slide. */
  lift: () => noise(0.09, 0.05, 0, 2400),
  /** A card placed in its seat: soft thump + a tone by suit. */
  place: (suit?: 'wands' | 'cups' | 'swords' | 'pentacles' | 'major') => {
    noise(0.06, 0.09, 0, 600);
    switch (suit) {
      case 'wands':
        tone(220, 0.16, 'triangle', 0.07);
        tone(330, 0.1, 'triangle', 0.03, 0.04);
        break;
      case 'cups':
        tone(330, 0.3, 'sine', 0.06);
        tone(495, 0.25, 'sine', 0.025, 0.06);
        break;
      case 'swords':
        tone(440, 0.09, 'sawtooth', 0.025);
        tone(880, 0.12, 'sine', 0.04, 0.02);
        break;
      case 'pentacles':
        tone(165, 0.22, 'triangle', 0.08);
        break;
      case 'major':
        tone(262, 0.3, 'sine', 0.06);
        tone(392, 0.35, 'sine', 0.05, 0.08);
        break;
      default:
        tone(180, 0.12, 'triangle', 0.08);
    }
  },
  /** Seat flip. */
  flip: () => {
    noise(0.12, 0.06, 0, 3000);
    tone(520, 0.08, 'sine', 0.04, 0.05);
  },
  /** A sheet sliding up: paper. */
  page: () => {
    noise(0.14, 0.05, 0, 1600);
    noise(0.1, 0.03, 0.06, 900);
  },
  whisper: () => {
    tone(880, 0.5, 'sine', 0.05);
    tone(1320, 0.6, 'sine', 0.03, 0.08, 6);
  },
  node: () => tone(440, 0.15, 'triangle', 0.06),
  redraw: () => {
    noise(0.15, 0.06, 0, 1800);
    noise(0.15, 0.06, 0.08, 1800);
    noise(0.15, 0.06, 0.16, 1800);
  },
  /** Resolution sting by tier. */
  resolve: (tier: OutcomeTier) => {
    switch (tier) {
      case 'triumph':
        [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.9, 'sine', 0.07, i * 0.09));
        break;
      case 'boon':
        [523, 659, 784].forEach((f, i) => tone(f, 0.7, 'sine', 0.06, i * 0.08));
        break;
      case 'neutral':
        tone(392, 0.6, 'sine', 0.05);
        tone(587, 0.6, 'sine', 0.04, 0.05);
        break;
      case 'harm':
        tone(311, 0.7, 'sawtooth', 0.03);
        tone(233, 0.8, 'sine', 0.06, 0.05);
        break;
      case 'calamity':
        noise(0.5, 0.12, 0, 400);
        tone(110, 1.4, 'sawtooth', 0.05);
        tone(104, 1.4, 'sawtooth', 0.05, 0.02);
        break;
    }
  },
  /** Entering the Abyss: a long, low swell. */
  abyss: () => {
    tone(41, 3.5, 'sine', 0.09);
    tone(82.5, 3.0, 'triangle', 0.03, 0.3);
    noise(1.2, 0.05, 0.2, 200);
  },
  /** One card edge passing under the thumb. */
  cutTick: () => noise(0.018, 0.035, 0, 3200),
  /** The deck riffled back together: a quick run of ticks, speeding up, then a soft thump. */
  riffle: () => {
    for (let i = 0; i < 14; i++) noise(0.02, 0.04, i * (0.055 - i * 0.002), 2600 + i * 60);
    tone(90, 0.25, 'sine', 0.06, 0.75);
  },
  /** Going under: a slow fall of three tones and water closing over. */
  under: () => {
    [130, 98, 65].forEach((f, i) => tone(f, 1.8, 'sine', 0.07, i * 0.45));
    noise(1.6, 0.05, 0.9, 260);
  },
  death: () => {
    noise(0.8, 0.1, 0, 300);
    [110, 98, 87].forEach((f, i) => tone(f, 1.6, 'triangle', 0.07, i * 0.5));
  },
  ascend: () => {
    [261, 329, 392, 523, 659, 784].forEach((f, i) => tone(f, 1.8, 'sine', 0.05, i * 0.12));
  },
  /** Someone by the fire: a low knock and a two-note murmur. */
  stranger: () => {
    noise(0.12, 0.07, 0, 500);
    tone(146.8, 0.5, 'triangle', 0.05, 0.15);
    tone(174.6, 0.7, 'triangle', 0.045, 0.42);
  },
  /** A vow sworn: a struck bell held. */
  vow: () => {
    tone(880, 1.6, 'sine', 0.06);
    tone(1318.5, 1.2, 'sine', 0.025, 0.02, 4);
    tone(440, 1.8, 'triangle', 0.02, 0.05);
  },
  /** A vow kept: the bell, and a rising answer. */
  vowKept: () => {
    tone(880, 1.2, 'sine', 0.05);
    [1046.5, 1318.5, 1760].forEach((f, i) => tone(f, 1.4, 'sine', 0.035, 0.25 + i * 0.16));
  },
  /** A vow broken: the bell cracked, falling. */
  vowBroken: () => {
    noise(0.2, 0.06, 0, 900);
    [880, 830.6, 740].forEach((f, i) => tone(f, 0.9, 'triangle', 0.045, i * 0.22, -12));
  },
  /** Study: a right answer, a bright pair of notes; a streak of five, a little peal. */
  studyRight: (streak = 1) => {
    tone(1046.5, 0.35, 'sine', 0.05);
    tone(1568, 0.5, 'sine', 0.04, 0.12);
    if (streak > 0 && streak % 5 === 0) [1760, 2093, 2637].forEach((f, i) => tone(f, 0.6, 'sine', 0.03, 0.3 + i * 0.1));
  },
  /** Study: a wrong answer, a dull knock. */
  studyWrong: () => {
    noise(0.1, 0.05, 0, 400);
    tone(196, 0.4, 'triangle', 0.05);
  },
  /** A card lands and the seat answers: a rising pair when it served, a dull knock when it cost, a soft tick otherwise. */
  seat: (verdict: 'helped' | 'hurt' | 'neither') => {
    if (verdict === 'helped') {
      tone(659, 0.28, 'sine', 0.045);
      tone(988, 0.42, 'sine', 0.035, 0.1);
    } else if (verdict === 'hurt') {
      noise(0.1, 0.05, 0, 380);
      tone(147, 0.5, 'triangle', 0.055, 0.02, -10);
    } else {
      tone(440, 0.12, 'sine', 0.025);
    }
  },
  /** The verdict seal pressed: a soft wax thud, and a note that follows the tier. */
  seal: (tier: 'calamity' | 'harm' | 'neutral' | 'boon' | 'triumph' = 'neutral') => {
    noise(0.14, 0.07, 0, 420);
    tone(82, 0.5, 'sine', 0.06);
    if (tier === 'triumph') [1046.5, 1568].forEach((f, i) => tone(f, 0.7, 'sine', 0.035, 0.12 + i * 0.1));
    else if (tier === 'boon') tone(784, 0.6, 'sine', 0.03, 0.12);
    else if (tier === 'harm') tone(196, 0.6, 'triangle', 0.04, 0.1, -8);
    else if (tier === 'calamity') { tone(110, 0.9, 'triangle', 0.05, 0.08, -14); noise(0.3, 0.04, 0.1, 240); }
  },
  /** A new act opens: a deep gong. */
  banner: () => {
    tone(55, 3.2, 'sine', 0.08);
    tone(110.5, 2.6, 'sine', 0.04, 0.05, 6);
    tone(165, 2.0, 'triangle', 0.015, 0.1);
    noise(0.5, 0.03, 0, 300);
  },
};

/** A slow, low pad that follows the scene hue (as a filter cutoff). Starts silent, fades in. */
export function startDrone() {
  const c = ensure();
  if (!c || !master || drone) return;
  const g = c.createGain();
  g.gain.value = 0;
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 220;
  const oscs = [55, 55.4, 82.5].map((freq, i) => {
    const o = c.createOscillator();
    o.type = i === 2 ? 'triangle' : 'sawtooth';
    o.frequency.value = freq;
    o.connect(f);
    o.start();
    return o;
  });
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 90;
  lfo.connect(lfoGain).connect(f.frequency);
  lfo.start();
  f.connect(g).connect(master);
  g.gain.linearRampToValueAtTime(0.045, c.currentTime + 4);
  drone = {
    stop: () => {
      g.gain.setTargetAtTime(0, c.currentTime, 0.8);
      setTimeout(() => {
        oscs.forEach((o) => o.stop());
        lfo.stop();
      }, 3000);
    },
  };
}

export function stopDrone() {
  drone?.stop();
  drone = null;
}

let heartbeat: number | null = null;

/** A slow double thump under the drone while vitality is low. */
export function setHeartbeat(on: boolean) {
  if (on && heartbeat === null) {
    const beat = () => {
      tone(48, 0.18, 'sine', 0.16);
      tone(44, 0.22, 'sine', 0.12, 0.22);
    };
    beat();
    heartbeat = window.setInterval(beat, 1900);
  } else if (!on && heartbeat !== null) {
    window.clearInterval(heartbeat);
    heartbeat = null;
  }
}
