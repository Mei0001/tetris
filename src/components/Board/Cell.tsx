import React from 'react';
import type { CellType, TetrominoType } from '../../types';

interface CellProps {
  type: CellType;
  tetrominoType?: TetrominoType;
  x: number;
  y: number;
  className?: string;
}

/**
 * ゲームボードのセル（マス）
 * - 状態・色・アニメーションをpropsで受け取る
 */
const Cell: React.FC<CellProps> = ({ type, tetrominoType, x, y, className = '' }) => {
  // 色クラス
  const getColorClass = () => {
    if (type === 'empty') return '';
    if (type === 'ghost') return 'bg-white/10';
    if (tetrominoType) return `bg-tetris-${tetrominoType}`;
    return 'bg-white/40';
  };
  return (
    <div
      className={`tetris-cell transition-all duration-75 ${getColorClass()} ${type !== 'empty' ? 'filled neon-border' : ''} ${type === 'ghost' ? 'ghost' : ''} ${className}`}
      data-x={x}
      data-y={y}
    />
  );
};

export default Cell; 