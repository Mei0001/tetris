import React from 'react';
import type { TetrominoType } from '../../types';

interface NextPanelProps {
  nextPieces: TetrominoType[];
  className?: string;
}

/**
 * 次のピース表示用サイドパネル
 */
const NextPanel: React.FC<NextPanelProps> = ({ nextPieces, className = '' }) => {
  return (
    <div className={`bg-black/60 rounded-lg shadow-md border border-white/10 p-4 min-w-[80px] flex flex-col gap-2 items-center ${className}`}>
      <div className="text-lg font-bold text-neon-purple mb-1">NEXT</div>
      <div className="flex flex-col gap-1 items-center">
        {nextPieces.map((type, idx) => (
          <div key={idx} className={`w-8 h-8 rounded-sm bg-tetris-${type} opacity-80 neon-border`}></div>
        ))}
      </div>
    </div>
  );
};

export default NextPanel; 