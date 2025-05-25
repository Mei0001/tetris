import React from 'react';
import type { TetrominoType } from '../../types';
import { getTetrominoPattern } from '../../constants/tetrominos';

interface NextPanelProps {
  nextPieces: TetrominoType[];
  className?: string;
}

const MiniTetromino: React.FC<{ type: TetrominoType }> = ({ type }) => {
  const pattern = getTetrominoPattern(type, 0);
  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-[1px] w-8 h-8">
      {pattern.flat().map((filled, i) => (
        <div
          key={i}
          className={filled ? `w-2 h-2 rounded-[2px] bg-tetris-${type}` : 'w-2 h-2'}
        />
      ))}
    </div>
  );
};

/**
 * 次のピース表示用サイドパネル
 */
const NextPanel: React.FC<NextPanelProps> = ({ nextPieces, className = '' }) => {
  return (
    <div className={`bg-black/60 rounded-lg shadow-md border border-white/10 p-4 min-w-[80px] flex flex-col gap-2 items-center ${className}`}>
      <div className="text-lg font-bold text-neon-purple mb-1">NEXT</div>
      <div className="flex flex-col gap-1 items-center">
        {nextPieces.map((type, idx) => (
          <MiniTetromino key={idx} type={type} />
        ))}
      </div>
    </div>
  );
};

export default NextPanel; 