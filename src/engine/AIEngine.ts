/**
 * Chess AI Evaluation Engine (Simplified)
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
    evaluateBoard(game: any) {
        let totalEvaluation = 0;
        const board = game.board();

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece) {
                    totalEvaluation += (piece.color === 'w' ? PIECE_VALUES[piece.type] : -PIECE_VALUES[piece.type]);
                }
            }
        }
        return totalEvaluation;
    }

    minimax(game: any, depth: number, alpha: number, beta: number, isMaximizingPlayer: boolean): number {
        if (depth === 0) return -this.evaluateBoard(game);

        const possibleMoves = game.moves();
        if (possibleMoves.length === 0) {
            if (game.inCheck()) return isMaximizingPlayer ? -99999 : 99999;
            return 0;
        }

        if (isMaximizingPlayer) {
            let bestMoveValue = -99999;
            for (const move of possibleMoves) {
                game.move(move);
                bestMoveValue = Math.max(bestMoveValue, this.minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
                game.undo();
                alpha = Math.max(alpha, bestMoveValue);
                if (beta <= alpha) break;
            }
            return bestMoveValue;
        } else {
            let bestMoveValue = 99999;
            for (const move of possibleMoves) {
                game.move(move);
                bestMoveValue = Math.min(bestMoveValue, this.minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
                game.undo();
                beta = Math.min(beta, bestMoveValue);
                if (beta <= alpha) break;
            }
            return bestMoveValue;
        }
    }

    getBestMove(game: any) {
        const possibleMoves = game.moves();
        if (possibleMoves.length === 0) return null;

        let bestMove = null;
        let bestValue = -100000;
        const depth = 2; // Fixed shallow depth for basic edition

        for (const move of possibleMoves) {
            game.move(move);
            const boardValue = this.minimax(game, depth - 1, -100100, 100100, false);
            game.undo();

            if (boardValue > bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        }

        return bestMove;
    }
}

export default new AIEngine();
