import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  size?: number;
  color?: string;
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 48, color = '#00FFFF', text, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} style={{ minHeight: size * 2 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
        style={{
          width: size,
          height: size,
          border: `${size * 0.13}px solid ${color}40`,
          borderTop: `${size * 0.13}px solid ${color}`,
          borderRadius: '50%',
          boxShadow: `0 0 16px 2px ${color}`,
        }}
      />
      {text && <span className="mt-3 text-neon-cyan animate-pulse text-base font-bold">{text}</span>}
    </div>
  );
};

export default Loader; 