import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MatchRecord {
    id: string;
    date: string;
    moves: string[];
    result: '1-0' | '0-1' | '1/2-1/2' | '*';
    opponent: string;
    moveCount: number;
}

const LIBRARY_KEY = 'chess_game_library';

export const StorageService = {
    async archiveMatch(record: MatchRecord): Promise<void> {
        try {
            const existing = await AsyncStorage.getItem(LIBRARY_KEY);
            const library: MatchRecord[] = existing ? JSON.parse(existing) : [];
            library.unshift(record); // Add to beginning
            await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
        } catch (e) {
            console.error('Failed to archive match', e);
        }
    },

    async getLibrary(): Promise<MatchRecord[]> {
        try {
            const existing = await AsyncStorage.getItem(LIBRARY_KEY);
            return existing ? JSON.parse(existing) : [];
        } catch (e) {
            console.error('Failed to get library', e);
            return [];
        }
    },

    async deleteMatch(id: string): Promise<void> {
        try {
            const existing = await AsyncStorage.getItem(LIBRARY_KEY);
            if (existing) {
                const library: MatchRecord[] = JSON.parse(existing);
                const filtered = library.filter(m => m.id !== id);
                await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(filtered));
            }
        } catch (e) {
            console.error('Failed to delete match', e);
        }
    }
};
