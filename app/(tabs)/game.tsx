import { Chess } from 'chess.js';
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
import { Colors, Spacing, Typography } from '../../src/constants/Theme';
import { useChess } from '../../src/context/ChessContext';
import AIEngine from '../../src/engine/AIEngine';

export default function GameScreen() {
    const {
        turn,
        game,
        makeMove,
        isCheckmate,
        isDraw,
        resetGame,
        isCheck
    } = useChess();
    const [isAiMoving, setIsAiMoving] = useState(false);

    useEffect(() => {
        if (turn === 'b' && !isCheckmate && !isDraw) {
            setIsAiMoving(true);

            // Give a slight delay for realism
            const timer = setTimeout(() => {
                // Use a clone for AI calculation to avoid mutating state directly
                const gameCopy = new Chess(game.fen());
                const bestMove = AIEngine.getBestMove(gameCopy);

                if (bestMove) {
                    // Apply move to our copy to extract from/to coordinates
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
            Alert.alert('Game Over', `Checkmate! ${turn === 'w' ? 'Black' : 'White'} wins!`, [
                { text: 'New Game', onPress: resetGame }
            ]);
        } else if (isDraw) {
            Alert.alert('Game Over', 'It is a draw!', [
                { text: 'New Game', onPress: resetGame }
            ]);
        }
    }, [turn, isCheckmate, isDraw]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.status}>
                    {isAiMoving ? 'AI is thinking...' : `${turn === 'w' ? "White's" : "Black's"} Turn`}
                </Text>
                {isCheck && <Text style={styles.checkAlert}>CHECK!</Text>}
            </View>

            <View style={styles.boardContainer}>
                <ChessBoard />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.resetBtn} onPress={resetGame}>
                    <Text style={styles.resetBtnText}>RESET GAME</Text>
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
    header: {
        paddingVertical: Spacing.xl,
        alignItems: 'center',
    },
    status: {
        ...Typography.h2,
        color: Colors.textSecondary,
        letterSpacing: 2,
    },
    checkAlert: {
        ...Typography.label,
        color: Colors.danger,
        marginTop: Spacing.xs,
    },
    boardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        padding: Spacing.xl,
        alignItems: 'center',
    },
    resetBtn: {
        backgroundColor: Colors.buttonSecondary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.surface,
    },
    resetBtnText: {
        ...Typography.label,
        color: Colors.textPrimary,
    },
});
