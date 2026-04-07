import { AppTheme, themes } from '../theme';
import { useThemeStore } from '../store/themeStore';

interface UseAppTheme {
    theme: AppTheme;
    toggle: () => void;
    setMode: (mode: 'light' | 'dark') => void;
    isDark: boolean;
}

export function useAppTheme(): UseAppTheme {
    const { mode, toggle, setMode } = useThemeStore();
    const theme = themes[mode];

    return {
        theme,
        toggle,
        setMode,
        isDark: mode === 'dark',
    };
}