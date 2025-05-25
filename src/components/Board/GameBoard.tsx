import React from 'react';
import Cell from './Cell';
import type { GameBoard, CellType, TetrominoType, Tetromino } from '../../types';
import { getTetrominoPattern } from '../../constants/tetrominos';

interface GameBoardProps {
  board: GameBoard;
  currentPiece?: Tetromino | null;
  ghostPiece?: Tetromino | null;
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

// 指定ピースのブロック座標リストを返す
function getPieceBlocks(piece: Tetromino) {
  const pattern = getTetrominoPattern(piece.type, piece.rotation);
  const blocks: { x: number; y: number }[] = [];
  for (let y = 0; y < pattern.length; y++) {
    for (let x = 0; x < pattern[y].length; x++) {
      if (pattern[y][x]) {
        blocks.push({ x: piece.position.x + x, y: piece.position.y + y });
      }
    }
  }
  return blocks;
}

/**
 * Tetrisのゲームボード（グリッド）
 * - 盤面データを受け取り、セルを描画
 * - レスポンシブ&ネオンUI
 */
const GameBoard: React.FC<GameBoardProps> = ({ board, currentPiece, ghostPiece, className = '' }) => {
  // ゴーストピース座標セット
  const ghostBlocks = ghostPiece ? getPieceBlocks(ghostPiece) : [];
  // アクティブピース座標セット
  const activeBlocks = currentPiece ? getPieceBlocks(currentPiece) : [];

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
          // ゴーストピース優先
          if (ghostBlocks.some(b => b.x === x && b.y === y)) {
            return (
              <Cell key={`${y}-${x}`} type="ghost" x={x} y={y} tetrominoType={currentPiece?.type} />
            );
          }
          // アクティブピース優先
          if (activeBlocks.some(b => b.x === x && b.y === y)) {
            return (
              <Cell key={`${y}-${x}`} type="active" x={x} y={y} tetrominoType={currentPiece?.type} />
            );
          }
          // 通常ボード
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