/**
 * Chess AI Evaluation Engine (Simplified & Corrected)
 */

const PIECE_VALUES: Record<string, number> = {
    p: 100,
    n: 320,
    b: 330,
    r: 500,
    q: 900,
    k: 20000,
};

class AIEngine {
    /**
     * Absolute evaluation. Positive favor White, Negative favor Black.
     */
    evaluateBoard(game: any) {
        let totalEvaluation = 0;
        const board = game.board();

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece) {
                    const val = PIECE_VALUES[piece.type] || 0;
                    totalEvaluation += (piece.color === 'w' ? val : -val);
                }
            }
        }
        return totalEvaluation;
    }

    /**
     * Standard Minimax with Alpha-Beta Pruning.
     * White is Maximizer, Black is Minimizer.
     */
    minimax(game: any, depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
        if (depth === 0) return this.evaluateBoard(game);

        const moves = game.moves();
        if (moves.length === 0) {
            if (game.inCheck()) return isMaximizing ? -100000 : 100000;
            return 0;
        }

        if (isMaximizing) {
            let bestVal = -100000;
            for (const move of moves) {
                game.move(move);
                bestVal = Math.max(bestVal, this.minimax(game, depth - 1, alpha, beta, false));
                game.undo();
                alpha = Math.max(alpha, bestVal);
                if (beta <= alpha) break;
            }
            return bestVal;
        } else {
            let bestVal = 100000;
            for (const move of moves) {
                game.move(move);
                bestVal = Math.min(bestVal, this.minimax(game, depth - 1, alpha, beta, true));
                game.undo();
                beta = Math.min(beta, bestVal);
                if (beta <= alpha) break;
            }
            return bestVal;
        }
    }

    /**
     * AI is assume to be Black. It will try to MINIMIZE the score.
     */
    getBestMove(game: any) {
        const moves = game.moves();
        if (moves.length === 0) return null;

        let bestMove = null;
        let bestValue = 100000; // Black wants MINIMUM
        const depth = 2;

        // Shuffle moves to add variety
        moves.sort(() => Math.random() - 0.5);

        for (const move of moves) {
            game.move(move);
            // After Black moves, it's White's turn (Maximizer)
            const boardValue = this.minimax(game, depth - 1, -100100, 100100, true);
            game.undo();

            if (boardValue < bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        }

        return bestMove;
    }
}

export default new AIEngine();
