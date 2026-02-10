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

const PST: Record<string, number[][]> = {
    p: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5, 5, 10, 25, 25, 10, 5, 5],
        [0, 0, 0, 20, 20, 0, 0, 0],
        [5, -5, -10, 0, 0, -10, -5, 5],
        [5, 10, 10, -20, -20, 10, 10, 5],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    n: [
        [-50, -40, -30, -30, -30, -30, -40, -50],
        [-40, -20, 0, 0, 0, 0, -20, -40],
        [-30, 0, 10, 15, 15, 10, 0, -30],
        [-30, 5, 15, 20, 20, 15, 5, -30],
        [-30, 0, 15, 20, 20, 15, 0, -30],
        [-30, 5, 10, 15, 15, 10, 5, -30],
        [-40, -20, 0, 5, 5, 0, -20, -40],
        [-50, -40, -30, -30, -30, -30, -40, -50]
    ],
    b: [
        [-20, -10, -10, -10, -10, -10, -10, -20],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-10, 0, 5, 10, 10, 5, 0, -10],
        [-10, 5, 5, 10, 10, 5, 5, -10],
        [-10, 0, 10, 10, 10, 10, 0, -10],
        [-10, 10, 10, 10, 10, 10, 10, -10],
        [-10, 5, 0, 0, 0, 0, 5, -10],
        [-20, -10, -10, -10, -10, -10, -10, -20]
    ],
    r: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [5, 10, 10, 10, 10, 10, 10, 5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [0, 0, 0, 5, 5, 0, 0, 0]
    ],
    q: [
        [-20, -10, -10, -5, -5, -10, -10, -20],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-10, 0, 5, 5, 5, 5, 0, -10],
        [-5, 0, 5, 5, 5, 5, 0, -5],
        [0, 0, 5, 5, 5, 5, 0, -5],
        [-10, 5, 5, 5, 5, 5, 0, -10],
        [-10, 0, 5, 0, 0, 0, 0, -10],
        [-20, -10, -10, -5, -5, -10, -10, -20]
    ],
    k: [
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-20, -30, -30, -40, -40, -30, -30, -20],
        [-10, -20, -20, -20, -20, -20, -20, -10],
        [20, 20, 0, 0, 0, 0, 20, 20],
        [20, 30, 10, 0, 0, 10, 30, 20]
    ]
};

class AIEngine {
    /**
     * Absolute evaluation. Positive favor White, Negative favor Black.
     */
    evaluateBoard(board: any[][]) {
        let totalEvaluation = 0;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece) {
                    const absVal = PIECE_VALUES[piece.type] || 0;
                    const pstTable = PST[piece.type];
                    const pstVal = pstTable ? (piece.color === 'w' ? pstTable[i][j] : pstTable[7 - i][j]) : 0;

                    const score = absVal + pstVal;
                    totalEvaluation += (piece.color === 'w' ? score : -score);
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
        if (depth === 0) return this.evaluateBoard(game.board());

        const moves = game.moves();
        if (moves.length === 0) {
            if (game.isCheck()) return isMaximizing ? -100000 : 100000;
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
    getBestMove(game: any, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
        const moves = game.moves();
        if (moves.length === 0) return null;

        let bestMove = null;
        let bestValue = 100000; // Black wants MINIMUM

        let depth = 2;
        if (difficulty === 'easy') depth = 1;
        if (difficulty === 'hard') depth = 3;

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
