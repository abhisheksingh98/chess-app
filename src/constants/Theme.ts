export const Colors = {
    // Brand Colors
    backgroundPrimary: '#302e2b', // Chess.com Dark Grey
    backgroundSecondary: '#262421',
    surface: '#3b3936',

    // Board Colors
    darkSquare: '#769656', // Chess.com Green
    lightSquare: '#eeeed2', // Chess.com Cream
    accentGold: '#f7f769', // Chess.com Move Highlight
    accentGreen: '#bad035', // Chess.com Suggestion

    // Text Colors
    textPrimary: '#FFFFFF',
    textSecondary: '#bababa',
    textMuted: '#808080',

    // Actions
    buttonPrimary: '#81b64c', // Chess.com Primary Green Button
    buttonSecondary: '#454341',

    // Check/Highlights
    highlight: 'rgba(247, 247, 105, 0.5)',
    danger: '#ca3431',
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
