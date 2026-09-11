import { create } from 'zustand';
import { setSoundEnabled } from './audio';

export interface Settings {
  sound: boolean;
  reduceMotion: boolean;
  haptics: boolean;
  /** Keep one hue instead of tinting per scene. */
  fixedTint: boolean;
  /** Larger cards in hand. */
  bigCards: boolean;
  /** Player has seen the seat glyph hint on the title screen. */
  set: (patch: Partial<Omit<Settings, 'set'>>) => void;
}

const KEY = 'arcana-descent.settings.v1';

type Stored = { sound: boolean; reduceMotion: boolean; haptics: boolean; fixedTint: boolean; bigCards: boolean };
const DEFAULTS: Stored = { sound: true, reduceMotion: false, haptics: true, fixedTint: false, bigCards: false };

function load(): Stored {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

export function hapticsEnabled(): boolean {
  return useSettings.getState().haptics;
}

const initial = load();
setSoundEnabled(initial.sound);

export const useSettings = create<Settings>((set, get) => ({
  ...initial,
  set: (patch) => {
    set(patch);
    const { sound, reduceMotion, haptics, fixedTint, bigCards } = get();
    setSoundEnabled(sound);
    try {
      localStorage.setItem(KEY, JSON.stringify({ sound, reduceMotion, haptics, fixedTint, bigCards }));
    } catch {
      /* ignore */
    }
  },
}));
