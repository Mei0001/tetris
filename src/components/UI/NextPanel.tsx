import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import type { Tetromino, TetrominoType, TetrominoShape } from '../../types';

interface MiniCellProps {
  filled: boolean;
  type: TetrominoType | 'empty';
}

const getMiniCellColor = (type: TetrominoType | 'empty'): string => {
  switch (type) {
    case 'I': return 'bg-cyan-400';
    case 'O': return 'bg-yellow-400';
    case 'T': return 'bg-purple-400';
    case 'S': return 'bg-green-400';
    case 'Z': return 'bg-red-400';
    case 'J': return 'bg-blue-400';
    case 'L': return 'bg-orange-400';
    default: return 'bg-gray-700'; // empty or other cases
  }
};

const MiniCell: React.FC<MiniCellProps> = ({ filled, type }) => {
  const color = filled ? getMiniCellColor(type) : 'bg-gray-700';
  return <div className={`w-4 h-4 ${color} border-px border-gray-600`}></div>;
};

interface MiniTetrominoProps {
  tetromino: Tetromino | null; 
  rows?: number; // 表示領域の行数 (デフォルト4)
  cols?: number; // 表示領域の列数 (デフォルト4)
}

const MiniTetromino: React.FC<MiniTetrominoProps> = ({ tetromino, rows = 4, cols = 4 }) => {
  if (!tetromino) {
    return (
      <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: rows * cols }).map((_, i) => (
          <MiniCell key={i} filled={false} type='empty' />
        ))}
      </div>
    );
  }

  const { shape, type } = tetromino;
  // 形状を中心に配置するためのオフセット計算
  const shapeHeight = shape.length;
  const shapeWidth = shape[0]?.length || 0;
  const yOffset = Math.floor((rows - shapeHeight) / 2);
  const xOffset = Math.floor((cols - shapeWidth) / 2);

  const displayGrid: (TetrominoType | 'empty')[][] = Array.from({ length: rows }, () => Array(cols).fill('empty'));

  shape.forEach((rowArr, r) => {
    rowArr.forEach((cell, c) => {
      if (cell) {
        const displayR = yOffset + r;
        const displayC = xOffset + c;
        if (displayR >= 0 && displayR < rows && displayC >= 0 && displayC < cols) {
          displayGrid[displayR][displayC] = type;
        }
      }
    });
  });

  return (
    <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {displayGrid.flat().map((cellType, i) => (
        <MiniCell key={i} filled={cellType !== 'empty'} type={cellType} />
      ))}
    </div>
  );
};

const NextPanel: React.FC = () => {
  const nextPieces = useGameStore((s) => s.state.nextPieces);
  const nextPieceToDisplay = nextPieces.length > 0 ? nextPieces[0] : null;

  return (
    <div className="p-3 bg-gray-700 rounded-lg shadow-md w-32 select-none">
      <h2 className="text-md font-semibold text-neon-cyan mb-2 text-center">NEXT</h2>
      <div className="flex justify-center items-center h-20">
        {nextPieceToDisplay ? (
          <MiniTetromino tetromino={nextPieceToDisplay} />
        ) : (
          <div className="text-gray-400 text-sm">N/A</div>
        )}
      </div>
    </div>
  );
};

export default NextPanel; 