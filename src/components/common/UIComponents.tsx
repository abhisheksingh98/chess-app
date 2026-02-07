import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/Theme';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    label,
    onPress,
    variant = 'primary',
    style
}) => {
    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary': return styles.btnSecondary;
            case 'outline': return styles.btnOutline;
            default: return styles.btnPrimary;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'outline': return { color: Colors.buttonPrimary };
            default: return { color: Colors.textPrimary };
        }
    };

    return (
        <TouchableOpacity
            style={[styles.button, getButtonStyle(), style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={[styles.btnText, getTextStyle()]}>{label}</Text>
        </TouchableOpacity>
    );
};

export const Card: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
    children,
    style
}) => (
    <View style={[styles.card, style]}>
        {children}
    </View>
);

const styles = StyleSheet.create({
    button: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    btnPrimary: {
        backgroundColor: Colors.buttonPrimary,
    },
    btnSecondary: {
        backgroundColor: Colors.buttonSecondary,
    },
    btnOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.buttonPrimary,
    },
    btnText: {
        ...Typography.label,
        fontSize: 16,
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 12,
        padding: Spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 8,
    },
});
