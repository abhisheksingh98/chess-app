export const Colors = {
    // Brand Colors
    backgroundPrimary: '#121212',
    backgroundSecondary: '#1E1E1E',
    surface: '#2C2B29',

    // Board Colors
    darkSquare: '#B58863',
    lightSquare: '#F0D9B5',
    accentGold: '#D4AF37',
    accentGreen: '#4C944C',

    // Text Colors
    textPrimary: '#FFFFFF',
    textSecondary: '#B58863',
    textMuted: '#808080',

    // Actions
    buttonPrimary: '#B58863',
    buttonSecondary: '#312E2B',

    // Check/Highlights
    highlight: 'rgba(212, 175, 55, 0.4)',
    danger: '#D32F2F',
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const Typography = {
    h1: {
        fontSize: 32,
        fontWeight: 'bold' as const,
        color: Colors.textPrimary,
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        color: Colors.textPrimary,
    },
    body: {
        fontSize: 16,
        color: Colors.textPrimary,
    },
    label: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '600' as const,
    },
};
