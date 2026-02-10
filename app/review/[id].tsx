import { Ionicons } from '@expo/vector-icons';
import { Chess } from 'chess.js';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChessBoardDisplay } from '../../src/components/ChessBoardDisplay';
import { EvalGraph } from '../../src/components/EvalGraph';
import { Colors, Spacing, Typography } from '../../src/constants/Theme';
import { useChess } from '../../src/context/ChessContext';
import AIEngine from '../../src/engine/AIEngine';
import { MatchRecord, StorageService } from '../../src/services/StorageService';

export default function ReviewScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { analyzeMove } = useChess();

    const [match, setMatch] = useState<MatchRecord | null>(null);
    const [currentIndex, setCurrentIndex] = useState(-1);

    useEffect(() => {
        loadMatch();
    }, [id]);

    const loadMatch = async () => {
        const library = await StorageService.getLibrary();
        const found = library.find((m: MatchRecord) => m.id === id);
        if (found) {
            setMatch(found);
            setCurrentIndex(found.moves.length - 1);
        }
    };

    const currentFen = useMemo(() => {
        const game = new Chess();
        if (!match) return game.fen();
        try {
            for (let i = 0; i <= currentIndex; i++) {
                const move = match.moves[i];
                if (move) {
                    game.move(move);
                }
            }
        } catch (e) {
            // Corrupted legacy match
        }
        return game.fen();
    }, [match, currentIndex]);

    const currentAnalysis = useMemo(() => {
        if (!match || currentIndex < 0) return null;
        const tempGame = new Chess();
        try {
            for (let i = 0; i < currentIndex; i++) {
                tempGame.move(match.moves[i]);
            }
            const moveResult = tempGame.move(match.moves[currentIndex]);
            return moveResult ? analyzeMove(moveResult) : null;
        } catch (e) {
            return null;
        }
    }, [match, currentIndex, analyzeMove]);

    const evalHistory = useMemo(() => {
        if (!match) return [];
        const history: number[] = [];
        const tempGame = new Chess();
        try {
            match.moves.forEach((move: string) => {
                const res = tempGame.move(move);
                if (res) {
                    history.push(AIEngine.evaluateBoard(tempGame.board()) / 100);
                }
            });
        } catch (e) {
            // stop at failure
        }
        return history;
    }, [match]);

    if (!match) return null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="close" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Match Review</Text>
            </View>

            <View style={styles.boardContainer}>
                <ChessBoardDisplay fen={currentFen} />
            </View>

            <EvalGraph evaluations={evalHistory} />

            <View style={styles.analysisSection}>
                {currentAnalysis && (
                    <View style={[styles.badge, styles[currentAnalysis as keyof typeof styles]]}>
                        <Text style={styles.badgeText}>{currentAnalysis.toUpperCase()}</Text>
                    </View>
                )}
                <Text style={styles.moveText}>
                    {currentIndex >= 0
                        ? `Move ${currentIndex + 1}: ${match.moves[currentIndex]}`
                        : 'Starting Position'}
                </Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    onPress={() => setCurrentIndex(Math.max(-1, currentIndex - 1))}
                    style={styles.controlBtn}
                >
                    <Ionicons name="chevron-back" size={32} color={Colors.textPrimary} />
                </TouchableOpacity>

                <Text style={styles.indexText}>{currentIndex + 1} / {match.moves.length}</Text>

                <TouchableOpacity
                    onPress={() => setCurrentIndex(Math.min(match.moves.length - 1, currentIndex + 1))}
                    style={styles.controlBtn}
                >
                    <Ionicons name="chevron-forward" size={32} color={Colors.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView horizontal style={styles.moveTimeline}>
                {match.moves.map((move: string, idx: number) => (
                    <TouchableOpacity
                        key={idx}
                        onPress={() => setCurrentIndex(idx)}
                        style={[styles.timelineMove, currentIndex === idx && styles.activeMove]}
                    >
                        <Text style={[styles.timelineText, currentIndex === idx && styles.activeText]}>
                            {idx + 1}. {move}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles: any = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundPrimary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
    },
    backBtn: { marginRight: Spacing.md },
    title: { ...Typography.h2, fontSize: 18 },
    boardContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: Colors.surface,
    },
    analysisSection: {
        padding: Spacing.lg,
        alignItems: 'center',
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    brilliant: { backgroundColor: '#1baca6' },
    best: { backgroundColor: '#81b64c' },
    inaccuracy: { backgroundColor: '#f0c15c' },
    mistake: { backgroundColor: '#e6912c' },
    blunder: { backgroundColor: '#ca3431' },
    moveText: {
        ...Typography.h2,
        color: Colors.textPrimary,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    controlBtn: {
        padding: Spacing.md,
    },
    indexText: {
        ...Typography.body,
        marginHorizontal: Spacing.xl,
        fontSize: 18,
    },
    moveTimeline: {
        maxHeight: 60,
        backgroundColor: Colors.backgroundSecondary,
    },
    timelineMove: {
        padding: Spacing.md,
        justifyContent: 'center',
    },
    activeMove: {
        backgroundColor: Colors.surface,
    },
    timelineText: {
        color: Colors.textMuted,
        fontWeight: 'bold',
    },
    activeText: {
        color: Colors.textPrimary,
    },
});
