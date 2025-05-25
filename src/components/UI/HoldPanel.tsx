import React from 'react';
import type { TetrominoType } from '../../types';
import { getTetrominoPattern } from '../../constants/tetrominos';

interface HoldPanelProps {
  holdPiece: TetrominoType | null;
  canHold: boolean;
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
 * ホールドピース表示用サイドパネル
 */
const HoldPanel: React.FC<HoldPanelProps> = ({ holdPiece, canHold, className = '' }) => {
  return (
    <div className={`bg-black/60 rounded-lg shadow-md border border-white/10 p-4 min-w-[80px] flex flex-col gap-2 items-center ${className}`}>
      <div className="text-lg font-bold text-neon-orange mb-1">HOLD</div>
      <div className="flex items-center justify-center w-8 h-8">
        {holdPiece ? (
          <MiniTetromino type={holdPiece} />
        ) : (
          <div className="w-8 h-8 rounded-sm border border-white/20 opacity-30" />
        )}
      </div>
      {!canHold && <div className="text-xs text-red-400 mt-1">LOCKED</div>}
    </div>
  );
};

export default HoldPanel; 