import React from 'react';
import type { Tetromino, TetrominoShape } from '../../types';
import { useGameStore } from '../../stores/gameStore';
import { getTetrominoPattern } from '../../utils/tetromino';
import { INITIAL_ROTATION_STATE } from '../../constants/tetrominos';

interface HoldPanelProps {
  className?: string;
}

const MiniTetromino: React.FC<{ piece: Tetromino }> = ({ piece }) => {
  const pattern: TetrominoShape = getTetrominoPattern(piece.type, INITIAL_ROTATION_STATE);
  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-[2px] w-12 h-6">
      {pattern.map((row: boolean[], y: number) =>
        row.map((filled: boolean, x: number) => (
          <div
            key={`${y}-${x}`}
            className={`w-3 h-3 rounded-[2px] ${filled ? `bg-tetris-${piece.type} neon-border-cell` : ''}`}
          />
        ))
      ).flat()}
    </div>
  );
};

/**
 * ホールドピース表示用サイドパネル
 */
const HoldPanel: React.FC<HoldPanelProps> = ({ className = '' }) => {
  const holdPiece = useGameStore((s) => s.state.holdPiece);
  const canHold = useGameStore((s) => s.state.canHold);
  const holdEnabled = useGameStore((s) => s.state.settings.holdEnabled);

  if (!holdEnabled) return null;

  return (
    <div className={`bg-black/60 rounded-lg shadow-md border border-white/10 p-4 min-w-[100px] flex flex-col gap-2 items-center ${className}`}>
      <div className="text-lg font-bold text-neon-orange mb-1 select-none">HOLD</div>
      <div className="flex items-center justify-center w-12 h-8 my-1">
        {holdPiece ? (
          <MiniTetromino piece={holdPiece} />
        ) : (
          <div className="w-12 h-6 rounded-sm border border-white/20 opacity-30" />
        )}
      </div>
      {!canHold && <div className="text-xs text-red-400 mt-1 select-none">LOCKED</div>}
    </div>
  );
};

export default HoldPanel; 