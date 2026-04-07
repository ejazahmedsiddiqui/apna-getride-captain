import {Theme, DefaultTheme} from '@react-navigation/native';

export type ThemeMode = 'light' | 'dark';

export interface AppColors {
    // --- Primary ---
    primary: string;
    primaryContainer: string;
    onPrimary: string;
    onPrimaryContainer: string;
    primaryFixed: string;

    // --- Secondary (Action Green) ---
    secondary: string;
    secondaryContainer: string;
    onSecondary: string;
    onSecondaryContainer: string;
    secondaryFixedDim: string;

    // --- Tertiary ---
    tertiary: string;
    tertiaryContainer: string;
    onTertiary: string;

    // --- Surface Hierarchy ---
    surface: string;
    surfaceBright: string;
    surfaceContainerLowest: string;
    surfaceContainerLow: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;

    // --- On-Surface ---
    onSurface: string;
    onSurfaceVariant: string;

    // --- Outline ---
    outline: string;
    outlineVariant: string;

    // --- Background ---
    background: string;
    onBackground: string;

    // --- Error ---
    error: string;
    onError: string;
    errorContainer: string;

    // --- Surface Tint (for focus bottom-stroke) ---
    surfaceTint: string;
}

export interface AppTheme extends Theme {
    mode: ThemeMode;
    colors: Theme['colors'] & AppColors;
    typography: {
        fontDisplay: string;
        fontBody: string;
    };
    spacing: {
        microGap: number;
        gutterMobile: number;
        sectionVerticalGap: number;
    };
    radius: {
        sm: number;
        md: number;
        xl: number;
        full: number;
    };
    shadow: {
        boxShadow: string;
    };
}

const typography = {
    fontDisplay: 'Manrope',
    fontBody: 'Inter',
};

const spacing = {
    microGap: 6,
    gutterMobile: 16,
    sectionVerticalGap: 32,
};

const radius = {
    sm: 4,
    md: 12,
    xl: 24,
    full: 9999,
};

const lightColors: AppColors = {
    // Primary — deep blue foundation
    primary: '#000666',
    primaryContainer: '#1A237E',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#C5CAE9',
    primaryFixed: '#E8EAF6',

    // Secondary — action green
    secondary: '#006e1c',
    secondaryContainer: '#91F78E',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#002204',
    secondaryFixedDim: '#76DB73',

    // Tertiary
    tertiary: '#380B00',
    tertiaryContainer: '#FFDBD0',
    onTertiary: '#FFFFFF',

    // Surface hierarchy (light: bright surfaces)
    surface: '#F8F9FF',
    surfaceBright: '#FFFFFF',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#F1F2FA',
    surfaceContainer: '#E8EAF6',
    surfaceContainerHigh: '#DDE0F0',
    surfaceContainerHighest: '#d0d3e8',

    // On-surface
    onSurface: '#1A1C2E',
    onSurfaceVariant: '#44475A',

    // Outline
    outline: '#757891',
    outlineVariant: '#C4C6DC',

    // Background
    background: '#F1F2FA',
    onBackground: '#1A1C2E',

    // Error
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',

    // Surface tint (focus indicator)
    surfaceTint: '#000666',
};

const darkColors: AppColors = {
    // Primary
    primary: '#BBC3FF',
    primaryContainer: '#414dc3',
    onPrimary: '#000F6B',
    onPrimaryContainer: '#DDE1FF',
    primaryFixed: '#1E2578',

    // Secondary — action green (muted for dark)
    secondary: '#76DB73',
    secondaryContainer: '#005314',
    onSecondary: '#003909',
    onSecondaryContainer: '#91F78E',
    secondaryFixedDim: '#5BBF59',

    // Tertiary
    tertiary: '#FFB59D',
    tertiaryContainer: '#5B1700',
    onTertiary: '#5B1700',

    // Surface hierarchy (dark: deep layered surfaces)
    surface: '#121420',
    surfaceBright: '#1E2030',
    surfaceContainerLowest: '#0D0F1A',
    surfaceContainerLow: '#161828',
    surfaceContainer: '#1A1C2E',
    surfaceContainerHigh: '#1E2038',
    surfaceContainerHighest: '#262840',

    // On-surface
    onSurface: '#E2E3F4',
    onSurfaceVariant: '#C4C6DC',

    // Outline
    outline: '#8E90A8',
    outlineVariant: '#44475A',

    // Background
    background: '#0D0F1A',
    onBackground: '#E2E3F4',

    // Error
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',

    // Surface tint
    surfaceTint: '#BBC3FF',
};

const shadow = (mode: ThemeMode) => ({

    boxShadow: mode === 'light' ? '0px 10px 20px rgba(0, 0, 0, 0.15)' : ''

});

export const lightTheme: AppTheme = {
    dark: false,
    mode: 'light',
    fonts: DefaultTheme.fonts,
    colors: {
        ...lightColors,
        // React Navigation required keys (override after spread to avoid TS2783)
        primary: lightColors.primary,
        background: lightColors.background,
        card: lightColors.surfaceContainerLow,
        text: lightColors.onSurface,
        border: 'transparent',
        notification: lightColors.secondary,
    },
    typography,
    spacing,
    radius,
    shadow: shadow('light'),
};

export const darkTheme: AppTheme = {
    dark: true,
    mode: 'dark',
    fonts: DefaultTheme.fonts,
    colors: {
        ...darkColors,
        // React Navigation required keys (override after spread to avoid TS2783)
        primary: darkColors.primary,
        background: darkColors.background,
        card: darkColors.surfaceContainerLow,
        text: darkColors.onSurface,
        border: 'transparent',
        notification: darkColors.secondary,
    },
    typography,
    spacing,
    radius,
    shadow: shadow('dark'),
};

export const themes: Record<ThemeMode, AppTheme> = {
    light: lightTheme,
    dark: darkTheme,
};