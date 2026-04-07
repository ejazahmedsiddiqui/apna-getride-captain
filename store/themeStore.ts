import { create } from 'zustand';
import { createMMKV } from 'react-native-mmkv';
import { ThemeMode } from '../theme';

const storage = createMMKV({ id: 'apna-getride-theme' });
const THEME_KEY = 'theme-mode';

function loadPersistedMode(): ThemeMode {
    const stored = storage.getString(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return 'light';
}

interface ThemeStore {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    toggle: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
    mode: loadPersistedMode(),

    setMode: (mode) => {
        storage.set(THEME_KEY, mode);
        set({ mode });
    },

    toggle: () => {
        const next: ThemeMode = get().mode === 'light' ? 'dark' : 'light';
        storage.set(THEME_KEY, next);
        set({ mode: next });
    },
}));