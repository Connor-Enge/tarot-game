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
  /** Narration reveal pace. */
  readingSpeed: 'slow' | 'normal' | 'fast';
  /** Keep the seats as glyphs even once their names are earned. */
  hideSeatNames: boolean;
  /** Player has seen the seat glyph hint on the title screen. */
  set: (patch: Partial<Omit<Settings, 'set'>>) => void;
}

const KEY = 'arcana-descent.settings.v1';

type Stored = { sound: boolean; reduceMotion: boolean; haptics: boolean; fixedTint: boolean; bigCards: boolean; readingSpeed: 'slow' | 'normal' | 'fast'; hideSeatNames: boolean };
const DEFAULTS: Stored = { sound: true, reduceMotion: false, haptics: true, fixedTint: false, bigCards: false, readingSpeed: 'normal', hideSeatNames: false };

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
    const { sound, reduceMotion, haptics, fixedTint, bigCards, readingSpeed, hideSeatNames } = get();
    setSoundEnabled(sound);
    try {
      localStorage.setItem(KEY, JSON.stringify({ sound, reduceMotion, haptics, fixedTint, bigCards, readingSpeed, hideSeatNames }));
    } catch {
      /* ignore */
    }
  },
}));
