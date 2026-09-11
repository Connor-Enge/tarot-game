import { create } from 'zustand';

/**
 * "Add to home screen": Chromium fires beforeinstallprompt, which we hold
 * until the player asks; iOS Safari never does, so we show the manual steps.
 * The offer waits until at least one descent has been made, and a "not now"
 * is remembered.
 */
type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

const KEY = 'arcana-descent.install.v1';

function standalone(): boolean {
  try {
    return window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
  } catch {
    return false;
  }
}

function iosSafari(): boolean {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

function loadDismissed(): boolean {
  try {
    return localStorage.getItem(KEY) === 'no';
  } catch {
    return false;
  }
}

interface InstallStore {
  deferred: InstallPrompt | null;
  standalone: boolean;
  ios: boolean;
  dismissed: boolean;
  installed: boolean;
  /** Ask the browser to install (Chromium). Resolves to whether the player accepted. */
  install: () => Promise<boolean>;
  dismiss: () => void;
}

export const useInstall = create<InstallStore>((set, get) => ({
  deferred: null,
  standalone: typeof window !== 'undefined' && standalone(),
  ios: typeof navigator !== 'undefined' && iosSafari(),
  dismissed: typeof localStorage !== 'undefined' && loadDismissed(),
  installed: false,
  install: async () => {
    const p = get().deferred;
    if (!p) return false;
    await p.prompt();
    const { outcome } = await p.userChoice;
    set({ deferred: null, installed: outcome === 'accepted' });
    return outcome === 'accepted';
  },
  dismiss: () => {
    set({ dismissed: true });
    try {
      localStorage.setItem(KEY, 'no');
    } catch {
      /* ignore */
    }
  },
}));

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    useInstall.setState({ deferred: e as InstallPrompt });
  });
  window.addEventListener('appinstalled', () => useInstall.setState({ installed: true, deferred: null }));
}

/** Whether the title should offer to keep the game on the home screen. */
export function canOfferInstall(s: InstallStore): boolean {
  return !s.standalone && !s.dismissed && !s.installed && (s.deferred !== null || s.ios);
}
