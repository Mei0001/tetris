import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CellType, TetrominoType } from '../../types';

interface CellProps {
  type: CellType;
  tetrominoType?: TetrominoType;
  x: number;
  y: number;
  className?: string;
  isClearing?: boolean;
}

/**
 * ゲームボードのセル（マス）
 * - 状態・色・アニメーションをpropsで受け取る
 */
const Cell: React.FC<CellProps> = ({ type, tetrominoType, x, y, className = '', isClearing }) => {
  // 色クラス
  const getColorClass = () => {
    if (type === 'empty') return '';
    if (type === 'ghost') return 'bg-white/10';
    if (tetrominoType) return `bg-tetris-${tetrominoType}`;
    return 'bg-white/40';
  };
  // アニメーション設定
  const variants = {
    initial: { opacity: 0, scale: 0.8 },
    filled: { opacity: 1, scale: 1, transition: { duration: 0.18 } },
    clearing: { opacity: 0, scale: 0.5, transition: { duration: 0.25 } },
  };
  return (
    <AnimatePresence>
      {(type as string) === 'empty' ? (
        <div
          className={`tetris-cell ${className}`}
          data-x={x}
          data-y={y}
        />
      ) : (
        <motion.div
          key={`${x}-${y}`}
          initial="initial"
          animate={isClearing ? 'clearing' : 'filled'}
          exit="clearing"
          variants={variants}
          className={`tetris-cell transition-all duration-75 ${getColorClass()} ${type !== 'empty' ? 'filled neon-border' : ''} ${type === 'ghost' ? 'ghost' : ''} ${type === 'active' ? 'ring-2 ring-white/80 brightness-125' : ''} ${className}`}
          data-x={x}
          data-y={y}
        />
      )}
    </AnimatePresence>
  );
};

export default Cell; 