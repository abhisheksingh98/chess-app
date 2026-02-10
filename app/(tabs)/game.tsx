import { Chess } from 'chess.js';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ChessBoard } from '../../src/components/ChessBoard';
import { EvalBar } from '../../src/components/EvalBar';
import { MoveList } from '../../src/components/MoveList';
import { PlayerBar } from '../../src/components/PlayerBar';
import { Colors, Spacing } from '../../src/constants/Theme';
import { useChess } from '../../src/context/ChessContext';
import AIEngine from '../../src/engine/AIEngine';

export default function GameScreen() {
    const router = useRouter();
    const {
        turn,
        game,
        makeMove,
        isCheckmate,
        isDraw,
        resetGame,
        isCheck,
        gameMode,
        difficulty,
        setDifficulty,
        capturedWhite,
        capturedBlack,
        moveHistory,
        evaluation,
        archiveMatch
    } = useChess();
    const [isAiMoving, setIsAiMoving] = useState(false);

    useEffect(() => {
        if (gameMode === 'ai' && turn === 'b' && !isCheckmate && !isDraw) {
            setIsAiMoving(true);
            const timer = setTimeout(() => {
                const gameCopy = new Chess();
                gameCopy.loadPgn(game.pgn());
                const bestMove = AIEngine.getBestMove(gameCopy, difficulty);
                if (bestMove) {
                    const moveResult = gameCopy.move(bestMove);
                    if (moveResult) {
                        makeMove(moveResult.from, moveResult.to);
                    }
                }
                setIsAiMoving(false);
            }, 600);
            return () => clearTimeout(timer);
        }

        if (isCheckmate) {
            archiveMatch();
            // FeedbackService.vibrateSuccess(); // Assuming haptics in FeedbackService
            Alert.alert('🏆 Checkmate!', `${turn === 'w' ? 'Black' : 'White'} wins!`, [
                { text: 'New Game', onPress: resetGame },
                { text: 'Review Match', onPress: () => router.push('/library') }
            ]);
        } else if (isDraw) {
            archiveMatch();
            Alert.alert('🤝 Draw', 'The game ended in a draw.', [
                { text: 'New Game', onPress: resetGame }
            ]);
        }
    }, [turn, isCheckmate, isDraw, gameMode, difficulty]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Top Bar: Opponent Info */}
            <PlayerBar
                name={gameMode === 'ai' ? `Computer (${difficulty.toUpperCase()})` : "Player 2"}
                rating={gameMode === 'ai' ? (difficulty === 'hard' ? 2200 : difficulty === 'medium' ? 1200 : 600) : 800}
                capturedPieces={capturedWhite} // Pieces taken BY opponent (white's pieces)
                isActive={turn === 'b'}
                isOpponent
            />

            <MoveList moves={moveHistory} />

            {/* Middle: The Board */}
            <View style={styles.boardWrapper}>
                <View style={styles.boardRow}>
                    <EvalBar evaluation={evaluation} />
                    <View style={styles.boardContainer}>
                        <ChessBoard />
                    </View>
                </View>
                {isCheck && (
                    <View style={styles.checkBadge}>
                        <Text style={styles.checkText}>CHECK</Text>
                    </View>
                )}
            </View>

            {/* Bottom Bar: Player Info */}
            <PlayerBar
                name="You"
                rating={800}
                capturedPieces={capturedBlack} // Pieces taken BY player (black's pieces)
                isActive={turn === 'w'}
            />

            {/* Controls Footer */}
            <View style={styles.footer}>
                <View style={styles.controlsRow}>
                    {gameMode === 'ai' && ((['easy', 'medium', 'hard'] as const).map((level) => (
                        <TouchableOpacity
                            key={level}
                            style={[styles.miniBtn, difficulty === level && styles.miniBtnActive]}
                            onPress={() => setDifficulty(level)}
                        >
                            <Text style={[styles.miniBtnText, difficulty === level && styles.miniBtnTextActive]}>
                                {level.charAt(0).toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    )))}
                </View>

                <TouchableOpacity style={styles.actionBtn} onPress={resetGame}>
                    <Text style={styles.actionBtnText}>NEW GAME</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundPrimary,
    },
    boardWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
    },
    boardContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    checkBadge: {
        position: 'absolute',
        top: 20,
        backgroundColor: Colors.danger,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 4,
    },
    checkText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    footer: {
        padding: Spacing.md,
        backgroundColor: Colors.backgroundSecondary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    controlsRow: {
        flexDirection: 'row',
    },
    miniBtn: {
        width: 36,
        height: 36,
        borderRadius: 4,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    miniBtnActive: {
        backgroundColor: Colors.buttonPrimary,
        borderColor: Colors.buttonPrimary,
    },
    miniBtnText: {
        color: Colors.textSecondary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    miniBtnTextActive: {
        color: '#FFF',
    },
    actionBtn: {
        backgroundColor: Colors.buttonPrimary,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 4,
    },
    actionBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
