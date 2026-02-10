import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
    const { resetGame, setGameMode, loadSavedGame } = useChess();
    const [hasSavedGame, setHasSavedGame] = useState(false);

    const titleOpacity = useSharedValue(0);
    const buttonY = useSharedValue(100);
    const buttonOpacity = useSharedValue(0);

    useEffect(() => {
        titleOpacity.value = withTiming(1, { duration: 1000 });
        buttonY.value = withDelay(500, withSpring(0));
        buttonOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));

        // Check for saved game
        const checkSaved = async () => {
            const saved = await loadSavedGame();
            // We don't want to technically LOAD it yet, just check if it exists
            // But Prompt 09 says "offer a 'Resume Game' option"
            // Let's check AsyncStorage directly here or add a specific check function
            const savedData = await AsyncStorage.getItem('chess_saved_game');
            if (savedData) setHasSavedGame(true);
        };
        checkSaved();
    }, []);

    const animatedTitleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
    }));

    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: buttonY.value }],
        opacity: buttonOpacity.value,
    }));

    const startNewGame = (mode: 'ai' | 'local') => {
        setGameMode(mode);
        resetGame();
        router.push('/(tabs)/game');
    };

    const resumeGame = async () => {
        const success = await loadSavedGame();
        if (success) {
            router.push('/(tabs)/game');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Animated.View style={[styles.header, animatedTitleStyle]}>
                    <Text style={styles.title}>Play Chess</Text>
                    <View style={styles.titleUnderline} />
                </Animated.View>

                <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
                    {hasSavedGame && (
                        <Button
                            label="Resume Game"
                            onPress={resumeGame}
                            style={styles.button}
                        />
                    )}
                    <Button
                        label="Play vs Computer"
                        variant={hasSavedGame ? "secondary" : "primary"}
                        onPress={() => startNewGame('ai')}
                        style={styles.button}
                    />
                    <Button
                        label="Play a Friend"
                        variant="secondary"
                        onPress={() => startNewGame('local')}
                        style={styles.button}
                    />
                    <Button
                        label="My Games"
                        variant="outline"
                        onPress={() => router.push('/library')}
                        style={StyleSheet.flatten([styles.button, { marginTop: Spacing.md }])}
                    />
                </Animated.View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>inspired by chess.com</Text>
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
        marginBottom: 80,
    },
    title: {
        ...Typography.h1,
        fontSize: 48,
        textAlign: 'center',
        color: '#FFF',
    },
    titleUnderline: {
        width: 40,
        height: 4,
        backgroundColor: Colors.buttonPrimary,
        marginTop: Spacing.sm,
        borderRadius: 2,
    },
    buttonContainer: {
        gap: Spacing.lg,
    },
    button: {
        height: 64,
    },
    footer: {
        padding: Spacing.lg,
        alignItems: 'center',
    },
    footerText: {
        ...Typography.label,
        fontSize: 12,
        color: Colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
