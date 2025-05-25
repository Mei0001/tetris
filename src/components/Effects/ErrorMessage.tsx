import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  color?: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, color = '#FF00FF', className = '' }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-lg border-2 border-white/20 bg-black/80 ${className}`}
        style={{ color }}
      >
        <span className="text-lg font-bold neon-glow mb-2">エラー</span>
        <span className="text-base mb-4 text-center">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded bg-neon-cyan text-black font-bold shadow hover:scale-105 transition-transform"
          >
            リトライ
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorMessage; 