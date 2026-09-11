import { create } from 'zustand';
import { setSoundEnabled } from './audio';

export interface Settings {
  sound: boolean;
  reduceMotion: boolean;
  /** Player has seen the seat glyph hint on the title screen. */
  set: (patch: Partial<Omit<Settings, 'set'>>) => void;
}

const KEY = 'arcana-descent.settings.v1';

function load(): { sound: boolean; reduceMotion: boolean } {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { sound: true, reduceMotion: false, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { sound: true, reduceMotion: false };
}

const initial = load();
setSoundEnabled(initial.sound);

export const useSettings = create<Settings>((set, get) => ({
  ...initial,
  set: (patch) => {
    set(patch);
    const { sound, reduceMotion } = get();
    setSoundEnabled(sound);
    try {
      localStorage.setItem(KEY, JSON.stringify({ sound, reduceMotion }));
    } catch {
      /* ignore */
    }
  },
}));
