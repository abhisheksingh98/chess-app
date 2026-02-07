import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { Button } from '../components/common/UIComponents';
import { Colors, Spacing, Typography } from '../constants/Theme';
import { useChess } from '../context/ChessContext';

export default function HomeScreen() {
    const router = useRouter();
    const { resetGame } = useChess();

    const titleOpacity = useSharedValue(0);
    const buttonY = useSharedValue(100);
    const buttonOpacity = useSharedValue(0);

    useEffect(() => {
        titleOpacity.value = withTiming(1, { duration: 1000 });
        buttonY.value = withDelay(500, withSpring(0));
        buttonOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
    }, []);

    const animatedTitleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
    }));

    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: buttonY.value }],
        opacity: buttonOpacity.value,
    }));

    const startNewGame = () => {
        resetGame();
        router.push('/(tabs)/game');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Animated.View style={[styles.header, animatedTitleStyle]}>
                    <Text style={styles.subtitle}>WELCOME TO</Text>
                    <Text style={styles.title}>BASIC</Text>
                    <Text style={styles.title}>CHESS</Text>
                    <View style={styles.titleUnderline} />
                </Animated.View>

                <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
                    <Button
                        label="Play vs Computer"
                        onPress={startNewGame}
                        style={styles.button}
                    />
                    <Button
                        label="Local Play"
                        variant="secondary"
                        onPress={startNewGame}
                        style={styles.button}
                    />
                </Animated.View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>SIMPLE EDITION</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundPrimary,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: 60,
    },
    subtitle: {
        ...Typography.label,
        color: Colors.textMuted,
        letterSpacing: 4,
        marginBottom: Spacing.xs,
    },
    title: {
        ...Typography.h1,
        fontSize: 42,
        lineHeight: 48,
        textAlign: 'center',
        letterSpacing: 2,
    },
    titleUnderline: {
        width: 60,
        height: 4,
        backgroundColor: Colors.accentGold,
        marginTop: Spacing.md,
        borderRadius: 2,
    },
    buttonContainer: {
        gap: Spacing.md,
    },
    button: {
        height: 56,
    },
    footer: {
        padding: Spacing.lg,
        alignItems: 'center',
    },
    footerText: {
        ...Typography.label,
        fontSize: 10,
        color: Colors.textMuted,
        letterSpacing: 2,
    },
});
