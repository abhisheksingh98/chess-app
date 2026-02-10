import { Chess } from 'chess.js';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Theme';
import { ChessPiece } from './ChessPiece';

const { width } = Dimensions.get('window');
const SQUARE_SIZE = width / 8;

interface BoardDisplayProps {
    fen: string;
}

export const ChessBoardDisplay: React.FC<BoardDisplayProps> = ({ fen }) => {
    const game = new Chess(fen);
    const board = game.board();

    return (
        <View style={styles.board}>
            {board.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((square, colIndex) => {
                        const isDark = (rowIndex + colIndex) % 2 === 1;
                        return (
                            <View
                                key={colIndex}
                                style={[
                                    styles.square,
                                    { backgroundColor: isDark ? Colors.darkSquare : Colors.lightSquare }
                                ]}
                            >
                                {square && (
                                    <ChessPiece
                                        type={square.type}
                                        color={square.color}
                                        size={SQUARE_SIZE * 0.8}
                                    />
                                )}
                            </View>
                        );
                    })}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    board: {
        width: width,
        height: width,
    },
    row: {
        flexDirection: 'row',
    },
    square: {
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
