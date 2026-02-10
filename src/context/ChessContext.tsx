import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chess, Move } from 'chess.js';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import AIEngine from '../engine/AIEngine';
import FeedbackService from '../services/FeedbackService';
import { StorageService } from '../services/StorageService';

interface ChessContextType {
    game: Chess;
    fen: string;
    board: any[][];
    turn: 'w' | 'b';
    gameMode: 'ai' | 'local';
    setGameMode: (mode: 'ai' | 'local') => void;
    difficulty: 'easy' | 'medium' | 'hard';
    setDifficulty: (level: 'easy' | 'medium' | 'hard') => void;
    capturedWhite: string[];
    capturedBlack: string[];
    moveHistory: string[];
    makeMove: (from: string, to: string) => Move | null;
    resetGame: () => void;
    loadSavedGame: () => Promise<boolean>;
    analyzeMove: (move: Move) => string;
    archiveMatch: () => Promise<void>;
    isCheck: boolean;
    isCheckmate: boolean;
    isDraw: boolean;
    evaluation: number;
}

const ChessContext = createContext<ChessContextType | undefined>(undefined);

export const ChessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // We use a state to trigger re-renders, but the Chess instance is the source of truth
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState(game.fen());
    const [board, setBoard] = useState(game.board());
    const [turn, setTurn] = useState(game.turn());
    const [gameMode, setGameMode] = useState<'ai' | 'local'>('ai');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
    const [capturedBlack, setCapturedBlack] = useState<string[]>([]);
    const [moveHistory, setMoveHistory] = useState<string[]>([]);
    const [evaluation, setEvaluation] = useState<number>(0);

    // Persist game state
    React.useEffect(() => {
        const saveGame = async () => {
            try {
                const state = JSON.stringify({
                    pgn: game.pgn(),
                    gameMode,
                    difficulty,
                });
                await AsyncStorage.setItem('chess_saved_game', state);
            } catch (e) {
                console.error('Failed to save game', e);
            }
        };
        saveGame();
    }, [fen, gameMode, difficulty]);

    const updateState = useCallback((newGame: Chess) => {
        // We only set the game instance if it's truly a new session/load
        // For move updates, we update individual states
        setFen(newGame.fen());
        setBoard(newGame.board());
        setTurn(newGame.turn());
        setMoveHistory(newGame.history());

        const evalScore = AIEngine.evaluateBoard(newGame.board());
        setEvaluation(evalScore / 100);
    }, []);

    const makeMove = useCallback((from: string, to: string) => {
        try {
            // Important: we move on the CURRENT game instance
            const move = game.move({ from, to, promotion: 'q' });
            if (move) {
                if (move.captured) {
                    const capturedPiece = move.captured;
                    if (move.color === 'w') {
                        setCapturedBlack(prev => [...prev, capturedPiece]);
                    } else {
                        setCapturedWhite(prev => [...prev, capturedPiece]);
                    }
                }

                // Create a NEW instance from PGN to follow immutable patterns
                // and ensure all context consumers see the update.
                const nextGame = new Chess();
                nextGame.loadPgn(game.pgn());

                setGame(nextGame);
                updateState(nextGame);

                FeedbackService.triggerMoveFeedback(!!move.captured);
                return move;
            }
        } catch (e) {
            console.log('Invalid Move Attempted', e);
        }
        return null;
    }, [game, updateState]);

    const resetGame = useCallback(() => {
        const newGame = new Chess();
        setGame(newGame); // Update the primary instance
        setCapturedWhite([]);
        setCapturedBlack([]);
        setMoveHistory([]);
        updateState(newGame);
    }, [updateState]);

    const loadSavedGame = useCallback(async () => {
        try {
            const saved = await AsyncStorage.getItem('chess_saved_game');
            if (saved) {
                const { pgn: savedPgn, gameMode: savedMode, difficulty: savedDiff } = JSON.parse(saved);

                const newGame = new Chess();
                if (savedPgn) {
                    newGame.loadPgn(savedPgn);
                }

                setGame(newGame);
                setGameMode(savedMode);
                setDifficulty(savedDiff);
                setMoveHistory(newGame.history());
                updateState(newGame);
                return true;
            }
        } catch (e) {
            console.error('Failed to load game', e);
        }
        return false;
    }, [updateState]);

    const analyzeMove = useCallback((move: Move) => {
        // Simple analysis: diff between board eval before and after
        const fenBefore = move.before;
        const fenAfter = move.after;

        const gameBefore = new Chess(fenBefore);
        const gameAfter = new Chess(fenAfter);

        const scoreBefore = AIEngine.evaluateBoard(gameBefore.board());
        const scoreAfter = AIEngine.evaluateBoard(gameAfter.board());

        // Perspective adjustment: if white moved, a drop in score is bad
        const diff = move.color === 'w' ? (scoreAfter - scoreBefore) : (scoreBefore - scoreAfter);

        if (diff < -300) return 'blunder';
        if (diff < -100) return 'mistake';
        if (diff < -50) return 'inaccuracy';
        if (diff > 200) return 'brilliant';
        return 'best';
    }, []);

    const archiveMatch = useCallback(async () => {
        if (moveHistory.length === 0) return;

        const result = game.isCheckmate()
            ? (game.turn() === 'w' ? '0-1' : '1-0')
            : (game.isDraw() ? '1/2-1/2' : '*');

        await StorageService.archiveMatch({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            moves: moveHistory,
            result: result as any,
            opponent: gameMode === 'ai' ? `Computer (${difficulty})` : 'Player 2',
            moveCount: moveHistory.length
        });
    }, [game, moveHistory, gameMode, difficulty]);

    const value = {
        game,
        fen,
        board,
        turn,
        gameMode,
        setGameMode,
        difficulty,
        setDifficulty,
        capturedWhite,
        capturedBlack,
        moveHistory,
        makeMove,
        resetGame,
        loadSavedGame,
        analyzeMove,
        archiveMatch,
        isCheck: game.isCheck(),
        isCheckmate: game.isCheckmate(),
        isDraw: game.isDraw(),
        evaluation,
    };

    return <ChessContext.Provider value={value}>{children}</ChessContext.Provider>;
};

export const useChess = () => {
    const context = useContext(ChessContext);
    if (!context) {
        throw new Error('useChess must be used within a ChessProvider');
    }
    return context;
};
