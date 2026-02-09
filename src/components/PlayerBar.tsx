import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/Theme';

interface PlayerBarProps {
    name: string;
    rating?: number;
    avatarUrl?: string;
    capturedPieces: string[];
    isOpponent?: boolean;
    isActive?: boolean;
}

const PIECE_SYMBOLS: Record<string, string> = {
    p: '♟',
    n: '♞',
    b: '♝',
    r: '♜',
    q: '♛',
    k: '♚',
};

export const PlayerBar: React.FC<PlayerBarProps> = ({
    name,
    rating = 800,
    avatarUrl,
    capturedPieces,
    isOpponent,
    isActive
}) => {
    // Logic to calculate material advantage could go here

    return (
        <View style={[styles.container, isActive && styles.activeContainer]}>
            <View style={styles.userInfo}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{name.charAt(0)}</Text>
                </View>
                <View style={styles.details}>
                    <View style={styles.nameRow}>
                        <Text style={styles.nameText}>{name}</Text>
                        <Text style={styles.ratingText}>({rating})</Text>
                    </View>
                    <View style={styles.capturesRow}>
                        {capturedPieces.map((piece, index) => (
                            <Text key={index} style={styles.capturedPiece}>
                                {PIECE_SYMBOLS[piece] || piece}
                            </Text>
                        ))}
                    </View>
                </View>
            </View>
            {/* Clock could be added here later */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        width: '100%',
        backgroundColor: 'transparent',
    },
    activeContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 4,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.sm,
    },
    avatarText: {
        color: Colors.textSecondary,
        fontWeight: 'bold',
    },
    details: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameText: {
        ...Typography.body,
        fontWeight: '600',
        fontSize: 14,
        color: Colors.textPrimary,
    },
    ratingText: {
        ...Typography.label,
        fontSize: 12,
        marginLeft: 4,
        color: Colors.textMuted,
    },
    capturesRow: {
        flexDirection: 'row',
        marginTop: 2,
    },
    capturedPiece: {
        fontSize: 12,
        color: Colors.textMuted,
        marginRight: 1,
    },
});
