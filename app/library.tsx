import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing, Typography } from '../src/constants/Theme';
import { MatchRecord, StorageService } from '../src/services/StorageService';

export default function LibraryScreen() {
    const [library, setLibrary] = useState<MatchRecord[]>([]);
    const router = useRouter();

    useEffect(() => {
        loadLibrary();
    }, []);

    const loadLibrary = async () => {
        const games = await StorageService.getLibrary();
        setLibrary(games);
    };

    const renderItem = ({ item }: { item: MatchRecord }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/review/${item.id}` as any)}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.opponentText}>vs {item.opponent}</Text>
                <Text style={[
                    styles.resultText,
                    { color: item.result === '1-0' ? Colors.buttonPrimary : item.result === '0-1' ? Colors.danger : Colors.textMuted }
                ]}>
                    {item.result}
                </Text>
            </View>
            <View style={styles.cardFooter}>
                <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
                <Text style={styles.moveCountText}>{item.moveCount} moves</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Game Library</Text>
            </View>

            <FlatList
                data={library}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No games saved yet.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundPrimary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        backgroundColor: Colors.backgroundSecondary,
    },
    backBtn: {
        marginRight: Spacing.md,
    },
    title: {
        ...Typography.h2,
        fontSize: 20,
    },
    listContent: {
        padding: Spacing.md,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 8,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderLeftWidth: 4,
        borderLeftColor: Colors.buttonPrimary,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    opponentText: {
        ...Typography.body,
        fontWeight: 'bold',
        fontSize: 16,
    },
    resultText: {
        fontWeight: '900',
        fontSize: 18,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateText: {
        ...Typography.label,
        color: Colors.textMuted,
        fontSize: 12,
    },
    moveCountText: {
        ...Typography.label,
        color: Colors.textMuted,
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.textMuted,
    },
});
