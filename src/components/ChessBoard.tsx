import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Theme';
import { useChess } from '../context/ChessContext';
import { ChessPiece } from './ChessPiece';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width;
const SQUARE_SIZE = BOARD_SIZE / 8;
const COORDINATE_COLOR_LIGHT = '#769656';
const COORDINATE_COLOR_DARK = '#eeeed2';

export const ChessBoard: React.FC = () => {
    const { board, turn, makeMove, game } = useChess();
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [legalMoves, setLegalMoves] = useState<string[]>([]);

    const handlePress = (row: number, col: number) => {
        const squareCode = String.fromCharCode(97 + col) + (8 - row);

        // Attempting a move
        if (selectedSquare && legalMoves.includes(squareCode)) {
            makeMove(selectedSquare, squareCode);
            setSelectedSquare(null);
            setLegalMoves([]);
            return;
        }

        // Selecting a piece
        const piece = board[row][col];
        if (piece && piece.color === turn) {
            if (selectedSquare === squareCode) {
                setSelectedSquare(null);
                setLegalMoves([]);
            } else {
                setSelectedSquare(squareCode);
                const moves = game.moves({ square: squareCode as any, verbose: true });
                setLegalMoves(moves.map(m => m.to));
            }
        } else {
            setSelectedSquare(null);
            setLegalMoves([]);
        }
    };

    const renderSquare = (row: number, col: number) => {
        const isDark = (row + col) % 2 === 1;
        const squareCode = String.fromCharCode(97 + col) + (8 - row);
        const piece = board[row][col];
        const isSelected = selectedSquare === squareCode;
        const isLegalMove = legalMoves.includes(squareCode);

        return (
            <TouchableOpacity
                key={squareCode}
                activeOpacity={0.8}
                onPress={() => handlePress(row, col)}
                style={[
                    styles.square,
                    { backgroundColor: isDark ? Colors.darkSquare : Colors.lightSquare },
                    isSelected && styles.selectedHighlight
                ]}
            >
                {isLegalMove && <View style={styles.moveDot} />}

                {piece && (
                    <ChessPiece
                        type={piece.type}
                        color={piece.color}
                        size={SQUARE_SIZE * 0.85}
                    />
                )}

                {col === 0 && (
                    <Text style={[
                        styles.coord,
                        styles.rank,
                        { color: isDark ? COORDINATE_COLOR_DARK : COORDINATE_COLOR_LIGHT }
                    ]}>
                        {8 - row}
                    </Text>
                )}
                {row === 7 && (
                    <Text style={[
                        styles.coord,
                        styles.file,
                        { color: isDark ? COORDINATE_COLOR_DARK : COORDINATE_COLOR_LIGHT }
                    ]}>
                        {String.fromCharCode(97 + col)}
                    </Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.board}>
            {Array.from({ length: 8 }).map((_, r) => (
                <View key={r} style={styles.row}>
                    {Array.from({ length: 8 }).map((_, c) => renderSquare(r, c))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    board: {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
    },
    row: { flexDirection: 'row' },
    square: {
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedHighlight: {
        backgroundColor: Colors.highlight,
    },
    moveDot: {
        width: SQUARE_SIZE * 0.3,
        height: SQUARE_SIZE * 0.3,
        borderRadius: (SQUARE_SIZE * 0.3) / 2,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    coord: {
        fontSize: 10,
        fontWeight: 'bold',
        position: 'absolute',
    },
    rank: { top: 2, left: 2 },
    file: { bottom: 2, right: 2 },
});
