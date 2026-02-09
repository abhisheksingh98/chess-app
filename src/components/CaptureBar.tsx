import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spacing } from '../constants/Theme';

interface CaptureBarProps {
    pieces: string[];
    color: 'w' | 'b';
}

const PIECE_SYMBOLS: Record<string, string> = {
    p: '♟',
    n: '♞',
    b: '♝',
    r: '♜',
    q: '♛',
    k: '♚',
};

export const CaptureBar: React.FC<CaptureBarProps> = ({ pieces, color }) => {
    if (pieces.length === 0) return <View style={styles.emptyContainer} />;

    return (
        <View style={styles.container}>
            {pieces.map((piece, index) => (
                <View
                    key={`${piece}-${index}`}
                    style={[
                        styles.pieceWrapper,
                        { marginLeft: index === 0 ? 0 : -8 }
                    ]}
                >
                    <Text style={[
                        styles.pieceText,
                        { color: color === 'w' ? '#FFF' : '#333' }
                    ]}>
                        {PIECE_SYMBOLS[piece] || piece}
                    </Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        paddingHorizontal: Spacing.xl,
    },
    emptyContainer: {
        height: 30,
    },
    pieceWrapper: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.1)',
    },
    pieceText: {
        fontSize: 16,
        lineHeight: 18,
    },
});
