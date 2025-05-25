import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LineClearParticlesProps {
  y: number; // 行番号
  boardWidth: number;
  color?: string;
  show: boolean;
  onComplete?: () => void;
}

const PARTICLE_COUNT = 24;
const PARTICLE_COLORS = [
  '#00FFFF', '#FF00FF', '#FFFF00', '#FFA500', '#00FF80', '#0080FF', '#FF0000', '#800080'
];

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const LineClearParticles: React.FC<LineClearParticlesProps> = ({ y, boardWidth, color, show, onComplete }) => {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 700);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={`particles-${y}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'absolute',
          left: 0,
          top: `calc(${y} * var(--tetris-grid-size))`,
          width: `calc(${boardWidth} * var(--tetris-grid-size))`,
          height: 'var(--tetris-grid-size)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
          const angle = getRandom(-80, 80);
          const dist = getRandom(20, 60);
          const particleColor = color || PARTICLE_COLORS[i % PARTICLE_COLORS.length];
          return (
            <motion.span
              key={i}
              initial={{
                x: boardWidth * getRandom(0.2, 0.8) * varGrid(),
                y: 0,
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              animate={{
                x: `calc(${dist} * cos(${angle}deg))`,
                y: `calc(-${dist} * sin(${angle}deg))`,
                opacity: 0,
                scale: getRandom(0.7, 1.2),
                rotate: getRandom(-30, 30),
              }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: `calc(${(i + 0.5) / PARTICLE_COUNT} * 100%)`,
                top: '50%',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${particleColor} 60%, #fff0 100%)`,
                boxShadow: `0 0 8px 2px ${particleColor}`,
                pointerEvents: 'none',
              }}
            />
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};

// CSS変数からpx値を取得
function varGrid() {
  if (typeof window === 'undefined') return 30;
  const val = getComputedStyle(document.documentElement).getPropertyValue('--tetris-grid-size');
  return parseInt(val) || 30;
}

export default LineClearParticles; 