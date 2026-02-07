import { Chess, Move } from 'chess.js';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import FeedbackService from '../services/FeedbackService';

interface ChessContextType {
    game: Chess;
    fen: string;
    board: any[][];
    turn: 'w' | 'b';
    makeMove: (from: string, to: string) => Move | null;
    resetGame: () => void;
    isCheck: boolean;
    isCheckmate: boolean;
    isDraw: boolean;
}

const ChessContext = createContext<ChessContextType | undefined>(undefined);

export const ChessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // We use a state to trigger re-renders, but the Chess instance is the source of truth
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState(game.fen());
    const [board, setBoard] = useState(game.board());
    const [turn, setTurn] = useState(game.turn());

    const updateState = useCallback((newGame: Chess) => {
        setGame(newGame);
        setFen(newGame.fen());
        setBoard(newGame.board());
        setTurn(newGame.turn());
    }, []);

    const makeMove = useCallback((from: string, to: string) => {
        try {
            // Important: we move on the CURRENT game instance
            const move = game.move({ from, to, promotion: 'q' });
            if (move) {
                // Then we create a NEW instance from the updated state to force React update
                const nextGame = new Chess(game.fen());
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
        updateState(newGame);
    }, [updateState]);

    const value = {
        game,
        fen,
        board,
        turn,
        makeMove,
        resetGame,
        isCheck: game.inCheck(),
        isCheckmate: game.isCheckmate(),
        isDraw: game.isDraw(),
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
