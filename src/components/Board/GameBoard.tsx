import React from 'react';
import type { GameBoard, CellType } from '../../types';

interface GameBoardProps {
  board: GameBoard;
  className?: string;
}

/**
 * Tetrisのゲームボード（グリッド）
 * - 盤面データを受け取り、セルを描画
 * - レスポンシブ&ネオンUI
 */
const GameBoard: React.FC<GameBoardProps> = ({ board, className = '' }) => {
  return (
    <div
      className={`grid aspect-[10/20] w-full max-w-[min(90vw,400px)] bg-black/60 rounded-lg shadow-lg border-2 border-white/10 overflow-hidden ${className}`}
      style={{
        gridTemplateColumns: `repeat(${board[0]?.length || 10}, 1fr)`,
        gridTemplateRows: `repeat(${board.length}, 1fr)`
      }}
    >
      {board.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`tetris-cell ${cell !== 'empty' ? 'filled neon-border' : ''} transition-all duration-75`}
            data-x={x}
            data-y={y}
          />
        ))
      )}
    </div>
  );
};

export default GameBoard; 