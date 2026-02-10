import React, { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '../constants/Theme';

interface MoveListProps {
    moves: string[];
}

export const MoveList: React.FC<MoveListProps> = ({ moves }) => {
    const scrollViewRef = useRef<ScrollView>(null);

    // Group moves into pairs: [1. e4 e5, 2. Nf3 Nc6, ...]
    const movePairs: string[][] = [];
    for (let i = 0; i < moves.length; i += 2) {
        movePairs.push(moves.slice(i, i + 2));
    }

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                contentContainerStyle={styles.scrollContent}
            >
                {movePairs.map((pair, index) => (
                    <View key={index} style={styles.movePair}>
                        <Text style={styles.moveNumber}>{index + 1}.</Text>
                        <View style={styles.moveTextContainer}>
                            <Text style={styles.moveText}>{pair[0]}</Text>
                            {pair[1] && <Text style={[styles.moveText, styles.blackMove]}>{pair[1]}</Text>}
                        </View>
                    </View>
                ))}
                {moves.length === 0 && (
                    <Text style={styles.emptyText}>No moves yet</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 40,
        backgroundColor: Colors.backgroundSecondary,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    scrollContent: {
        paddingHorizontal: Spacing.md,
        alignItems: 'center',
    },
    movePair: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    moveNumber: {
        color: Colors.textMuted,
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 6,
        width: 18,
    },
    moveTextContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    moveText: {
        color: Colors.textPrimary,
        fontSize: 13,
        fontWeight: '600',
        minWidth: 35,
    },
    blackMove: {
        marginLeft: 8,
        paddingLeft: 8,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255,255,255,0.1)',
    },
    emptyText: {
        color: Colors.textMuted,
        fontSize: 12,
        fontStyle: 'italic',
    },
});
