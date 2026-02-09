import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { Colors, Spacing, Typography } from '../constants/Theme';

interface HUDProps {
    turn: 'w' | 'b';
    gameMode: 'ai' | 'local';
    difficulty: 'easy' | 'medium' | 'hard';
}

export const HUD: React.FC<HUDProps> = ({ turn, gameMode, difficulty }) => {
    const isWhiteTurn = turn === 'w';

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: withRepeat(
            withSequence(
                withTiming(0.6, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            true
        ),
    }));

    return (
        <View style={styles.container}>
            <View style={styles.modeInfo}>
                <Text style={styles.modeText}>
                    {gameMode === 'ai' ? `VS COMPUTER (${difficulty.toUpperCase()})` : 'LOCAL MULTIPLAYER'}
                </Text>
            </View>

            <View style={styles.turnIndicator}>
                <Animated.View style={[styles.statusWrapper, animatedStyle]}>
                    <View style={[
                        styles.dot,
                        { backgroundColor: isWhiteTurn ? '#FFF' : '#333' }
                    ]} />
                    <Text style={styles.turnText}>
                        {isWhiteTurn ? "WHITE'S TURN" : "BLACK'S TURN"}
                    </Text>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.md,
        alignItems: 'center',
    },
    modeInfo: {
        marginBottom: Spacing.xs,
    },
    modeText: {
        ...Typography.label,
        color: Colors.textMuted,
        fontSize: 10,
        letterSpacing: 1.5,
    },
    turnIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    turnText: {
        ...Typography.h2,
        fontSize: 14,
        color: Colors.accentGold,
        letterSpacing: 2,
    },
});
