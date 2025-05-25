import React from 'react';
import Cell from './Cell';
import type { GameBoard, CellType, TetrominoType } from '../../types';

interface GameBoardProps {
  board: GameBoard;
  className?: string;
}

/**
 * CellTypeに対応するテトロミノ色クラスを返す
 */
const getCellColorClass = (cell: CellType, tetrominoType?: TetrominoType) => {
  if (cell === 'empty') return '';
  if (cell === 'ghost') return 'bg-white/10';
  if (tetrominoType) return `bg-tetris-${tetrominoType}`;
  // 仮: filled/activeはデフォルト色
  return 'bg-white/40';
};

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
        row.map((cell, x) => {
          let cellType: CellType = cell;
          let tetrominoType: TetrominoType | undefined = undefined;
          if (typeof cell === 'string' && ['I','O','T','S','Z','J','L'].includes(cell)) {
            tetrominoType = cell as TetrominoType;
            cellType = 'filled';
          }
          return (
            <Cell
              key={`${y}-${x}`}
              type={cellType}
              tetrominoType={tetrominoType}
              x={x}
              y={y}
            />
          );
        })
      )}
    </div>
  );
};

export default GameBoard; 